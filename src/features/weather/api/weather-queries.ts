import { useQuery } from '@tanstack/react-query';

import { fetchWeatherSnapshot } from '@/features/weather/api/weather-client';
import type { City } from '@/features/weather/model/weather.types';

export const weatherQueryKeys = {
  snapshot: (city: City) => ['weather', 'snapshot', city.id] as const,
};

export function useWeatherSnapshot(city: City) {
  return useQuery({
    queryKey: weatherQueryKeys.snapshot(city),
    queryFn: () => fetchWeatherSnapshot(city),
  });
}
