import { Easing } from 'react-native-reanimated';

export const motion = {
  duration: {
    fast: 180,
    normal: 320,
    slow: 520,
  },
  easing: {
    standard: Easing.bezier(0.2, 0.8, 0.2, 1),
  },
  stagger: 70,
} as const;
