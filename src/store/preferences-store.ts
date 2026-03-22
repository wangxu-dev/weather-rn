import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { SupportedLocale } from '@/shared/i18n/translations';

export type ThemePreference = 'system' | 'light' | 'dark';
export type LocalePreference = 'system' | SupportedLocale;

type PreferencesState = {
  themePreference: ThemePreference;
  localePreference: LocalePreference;
  setThemePreference: (preference: ThemePreference) => void;
  setLocalePreference: (preference: LocalePreference) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      themePreference: 'system',
      localePreference: 'system',
      setThemePreference: (themePreference) => set({ themePreference }),
      setLocalePreference: (localePreference) => set({ localePreference }),
    }),
    {
      name: 'weather-preferences',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
