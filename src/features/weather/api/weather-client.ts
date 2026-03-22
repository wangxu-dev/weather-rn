import { fetchWeatherApi } from 'openmeteo';

import {
  toDailyForecast,
  toHourlyForecast,
} from '@/features/weather/model/weather.mapper';
import type { City, WeatherSnapshot } from '@/features/weather/model/weather.types';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export type CitySearchResult = City & {
  subtitle: string;
};

function range(start: number, stop: number, step: number) {
  return Array.from({ length: (stop - start) / step }, (_, index) => start + index * step);
}

function valuesToArray(values: ArrayLike<number> | null) {
  return values ? Array.from(values) : [];
}

function formatCityName(parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(', ');
}

function normalizeGeocodingLanguage(locale: string) {
  return locale.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

export async function searchCities(query: string, locale: string): Promise<CitySearchResult[]> {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < 2) {
    return [];
  }

  const params = new URLSearchParams({
    name: trimmedQuery,
    count: '10',
    language: normalizeGeocodingLanguage(locale),
    format: 'json',
  });
  const response = await fetch(`${GEOCODING_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Open-Meteo geocoding request failed.');
  }

  const payload = (await response.json()) as {
    results?: Array<{
      id?: number;
      name: string;
      latitude: number;
      longitude: number;
      timezone?: string;
      admin1?: string;
      country?: string;
    }>;
  };

  return (payload.results ?? [])
    .filter((item) => item.timezone)
    .map((item) => ({
      id: item.id ? `geo-${item.id}` : `geo-${item.latitude}-${item.longitude}`,
      name: formatCityName([item.name, item.admin1]),
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone!,
      subtitle: formatCityName([item.country, item.timezone]),
    }));
}

export async function fetchWeatherSnapshot(city: City): Promise<WeatherSnapshot> {
  const responses = await fetchWeatherApi(FORECAST_URL, {
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: city.timezone,
    current: [
      'temperature_2m',
      'apparent_temperature',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'relative_humidity_2m',
      'precipitation_probability',
      'surface_pressure',
      'uv_index',
    ],
    hourly: ['temperature_2m', 'weather_code', 'precipitation_probability'],
    daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min', 'sunrise', 'sunset'],
  });

  const response = responses[0];
  const current = response.current();
  const hourly = response.hourly();
  const daily = response.daily();

  if (!current || !hourly || !daily) {
    throw new Error('Open-Meteo response is missing required sections.');
  }

  const utcOffsetSeconds = response.utcOffsetSeconds();

  const hourlyTimes = range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
    (value) => new Date((value + utcOffsetSeconds) * 1000).toISOString(),
  );
  const dailyDates = range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
    (value) => new Date((value + utcOffsetSeconds) * 1000).toISOString(),
  );
  const sunriseValues = valuesToArray(daily.variables(3)!.valuesArray());
  const sunsetValues = valuesToArray(daily.variables(4)!.valuesArray());

  return {
    city,
    current: {
      temperature: current.variables(0)!.value(),
      apparentTemperature: current.variables(1)!.value(),
      weatherCode: current.variables(2)!.value(),
      windSpeed: current.variables(3)!.value(),
      windDirection: current.variables(4)!.value(),
      humidity: current.variables(5)!.value(),
      precipitationProbability: current.variables(6)!.value(),
      pressure: current.variables(7)!.value(),
      uvIndex: current.variables(8)!.value(),
    },
    hourly: toHourlyForecast(
      hourlyTimes,
      valuesToArray(hourly.variables(0)!.valuesArray()),
      valuesToArray(hourly.variables(1)!.valuesArray()),
      valuesToArray(hourly.variables(2)!.valuesArray()),
    ),
    daily: toDailyForecast(
      dailyDates,
      valuesToArray(daily.variables(0)!.valuesArray()),
      valuesToArray(daily.variables(1)!.valuesArray()),
      valuesToArray(daily.variables(2)!.valuesArray()),
      sunriseValues.map((value) => new Date((value + utcOffsetSeconds) * 1000).toISOString()),
      sunsetValues.map((value) => new Date((value + utcOffsetSeconds) * 1000).toISOString()),
    ),
  };
}
