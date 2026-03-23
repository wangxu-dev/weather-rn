import { Button as SwiftUIButton, GlassEffectContainer, HStack, Host } from '@expo/ui/swift-ui';
import { buttonStyle, controlSize, labelStyle } from '@expo/ui/swift-ui/modifiers';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

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
    buttonBackground: string;
    buttonBorder: string;
    buttonText: string;
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
        <View style={styles.fallbackGroup}>
          {actions.map((action) => (
            <View
              key={action.id}
              style={[
                styles.iconShell,
                {
                  backgroundColor: tokens.colors.buttonBackground,
                  borderColor: tokens.colors.buttonBorder,
                },
                action.prominent && styles.iconShellProminent,
              ]}>
              <Pressable android_ripple={{ color: 'rgba(255,255,255,0.16)', borderless: true }} onPress={action.onPress} style={styles.iconButton}>
                <SymbolView
                  name={action.systemImage}
                  size={18}
                  weight="medium"
                  type="hierarchical"
                  tintColor={tokens.colors.buttonText}
                />
              </Pressable>
            </View>
          ))}
        </View>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconShellProminent: {
    borderWidth: 1.5,
  },
  iconButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
