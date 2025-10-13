// src/features/users/features/rcCheck/components/RCCheckLoadingSkeleton.tsx

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../../../../styles/colors';

const RCCheckLoadingSkeleton: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [fadeAnim]);

  const SkeletonBox = ({ width, height, style }: any) => (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, opacity: fadeAnim },
        style,
      ]}
    />
  );

  return (
    <View style={styles.container}>
      {/* Trust Score Skeleton */}
      <View style={styles.section}>
        <SkeletonBox width="100%" height={150} style={styles.trustScore} />
      </View>

      {/* Stats Skeleton */}
      <View style={styles.statsRow}>
        <SkeletonBox width="30%" height={80} style={styles.statCard} />
        <SkeletonBox width="30%" height={80} style={styles.statCard} />
        <SkeletonBox width="30%" height={80} style={styles.statCard} />
      </View>

      {/* Info Card Skeleton */}
      <View style={styles.section}>
        <SkeletonBox width="100%" height={250} style={styles.card} />
      </View>

      {/* Price Card Skeleton */}
      <View style={styles.section}>
        <SkeletonBox width="100%" height={200} style={styles.card} />
      </View>

      {/* Inspection Card Skeleton */}
      <View style={styles.section}>
        <SkeletonBox width="100%" height={300} style={styles.card} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  skeleton: {
    backgroundColor: colors.gray[200],
    borderRadius: 12,
  },
  trustScore: {
    borderRadius: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    borderRadius: 12,
  },
  card: {
    borderRadius: 16,
  },
});

export default RCCheckLoadingSkeleton;