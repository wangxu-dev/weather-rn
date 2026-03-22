import { Host, TextField } from '@expo/ui/swift-ui';
import { controlSize, glassEffect, padding, submitLabel, textFieldStyle } from '@expo/ui/swift-ui/modifiers';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCitySearch } from '@/features/weather/api/weather-queries';
import type { City } from '@/features/weather/model/weather.types';
import { motion } from '@/shared/animation/motion';
import { useTranslation } from '@/shared/i18n/use-translation';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { ToolbarControls } from '@/shared/ui/toolbar-controls';
import { presetCities, useAppStore } from '@/store/app-store';

type CityListItem = City & {
  subtitle: string;
};

const SEARCH_DEBOUNCE_MS = 250;

export function CitySearchScreen() {
  const { t, locale } = useTranslation();
  const { tokens, themeName } = useAppTheme();
  const styles = createStyles(tokens);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const selectedCity = useAppStore((state) => state.selectedCity);
  const setSelectedCity = useAppStore((state) => state.setSelectedCity);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query]);

  const citySearch = useCitySearch(debouncedQuery, locale);
  const suggestedCities = useMemo(() => {
    return dedupeCities([
      { ...selectedCity, subtitle: t('currentCityLabel') },
      ...presetCities
        .filter((city) => city.id !== selectedCity.id)
        .map((city) => ({ ...city, subtitle: city.timezone })),
    ]);
  }, [selectedCity, t]);

  const searchResults = citySearch.data ?? [];
  const showRemoteResults = debouncedQuery.length >= 2;

  return (
    <LinearGradient
      colors={[tokens.colors.backgroundTop, tokens.colors.backgroundBottom]}
      start={{ x: 0.15, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.container}>
      <View pointerEvents="none" style={styles.glowLarge} />
      <View pointerEvents="none" style={styles.glowSmall} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Animated.View
            entering={FadeInDown.duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>{t('search')}</Text>
              <Text style={styles.title}>{t('searchCity')}</Text>
              <Text style={styles.subtitle}>{t('searchCityNote')}</Text>
            </View>
            <ToolbarControls
              themeName={themeName}
              tokens={tokens}
              actions={[
                {
                  id: 'close',
                  label: t('close'),
                  systemImage: 'xmark',
                  onPress: () => router.back(),
                },
              ]}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(70).duration(motion.duration.slow).easing(motion.easing.standard)}
            style={styles.searchFieldWrap}>
            {Platform.OS === 'ios' ? (
              <Host matchContents colorScheme={themeName} style={styles.searchHost}>
                <TextField
                  key={`search-${themeName}`}
                  defaultValue={query}
                  placeholder={t('citySearchPlaceholder')}
                  autoFocus
                  autocorrection={false}
                  keyboardType="web-search"
                  onChangeText={setQuery}
                  onSubmit={setQuery}
                  modifiers={[
                    textFieldStyle('plain'),
                    controlSize('large'),
                    submitLabel('search'),
                    padding({ horizontal: 18, vertical: 14 }),
                    glassEffect({
                      glass: {
                        variant: 'regular',
                        interactive: true,
                      },
                      shape: 'capsule',
                    }),
                  ]}
                />
              </Host>
            ) : (
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder={t('citySearchPlaceholder')}
                placeholderTextColor={tokens.colors.textMuted}
                style={styles.searchInput}
                autoFocus
                autoCorrect={false}
                returnKeyType="search"
              />
            )}
          </Animated.View>

          {showRemoteResults ? (
            <Animated.View
              entering={FadeInDown.delay(120).duration(motion.duration.slow).easing(motion.easing.standard)}
              style={styles.section}>
              <Text style={styles.sectionTitle}>{t('searchResults')}</Text>
              {citySearch.isPending ? <Text style={styles.sectionHint}>{t('searchingCities')}</Text> : null}
              {citySearch.isError ? <Text style={styles.sectionHint}>{t('citySearchError')}</Text> : null}
              {!citySearch.isPending && !citySearch.isError && searchResults.length === 0 ? (
                <Text style={styles.sectionHint}>{t('noCitiesFound')}</Text>
              ) : null}
              <View style={styles.list}>
                {searchResults.map((city) => (
                  <CityRow
                    key={city.id}
                    city={city}
                    active={city.id === selectedCity.id}
                    onPress={() => {
                      setSelectedCity(city);
                      router.back();
                    }}
                    styles={styles}
                    activeLabel={t('current')}
                    idleLabel={t('select')}
                  />
                ))}
              </View>
            </Animated.View>
          ) : (
            <Animated.View
              entering={FadeInDown.delay(120).duration(motion.duration.slow).easing(motion.easing.standard)}
              style={styles.section}>
              <Text style={styles.sectionTitle}>{t('suggestedCities')}</Text>
              <Text style={styles.sectionHint}>{t('searchHint')}</Text>
              <View style={styles.list}>
                {suggestedCities.map((city) => (
                  <CityRow
                    key={city.id}
                    city={city}
                    active={city.id === selectedCity.id}
                    onPress={() => {
                      setSelectedCity(city);
                      router.back();
                    }}
                    styles={styles}
                    activeLabel={t('current')}
                    idleLabel={t('select')}
                  />
                ))}
              </View>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function CityRow({
  city,
  active,
  onPress,
  styles,
  activeLabel,
  idleLabel,
}: {
  city: CityListItem;
  active: boolean;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
  activeLabel: string;
  idleLabel: string;
}) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <View style={styles.rowCopy}>
        <Text style={styles.cityName}>{city.name}</Text>
        <Text style={styles.cityMeta}>{city.subtitle}</Text>
      </View>
      <Text style={[styles.statusText, active && styles.statusTextActive]}>{active ? activeLabel : idleLabel}</Text>
    </Pressable>
  );
}

function dedupeCities(cities: CityListItem[]) {
  const seen = new Set<string>();

  return cities.filter((city) => {
    if (seen.has(city.id)) {
      return false;
    }
    seen.add(city.id);
    return true;
  });
}

function createStyles(tokens: ReturnType<typeof useAppTheme>['tokens']) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: tokens.colors.backgroundTop,
    },
    safeArea: {
      flex: 1,
    },
    glowLarge: {
      position: 'absolute',
      top: 84,
      right: -30,
      width: 220,
      height: 220,
      borderRadius: 999,
      backgroundColor: tokens.colors.orbPrimary,
    },
    glowSmall: {
      position: 'absolute',
      bottom: 120,
      left: -40,
      width: 180,
      height: 180,
      borderRadius: 999,
      backgroundColor: tokens.colors.orbSecondary,
    },
    content: {
      paddingHorizontal: tokens.spacing.lg,
      paddingTop: tokens.spacing.md,
      paddingBottom: tokens.spacing.xxl,
      gap: tokens.spacing.xl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: tokens.spacing.md,
    },
    headerCopy: {
      flex: 1,
      gap: 6,
    },
    eyebrow: {
      color: tokens.colors.textMuted,
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: 4,
    },
    title: {
      color: tokens.colors.textPrimary,
      fontSize: 34,
      fontWeight: '700',
      letterSpacing: -1.2,
    },
    subtitle: {
      color: tokens.colors.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      maxWidth: 280,
    },
    searchFieldWrap: {
      minHeight: 48,
      justifyContent: 'center',
    },
    searchHost: {
      alignSelf: 'stretch',
    },
    searchInput: {
      color: tokens.colors.textPrimary,
      fontSize: 20,
      paddingVertical: 0,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.divider,
      paddingBottom: tokens.spacing.sm,
    },
    section: {
      gap: tokens.spacing.sm,
    },
    sectionTitle: {
      color: tokens.colors.textPrimary,
      fontSize: 18,
      fontWeight: '600',
    },
    sectionHint: {
      color: tokens.colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: tokens.spacing.xs,
    },
    list: {
      borderTopWidth: 1,
      borderTopColor: tokens.colors.divider,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: tokens.spacing.md,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.divider,
    },
    rowCopy: {
      flex: 1,
      gap: 4,
    },
    cityName: {
      color: tokens.colors.textPrimary,
      fontSize: 18,
      fontWeight: '600',
    },
    cityMeta: {
      color: tokens.colors.textMuted,
      fontSize: 13,
      lineHeight: 18,
    },
    statusText: {
      color: tokens.colors.textSecondary,
      fontSize: 13,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
    },
    statusTextActive: {
      color: tokens.colors.accent,
    },
  });
}
