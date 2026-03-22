import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useBootstrapLocation } from '@/features/location/hooks/use-bootstrap-location';
import { useWeatherSnapshot } from '@/features/weather/api/weather-queries';
import {
  degreesToCompass,
  formatClockTime,
  formatHourLabel,
  formatWeekday,
  weatherCodeToKey,
} from '@/features/weather/model/weather.mapper';
import { motion } from '@/shared/animation/motion';
import { useTranslation } from '@/shared/i18n/use-translation';
import type { TranslationKey } from '@/shared/i18n/translations';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import type { AppThemeTokens } from '@/shared/theme/tokens';
import { useAppStore } from '@/store/app-store';

export function WeatherHomeScreen() {
  const city = useAppStore((state) => state.selectedCity);
  const toggleCity = useAppStore((state) => state.toggleCity);
  const weatherQuery = useWeatherSnapshot(city);
  const { t } = useTranslation();
  const { tokens } = useAppTheme();
  const styles = createStyles(tokens);

  useBootstrapLocation();

  function handleToggleCity() {
    Haptics.selectionAsync();
    toggleCity();
  }

  if (weatherQuery.isPending) {
    return (
      <LinearGradient
        colors={[tokens.colors.backgroundTop, tokens.colors.backgroundBottom]}
        style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View
            entering={FadeInDown.duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.stateContainer}>
            <Text style={styles.stateTitle}>{city.name}</Text>
            <Text style={styles.stateCopy}>{t('loadingTitle')}</Text>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (weatherQuery.isError || !weatherQuery.data) {
    return (
      <LinearGradient
        colors={[tokens.colors.backgroundTop, tokens.colors.backgroundBottom]}
        style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View
            entering={FadeInDown.duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.stateContainer}>
            <Text style={styles.stateTitle}>{t('errorTitle')}</Text>
            <Text style={styles.stateCopy}>{t('errorCopy')}</Text>
            <Pressable onPress={() => weatherQuery.refetch()} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{t('retry')}</Text>
            </Pressable>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const snapshot = weatherQuery.data;
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

  return (
    <LinearGradient
      colors={[tokens.colors.backgroundTop, tokens.colors.backgroundBottom]}
      style={styles.container}>
      <View pointerEvents="none" style={styles.skyGlowLarge} />
      <View pointerEvents="none" style={styles.skyGlowSmall} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View
            entering={FadeInDown.duration(motion.duration.slow).easing(motion.easing.standard)}
            layout={LinearTransition}
            style={styles.topBar}>
            <View style={styles.topBarLeading}>
              <Text style={styles.brand}>{t('brand')}</Text>
              <View style={styles.cityRow}>
                <Text style={styles.city}>{snapshot.city.name}</Text>
                {city.id.startsWith('current-') && <View style={styles.locationDot} />}
              </View>
            </View>

            <View style={styles.topBarActions}>
              <Pressable onPress={() => router.push('/settings')} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>{t('settings')}</Text>
              </Pressable>
              <Pressable onPress={handleToggleCity} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>{t('changeCity')}</Text>
              </Pressable>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(60).duration(motion.duration.slow).easing(motion.easing.standard)}
            layout={LinearTransition}
            style={styles.hero}>
            <View style={styles.heroMain}>
              <Text style={styles.temperature}>{Math.round(snapshot.current.temperature)}°</Text>
              <View style={styles.heroMeta}>
                <Text style={styles.condition}>{weatherLabel}</Text>
                <Text style={styles.highLow}>
                  {Math.round(today.temperatureMin)}° / {Math.round(today.temperatureMax)}°
                </Text>
              </View>
            </View>

            <View style={styles.heroDivider} />

            <View style={styles.primaryMetricsRow}>
              <Metric label={t('feelsLike')} value={`${Math.round(snapshot.current.apparentTemperature)}°`} styles={styles} />
              <Metric label={t('wind')} value={`${windCompass} ${Math.round(snapshot.current.windSpeed)} km/h`} styles={styles} />
              <Metric label={t('humidity')} value={`${Math.round(snapshot.current.humidity)}%`} styles={styles} />
              <Metric label={t('rain')} value={`${Math.round(snapshot.current.precipitationProbability)}%`} styles={styles} />
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(120).duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.advisoryRow}>
            <Text style={styles.advisoryLabel}>{t('advisory')}</Text>
            <Text style={styles.advisoryText}>{advisory}</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(180).duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.metricsGrid}>
            <InfoTile label={t('pressure')} value={`${Math.round(snapshot.current.pressure)} hPa`} styles={styles} />
            <InfoTile label={t('uvIndex')} value={`${Math.round(snapshot.current.uvIndex)}`} styles={styles} />
            <InfoTile label={t('sunrise')} value={formatClockTime(today.sunrise)} styles={styles} />
            <InfoTile label={t('sunset')} value={formatClockTime(today.sunset)} styles={styles} />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(240).duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('nextHours')}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyRow}>
              {snapshot.hourly.map((item, index) => (
                <Animated.View
                  key={item.time}
                  entering={FadeInRight
                    .delay(260 + index * motion.stagger)
                    .duration(motion.duration.normal)
                    .easing(motion.easing.standard)}
                  style={styles.hourlyItem}>
                  <Text style={styles.hourlyTime}>{formatHourLabel(item.time)}</Text>
                  <Text style={styles.hourlyTemp}>{Math.round(item.temperature)}°</Text>
                  <Text style={styles.hourlyRain}>{Math.round(item.precipitationProbability)}%</Text>
                  <Text style={styles.hourlyCode}>{t(weatherCodeToKey(item.weatherCode))}</Text>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(320).duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('weekOutlook')}</Text>
            </View>
            <Animated.View layout={LinearTransition} style={styles.weekList}>
              {snapshot.daily.map((item, index) => (
                <Animated.View
                  key={item.date}
                  entering={FadeInDown
                    .delay(340 + index * motion.stagger)
                    .duration(motion.duration.normal)
                    .easing(motion.easing.standard)}
                  layout={LinearTransition}
                  style={styles.weekRow}>
                  <View style={styles.weekLeading}>
                    <Text style={styles.weekDay}>{index === 0 ? t('today') : formatWeekday(item.date)}</Text>
                    <Text style={styles.weekCode}>{t(weatherCodeToKey(item.weatherCode))}</Text>
                  </View>
                  <Text style={styles.weekRange}>
                    {Math.round(item.temperatureMin)}°  {Math.round(item.temperatureMax)}°
                  </Text>
                </Animated.View>
              ))}
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function Metric({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function InfoTile({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.infoTile}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
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

function createStyles(tokens: AppThemeTokens) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.backgroundTop,
    },
    safeArea: {
      flex: 1,
    },
    skyGlowLarge: {
      position: 'absolute',
      top: 72,
      right: -40,
      width: 220,
      height: 220,
      borderRadius: 999,
      backgroundColor: tokens.colors.orbPrimary,
    },
    skyGlowSmall: {
      position: 'absolute',
      top: 220,
      left: -30,
      width: 120,
      height: 120,
      borderRadius: 999,
      backgroundColor: tokens.colors.orbSecondary,
    },
    content: {
      paddingHorizontal: tokens.spacing.lg,
      paddingTop: tokens.spacing.md,
      paddingBottom: tokens.spacing.xxl,
      gap: tokens.spacing.xl,
    },
    stateContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: tokens.spacing.xl,
      gap: tokens.spacing.sm,
    },
    stateTitle: {
      color: tokens.colors.textPrimary,
      fontSize: 32,
      fontWeight: '700',
    },
    stateCopy: {
      color: tokens.colors.textSecondary,
      fontSize: 16,
      lineHeight: 24,
      maxWidth: 280,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: tokens.spacing.md,
    },
    topBarLeading: {
      gap: 2,
      flex: 1,
    },
    brand: {
      color: tokens.colors.textMuted,
      fontSize: 12,
      letterSpacing: 2,
      textTransform: 'uppercase',
      marginBottom: 6,
    },
    cityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    city: {
      color: tokens.colors.textPrimary,
      fontSize: tokens.typography.city,
      fontWeight: '700',
      letterSpacing: -1.2,
    },
    locationDot: {
      width: 10,
      height: 10,
      borderRadius: 999,
      backgroundColor: tokens.colors.accent,
      marginTop: 4,
    },
    topBarActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.spacing.sm,
    },
    primaryButton: {
      borderWidth: 1,
      borderColor: tokens.colors.buttonBorder,
      backgroundColor: tokens.colors.buttonBackground,
      borderRadius: tokens.radius.full,
      paddingHorizontal: 16,
      paddingVertical: 11,
    },
    primaryButtonText: {
      color: tokens.colors.buttonText,
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    secondaryButton: {
      borderWidth: 1,
      borderColor: tokens.colors.divider,
      backgroundColor: tokens.colors.surfaceSoft,
      borderRadius: tokens.radius.full,
      paddingHorizontal: 14,
      paddingVertical: 11,
    },
    secondaryButtonText: {
      color: tokens.colors.textSecondary,
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },
    hero: {
      paddingTop: 10,
      paddingBottom: 8,
      gap: tokens.spacing.lg,
    },
    heroMain: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: tokens.spacing.md,
    },
    heroMeta: {
      alignItems: 'flex-end',
      paddingBottom: 14,
      gap: 8,
    },
    temperature: {
      color: tokens.colors.textPrimary,
      fontSize: tokens.typography.temp,
      fontWeight: '200',
      lineHeight: 108,
      letterSpacing: -4,
    },
    condition: {
      color: tokens.colors.textPrimary,
      fontSize: 28,
      fontWeight: '600',
    },
    highLow: {
      color: tokens.colors.textMuted,
      fontSize: 16,
    },
    heroDivider: {
      height: 1,
      backgroundColor: tokens.colors.divider,
    },
    primaryMetricsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tokens.spacing.xl,
    },
    metric: {
      gap: 4,
      minWidth: 92,
    },
    metricLabel: {
      color: tokens.colors.textMuted,
      fontSize: 12,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    metricValue: {
      color: tokens.colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    advisoryRow: {
      gap: 8,
      paddingTop: tokens.spacing.md,
      borderTopWidth: 1,
      borderTopColor: tokens.colors.divider,
    },
    advisoryLabel: {
      color: tokens.colors.textMuted,
      fontSize: 12,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
    },
    advisoryText: {
      color: tokens.colors.textPrimary,
      fontSize: 18,
      lineHeight: 27,
      maxWidth: 360,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: tokens.spacing.md,
    },
    infoTile: {
      minWidth: '47%',
      flexGrow: 1,
      paddingTop: tokens.spacing.md,
      borderTopWidth: 1,
      borderTopColor: tokens.colors.divider,
      gap: 6,
    },
    infoLabel: {
      color: tokens.colors.textMuted,
      fontSize: 12,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    infoValue: {
      color: tokens.colors.textPrimary,
      fontSize: 22,
      fontWeight: '600',
    },
    section: {
      gap: tokens.spacing.md,
    },
    sectionHeader: {
      paddingBottom: 2,
    },
    sectionTitle: {
      color: tokens.colors.textPrimary,
      fontSize: tokens.typography.section,
      fontWeight: '600',
    },
    hourlyRow: {
      gap: tokens.spacing.xl,
      paddingRight: tokens.spacing.xl,
    },
    hourlyItem: {
      minWidth: 92,
      gap: 6,
      paddingBottom: 8,
    },
    hourlyTime: {
      color: tokens.colors.textMuted,
      fontSize: 12,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    hourlyTemp: {
      color: tokens.colors.textPrimary,
      fontSize: 32,
      fontWeight: '600',
      letterSpacing: -1,
    },
    hourlyRain: {
      color: tokens.colors.accent,
      fontSize: 14,
      fontWeight: '600',
    },
    hourlyCode: {
      color: tokens.colors.textSecondary,
      fontSize: 13,
    },
    weekList: {
      gap: 0,
    },
    weekRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.divider,
    },
    weekLeading: {
      gap: 4,
    },
    weekDay: {
      color: tokens.colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    weekCode: {
      color: tokens.colors.textMuted,
      fontSize: 13,
    },
    weekRange: {
      color: tokens.colors.textSecondary,
      fontSize: 16,
      fontWeight: '600',
    },
  });
}
