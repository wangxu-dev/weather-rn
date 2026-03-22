import { create } from 'zustand';

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
  hasResolvedInitialLocation: boolean;
  setSelectedCity: (city: City) => void;
  markInitialLocationResolved: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  selectedCity: presetCities[0],
  hasResolvedInitialLocation: false,
  setSelectedCity: (selectedCity) => set({ selectedCity }),
  markInitialLocationResolved: () => set({ hasResolvedInitialLocation: true }),
}));
