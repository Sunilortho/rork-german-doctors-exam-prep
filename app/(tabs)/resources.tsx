import { useRouter } from 'expo-router';
import { BookOpen, ChevronRight, FileText, Mail, User } from 'lucide-react-native';
import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface SampleItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
  route?: string;
}

export default function ResourcesScreen() {
  const router = useRouter();

  const samples: SampleItem[] = [
    {
      id: '1',
      title: 'Sample Arztbrief',
      description: 'Professional medical letter example',
      icon: <FileText size={24} color="#60A5FA" />,
      available: true,
      route: '/sample-arztbrief',
    },
    {
      id: '2',
      title: 'Sample Anamnesis Dialogue',
      description: 'Patient history conversation example',
      icon: <BookOpen size={24} color="#60A5FA" />,
      available: true,
      route: '/sample-anamnesis',
    },
    {
      id: '3',
      title: 'Sample Motivation Letter',
      description: 'Application letter template',
      icon: <Mail size={24} color="#60A5FA" />,
      available: false,
    },
    {
      id: '4',
      title: 'Sample German CV (Lebenslauf)',
      description: 'Professional CV template',
      icon: <User size={24} color="#60A5FA" />,
      available: false,
    },
  ];

  const handleSamplePress = (sample: SampleItem) => {
    if (!sample.available) {
      Alert.alert(
        'Coming Soon',
        'This sample will be available shortly and automatically unlocked for Pro users.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (sample.route) {
      router.push(sample.route as any);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Resources & Samples</Text>
          <Text style={styles.headerSubtitle}>
            Professional templates and examples for your preparation
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sample Documents</Text>
          <Text style={styles.sectionDescription}>
            Use these examples as reference for your own documents
          </Text>
        </View>

        <View style={styles.samplesContainer}>
          {samples.map((sample) => (
            <TouchableOpacity
              key={sample.id}
              style={styles.sampleCard}
              onPress={() => handleSamplePress(sample)}
              activeOpacity={0.7}
            >
              <View style={styles.sampleIconContainer}>{sample.icon}</View>

              <View style={styles.sampleContent}>
                <Text style={styles.sampleTitle}>{sample.title}</Text>
                <Text style={styles.sampleDescription}>
                  {sample.description}
                </Text>
                {!sample.available && (
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonText}>Coming Soon</Text>
                  </View>
                )}
              </View>

              <ChevronRight size={24} color="#475569" />
            </TouchableOpacity>
          ))}
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
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
  },
  samplesContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  sampleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sampleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sampleContent: {
    flex: 1,
  },
  sampleTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sampleDescription: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  comingSoonBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#94A3B8',
  },
});
