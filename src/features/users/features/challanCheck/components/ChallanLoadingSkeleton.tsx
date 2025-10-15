// src/features/users/features/challanCheck/components/ChallanLoadingSkeleton.tsx

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../../../../styles';

export const ChallanLoadingSkeleton: React.FC = () => {
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
    <View style={styles.container}>
      <Animated.View style={[styles.vehicleCard, { opacity }]}>
        <View style={styles.licensePlate} />
        <View style={styles.infoRow} />
        <View style={styles.infoRow} />
      </Animated.View>

      <Animated.View style={[styles.statsCard, { opacity }]}>
        <View style={styles.statsRow}>
          <View style={styles.statBox} />
          <View style={styles.statBox} />
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox} />
          <View style={styles.statBox} />
        </View>
      </Animated.View>

      <Animated.View style={[styles.challanCard, { opacity }]}>
        <View style={styles.cardHeader} />
        <View style={styles.cardContent} />
        <View style={styles.cardContent} />
        <View style={styles.cardFooter} />
      </Animated.View>

      <Animated.View style={[styles.challanCard, { opacity }]}>
        <View style={styles.cardHeader} />
        <View style={styles.cardContent} />
        <View style={styles.cardContent} />
        <View style={styles.cardFooter} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  vehicleCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  licensePlate: {
    height: 40,
    width: 180,
    backgroundColor: colors.border,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 16,
  },
  infoRow: {
    height: 16,
    backgroundColor: colors.border,
    borderRadius: 8,
    marginBottom: 12,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statBox: {
    width: '48%',
    height: 80,
    backgroundColor: colors.border,
    borderRadius: 12,
  },
  challanCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    height: 20,
    backgroundColor: colors.border,
    borderRadius: 8,
    marginBottom: 12,
    width: '60%',
  },
  cardContent: {
    height: 14,
    backgroundColor: colors.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardFooter: {
    height: 48,
    backgroundColor: colors.border,
    borderRadius: 12,
    marginTop: 12,
  },
});