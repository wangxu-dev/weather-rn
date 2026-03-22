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

export function weatherCodeToKey(code: number) {
  if (code === 0) return 'weatherClear';
  if (code <= 3) return 'weatherPartlyCloudy';
  if (code <= 48) return 'weatherFoggy';
  if (code <= 67) return 'weatherRain';
  if (code <= 77) return 'weatherSnow';
  if (code <= 82) return 'weatherShowers';
  if (code <= 86) return 'weatherSnowShowers';
  if (code <= 99) return 'weatherThunderstorm';
  return 'weatherUnknown';
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

export function formatClockTime(dateTime: string) {
  const date = new Date(dateTime);
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function degreesToCompass(degrees: number) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((((degrees % 360) + 360) % 360) / 45) % 8;
  return directions[index];
}

export function toHourlyForecast(
  times: string[],
  temperatures: number[],
  weatherCodes: number[],
  precipitationProbabilities: number[],
): HourlyForecastItem[] {
  return times.slice(0, 12).map((time, index) => ({
    time,
    temperature: temperatures[index] ?? 0,
    weatherCode: weatherCodes[index] ?? -1,
    precipitationProbability: precipitationProbabilities[index] ?? 0,
  }));
}

export function toDailyForecast(
  dates: string[],
  weatherCodes: number[],
  maxTemps: number[],
  minTemps: number[],
  sunrises: string[],
  sunsets: string[],
): DailyForecastItem[] {
  return dates.slice(0, 7).map((date, index) => ({
    date,
    weatherCode: weatherCodes[index] ?? -1,
    temperatureMax: maxTemps[index] ?? 0,
    temperatureMin: minTemps[index] ?? 0,
    sunrise: sunrises[index] ?? date,
    sunset: sunsets[index] ?? date,
  }));
}
