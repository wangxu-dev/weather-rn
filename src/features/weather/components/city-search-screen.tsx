import { Host, TextField } from '@expo/ui/swift-ui';
import { controlSize, glassEffect, padding, submitLabel, textFieldStyle } from '@expo/ui/swift-ui/modifiers';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCitySearch } from '@/features/weather/api/weather-queries';
import { motion } from '@/shared/animation/motion';
import { useTranslation } from '@/shared/i18n/use-translation';
import { useNavigationLock } from '@/shared/navigation/use-navigation-lock';
import { useAppTheme } from '@/shared/theme/use-app-theme';
import { GlassSurface } from '@/shared/ui/glass-surface';
import { ToolbarControls } from '@/shared/ui/toolbar-controls';
import { useAppStore } from '@/store/app-store';

import { buildSuggestedCities, toSearchResultItems } from './city-search.helpers';
import { CitySearchSection } from './city-search-section';
import { createCitySearchStyles } from './city-search.styles';
import type { CityListItem } from './city-search.types';

const SEARCH_DEBOUNCE_MS = 250;

export function CitySearchScreen() {
  const { t, locale } = useTranslation();
  const { tokens, themeName } = useAppTheme();
  const styles = createCitySearchStyles(tokens);
  const runLockedNavigation = useNavigationLock();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const selectedCity = useAppStore((state) => state.selectedCity);
  const savedCities = useAppStore((state) => state.savedCities);
  const setSelectedCity = useAppStore((state) => state.setSelectedCity);
  const removeSavedCity = useAppStore((state) => state.removeSavedCity);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [query]);

  const citySearch = useCitySearch(debouncedQuery, locale);
  const suggestedCities = useMemo(() => buildSuggestedCities(selectedCity, savedCities, t('currentCityLabel')), [
    savedCities,
    selectedCity,
    t,
  ]);
  const savedCityItems = suggestedCities.filter((city) => city.kind === 'saved');
  const browsingCities = suggestedCities.filter((city) => city.kind !== 'saved');
  const searchResults = toSearchResultItems(citySearch.data ?? []);
  const showRemoteResults = debouncedQuery.length >= 2;

  function handleClose() {
    runLockedNavigation(() => router.replace('/'));
  }

  function handleSelectCity(city: CityListItem) {
    setSelectedCity(city);
    runLockedNavigation(() => router.replace('/'));
  }

  function handleDeleteCity(city: CityListItem) {
    removeSavedCity(city.id);
  }

  function handleLongPressDelete(city: CityListItem) {
    if (city.kind !== 'saved') return;

    Alert.alert(t('removeCity'), t('removeCityPrompt', { city: city.name }), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: () => handleDeleteCity(city) },
    ]);
  }

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
          <Animated.View entering={FadeInDown.duration(motion.duration.slow).easing(motion.easing.standard)} style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>{t('search')}</Text>
              <Text style={styles.title}>{t('searchCity')}</Text>
              <Text style={styles.subtitle}>{t('searchCityNote')}</Text>
            </View>
            <ToolbarControls
              themeName={themeName}
              tokens={tokens}
              actions={[{ id: 'close', label: t('close'), systemImage: 'xmark', onPress: handleClose }]}
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
                    glassEffect({ glass: { variant: 'regular', interactive: true }, shape: 'capsule' }),
                  ]}
                />
              </Host>
            ) : (
              <GlassSurface
                colorScheme={themeName}
                tintColor={tokens.colors.glassTint}
                borderColor={tokens.colors.buttonBorder}
                fallbackColor={tokens.colors.buttonBackground}
                style={styles.searchInputShell}>
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
              </GlassSurface>
            )}
          </Animated.View>

          {showRemoteResults ? (
            <CitySearchSection
              title={t('searchResults')}
              hint={getSearchResultHint(citySearch.isPending, citySearch.isError, searchResults.length, t)}
              cities={searchResults}
              styles={styles}
              onSelect={handleSelectCity}
              onLongPressDelete={handleLongPressDelete}
            />
          ) : (
            <>
              {savedCityItems.length ? (
                <CitySearchSection
                  title={t('savedCities')}
                  hint={t('savedCitiesHint')}
                  cities={savedCityItems}
                  styles={styles}
                  onSelect={handleSelectCity}
                  onLongPressDelete={handleLongPressDelete}
                />
              ) : null}
              {browsingCities.length ? (
                <CitySearchSection
                  title={t('changeCity')}
                  hint={t('searchHint')}
                  cities={browsingCities}
                  styles={styles}
                  onSelect={handleSelectCity}
                  onLongPressDelete={handleLongPressDelete}
                />
              ) : null}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function getSearchResultHint(
  isPending: boolean,
  isError: boolean,
  resultCount: number,
  t: ReturnType<typeof useTranslation>['t'],
) {
  if (isPending) return t('searchingCities');
  if (isError) return t('citySearchError');
  if (resultCount === 0) return t('noCitiesFound');
  return t('searchResultHint');
}
