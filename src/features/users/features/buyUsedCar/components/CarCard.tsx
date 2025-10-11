// src/features/users/features/buyUsedCar/components/CarCard.tsx

import React, { memo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Car } from '../types';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';
import { typography } from '../../../../../styles/typography';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.lg* 2;

interface CarCardProps {
  car: Car;
  onPress: () => void;
  onSavePress: () => void;
}

export const CarCard = memo<CarCardProps>(({ car, onPress, onSavePress }) => {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const formatKm = (km: number) => {
    if (km >= 100000) {
      return `${(km / 100000).toFixed(1)} L km`;
    }
    return `${(km / 1000).toFixed(0)}k km`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: car.thumbnail }} style={styles.image} resizeMode="cover" />
        <TouchableOpacity style={styles.saveButton} onPress={onSavePress}>
          <Ionicons 
            name={car.isSaved ? 'heart' : 'heart-outline'} 
            size={24} 
            color={car.isSaved ? colors.error : colors.white} 
          />
        </TouchableOpacity>
        {car.isVerified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color={colors.white} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {car.brand} {car.model}
          </Text>
          <Text style={styles.year}>{car.year}</Text>
        </View>

        {car.variant && (
          <Text style={styles.variant} numberOfLines={1}>{car.variant}</Text>
        )}

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="speedometer-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{formatKm(car.km)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="water-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{car.fuelType}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="cog-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{car.transmission}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{car.ownerNumber} Owner</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.location}>{car.location.city}, {car.location.state}</Text>
          </View>
          <Text style={styles.price}>{formatPrice(car.price)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  saveButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: spacing.xs,
  },
  verifiedBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.success,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  year: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  variant: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: spacing.sm,
  },
  detailText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  price: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.primary,
  },
});

CarCard.displayName = 'CarCard';