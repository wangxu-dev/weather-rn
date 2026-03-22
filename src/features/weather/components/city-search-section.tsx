import React from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { motion } from '@/shared/animation/motion';

import { CitySearchRow } from './city-search-row';
import type { CitySearchStyles } from './city-search.styles';
import type { CityListItem } from './city-search.types';

type CitySectionProps = {
  title: string;
  hint: string;
  cities: CityListItem[];
  selectedCityId: string;
  styles: CitySearchStyles;
  onSelect: (city: CityListItem) => void;
  onDelete: (city: CityListItem) => void;
  onLongPressDelete: (city: CityListItem) => void;
  activeLabel: string;
  selectLabel: string;
  savedLabel: string;
  deleteLabel: string;
};

export function CitySearchSection({
  title,
  hint,
  cities,
  selectedCityId,
  styles,
  onSelect,
  onDelete,
  onLongPressDelete,
  activeLabel,
  selectLabel,
  savedLabel,
  deleteLabel,
}: CitySectionProps) {
  return (
    <Animated.View entering={FadeInDown.delay(120).duration(motion.duration.slow).easing(motion.easing.standard)} style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionHint}>{hint}</Text>
      <View style={styles.list}>
        {cities.map((city) => (
          <CitySearchRow
            key={city.id}
            city={city}
            active={city.id === selectedCityId}
            onPress={() => onSelect(city)}
            onDelete={() => onDelete(city)}
            onLongPress={() => onLongPressDelete(city)}
            styles={styles}
            activeLabel={activeLabel}
            idleLabel={city.kind === 'saved' ? savedLabel : selectLabel}
            deleteLabel={deleteLabel}
          />
        ))}
      </View>
    </Animated.View>
  );
}
