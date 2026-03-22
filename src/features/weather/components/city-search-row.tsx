import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { CitySearchStyles } from './city-search.styles';
import type { CityListItem } from './city-search.types';

type CityRowProps = {
  city: CityListItem;
  active: boolean;
  onPress: () => void;
  onDelete: () => void;
  onLongPress: () => void;
  styles: CitySearchStyles;
  activeLabel: string;
  idleLabel: string;
  deleteLabel: string;
};

export function CitySearchRow({
  city,
  active,
  onPress,
  onDelete,
  onLongPress,
  styles,
  activeLabel,
  idleLabel,
  deleteLabel,
}: CityRowProps) {
  return (
    <Pressable onPress={onPress} onLongPress={city.kind === 'saved' ? onLongPress : undefined} style={styles.row}>
      <View style={styles.rowCopy}>
        <Text style={styles.cityName}>{city.name}</Text>
        <Text style={styles.cityMeta}>{city.subtitle}</Text>
      </View>
      <Text style={[styles.statusText, active && styles.statusTextActive]}>{active ? activeLabel : idleLabel}</Text>
    </Pressable>
  );
}
