import { Button as SwiftUIButton, GlassEffectContainer, HStack, Host } from '@expo/ui/swift-ui';
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
  const mode = Platform.OS === 'ios' ? 'swift-ui' : 'fallback';

  if (mode === 'swift-ui') {
    return (
      <View style={styles.wrap}>
        <Host matchContents colorScheme={themeName} style={styles.swiftUIHost}>
          <GlassEffectContainer spacing={10}>
            <HStack spacing={10}>
              {actions.map((action) => (
                <SwiftUIButton
                  key={action.id}
                  label={action.label}
                  systemImage={action.systemImage}
                  onPress={action.onPress}
                  modifiers={[
                    controlSize('large'),
                    buttonStyle(action.prominent ? 'glassProminent' : 'glass'),
                    labelStyle('iconOnly'),
                  ]}
                />
              ))}
            </HStack>
          </GlassEffectContainer>
        </Host>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'flex-end',
  },
  swiftUIHost: {
    alignSelf: 'flex-start',
  },
  fallbackWrap: {
    paddingTop: 4,
  },
  fallbackGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  iconShell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
