import { Tabs } from 'expo-router';
import { BookOpen, Map, User } from 'lucide-react-native';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#60A5FA',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopColor: '#1E293B',
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: '#0F172A',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#1E293B',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Roadmap',
          headerTitle: 'Your Roadmap',
          tabBarIcon: ({ color }) => <Map size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="resources"
        options={{
          title: 'Resources',
          headerTitle: 'Resources',
          tabBarIcon: ({ color }) => <BookOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
