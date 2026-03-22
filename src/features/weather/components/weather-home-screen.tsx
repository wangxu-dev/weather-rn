import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBootstrapLocation } from '@/features/location/hooks/use-bootstrap-location';
import { useWeatherSnapshot } from '@/features/weather/api/weather-queries';
import { useTranslation } from '@/shared/i18n/use-translation';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { useAppStore } from '@/store/app-store';

import { WeatherBackdrop } from './weather-home-backdrop';
import { WeatherHomeContent } from './weather-home-content';
import { WeatherHomeHeader } from './weather-home-header';
import { buildWeatherHomeViewModel } from './weather-home.helpers';
import { createWeatherHomeStyles } from './weather-home.styles';
import { WeatherHomeState } from './weather-home-state';

export function WeatherHomeScreen() {
  const city = useAppStore((state) => state.selectedCity);
  const weatherQuery = useWeatherSnapshot(city);
  const { t, locale } = useTranslation();
  const { tokens, themeName } = useAppTheme();
  const styles = createWeatherHomeStyles(tokens);

  useBootstrapLocation();

  if (weatherQuery.isPending) {
    return (
      <WeatherBackdrop styles={styles} tokens={tokens}>
        <SafeAreaView style={styles.safeArea}>
          <WeatherHomeState title={city.name} copy={t('loadingTitle')} styles={styles} />
        </SafeAreaView>
      </WeatherBackdrop>
    );
  }

  if (weatherQuery.isError || !weatherQuery.data) {
    return (
      <WeatherBackdrop styles={styles} tokens={tokens}>
        <SafeAreaView style={styles.safeArea}>
          <WeatherHomeState
            title={t('errorTitle')}
            copy={t('errorCopy')}
            actionLabel={t('retry')}
            onActionPress={() => weatherQuery.refetch()}
            styles={styles}
          />
        </SafeAreaView>
      </WeatherBackdrop>
    );
  }

  const snapshot = weatherQuery.data;
  const viewModel = buildWeatherHomeViewModel(snapshot, locale, t);

  return (
    <WeatherBackdrop styles={styles} tokens={tokens}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <WeatherHomeHeader
            cityId={snapshot.city.id}
            cityName={snapshot.city.name}
            themeName={themeName}
            styles={styles}
            tokens={tokens}
          />
          <WeatherHomeContent
            cityId={snapshot.city.id}
            locale={locale}
            currentTemperature={snapshot.current.temperature}
            weatherLabel={viewModel.weatherLabel}
            today={viewModel.today}
            advisory={viewModel.advisory}
            primaryMetrics={viewModel.primaryMetrics}
            details={viewModel.details}
            hourly={snapshot.hourly}
            daily={snapshot.daily}
            styles={styles}
          />
        </ScrollView>
      </SafeAreaView>
    </WeatherBackdrop>
  );
}
