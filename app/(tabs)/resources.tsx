import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ResourcesScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Resources & Samples</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sample Arztbrief</Text>
          <Text style={styles.cardText}>Professional medical letter example</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sample Anamnesis</Text>
          <Text style={styles.cardText}>Patient history conversation</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#94A3B8',
  },
});
