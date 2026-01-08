import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import { Check, Crown } from 'lucide-react-native';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  color: string;
  features: string[];
}

export default function UpgradeScreen() {
  const router = useRouter();
  const { entitlement, upgradeEntitlement } = useApp();

  const tiers: PricingTier[] = [
    {
      id: 'pro',
      name: 'Pro',
      price: '€29.99/month',
      color: '#3B82F6',
      features: [
        'Unlimited Voice FSP Simulations',
        'Advanced Text-based Practice',
        'Arztbrief Auto-Correction',
        'All Sample Documents',
        'Priority Support',
        'Offline Access',
      ],
    },
    {
      id: 'vip',
      name: 'VIP',
      price: '€49.99/month',
      color: '#F59E0B',
      features: [
        'Everything in Pro',
        'Personal Examiner Feedback',
        'Custom Practice Scenarios',
        'One-on-One Coaching Sessions',
        'Kenntnisprüfung Preparation',
        'Certification Tracking',
      ],
    },
  ];

  const handleUpgrade = async (tierId: string) => {
    Alert.alert(
      'Upgrade Confirmation',
      `Would you like to upgrade to ${tierId.toUpperCase()}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            await upgradeEntitlement(tierId as any);
            Alert.alert(
              'Success!',
              `You are now a ${tierId.toUpperCase()} member. All features are unlocked!`,
              [
                {
                  text: 'OK',
                  onPress: () => router.back(),
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Crown size={48} color="#F59E0B" />
          <Text style={styles.headerTitle}>Upgrade Your Journey</Text>
          <Text style={styles.headerSubtitle}>
            Unlock all features and accelerate your FSP preparation
          </Text>
        </View>

        <View style={styles.currentPlanCard}>
          <Text style={styles.currentPlanLabel}>Current Plan</Text>
          <Text style={styles.currentPlanValue}>
            {entitlement.toUpperCase()}
          </Text>
        </View>

        <View style={styles.tiersContainer}>
          {tiers.map((tier) => (
            <View
              key={tier.id}
              style={[
                styles.tierCard,
                tier.id === 'vip' && styles.tierCardHighlighted,
              ]}
            >
              {tier.id === 'vip' && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>MOST POPULAR</Text>
                </View>
              )}

              <Text style={styles.tierName}>{tier.name}</Text>
              <Text style={[styles.tierPrice, { color: tier.color }]}>
                {tier.price}
              </Text>

              <View style={styles.featuresContainer}>
                {tier.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Check size={20} color={tier.color} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.upgradeButton,
                  { backgroundColor: tier.color },
                  entitlement !== 'free' && styles.upgradeButtonDisabled,
                ]}
                onPress={() => handleUpgrade(tier.id)}
                activeOpacity={0.8}
                disabled={entitlement !== 'free'}
              >
                <Text style={styles.upgradeButtonText}>
                  {entitlement === tier.id
                    ? 'Current Plan'
                    : entitlement === 'free'
                    ? 'Upgrade Now'
                    : 'Already Premium'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Demo Mode Active</Text>
          <Text style={styles.infoText}>
            You are currently in demo mode. Upgrade to unlock unlimited access
            to all FSP practice features, voice simulations, and professional
            medical German training.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  currentPlanCard: {
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  currentPlanLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  currentPlanValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#60A5FA',
  },
  tiersContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 20,
  },
  tierCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#334155',
  },
  tierCardHighlighted: {
    borderColor: '#F59E0B',
    position: 'relative',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tierName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tierPrice: {
    fontSize: 32,
    fontWeight: '700' as const,
    marginBottom: 24,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
  },
  upgradeButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  upgradeButtonDisabled: {
    backgroundColor: '#475569',
  },
  upgradeButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  infoCard: {
    marginHorizontal: 24,
    marginTop: 32,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#60A5FA',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#93C5FD',
    lineHeight: 20,
  },
});
