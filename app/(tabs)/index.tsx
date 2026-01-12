import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Roadmap to Germany</Text>
        <Text style={styles.subtitle}>For Doctors</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>📋 Document Preparation</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>🎙️ FSP Practice</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>📝 Arztbrief Training</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>✅ Examiner Ready</Text>
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#94A3B8',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
