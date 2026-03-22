import { presetCities } from '@/store/app-store';

import type { City } from '@/features/weather/model/weather.types';

import type { CityListItem } from './city-search.types';

export function buildSuggestedCities(
  selectedCity: City,
  savedCities: City[],
  currentCityLabel: string,
): CityListItem[] {
  const savedCityItems = savedCities
    .filter((city) => city.id !== selectedCity.id)
    .map((city) => ({ ...city, subtitle: city.timezone, kind: 'saved' as const }));

  return dedupeCities([
    {
      ...selectedCity,
      subtitle: selectedCity.id.startsWith('current-') ? currentCityLabel : selectedCity.timezone,
      kind: 'current' as const,
    },
    ...savedCityItems,
    ...presetCities
      .filter((city) => city.id !== selectedCity.id && !savedCities.some((savedCity) => savedCity.id === city.id))
      .map((city) => ({ ...city, subtitle: city.timezone, kind: 'preset' as const })),
  ]);
}

export function toSearchResultItems(cities: Array<City & { subtitle: string }>): CityListItem[] {
  return cities.map((city) => ({ ...city, kind: 'search' as const }));
}

function dedupeCities(cities: CityListItem[]) {
  const seen = new Set<string>();

  return cities.filter((city) => {
    if (seen.has(city.id)) {
      return false;
    }
    seen.add(city.id);
    return true;
  });
}
