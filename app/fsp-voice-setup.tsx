import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Personality = 'anxious' | 'talkative' | 'brief';
type Difficulty = 'A2' | 'B2' | 'C1';

export default function FSPVoiceSetupScreen() {
  const router = useRouter();
  const [personality, setPersonality] = useState<Personality>('brief');
  const [difficulty, setDifficulty] = useState<Difficulty>('B2');
  const [examinerInterruptions, setExaminerInterruptions] = useState<boolean>(false);

  const handleStartSimulation = () => {
    router.push({
      pathname: '/fsp-voice-session',
      params: {
        personality,
        difficulty,
        examinerInterruptions: examinerInterruptions ? '1' : '0',
      },
    } as any);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Voice FSP Simulation</Text>
          <Text style={styles.headerSubtitle}>
            Configure your practice session settings
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Personality</Text>
          <View style={styles.optionGroup}>
            <OptionButton
              title="Anxious"
              description="Patient is nervous and uncertain"
              selected={personality === 'anxious'}
              onPress={() => setPersonality('anxious')}
            />
            <OptionButton
              title="Talkative"
              description="Patient provides detailed responses"
              selected={personality === 'talkative'}
              onPress={() => setPersonality('talkative')}
            />
            <OptionButton
              title="Brief"
              description="Patient gives short, direct answers"
              selected={personality === 'brief'}
              onPress={() => setPersonality('brief')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language Difficulty</Text>
          <View style={styles.optionGroup}>
            <OptionButton
              title="A2"
              description="Basic medical German"
              selected={difficulty === 'A2'}
              onPress={() => setDifficulty('A2')}
            />
            <OptionButton
              title="B2"
              description="Intermediate medical German"
              selected={difficulty === 'B2'}
              onPress={() => setDifficulty('B2')}
            />
            <OptionButton
              title="C1"
              description="Advanced medical German"
              selected={difficulty === 'C1'}
              onPress={() => setDifficulty('C1')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Examiner Interruptions</Text>
          <View style={styles.optionGroup}>
            <OptionButton
              title="Off"
              description="Practice without interruptions"
              selected={!examinerInterruptions}
              onPress={() => setExaminerInterruptions(false)}
            />
            <OptionButton
              title="On"
              description="Realistic exam with examiner questions"
              selected={examinerInterruptions}
              onPress={() => setExaminerInterruptions(true)}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartSimulation}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Start Voice Simulation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface OptionButtonProps {
  title: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

function OptionButton({ title, description, selected, onPress }: OptionButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.optionButton, selected && styles.optionButtonSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionHeader}>
        <Text style={[styles.optionTitle, selected && styles.optionTitleSelected]}>
          {title}
        </Text>
        {selected && <View style={styles.selectedIndicator} />}
      </View>
      <Text style={[styles.optionDescription, selected && styles.optionDescriptionSelected]}>
        {description}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 120,
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
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  optionGroup: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#334155',
  },
  optionButtonSelected: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  optionTitleSelected: {
    color: '#60A5FA',
  },
  optionDescription: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  optionDescriptionSelected: {
    color: '#93C5FD',
  },
  selectedIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
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
  startButton: {
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
  startButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
});
