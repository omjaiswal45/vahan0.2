// src/features/users/features/buyUsedCar/screens/CarFeedScreen.tsx

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { CarCard } from '../components/CarCard';
import { SearchBar } from '../components/SearchBar';
import { FilterModal } from '../components/FilterModal';
import { ActiveFilterChips } from '../components/ActiveFilterChips';
import { SortDropdown } from '../components/SortDropdown';
import { useBuyUsedCar } from '../hooks/useBuyUsedCar';
import { useFilterOptions } from '../hooks/useBuyUsedCar';
import { Car, CarFilters } from '../types';
import { toggleSaveCar } from '../../../../../store/slices/buyUsedCarSlice';
import { RootState, AppDispatch } from '../../../../../store/store';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing'
import { typography } from '../../../../../styles/typography';
import { useLocalNotifications, NotificationMessages } from '../../../../notifications';

export const CarFeedScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const savedCarIds = useSelector((state: RootState) => state.buyUsedCar.savedCarIds);
  const { presentNotificationNow } = useLocalNotifications();

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
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<CarFilters>({});
  const [currentSort, setCurrentSort] = useState<string>('recent');

  // Hide/Show bottom tabs when modals are open
  useEffect(() => {
    const isModalOpen = filterModalVisible || sortModalVisible;

    navigation.setOptions({
      tabBarStyle: isModalOpen ? { display: 'none' } : undefined,
    });

    return () => {
      navigation.setOptions({
        tabBarStyle: undefined,
      });
    };
  }, [filterModalVisible, sortModalVisible, navigation]);

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

  const handleSavePress = useCallback(async (carId: string) => {
    const userId = auth.phone || 'guest-user';
    try {
      const result = await dispatch(toggleSaveCar({ carId, userId })).unwrap();

      // Send notification only when adding to wishlist (not removing)
      if (result.isSaved) {
        const car = cars.find(c => c.id === carId);
        if (car) {
          const notification = NotificationMessages.ADDED_TO_WISHLIST;
          await presentNotificationNow(
            notification.title(car.brand, car.model),
            notification.body(),
            {
              type: 'wishlist',
              screen: 'SavedCars',
              carId: car.id
            }
          );
        }
      }
    } catch (error) {
      console.error('Failed to save car:', error);
    }
  }, [dispatch, auth.phone, cars, presentNotificationNow]);

  const handleSearch = useCallback((query: string) => {
    searchCars(query);
  }, [searchCars]);

  const handleApplyFilters = useCallback((filters: CarFilters) => {
    setCurrentFilters(filters);
    const filtersWithSort = { ...filters, sortBy: currentSort as any };
    applyFilters(filtersWithSort);
  }, [applyFilters, currentSort]);

  const handleSortChange = useCallback((sortBy: string) => {
    setCurrentSort(sortBy);
    const filtersWithSort = { ...currentFilters, sortBy: sortBy as any };
    applyFilters(filtersWithSort);
    setSortModalVisible(false);
  }, [currentFilters, applyFilters]);

  const handleRemoveFilter = useCallback((filterKey: keyof CarFilters, value?: any) => {
    setCurrentFilters(prev => {
      const newFilters = { ...prev };

      if (value !== undefined) {
        // Remove specific value from array filter
        const currentArray = (newFilters[filterKey] as any[]) || [];
        newFilters[filterKey] = currentArray.filter(v => v !== value) as any;

        // Remove the key entirely if array is empty
        if ((newFilters[filterKey] as any[]).length === 0) {
          delete newFilters[filterKey];
        }
      } else {
        // Remove entire filter key
        if (filterKey === 'priceMin' || filterKey === 'priceMax') {
          delete newFilters.priceMin;
          delete newFilters.priceMax;
        } else if (filterKey === 'yearMin' || filterKey === 'yearMax') {
          delete newFilters.yearMin;
          delete newFilters.yearMax;
        } else {
          delete newFilters[filterKey];
        }
      }

      applyFilters({ ...newFilters, sortBy: currentSort as any });
      return newFilters;
    });
  }, [applyFilters, currentSort]);

  const handleClearAllFilters = useCallback(() => {
    setCurrentFilters({});
    applyFilters({ sortBy: currentSort as any });
  }, [applyFilters, currentSort]);

  const renderCarItem = useCallback(({ item }: { item: Car }) => (
    <CarCard
      car={{ ...item, isSaved: savedCarIds.includes(item.id) }}
      onPress={() => handleCarPress(item)}
      onSavePress={() => handleSavePress(item.id)}
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
        onSortPress={() => setSortModalVisible(true)}
        activeFiltersCount={getActiveFiltersCount()}
        enableRealTimeSearch={true}
        debounceMs={500}
      />

      {getActiveFiltersCount() > 0 && (
        <ActiveFilterChips
          filters={currentFilters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />
      )}

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

      <SortDropdown
        visible={sortModalVisible}
        selectedSort={currentSort}
        onSortChange={handleSortChange}
        onClose={() => setSortModalVisible(false)}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
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