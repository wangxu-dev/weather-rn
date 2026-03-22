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
  styles: CitySearchStyles;
  onSelect: (city: CityListItem) => void;
  onLongPressDelete: (city: CityListItem) => void;
};

export function CitySearchSection({
  title,
  hint,
  cities,
  styles,
  onSelect,
  onLongPressDelete,
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
            onPress={() => onSelect(city)}
            onLongPress={() => onLongPressDelete(city)}
            styles={styles}
          />
        ))}
      </View>
    </Animated.View>
  );
}
