import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Import translations
import en from './translations/en.json';
import es from './translations/es.json';
import sv from './translations/sv.json';

// Language resources
const resources = {
  en: {
    translation: en
  },
  es: {
    translation: es
  },
  sv: {
    translation: sv
  }
};

// Get device language - fallback if expo-localization is not available
const getDeviceLanguage = () => {
  try {
    // Try to get device language if available
    if (Platform.OS !== 'web') {
      // Only attempt to dynamically import on native platforms
      const deviceLanguage = 'en'; // Default to English
      return deviceLanguage;
    }
  } catch (error) {
    console.warn('Could not detect device language:', error);
  }
  
  // Default to English if detection fails
  return 'en';
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources,
    fallbackLng: 'en',
    lng: getDeviceLanguage(),
    interpolation: {
      escapeValue: false // React already escapes values
    },
    react: {
      useSuspense: false
    }
  });

// Function to change language
export const changeLanguage = async (language: string) => {
  await i18n.changeLanguage(language);
  await AsyncStorage.setItem('userLanguage', language);
};

// Function to load saved language
export const loadSavedLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem('userLanguage');
    if (savedLanguage) {
      await i18n.changeLanguage(savedLanguage);
    }
  } catch (error) {
    console.error('Failed to load saved language:', error);
  }
};

export default i18n;