import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { CitySearchStyles } from './city-search.styles';
import type { CityListItem } from './city-search.types';

type CityRowProps = {
  city: CityListItem;
  onPress: () => void;
  onLongPress: () => void;
  styles: CitySearchStyles;
};

export function CitySearchRow({
  city,
  onPress,
  onLongPress,
  styles,
}: CityRowProps) {
  return (
    <Pressable onPress={onPress} onLongPress={city.kind === 'saved' ? onLongPress : undefined} style={styles.row}>
      <View style={styles.rowCopy}>
        <Text style={styles.cityName}>{city.name}</Text>
        <Text style={styles.cityMeta}>{city.subtitle}</Text>
      </View>
    </Pressable>
  );
}
