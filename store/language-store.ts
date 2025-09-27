import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import i18n, { changeLanguage } from '@/i18n';
import { Language, getLanguageByCode } from '@/constants/languages';

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (languageCode: string) => Promise<void>;
}

// Get device language or default to English
const getInitialLanguage = (): Language => {
  // Default to English
  return getLanguageByCode('en');
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: getInitialLanguage(),
      
      setLanguage: async (languageCode: string) => {
        const language = getLanguageByCode(languageCode);
        await changeLanguage(languageCode);
        set({ currentLanguage: language });
      }
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);