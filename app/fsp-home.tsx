import { useRouter } from 'expo-router';
import { FileText, MessageSquare, Mic } from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface PracticeOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isPrimary: boolean;
  route: string;
}

export default function FSPHomeScreen() {
  const router = useRouter();

  const practiceOptions: PracticeOption[] = [
    {
      id: 'voice',
      title: 'Voice-based FSP Simulation',
      description:
        'Practice with realistic patient conversations using voice interaction',
      icon: <Mic size={32} color="#FFFFFF" />,
      isPrimary: true,
      route: '/fsp-voice-setup',
    },
    {
      id: 'text',
      title: 'Text-based FSP Practice',
      description: 'Practice medical conversations with text-based interactions',
      icon: <MessageSquare size={28} color="#60A5FA" />,
      isPrimary: false,
      route: '/fsp-text',
    },
    {
      id: 'arztbrief',
      title: 'Arztbrief Practice',
      description:
        'Practice writing medical letters with AI-powered correction',
      icon: <FileText size={28} color="#60A5FA" />,
      isPrimary: false,
      route: '/arztbrief-corrector',
    },
  ];

  const handleOptionPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Fachsprachprüfung</Text>
          <Text style={styles.headerSubtitle}>
            Choose your practice mode for medical German examination preparation
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {practiceOptions.map((option) =>
            option.isPrimary ? (
              <TouchableOpacity
                key={option.id}
                style={styles.primaryCard}
                onPress={() => handleOptionPress(option.route)}
                activeOpacity={0.8}
              >
                <View style={styles.primaryIconContainer}>{option.icon}</View>
                <Text style={styles.primaryTitle}>{option.title}</Text>
                <Text style={styles.primaryDescription}>
                  {option.description}
                </Text>
                <View style={styles.primaryBadge}>
                  <Text style={styles.primaryBadgeText}>RECOMMENDED</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={option.id}
                style={styles.secondaryCard}
                onPress={() => handleOptionPress(option.route)}
                activeOpacity={0.7}
              >
                <View style={styles.secondaryIconContainer}>
                  {option.icon}
                </View>
                <View style={styles.secondaryContent}>
                  <Text style={styles.secondaryTitle}>{option.title}</Text>
                  <Text style={styles.secondaryDescription}>
                    {option.description}
                  </Text>
                </View>
              </TouchableOpacity>
            )
          )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  optionsContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 16,
  },
  primaryCard: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  primaryIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  primaryTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  primaryDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  primaryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  primaryBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  secondaryCard: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  secondaryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  secondaryContent: {
    flex: 1,
  },
  secondaryTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 6,
  },
  secondaryDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
});
