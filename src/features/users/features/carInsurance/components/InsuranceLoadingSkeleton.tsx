// src/features/users/features/carInsurance/components/InsuranceLoadingSkeleton.tsx

import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../../../../styles';

export const InsuranceLoadingSkeleton: React.FC = () => {
  const pulseAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.skeleton, styles.headerSkeleton, { opacity }]} />
      <Animated.View style={[styles.skeleton, styles.infoSkeleton, { opacity }]} />
      <Animated.View style={[styles.skeleton, styles.policySkeleton, { opacity }]} />
      <Animated.View style={[styles.skeleton, styles.policySkeleton, { opacity }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  skeleton: {
    backgroundColor: colors.border,
    borderRadius: 12,
    marginBottom: 16,
  },
  headerSkeleton: {
    height: 120,
  },
  infoSkeleton: {
    height: 150,
  },
  policySkeleton: {
    height: 200,
  },
});
