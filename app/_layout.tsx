import React, { useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { I18nextProvider } from 'react-i18next';
import i18n, { loadSavedLanguage } from '@/i18n';
import { initializePodcastUpdates } from '@/services/podcastUpdateService';
import { initializeFirebaseAuth } from '@/services/firebase';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    // Load saved language preference
    loadSavedLanguage();
    
    // Initialize podcast update service
    initializePodcastUpdates();
    
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // Initialize Firebase authentication after app is fully loaded
    if (loaded) {
      setTimeout(() => {
        try {
          initializeFirebaseAuth();
        } catch (error) {
          console.error('Failed to initialize Firebase Auth:', error);
        }
      }, 500);
    }
  }, [loaded]);

  useEffect(() => {
    // Initialize the podcast update service when the app starts
    initializePodcastUpdates();
    console.log('Podcast update service initialized at app startup');
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider value={DefaultTheme}>
        <RootLayoutNav />
      </ThemeProvider>
    </I18nextProvider>
  );
}

function RootLayoutNav() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="podcast/series/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="podcast/episode/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="podcast/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="booking" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="chat/index" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="newsletter" options={{ headerShown: false }} />
        <Stack.Screen name="firebase-test" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}