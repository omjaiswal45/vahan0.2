// src/features/users/features/profile/screens/SavedCarsScreen.tsx

import React, { useEffect } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useProfile } from '../hooks/useProfile';
import { CarListing } from '../types';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';
import { typography } from '../../../../../styles/typography';

export const SavedCarsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { savedCars, fetchSavedCars, toggleSaveCar, refreshing, refreshData } = useProfile();

  useEffect(() => {
    loadSavedCars();
  }, []);

  const loadSavedCars = async () => {
    try {
      fetchSavedCars();
    } catch (error) {
      console.error('Failed to load saved cars:', error);
    }
  };

  const handleUnsave = (carId: string, carName: string) => {
    Alert.alert(
      'Remove from Saved',
      `Remove ${carName} from your saved cars?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => toggleSaveCar(carId),
        },
      ]
    );
  };

  const handleCarPress = (carId: string) => {
    navigation.navigate('ListingDetail' as never, { id: carId } as never);
  };

  const renderCarCard = ({ item }: { item: CarListing }) => {
    const car = item;
    const carName = `${car.brand} ${car.model}`;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleCarPress(car.id)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: car.images[0] }}
          style={styles.carImage}
          resizeMode="cover"
        />

        <TouchableOpacity
          style={styles.unsaveButton}
          onPress={() => handleUnsave(car.id, carName)}
        >
          <Ionicons name="heart" size={24} color={colors.error} />
        </TouchableOpacity>

        <View style={styles.cardContent}>
          <Text style={styles.carName} numberOfLines={1}>
            {carName}
          </Text>

          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.detailText}>{car.year}</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="speedometer-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.detailText}>{car.kmDriven.toLocaleString()} km</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.detailText}>{car.fuelType}</Text>
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

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color={colors.textSecondary} />
      <Text style={styles.emptyTitle}>No Saved Cars</Text>
      <Text style={styles.emptySubtitle}>
        Cars you save will appear here for easy access
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => navigation.navigate('Home' as never)}
      >
        <Text style={styles.browseButtonText}>Browse Cars</Text>
      </TouchableOpacity>
    </View>
  );

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
            onRefresh={refreshData}
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
  cardContent: {
    padding: spacing.md,
  },
  carName: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.text,
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