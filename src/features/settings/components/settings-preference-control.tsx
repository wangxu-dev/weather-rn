import { Host, Picker, Text as SwiftText, VStack } from '@expo/ui/swift-ui';
import { controlSize, pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

import type { SettingsStyles } from './settings.styles';

type PreferenceControlProps = {
  themeName: 'light' | 'dark';
  styles: SettingsStyles;
  value: string;
  options: Array<{ key: string; label: string }>;
  onChange: (value: string) => void;
};

export function SettingsPreferenceControl({
  themeName,
  styles,
  value,
  options,
  onChange,
}: PreferenceControlProps) {
  if (Platform.OS === 'ios') {
    return (
      <View style={styles.nativeControlWrap}>
        <Host matchContents colorScheme={themeName} style={styles.nativeControlHost}>
          <VStack spacing={0}>
            <Picker
              selection={value}
              onSelectionChange={onChange}
              modifiers={[pickerStyle('segmented'), controlSize('large')]}>
              {options.map((option) => (
                <SwiftText key={option.key} modifiers={[tag(option.key)]}>
                  {option.label}
                </SwiftText>
              ))}
            </Picker>
          </VStack>
        </Host>
      </View>
    );
  }

  return (
    <View style={styles.optionRow}>
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable key={option.key} onPress={() => onChange(option.key)} style={[styles.chip, active && styles.chipActive]}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
