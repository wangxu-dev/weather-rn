import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight, LinearTransition } from 'react-native-reanimated';

import { motion } from '@/shared/animation/motion';
import { useTranslation } from '@/shared/i18n/use-translation';

import {
  formatClockTime,
  formatHourLabel,
  formatWeekday,
  weatherCodeToKey,
} from '@/features/weather/model/weather.mapper';
import type { DailyForecastItem, HourlyForecastItem } from '@/features/weather/model/weather.types';

import type { WeatherHomeStyles } from './weather-home.styles';

type MetricItem = { label: string; value: string };
type DetailItem = { label: string; value: string };

type WeatherHomeContentProps = {
  cityId: string;
  locale: string;
  currentTemperature: number;
  weatherLabel: string;
  today: DailyForecastItem;
  advisory: string;
  primaryMetrics: MetricItem[];
  details: DetailItem[];
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  styles: WeatherHomeStyles;
};

export function WeatherHomeContent({
  cityId,
  locale,
  currentTemperature,
  weatherLabel,
  today,
  advisory,
  primaryMetrics,
  details,
  hourly,
  daily,
  styles,
}: WeatherHomeContentProps) {
  const { t } = useTranslation();

  return (
    <Animated.View key={`snapshot-${cityId}`} entering={FadeInDown.duration(320)} style={styles.snapshotContent}>
      <Animated.View
        entering={FadeInDown.delay(50).duration(motion.duration.slow).easing(motion.easing.standard)}
        style={styles.hero}>
        <View style={styles.heroMetaRow}>
          <Text style={styles.heroEyebrow}>{t('currentConditions')}</Text>
          <Text style={styles.heroMetaText}>{formatWeekday(today.date, locale)}</Text>
        </View>

        <View style={styles.heroMain}>
          <View style={styles.heroPrimary}>
            <Text style={styles.temperature}>{Math.round(currentTemperature)}°</Text>
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

      <WeatherSection title={t('advisory')} styles={styles} delay={120}>
        <Text style={styles.advisoryText}>{advisory}</Text>
      </WeatherSection>

      <WeatherSection title={t('currentConditions')} styles={styles} delay={160}>
        <View style={styles.detailGrid}>
          {details.map((item) => (
            <InfoLine key={item.label} label={item.label} value={item.value} styles={styles} />
          ))}
        </View>
      </WeatherSection>

      <WeatherSection title={t('nextHours')} styles={styles} delay={220}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyRow}>
          {hourly.map((item, index) => (
            <Animated.View
              key={item.time}
              entering={FadeInRight
                .delay(200 + index * motion.stagger)
                .duration(motion.duration.normal)
                .easing(motion.easing.standard)}
              style={styles.hourlyItem}>
              <Text style={styles.hourlyTime}>{formatHourLabel(item.time, locale)}</Text>
              <Text style={styles.hourlyTemp}>{Math.round(item.temperature)}°</Text>
              <Text style={styles.hourlyRain}>{Math.round(item.precipitationProbability)}%</Text>
              <Text style={styles.hourlyCode}>{t(weatherCodeToKey(item.weatherCode))}</Text>
            </Animated.View>
          ))}
        </ScrollView>
      </WeatherSection>

      <WeatherSection title={t('weekOutlook')} styles={styles} delay={300}>
        <Animated.View layout={LinearTransition}>
          {daily.map((item, index) => (
            <Animated.View
              key={item.date}
              entering={FadeInDown
                .delay(280 + index * motion.stagger)
                .duration(motion.duration.normal)
                .easing(motion.easing.standard)}
              layout={LinearTransition}
              style={[styles.weekRow, index === daily.length - 1 && styles.weekRowLast]}>
              <View style={styles.weekLeading}>
                <Text style={styles.weekDay}>{index === 0 ? t('today') : formatWeekday(item.date, locale)}</Text>
                <Text style={styles.weekCode}>{t(weatherCodeToKey(item.weatherCode))}</Text>
              </View>
              <Text style={styles.weekRange}>
                {Math.round(item.temperatureMin)}°  {Math.round(item.temperatureMax)}°
              </Text>
            </Animated.View>
          ))}
        </Animated.View>
      </WeatherSection>
    </Animated.View>
  );
}

function WeatherSection({
  title,
  styles,
  delay,
  children,
}: {
  title: string;
  styles: WeatherHomeStyles;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(motion.duration.slow).easing(motion.easing.standard)}
      style={styles.section}>
      <View style={styles.sectionHeadingRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </Animated.View>
  );
}

function Metric({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: WeatherHomeStyles;
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
  styles: WeatherHomeStyles;
}) {
  return (
    <View style={styles.infoLine}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}
