// src/features/users/features/buyUsedCar/components/LoadingSkeleton.tsx

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.lg * 2;

export const CarCardSkeleton: React.FC = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.image, { opacity }]} />
      <View style={styles.content}>
        <Animated.View style={[styles.titleBar, { opacity }]} />
        <Animated.View style={[styles.subtitleBar, { opacity }]} />
        <View style={styles.detailsRow}>
          <Animated.View style={[styles.detailBox, { opacity }]} />
          <Animated.View style={[styles.detailBox, { opacity }]} />
          <Animated.View style={[styles.detailBox, { opacity }]} />
        </View>
        <View style={styles.footer}>
          <Animated.View style={[styles.locationBar, { opacity }]} />
          <Animated.View style={[styles.priceBar, { opacity }]} />
        </View>
      </View>
    </View>
  );
};

export const LoadingSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <CarCardSkeleton key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.border,
  },
  content: {
    padding: spacing.md,
  },
  titleBar: {
    height: 20,
    width: '70%',
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: spacing.sm,
  },
  subtitleBar: {
    height: 16,
    width: '50%',
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: spacing.md,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  detailBox: {
    height: 14,
    width: 60,
    backgroundColor: colors.border,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  locationBar: {
    height: 14,
    width: 80,
    backgroundColor: colors.border,
    borderRadius: 4,
  },
  priceBar: {
    height: 18,
    width: 100,
    backgroundColor: colors.border,
    borderRadius: 4,
  },
});