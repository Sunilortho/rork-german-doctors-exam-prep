import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import { Stethoscope } from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function WelcomeScreen() {
  const { markWelcomeAsSeen } = useApp();
  const router = useRouter();

  const handleContinue = async () => {
    await markWelcomeAsSeen();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <Stethoscope size={80} color="#60A5FA" strokeWidth={1.5} />
        </View>

        <Text style={styles.title}>Roadmap to Germany{'\n'}for Doctors</Text>

        <Text style={styles.tagline}>
          From documents to Fachsprachprüfung — structured, examiner-ready.
        </Text>

        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            This platform is designed for doctors preparing for the German
            medical pathway. It provides a structured roadmap for documents,
            Fachsprachprüfung, and clinical readiness — aligned with German
            examiner expectations.
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <FeatureItem
            emoji="📋"
            title="Document Preparation"
            description="Complete checklist for all required documents"
          />
          <FeatureItem
            emoji="🎙️"
            title="FSP Simulation"
            description="Voice-based patient interaction practice"
          />
          <FeatureItem
            emoji="📝"
            title="Arztbrief Training"
            description="Medical letter writing with AI correction"
          />
          <FeatureItem
            emoji="✅"
            title="Examiner-Ready"
            description="Aligned with German medical standards"
          />
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Begin Your Journey</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface FeatureItemProps {
  emoji: string;
  title: string;
  description: string;
}

function FeatureItem({ emoji, title, description }: FeatureItemProps) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureEmoji}>{emoji}</Text>
      <View style={styles.featureTextContainer}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 40,
  },
  tagline: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
    lineHeight: 24,
  },
  messageContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#334155',
  },
  message: {
    fontSize: 15,
    color: '#CBD5E1',
    lineHeight: 24,
    textAlign: 'left',
  },
  featuresContainer: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  featureEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
