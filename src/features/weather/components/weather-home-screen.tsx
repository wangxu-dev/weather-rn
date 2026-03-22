import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { Button as SwiftUIButton, ControlGroup, Host } from '@expo/ui/swift-ui';
import { buttonStyle, controlSize, labelStyle } from '@expo/ui/swift-ui/modifiers';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { GlassGroup, GlassSurface } from '@/shared/ui/glass-surface';
import { useAppStore } from '@/store/app-store';

export function WeatherHomeScreen() {
  const city = useAppStore((state) => state.selectedCity);
  const toggleCity = useAppStore((state) => state.toggleCity);
  const weatherQuery = useWeatherSnapshot(city);
  const { t } = useTranslation();
  const { tokens, themeName } = useAppTheme();
  const styles = createStyles(tokens);

  useBootstrapLocation();

  function handleToggleCity() {
    Haptics.selectionAsync();
    toggleCity();
  }

  if (weatherQuery.isPending) {
    return (
      <WeatherBackdrop tokens={tokens}>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View
            entering={FadeInDown.duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.stateContainer}>
            <Text style={styles.stateTitle}>{city.name}</Text>
            <Text style={styles.stateCopy}>{t('loadingTitle')}</Text>
          </Animated.View>
        </SafeAreaView>
      </WeatherBackdrop>
    );
  }

  if (weatherQuery.isError || !weatherQuery.data) {
    return (
      <WeatherBackdrop tokens={tokens}>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View
            entering={FadeInDown.duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.stateContainer}>
            <Text style={styles.stateTitle}>{t('errorTitle')}</Text>
            <Text style={styles.stateCopy}>{t('errorCopy')}</Text>
            <Pressable onPress={() => weatherQuery.refetch()} style={styles.inlineButton}>
              <Text style={styles.inlineButtonText}>{t('retry')}</Text>
            </Pressable>
          </Animated.View>
        </SafeAreaView>
      </WeatherBackdrop>
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

  const primaryMetrics = [
    { label: t('feelsLike'), value: `${Math.round(snapshot.current.apparentTemperature)}°` },
    { label: t('wind'), value: `${windCompass} ${Math.round(snapshot.current.windSpeed)} km/h` },
    { label: t('humidity'), value: `${Math.round(snapshot.current.humidity)}%` },
    { label: t('rain'), value: `${Math.round(snapshot.current.precipitationProbability)}%` },
  ];

  const details = [
    { label: t('pressure'), value: `${Math.round(snapshot.current.pressure)} hPa` },
    { label: t('uvIndex'), value: `${Math.round(snapshot.current.uvIndex)}` },
    { label: t('sunrise'), value: formatClockTime(today.sunrise) },
    { label: t('sunset'), value: formatClockTime(today.sunset) },
  ];

  return (
    <WeatherBackdrop tokens={tokens}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View
            entering={FadeInDown.duration(motion.duration.slow).easing(motion.easing.standard)}
            layout={LinearTransition}
            style={styles.headerRow}>
            <View style={styles.headerCopy}>
              <Text style={styles.brand}>{t('brand')}</Text>
              <View style={styles.cityRow}>
                <Text style={styles.city}>{snapshot.city.name}</Text>
                {city.id.startsWith('current-') && <View style={styles.locationDot} />}
              </View>
            </View>

            <TopControls
              styles={styles}
              themeName={themeName}
              tokens={tokens}
              searchLabel={t('search')}
              addLabel={t('changeCity')}
              settingsLabel={t('settings')}
              onSearchPress={() => router.push('/search')}
              onAddPress={handleToggleCity}
              onSettingsPress={() => router.push('/settings')}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(50).duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.hero}>
            <View style={styles.heroMetaRow}>
              <Text style={styles.heroEyebrow}>{t('currentConditions')}</Text>
              <Text style={styles.heroMetaText}>{formatWeekday(today.date)}</Text>
            </View>

            <View style={styles.heroMain}>
              <View style={styles.heroPrimary}>
                <Text style={styles.temperature}>{Math.round(snapshot.current.temperature)}°</Text>
                <Text style={styles.condition}>{weatherLabel}</Text>
              </View>
              <View style={styles.heroSecondary}>
                <Text style={styles.rangeLabel}>{t('range')}</Text>
                <Text style={styles.rangeValue}>
                  {Math.round(today.temperatureMin)}° / {Math.round(today.temperatureMax)}°
                </Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              {primaryMetrics.map((metric) => (
                <Metric key={metric.label} label={metric.label} value={metric.value} styles={styles} />
              ))}
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(120).duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.section}>
            <View style={styles.sectionHeadingRow}>
              <Text style={styles.sectionTitle}>{t('advisory')}</Text>
            </View>
            <Text style={styles.advisoryText}>{advisory}</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(160).duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.section}>
            <Text style={styles.sectionTitle}>{t('currentConditions')}</Text>
            <View style={styles.detailGrid}>
              {details.map((item) => (
                <InfoLine key={item.label} label={item.label} value={item.value} styles={styles} />
              ))}
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(220).duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.section}>
            <View style={styles.sectionHeadingRow}>
              <Text style={styles.sectionTitle}>{t('nextHours')}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyRow}>
              {snapshot.hourly.map((item, index) => (
                <Animated.View
                  key={item.time}
                  entering={FadeInRight
                    .delay(200 + index * motion.stagger)
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
            entering={FadeInDown.delay(300).duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.section}>
            <Text style={styles.sectionTitle}>{t('weekOutlook')}</Text>
            <Animated.View layout={LinearTransition}>
              {snapshot.daily.map((item, index) => (
                <Animated.View
                  key={item.date}
                  entering={FadeInDown
                    .delay(280 + index * motion.stagger)
                    .duration(motion.duration.normal)
                    .easing(motion.easing.standard)}
                  layout={LinearTransition}
                  style={[styles.weekRow, index === snapshot.daily.length - 1 && styles.weekRowLast]}>
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
    </WeatherBackdrop>
  );
}

function IconButton({
  symbol,
  onPress,
  styles,
  tintColor,
  themeName,
  tokens,
}: {
  symbol: 'magnifyingglass' | 'plus' | 'gearshape';
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
  tintColor: string;
  themeName: 'light' | 'dark';
  tokens: AppThemeTokens;
}) {
  return (
    <GlassSurface
      colorScheme={themeName}
      tintColor={tokens.colors.glassTint}
      borderColor={tokens.colors.glassBorder}
      fallbackColor={tokens.colors.surfaceSoft}
      glassEffectStyle="regular"
      style={styles.iconButtonShell}>
      <Pressable onPress={onPress} style={styles.iconButton}>
        <SymbolView
          name={symbol}
          size={18}
          weight="medium"
          type="hierarchical"
          tintColor={tintColor}
        />
      </Pressable>
    </GlassSurface>
  );
}

function TopControls({
  styles,
  themeName,
  tokens,
  searchLabel,
  addLabel,
  settingsLabel,
  onSearchPress,
  onAddPress,
  onSettingsPress,
}: {
  styles: ReturnType<typeof createStyles>;
  themeName: 'light' | 'dark';
  tokens: AppThemeTokens;
  searchLabel: string;
  addLabel: string;
  settingsLabel: string;
  onSearchPress: () => void;
  onAddPress: () => void;
  onSettingsPress: () => void;
}) {
  if (Platform.OS === 'ios') {
    return (
      <Host matchContents colorScheme={themeName} style={styles.swiftUIHost}>
        <ControlGroup modifiers={[controlSize('small')]}>
          <SwiftUIButton
            label={searchLabel}
            systemImage="magnifyingglass"
            onPress={onSearchPress}
            modifiers={[buttonStyle('glass'), labelStyle('iconOnly')]}
          />
          <SwiftUIButton
            label={addLabel}
            systemImage="plus"
            onPress={onAddPress}
            modifiers={[buttonStyle('glass'), labelStyle('iconOnly')]}
          />
          <SwiftUIButton
            label={settingsLabel}
            systemImage="gearshape"
            onPress={onSettingsPress}
            modifiers={[buttonStyle('glass'), labelStyle('iconOnly')]}
          />
        </ControlGroup>
      </Host>
    );
  }

  return (
    <View style={styles.headerActions}>
      <GlassGroup spacing={16} style={styles.headerActionGroup}>
        <IconButton
          symbol="magnifyingglass"
          onPress={onSearchPress}
          styles={styles}
          tintColor={tokens.colors.textPrimary}
          themeName={themeName}
          tokens={tokens}
        />
        <IconButton
          symbol="plus"
          onPress={onAddPress}
          styles={styles}
          tintColor={tokens.colors.textPrimary}
          themeName={themeName}
          tokens={tokens}
        />
        <IconButton
          symbol="gearshape"
          onPress={onSettingsPress}
          styles={styles}
          tintColor={tokens.colors.textPrimary}
          themeName={themeName}
          tokens={tokens}
        />
      </GlassGroup>
    </View>
  );
}

function WeatherBackdrop({
  children,
  tokens,
}: {
  children: React.ReactNode;
  tokens: AppThemeTokens;
}) {
  const styles = createStyles(tokens);

  return (
    <LinearGradient
      colors={[tokens.colors.backgroundTop, tokens.colors.backgroundBottom]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.container}>
      <View pointerEvents="none" style={styles.skyGlowLarge} />
      <View pointerEvents="none" style={styles.skyGlowSmall} />
      <LinearGradient
        colors={[tokens.colors.backgroundHaze, 'transparent']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 0.7 }}
        pointerEvents="none"
        style={styles.sunHaze}
      />
      {children}
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

function InfoLine({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.infoLine}>
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
      top: 64,
      right: -18,
      width: 248,
      height: 248,
      borderRadius: 999,
      backgroundColor: tokens.colors.orbPrimary,
    },
    skyGlowSmall: {
      position: 'absolute',
      top: 238,
      left: -42,
      width: 176,
      height: 176,
      borderRadius: 999,
      backgroundColor: tokens.colors.orbSecondary,
    },
    sunHaze: {
      position: 'absolute',
      top: 58,
      left: 24,
      width: 240,
      height: 240,
      borderRadius: 999,
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
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: tokens.spacing.md,
    },
    headerCopy: {
      flex: 1,
      gap: 4,
    },
    brand: {
      color: tokens.colors.textMuted,
      fontSize: 12,
      letterSpacing: 2,
      textTransform: 'uppercase',
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
      letterSpacing: -1.4,
    },
    locationDot: {
      width: 10,
      height: 10,
      borderRadius: 999,
      backgroundColor: tokens.colors.accent,
      marginTop: 4,
    },
    headerActions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      paddingTop: 8,
    },
    swiftUIHost: {
      alignSelf: 'flex-start',
      marginTop: 4,
    },
    headerActionGroup: {
      flexDirection: 'row',
      gap: tokens.spacing.sm,
    },
    inlineButton: {
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
    inlineButtonText: {
      color: tokens.colors.textSecondary,
      fontSize: 13,
      fontWeight: '600',
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
    iconButtonShell: {
      width: 36,
      height: 36,
      borderRadius: 18,
    },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    hero: {
      gap: tokens.spacing.md,
    },
    heroMetaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: tokens.spacing.md,
    },
    heroEyebrow: {
      color: tokens.colors.textMuted,
      fontSize: 12,
      letterSpacing: 1.6,
      textTransform: 'uppercase',
    },
    heroMetaText: {
      color: tokens.colors.textSecondary,
      fontSize: 13,
      fontWeight: '500',
    },
    heroMain: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: tokens.spacing.md,
    },
    heroPrimary: {
      flex: 1,
    },
    heroSecondary: {
      alignItems: 'flex-end',
      paddingBottom: 12,
      gap: 6,
    },
    temperature: {
      color: tokens.colors.textPrimary,
      fontSize: tokens.typography.temp,
      fontWeight: '200',
      lineHeight: 108,
      letterSpacing: -4.6,
    },
    condition: {
      color: tokens.colors.textPrimary,
      fontSize: 28,
      fontWeight: '600',
      marginTop: 4,
    },
    rangeLabel: {
      color: tokens.colors.textMuted,
      fontSize: 12,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    rangeValue: {
      color: tokens.colors.textPrimary,
      fontSize: 20,
      fontWeight: '600',
    },
    metricsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      rowGap: tokens.spacing.md,
      columnGap: tokens.spacing.lg,
    },
    metric: {
      minWidth: '45%',
      gap: 4,
    },
    metricLabel: {
      color: tokens.colors.textMuted,
      fontSize: 12,
      letterSpacing: 1.1,
      textTransform: 'uppercase',
    },
    metricValue: {
      color: tokens.colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    advisoryText: {
      color: tokens.colors.textPrimary,
      fontSize: 18,
      lineHeight: 27,
      maxWidth: 380,
    },
    section: {
      gap: tokens.spacing.md,
      paddingTop: tokens.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: tokens.colors.divider,
    },
    sectionHeadingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    sectionTitle: {
      color: tokens.colors.textPrimary,
      fontSize: tokens.typography.section,
      fontWeight: '600',
    },
    detailGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      rowGap: tokens.spacing.md,
      columnGap: tokens.spacing.lg,
    },
    infoLine: {
      minWidth: '45%',
      flexGrow: 1,
      gap: 4,
    },
    infoLabel: {
      color: tokens.colors.textMuted,
      fontSize: 12,
      letterSpacing: 1.1,
      textTransform: 'uppercase',
    },
    infoValue: {
      color: tokens.colors.textPrimary,
      fontSize: 22,
      fontWeight: '600',
    },
    hourlyRow: {
      gap: tokens.spacing.xl,
      paddingRight: tokens.spacing.lg,
    },
    hourlyItem: {
      minWidth: 96,
      gap: 6,
    },
    hourlyTime: {
      color: tokens.colors.textMuted,
      fontSize: 12,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    hourlyTemp: {
      color: tokens.colors.textPrimary,
      fontSize: 34,
      fontWeight: '600',
      letterSpacing: -1.4,
    },
    hourlyRain: {
      color: tokens.colors.accent,
      fontSize: 15,
      fontWeight: '700',
    },
    hourlyCode: {
      color: tokens.colors.textSecondary,
      fontSize: 13,
      lineHeight: 18,
    },
    weekRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.divider,
    },
    weekRowLast: {
      borderBottomWidth: 0,
      paddingBottom: 0,
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
