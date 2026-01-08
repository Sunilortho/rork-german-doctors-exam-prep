import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';

export type EntitlementTier = 'free' | 'pro' | 'vip';

export const [AppProvider, useApp] = createContextHook(() => {
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean>(false);
  const [entitlement, setEntitlement] = useState<EntitlementTier>('free');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAppState();
  }, []);

  const loadAppState = async () => {
    try {
      const [welcomeState, entitlementState] = await Promise.all([
        AsyncStorage.getItem('hasSeenWelcome'),
        AsyncStorage.getItem('entitlement'),
      ]);

      if (welcomeState === 'true') {
        setHasSeenWelcome(true);
      }

      if (entitlementState) {
        setEntitlement(entitlementState as EntitlementTier);
      }
    } catch (error) {
      console.error('Failed to load app state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markWelcomeAsSeen = async () => {
    try {
      await AsyncStorage.setItem('hasSeenWelcome', 'true');
      setHasSeenWelcome(true);
    } catch (error) {
      console.error('Failed to mark welcome as seen:', error);
    }
  };

  const upgradeEntitlement = async (tier: EntitlementTier) => {
    try {
      await AsyncStorage.setItem('entitlement', tier);
      setEntitlement(tier);
    } catch (error) {
      console.error('Failed to upgrade entitlement:', error);
    }
  };

  const hasAccess = (requiredTier: EntitlementTier): boolean => {
    const tierLevels: Record<EntitlementTier, number> = {
      free: 0,
      pro: 1,
      vip: 2,
    };

    return tierLevels[entitlement] >= tierLevels[requiredTier];
  };

  return {
    hasSeenWelcome,
    entitlement,
    isLoading,
    markWelcomeAsSeen,
    upgradeEntitlement,
    hasAccess,
  };
});
