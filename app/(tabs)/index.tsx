import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  FileText,
  Lock,
  Mic,
  Stethoscope,
} from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface RoadmapItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  completed: boolean;
  locked: boolean;
  requiredTier?: 'pro' | 'vip';
  route?: string;
}

export default function RoadmapScreen() {
  const router = useRouter();
  const { hasAccess } = useApp();

  const roadmapItems: RoadmapItem[] = [
    {
      id: '1',
      title: 'Document Checklist',
      subtitle: 'Prepare all required documents',
      icon: <FileText size={24} color="#60A5FA" />,
      completed: false,
      locked: false,
    },
    {
      id: '2',
      title: 'German Language (B2-C1)',
      subtitle: 'Language proficiency requirements',
      icon: <BookOpen size={24} color="#60A5FA" />,
      completed: false,
      locked: false,
    },
    {
      id: '3',
      title: 'Fachsprachprüfung (FSP)',
      subtitle: 'Medical German exam practice',
      icon: <Mic size={24} color="#60A5FA" />,
      completed: false,
      locked: false,
      route: '/fsp-home',
    },
    {
      id: '4',
      title: 'Kenntnisprüfung',
      subtitle: 'Medical knowledge examination',
      icon: <Stethoscope size={24} color="#60A5FA" />,
      completed: false,
      locked: true,
      requiredTier: 'pro',
    },
    {
      id: '5',
      title: 'Application Process',
      subtitle: 'Submit to state medical board',
      icon: <CheckCircle2 size={24} color="#60A5FA" />,
      completed: false,
      locked: true,
      requiredTier: 'pro',
    },
  ];

  const handleItemPress = (item: RoadmapItem) => {
    if (item.locked && item.requiredTier && !hasAccess(item.requiredTier)) {
      router.push('/upgrade');
      return;
    }

    if (item.route) {
      router.push(item.route as any);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Stethoscope size={32} color="#60A5FA" strokeWidth={1.5} />
          <Text style={styles.headerTitle}>
            Roadmap to Germany{'\n'}for Doctors
          </Text>
          <Text style={styles.headerSubtitle}>
            From documents to Fachsprachprüfung — structured, examiner-ready.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Pathway</Text>
          <Text style={styles.sectionDescription}>
            Follow this structured roadmap to prepare for German medical
            licensing
          </Text>
        </View>

        <View style={styles.roadmapContainer}>
          {roadmapItems.map((item, index) => (
            <RoadmapItemCard
              key={item.id}
              item={item}
              index={index}
              onPress={handleItemPress}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

interface RoadmapItemCardProps {
  item: RoadmapItem;
  index: number;
  onPress: (item: RoadmapItem) => void;
}

function RoadmapItemCard({ item, index, onPress }: RoadmapItemCardProps) {
  return (
    <TouchableOpacity
      style={styles.itemCard}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
      disabled={item.locked && !item.route}
    >
      <View style={styles.itemNumber}>
        <Text style={styles.itemNumberText}>{index + 1}</Text>
      </View>

      <View style={styles.itemIconContainer}>{item.icon}</View>

      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
        {item.locked && item.requiredTier && (
          <View style={styles.lockedBadge}>
            <Lock size={12} color="#F59E0B" />
            <Text style={styles.lockedBadgeText}>
              {item.requiredTier.toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {item.completed ? (
        <CheckCircle2 size={24} color="#10B981" />
      ) : (
        <ChevronRight size={24} color="#475569" />
      )}
    </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 32,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
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
  roadmapContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  itemNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemNumberText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  itemIconContainer: {
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  lockedBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#F59E0B',
  },
});
