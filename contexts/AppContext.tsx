import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';

export type EntitlementTier = 'free' | 'pro' | 'vip';

const isWeb = typeof window !== 'undefined';

// Fallback storage for web if AsyncStorage fails
const mockStorage: Record<string, string> = {
  hasSeenWelcome: 'false',
  entitlement: 'free',
};

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
        getStorageItem('hasSeenWelcome'),
        getStorageItem('entitlement'),
      ]);

      if (welcomeState === 'true') {
        setHasSeenWelcome(true);
      }

      if (entitlementState && ['free', 'pro', 'vip'].includes(entitlementState)) {
        setEntitlement(entitlementState as EntitlementTier);
      }
    } catch (error) {
      console.error('Failed to load app state:', error);
      // Use defaults on error
    } finally {
      // Always set loading to false, even if there are errors
      setIsLoading(false);
    }
  };

  const getStorageItem = async (key: string): Promise<string | null> => {
    try {
      // For web, try AsyncStorage first, fall back to mock
      if (isWeb) {
        try {
          const value = await AsyncStorage.getItem(key);
          return value;
        } catch (e) {
          console.warn(`AsyncStorage not available on web for key: ${key}`);
          return mockStorage[key] || null;
        }
      }
      // For native, use AsyncStorage normally
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Error getting storage item ${key}:`, error);
      return null;
    }
  };

  const setStorageItem = async (key: string, value: string): Promise<void> => {
    try {
      // Try AsyncStorage first
      try {
        await AsyncStorage.setItem(key, value);
      } catch (e) {
        // Fall back to mock storage on web
        console.warn(`AsyncStorage not available, using mock storage for ${key}`);
        mockStorage[key] = value;
      }
    } catch (error) {
      console.error(`Error setting storage item ${key}:`, error);
    }
  };

  const markWelcomeAsSeen = async () => {
    try {
      await setStorageItem('hasSeenWelcome', 'true');
      setHasSeenWelcome(true);
    } catch (error) {
      console.error('Failed to mark welcome as seen:', error);
    }
  };

  const upgradeEntitlement = async (tier: EntitlementTier) => {
    try {
      await setStorageItem('entitlement', tier);
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
