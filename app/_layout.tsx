import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  React.useEffect(() => {
    // Hide splash screen immediately
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
