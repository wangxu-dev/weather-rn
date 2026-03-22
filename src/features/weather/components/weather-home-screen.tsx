import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useWeatherSnapshot } from '@/features/weather/api/weather-queries';
import {
  formatHourLabel,
  formatWeekday,
  weatherCodeToLabel,
} from '@/features/weather/model/weather.mapper';
import { useAppStore } from '@/store/app-store';

export function WeatherHomeScreen() {
  const city = useAppStore((state) => state.selectedCity);
  const toggleCity = useAppStore((state) => state.toggleCity);
  const weatherQuery = useWeatherSnapshot(city);

  function handleToggleCity() {
    Haptics.selectionAsync();
    toggleCity();
  }

  if (weatherQuery.isPending) {
    return (
      <LinearGradient colors={['#07111d', '#0c2235', '#143b57']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View entering={FadeInDown.duration(450)} style={styles.stateContainer}>
            <Text style={styles.stateTitle}>Loading weather</Text>
            <Text style={styles.stateCopy}>正在从 Open-Meteo 拉取 {city.name} 的实时天气。</Text>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (weatherQuery.isError || !weatherQuery.data) {
    return (
      <LinearGradient colors={['#07111d', '#0c2235', '#143b57']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View entering={FadeInDown.duration(450)} style={styles.stateContainer}>
            <Text style={styles.stateTitle}>Weather unavailable</Text>
            <Text style={styles.stateCopy}>这一步说明网络请求或数据映射有问题，我们下一步就排查。</Text>
            <Pressable onPress={() => weatherQuery.refetch()} style={styles.switchButton}>
              <Text style={styles.switchButtonText}>重试</Text>
            </Pressable>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const snapshot = weatherQuery.data;
  const currentCondition = weatherCodeToLabel(snapshot.current.weatherCode);
  const today = snapshot.daily[0];

  return (
    <LinearGradient colors={['#091015', '#13222c', '#203847']} style={styles.container}>
      <View pointerEvents="none" style={styles.backgroundOrbLarge} />
      <View pointerEvents="none" style={styles.backgroundOrbSmall} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(500)} layout={LinearTransition} style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>Atmosphere</Text>
              <Text style={styles.city}>{snapshot.city.name}</Text>
              <Text style={styles.summary}>
                安静、自然的天气视图。先把信息层次和材质做对，再逐步扩展搜索、定位和更复杂的动效。
              </Text>
            </View>

            <Pressable onPress={handleToggleCity} style={styles.switchButton}>
              <Text style={styles.switchButtonText}>Change</Text>
            </Pressable>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(100).duration(550)}
            layout={LinearTransition}
            style={styles.heroCard}>
            <BlurView intensity={28} tint="dark" style={styles.heroGlass}>
              <View style={styles.heroTop}>
                <View style={styles.heroTitleBlock}>
                  <Text style={styles.heroLabel}>Current Conditions</Text>
                  <Text style={styles.condition}>{currentCondition}</Text>
                </View>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>Feels {Math.round(snapshot.current.apparentTemperature)}°</Text>
                </View>
              </View>

              <View style={styles.heroCore}>
                <Text style={styles.temperature}>{Math.round(snapshot.current.temperature)}°</Text>
                <View style={styles.heroMetaColumn}>
                  <Metric label="Wind" value={`${Math.round(snapshot.current.windSpeed)} km/h`} />
                  <Metric
                    label="Range"
                    value={`${Math.round(today.temperatureMin)}° / ${Math.round(today.temperatureMax)}°`}
                  />
                </View>
              </View>
            </BlurView>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(180).duration(550)} style={styles.section}>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionTitle}>Next Hours</Text>
              <Text style={styles.sectionHint}>calm trend</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
              {snapshot.hourly.map((item, index) => (
                <Animated.View
                  key={item.time}
                  entering={FadeInDown.delay(220 + index * 35).duration(420)}
                  style={styles.hourRow}>
                  <Text style={styles.hourTime}>{formatHourLabel(item.time)}</Text>
                  <Text style={styles.hourTemp}>{Math.round(item.temperature)}°</Text>
                  <Text style={styles.hourAccent}>{weatherCodeToLabel(item.weatherCode)}</Text>
                </Animated.View>
              ))}
            </ScrollView>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(260).duration(550)} style={styles.section}>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionTitle}>Week Outlook</Text>
              <Text style={styles.sectionHint}>steady overview</Text>
            </View>
            <Animated.View layout={LinearTransition} style={styles.weekList}>
              {snapshot.daily.map((item, index) => (
                <Animated.View
                  key={item.date}
                  entering={FadeInDown.delay(300 + index * 50).duration(420)}
                  layout={LinearTransition}
                  style={styles.weekRow}>
                  <View style={styles.weekDayGroup}>
                    <Text style={styles.weekDay}>{formatWeekday(item.date)}</Text>
                    <Text style={styles.weekCondition}>{weatherCodeToLabel(item.weatherCode)}</Text>
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricItem}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#091015',
  },
  safeArea: {
    flex: 1,
  },
  backgroundOrbLarge: {
    position: 'absolute',
    top: 90,
    right: -30,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(167, 189, 172, 0.12)',
  },
  backgroundOrbSmall: {
    position: 'absolute',
    top: 210,
    left: -40,
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: 'rgba(196, 182, 143, 0.10)',
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 28,
    gap: 14,
  },
  stateTitle: {
    color: '#f1ede3',
    fontSize: 28,
    fontWeight: '700',
  },
  stateCopy: {
    color: '#b4c0bd',
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 300,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: 36,
    gap: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 12,
    gap: 18,
  },
  eyebrow: {
    color: '#94a69e',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  city: {
    color: '#f3efe6',
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: -1.2,
  },
  summary: {
    color: '#b8c4c1',
    fontSize: 15,
    lineHeight: 24,
    marginTop: 10,
    maxWidth: 248,
  },
  switchButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(244, 239, 226, 0.08)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  switchButtonText: {
    color: '#ece7dc',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroCard: {
    marginTop: 4,
    borderRadius: 32,
    overflow: 'hidden',
  },
  heroGlass: {
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(33, 47, 56, 0.22)',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  heroTitleBlock: {
    gap: 6,
  },
  heroLabel: {
    color: '#90a29d',
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  heroBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(248, 243, 232, 0.09)',
  },
  heroBadgeText: {
    color: '#efe9dc',
    fontSize: 12,
    fontWeight: '600',
  },
  heroCore: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 16,
  },
  temperature: {
    color: '#f6f2e9',
    fontSize: 104,
    fontWeight: '200',
    lineHeight: 108,
    letterSpacing: -4,
  },
  condition: {
    color: '#f4eee2',
    fontSize: 26,
    fontWeight: '600',
  },
  heroMetaColumn: {
    minWidth: 112,
    gap: 12,
    paddingBottom: 10,
  },
  metricItem: {
    gap: 4,
  },
  metricLabel: {
    color: '#8fa19c',
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  metricValue: {
    color: '#e9e4d9',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    gap: 16,
  },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#f0ece2',
    fontSize: 21,
    fontWeight: '600',
  },
  sectionHint: {
    color: '#8fa09b',
    fontSize: 13,
  },
  row: {
    gap: 18,
    paddingRight: 18,
  },
  hourRow: {
    minWidth: 78,
    paddingBottom: 8,
    gap: 6,
  },
  hourTime: {
    color: '#93a59f',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  hourTemp: {
    color: '#f5f0e5',
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: -1,
  },
  hourAccent: {
    color: '#ced7d2',
    fontSize: 13,
    lineHeight: 18,
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
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  weekDayGroup: {
    gap: 4,
  },
  weekDay: {
    color: '#f1ede3',
    fontSize: 16,
    fontWeight: '600',
  },
  weekCondition: {
    color: '#91a29d',
    fontSize: 13,
  },
  weekRange: {
    color: '#ded8cb',
    fontSize: 16,
    fontWeight: '600',
  },
});
