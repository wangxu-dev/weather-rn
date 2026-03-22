import type { DailyForecastItem, HourlyForecastItem } from '@/features/weather/model/weather.types';

export function weatherCodeToLabel(code: number) {
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Showers';
  if (code <= 86) return 'Snow showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

export function formatHourLabel(dateTime: string) {
  const date = new Date(dateTime);
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatWeekday(dateTime: string) {
  const date = new Date(dateTime);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  }).format(date);
}

export function toHourlyForecast(
  times: string[],
  temperatures: number[],
  weatherCodes: number[],
): HourlyForecastItem[] {
  return times.slice(0, 12).map((time, index) => ({
    time,
    temperature: temperatures[index] ?? 0,
    weatherCode: weatherCodes[index] ?? -1,
  }));
}

export function toDailyForecast(
  dates: string[],
  weatherCodes: number[],
  maxTemps: number[],
  minTemps: number[],
): DailyForecastItem[] {
  return dates.slice(0, 7).map((date, index) => ({
    date,
    weatherCode: weatherCodes[index] ?? -1,
    temperatureMax: maxTemps[index] ?? 0,
    temperatureMin: minTemps[index] ?? 0,
  }));
}
