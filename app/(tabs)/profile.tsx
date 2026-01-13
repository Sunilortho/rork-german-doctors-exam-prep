import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import { ChevronRight, Crown, Settings, User } from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const { entitlement } = useApp();
  const router = useRouter();

  const getTierColor = () => {
    switch (entitlement) {
      case 'vip':
        return '#F59E0B';
      case 'pro':
        return '#3B82F6';
      default:
        return '#64748B';
    }
  };

  const getTierLabel = () => {
    switch (entitlement) {
      case 'vip':
        return 'VIP Member';
      case 'pro':
        return 'Pro Member';
      default:
        return 'Free Plan';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <User size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.headerTitle}>Your Profile</Text>
          <View style={[styles.tierBadge, { backgroundColor: getTierColor() }]}>
            <Crown size={16} color="#FFFFFF" />
            <Text style={styles.tierBadgeText}>{getTierLabel()}</Text>
          </View>
        </View>

        {entitlement === 'free' && (
          <TouchableOpacity
            style={styles.upgradeCard}
            onPress={() => router.push('/upgrade')}
            activeOpacity={0.8}
          >
            <Crown size={32} color="#F59E0B" />
            <View style={styles.upgradeContent}>
              <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
              <Text style={styles.upgradeDescription}>
                Unlock all features, voice simulations, and advanced practice
              </Text>
            </View>
            <ChevronRight size={24} color="#F59E0B" />
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuIconContainer}>
              <Settings size={20} color="#60A5FA" />
            </View>
            <Text style={styles.menuItemText}>Settings</Text>
            <ChevronRight size={20} color="#475569" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About This App</Text>
          <Text style={styles.infoText}>
            Roadmap to Germany for Doctors is designed to help medical
            professionals prepare for German medical licensing and language
            examinations.
          </Text>
          <Text style={styles.infoVersion}>Version 1.0.0</Text>
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
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  tierBadgeText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  upgradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  upgradeContent: {
    flex: 1,
    marginLeft: 16,
  },
  upgradeTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  upgradeDescription: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuContainer: {
    paddingHorizontal: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  infoCard: {
    marginHorizontal: 24,
    marginTop: 32,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 12,
  },
  infoVersion: {
    fontSize: 12,
    color: '#64748B',
  },
});
