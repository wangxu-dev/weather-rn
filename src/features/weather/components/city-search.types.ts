import type { City } from '@/features/weather/model/weather.types';

export type CityListItem = City & {
  subtitle: string;
  kind: 'current' | 'saved' | 'preset' | 'search';
};
