// src/features/users/features/profile/screens/SavedCarsScreen.tsx

import React, { useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState, AppDispatch } from '../../../../../store/store';
import { toggleSaveCar } from '../../../../../store/slices/buyUsedCarSlice';
import { Car } from '../../buyUsedCar/types';
import { MOCK_CARS } from '../../buyUsedCar/services/mockCarData';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';
import { typography } from '../../../../../styles/typography';

export const SavedCarsScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const savedCarIds = useSelector((state: RootState) => state.buyUsedCar.savedCarIds);
  const [refreshing, setRefreshing] = React.useState(false);

  // Filter MOCK_CARS by savedCarIds from Redux
  const savedCars = useMemo(() =>
    MOCK_CARS.filter(car => savedCarIds.includes(car.id)),
    [savedCarIds]
  );

  const handleUnsave = useCallback((carId: string, carName: string) => {
    Alert.alert(
      'Remove from Saved',
      `Remove ${carName} from your saved cars?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const userId = auth.phone || 'guest-user';
            try {
              await dispatch(toggleSaveCar({ carId, userId })).unwrap();
            } catch (error) {
              console.error('Failed to unsave car:', error);
            }
          },
        },
      ]
    );
  }, [auth.phone, dispatch]);

  const handleCarPress = useCallback((carId: string) => {
    navigation.navigate('CarDetail' as never, { carId } as never);
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh - in real app, this would refetch from API
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderCarCard = ({ item }: { item: Car }) => {
    const car = item;
    const carName = `${car.brand} ${car.model}`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleCarPress(car.id)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: car.thumbnail || car.images[0] }}
          style={styles.carImage}
          resizeMode="cover"
        />

        <TouchableOpacity
          style={styles.unsaveButton}
          onPress={() => handleUnsave(car.id, carName)}
        >
          <Ionicons name="heart" size={24} color={colors.error} />
        </TouchableOpacity>

        {car.isVerified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color={colors.white} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}

        <View style={styles.cardContent}>
          <Text style={styles.carName} numberOfLines={1}>
            {carName}
          </Text>
          {car.variant && (
            <Text style={styles.variant} numberOfLines={1}>{car.variant}</Text>
          )}

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.detailText}>{car.year}</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.detailText}>{car.km.toLocaleString()} km</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.detailText}>{car.fuelType}</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="cog-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.detailText}>{car.transmission}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <View>
              <Text style={styles.price}>₹{car.price.toLocaleString()}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
                <Text style={styles.location}>{car.location.city}, {car.location.state}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View Details</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No Saved Cars</Text>
      <Text style={styles.emptySubtitle}>
        Start exploring and save your favorite cars to see them here
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('BuyUsedCar' as never)}
      >
        <Text style={styles.browseButtonText}>Browse Cars</Text>
      </TouchableOpacity>
    </View>
  ), [navigation]);

  return (
    <View style={styles.container}>
      {/* Cars List */}
      <FlatList
        data={savedCars}
        renderItem={renderCarCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  carImage: {
    width: '100%',
    height: 200,
    backgroundColor: colors.border,
  },
  unsaveButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
  },
  verifiedText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: typography.fontFamily.semiBold,
    marginLeft: 4,
  },
  cardContent: {
    padding: spacing.md,
  },
  carName: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  variant: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  detailText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.primary,
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  browseButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 12,
  },
  browseButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.semiBold,
    color: colors.white,
  },
});