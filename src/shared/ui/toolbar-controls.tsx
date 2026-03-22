import { Button as SwiftUIButton, ControlGroup, Host } from '@expo/ui/swift-ui';
import { buttonStyle, controlSize, labelStyle } from '@expo/ui/swift-ui/modifiers';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { GlassGroup, GlassSurface } from '@/shared/ui/glass-surface';

type ThemeName = 'light' | 'dark';

type ToolbarAction = {
  id: string;
  label: string;
  systemImage: 'magnifyingglass' | 'plus' | 'gearshape' | 'xmark';
  onPress: () => void;
  prominent?: boolean;
};

type Tokens = {
  colors: {
    textPrimary: string;
    divider: string;
    surfaceSoft: string;
    glassTint: string;
    glassBorder: string;
  };
};

type ToolbarControlsProps = {
  actions: ToolbarAction[];
  themeName: ThemeName;
  tokens: Tokens;
};

export function ToolbarControls({ actions, themeName, tokens }: ToolbarControlsProps) {
  if (Platform.OS === 'ios') {
    return (
      <Host matchContents colorScheme={themeName} style={styles.swiftUIHost}>
        <ControlGroup modifiers={[controlSize(actions.length === 1 ? 'regular' : 'large')]}>
          {actions.map((action) => (
            <SwiftUIButton
              key={action.id}
              label={action.label}
              systemImage={action.systemImage}
              onPress={action.onPress}
              modifiers={[
                buttonStyle(action.prominent ? 'glassProminent' : 'glass'),
                labelStyle('iconOnly'),
              ]}
            />
          ))}
        </ControlGroup>
      </Host>
    );
  }

  return (
    <View style={styles.fallbackWrap}>
      <GlassGroup spacing={16} style={styles.fallbackGroup}>
        {actions.map((action) => (
          <GlassSurface
            key={action.id}
            colorScheme={themeName}
            tintColor={tokens.colors.glassTint}
            borderColor={tokens.colors.glassBorder}
            fallbackColor={action.prominent ? tokens.colors.glassTint : tokens.colors.surfaceSoft}
            glassEffectStyle="regular"
            style={styles.iconShell}>
            <Pressable onPress={action.onPress} style={styles.iconButton}>
              <SymbolView
                name={action.systemImage}
                size={18}
                weight="medium"
                type="hierarchical"
                tintColor={tokens.colors.textPrimary}
              />
            </Pressable>
          </GlassSurface>
        ))}
      </GlassGroup>
    </View>
  );
}

const styles = StyleSheet.create({
  swiftUIHost: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  fallbackWrap: {
    paddingTop: 8,
  },
  fallbackGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  iconShell: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
