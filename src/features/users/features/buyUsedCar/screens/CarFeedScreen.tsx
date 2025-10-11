// src/features/users/features/buyUsedCar/screens/CarFeedScreen.tsx

import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CarCard } from '../components/CarCard';
import { SearchBar } from '../components/SearchBar';
import { FilterModal } from '../components/FilterModal';
import { useBuyUsedCar } from '../hooks/useBuyUsedCar';
import { useFilterOptions } from '../hooks/useBuyUsedCar';
import { Car, CarFilters } from '../types';
import { buyUsedCarAPI } from '../services/buyUsedCarAPI';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing'
import { typography } from '../../../../../styles/typography';

export const CarFeedScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    cars,
    loading,
    refreshing,
    hasMore,
    totalItems,
    loadMore,
    refresh,
    applyFilters,
    searchCars,
  } = useBuyUsedCar();

  const { filterOptions } = useFilterOptions();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<CarFilters>({});
  const [savedCarIds, setSavedCarIds] = useState<Set<string>>(new Set());

  const getActiveFiltersCount = useCallback((): number => {
    let count = 0;
    if (currentFilters.brands?.length) count++;
    if (currentFilters.fuelTypes?.length) count++;
    if (currentFilters.transmissions?.length) count++;
    if (currentFilters.priceMin || currentFilters.priceMax) count++;
    if (currentFilters.yearMin || currentFilters.yearMax) count++;
    if (currentFilters.kmMax) count++;
    if (currentFilters.ownerNumbers?.length) count++;
    return count;
  }, [currentFilters]);

  const handleCarPress = useCallback((car: Car) => {
    navigation.navigate('CarDetail' as never, { carId: car.id } as never);
  }, [navigation]);

  const handleSavePress = useCallback(async (carId: string, userId: string) => {
    try {
      const result = await buyUsedCarAPI.toggleSaveCar({ carId, userId });
      setSavedCarIds(prev => {
        const newSet = new Set(prev);
        if (result.isSaved) {
          newSet.add(carId);
        } else {
          newSet.delete(carId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Failed to save car:', error);
    }
  }, []);

  const handleSearch = useCallback((query: string) => {
    searchCars(query);
  }, [searchCars]);

  const handleApplyFilters = useCallback((filters: CarFilters) => {
    setCurrentFilters(filters);
    applyFilters(filters);
  }, [applyFilters]);

  const renderCarItem = useCallback(({ item }: { item: Car }) => (
    <CarCard
      car={{ ...item, isSaved: savedCarIds.has(item.id) }}
      onPress={() => handleCarPress(item)}
      onSavePress={() => handleSavePress(item.id, 'current-user-id')}
    />
  ), [handleCarPress, handleSavePress, savedCarIds]);

  const renderFooter = useCallback(() => {
    if (!loading || refreshing) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [loading, refreshing]);

  const renderEmpty = useCallback(() => {
    if (loading && !refreshing) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No cars found</Text>
        <Text style={styles.emptySubtext}>Try adjusting your filters or search query</Text>
      </View>
    );
  }, [loading, refreshing]);

  const renderHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      <Text style={styles.resultCount}>
        {totalItems} {totalItems === 1 ? 'car' : 'cars'} available
      </Text>
    </View>
  ), [totalItems]);

  return (
    <View style={styles.container}>
      <SearchBar
        onSearch={handleSearch}
        onFilterPress={() => setFilterModalVisible(true)}
        activeFiltersCount={getActiveFiltersCount()}
      />

      <FlatList
        data={cars}
        renderItem={renderCarItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
        removeClippedSubviews
      />

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        filterOptions={filterOptions}
        currentFilters={currentFilters}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  headerContainer: {
    paddingVertical: spacing.md,
  },
  resultCount: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.text,
  },
  footer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});