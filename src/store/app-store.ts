import { create } from 'zustand';

import type { City } from '@/features/weather/model/weather.types';

const cities: City[] = [
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
  toggleCity: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  selectedCity: cities[0],
  toggleCity: () =>
    set((state) => ({
      selectedCity: state.selectedCity.id === cities[0].id ? cities[1] : cities[0],
    })),
}));
