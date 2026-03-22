import { fetchWeatherApi } from 'openmeteo';

import {
  toDailyForecast,
  toHourlyForecast,
} from '@/features/weather/model/weather.mapper';
import type { City, WeatherSnapshot } from '@/features/weather/model/weather.types';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

function range(start: number, stop: number, step: number) {
  return Array.from({ length: (stop - start) / step }, (_, index) => start + index * step);
}

function valuesToArray(values: Float32Array<ArrayBufferLike> | null) {
  return values ? Array.from(values) : [];
}

export async function fetchWeatherSnapshot(city: City): Promise<WeatherSnapshot> {
  const responses = await fetchWeatherApi(FORECAST_URL, {
    latitude: city.latitude,
    longitude: city.longitude,
    timezone: city.timezone,
    current: ['temperature_2m', 'apparent_temperature', 'weather_code', 'wind_speed_10m'],
    hourly: ['temperature_2m', 'weather_code'],
    daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min'],
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

  return {
    city,
    current: {
      temperature: current.variables(0)!.value(),
      apparentTemperature: current.variables(1)!.value(),
      weatherCode: current.variables(2)!.value(),
      windSpeed: current.variables(3)!.value(),
    },
    hourly: toHourlyForecast(
      hourlyTimes,
      valuesToArray(hourly.variables(0)!.valuesArray()),
      valuesToArray(hourly.variables(1)!.valuesArray()),
    ),
    daily: toDailyForecast(
      dailyDates,
      valuesToArray(daily.variables(0)!.valuesArray()),
      valuesToArray(daily.variables(1)!.valuesArray()),
      valuesToArray(daily.variables(2)!.valuesArray()),
    ),
  };
}
