import { AppProvider, useApp } from '@/contexts/AppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { hasSeenWelcome, isLoading } = useApp();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!hasSeenWelcome) {
    return <Redirect href="/welcome" />;
  }

  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Back',
        headerStyle: { backgroundColor: '#0F172A' },
        headerTintColor: '#FFFFFF',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="welcome"
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="fsp-home"
        options={{ title: 'FSP Practice' }}
      />
      <Stack.Screen
        name="fsp-voice-setup"
        options={{ title: 'Voice Setup' }}
      />
      <Stack.Screen
        name="fsp-voice-session"
        options={{ title: 'Voice Session' }}
      />
      <Stack.Screen
        name="fsp-text"
        options={{ title: 'Text Practice' }}
      />
      <Stack.Screen
        name="arztbrief-corrector"
        options={{ title: 'Arztbrief Corrector' }}
      />
      <Stack.Screen
        name="sample-arztbrief"
        options={{ title: 'Sample Arztbrief' }}
      />
      <Stack.Screen
        name="sample-anamnesis"
        options={{ title: 'Sample Anamnesis' }}
      />
      <Stack.Screen
        name="upgrade"
        options={{ title: 'Upgrade' }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <GestureHandlerRootView style={styles.container}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </AppProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
