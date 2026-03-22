import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { City } from '@/features/weather/model/weather.types';

export const presetCities: City[] = [
  {
    id: 'shanghai',
    name: 'Shanghai',
    latitude: 31.2304,
    longitude: 121.4737,
    timezone: 'Asia/Shanghai',
  },
  {
    id: 'hangzhou',
    name: 'Hangzhou',
    latitude: 30.2741,
    longitude: 120.1551,
    timezone: 'Asia/Shanghai',
  },
];

type AppState = {
  selectedCity: City;
  savedCities: City[];
  hasResolvedInitialLocation: boolean;
  setSelectedCity: (city: City) => void;
  removeSavedCity: (cityId: string) => void;
  markInitialLocationResolved: () => void;
};

function isPresetCity(city: City) {
  return presetCities.some((presetCity) => presetCity.id === city.id);
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      selectedCity: presetCities[0],
      savedCities: [],
      hasResolvedInitialLocation: false,
      setSelectedCity: (selectedCity) =>
        set((state) => ({
          selectedCity,
          savedCities:
            isPresetCity(selectedCity) || selectedCity.id.startsWith('current-')
              ? state.savedCities
              : [selectedCity, ...state.savedCities.filter((city) => city.id !== selectedCity.id)],
        })),
      removeSavedCity: (cityId) =>
        set((state) => {
          const nextSavedCities = state.savedCities.filter((city) => city.id !== cityId);
          const selectedCity =
            state.selectedCity.id === cityId ? nextSavedCities[0] ?? presetCities[0] : state.selectedCity;

          return {
            savedCities: nextSavedCities,
            selectedCity,
          };
        }),
      markInitialLocationResolved: () => set({ hasResolvedInitialLocation: true }),
    }),
    {
      name: 'weather-app-state',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedCity: state.selectedCity,
        savedCities: state.savedCities,
      }),
    },
  ),
);
