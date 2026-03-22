import { useQuery } from '@tanstack/react-query';

import { fetchWeatherSnapshot, searchCities } from '@/features/weather/api/weather-client';
import type { City } from '@/features/weather/model/weather.types';

export const weatherQueryKeys = {
  snapshot: (city: City) => ['weather', 'snapshot', city.id] as const,
  citySearch: (query: string, locale: string) => ['weather', 'city-search', query, locale] as const,
};

export function useWeatherSnapshot(city: City) {
  return useQuery({
    queryKey: weatherQueryKeys.snapshot(city),
    queryFn: () => fetchWeatherSnapshot(city),
  });
}

export function useCitySearch(query: string, locale: string) {
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: weatherQueryKeys.citySearch(trimmedQuery, locale),
    queryFn: () => searchCities(trimmedQuery, locale),
    enabled: trimmedQuery.length >= 2,
  });
}
