import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { City } from '@/features/weather/model/weather.types';

const LEGACY_PRESET_CITY_IDS = new Set(['shanghai', 'hangzhou']);

type AppState = {
  selectedCity: City | null;
  savedCities: City[];
  hasResolvedInitialLocation: boolean;
  setSelectedCity: (city: City) => void;
  removeSavedCity: (cityId: string) => void;
  markInitialLocationResolved: () => void;
};

function isCurrentLocationCity(city: City) {
  return city.id.startsWith('current-');
}

function isLegacyPresetCity(city: City | null | undefined) {
  return Boolean(city && LEGACY_PRESET_CITY_IDS.has(city.id));
}

function sanitizeSavedCities(cities: City[]) {
  return cities.filter((city) => !isLegacyPresetCity(city) && !isCurrentLocationCity(city));
}

function migrateSelectedCity(selectedCity: City | null | undefined, savedCities: City[]) {
  if (!selectedCity || isLegacyPresetCity(selectedCity)) {
    return savedCities[0] ?? null;
  }
  return selectedCity;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedCity: null,
      savedCities: [],
      hasResolvedInitialLocation: false,
      setSelectedCity: (selectedCity) =>
        set((state) => ({
          selectedCity,
          savedCities: isCurrentLocationCity(selectedCity)
            ? state.savedCities
            : [selectedCity, ...state.savedCities.filter((city) => city.id !== selectedCity.id)],
        })),
      removeSavedCity: (cityId) =>
        set((state) => {
          const nextSavedCities = state.savedCities.filter((city) => city.id !== cityId);
          const selectedCity = state.selectedCity?.id === cityId ? nextSavedCities[0] ?? null : state.selectedCity;

          return {
            savedCities: nextSavedCities,
            selectedCity,
          };
        }),
      markInitialLocationResolved: () => set({ hasResolvedInitialLocation: true }),
    }),
    {
      name: 'weather-app-state',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedCity: state.selectedCity,
        savedCities: state.savedCities,
      }),
      migrate: (persistedState) => {
        const state = persistedState as Partial<AppState> | undefined;
        const savedCities = sanitizeSavedCities(state?.savedCities ?? []);

        return {
          selectedCity: migrateSelectedCity(state?.selectedCity ?? null, savedCities),
          savedCities,
          hasResolvedInitialLocation: false,
        };
      },
    },
  ),
);
