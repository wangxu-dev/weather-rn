import {
  degreesToCompass,
  formatClockTime,
  weatherCodeToKey,
} from '@/features/weather/model/weather.mapper';
import type { WeatherSnapshot } from '@/features/weather/model/weather.types';
import type { TranslationKey } from '@/shared/i18n/translations';

export function buildWeatherHomeViewModel(
  snapshot: WeatherSnapshot,
  locale: string,
  t: (key: TranslationKey) => string,
) {
  const today = snapshot.daily[0];
  const weatherLabel = t(weatherCodeToKey(snapshot.current.weatherCode));
  const windCompass = degreesToCompass(snapshot.current.windDirection);
  const advisory = getAdvisory({
    uvIndex: snapshot.current.uvIndex,
    rainProbability: snapshot.current.precipitationProbability,
    high: today.temperatureMax,
    low: today.temperatureMin,
    t,
  });

  return {
    today,
    weatherLabel,
    advisory,
    primaryMetrics: [
      { label: t('feelsLike'), value: `${Math.round(snapshot.current.apparentTemperature)}°` },
      { label: t('wind'), value: `${windCompass} ${Math.round(snapshot.current.windSpeed)} km/h` },
      { label: t('humidity'), value: `${Math.round(snapshot.current.humidity)}%` },
      { label: t('rain'), value: `${Math.round(snapshot.current.precipitationProbability)}%` },
    ],
    details: [
      { label: t('pressure'), value: `${Math.round(snapshot.current.pressure)} hPa` },
      { label: t('uvIndex'), value: `${Math.round(snapshot.current.uvIndex)}` },
      { label: t('sunrise'), value: formatClockTime(today.sunrise, locale) },
      { label: t('sunset'), value: formatClockTime(today.sunset, locale) },
    ],
  };
}

function getAdvisory({
  uvIndex,
  rainProbability,
  high,
  low,
  t,
}: {
  uvIndex: number;
  rainProbability: number;
  high: number;
  low: number;
  t: (key: TranslationKey) => string;
}) {
  if (rainProbability >= 45) return t('advisoryBringUmbrella');
  if (uvIndex >= 6) return t('advisorySunCare');
  if (high - low >= 8 || low <= 14) return t('advisoryCarryLayer');
  return t('advisoryComfortable');
}
