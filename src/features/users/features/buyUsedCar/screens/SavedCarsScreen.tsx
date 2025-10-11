// src/features/users/features/buyUsedCar/screens/SavedCarsScreen.tsx

import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CarCard } from '../components/CarCard';
import { EmptyState } from '../components/EmptyState';
import { useSavedCars } from '../hooks/useBuyUsedCar';
import { Car } from '../types';
import { buyUsedCarAPI } from '../services/buyUsedCarAPI';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';

export const SavedCarsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { savedCars, loading, refreshing, refresh } = useSavedCars('current-user-id');

  const handleCarPress = useCallback((car: Car) => {
    navigation.navigate('CarDetail' as never, { carId: car.id } as never);
  }, [navigation]);

  const handleSavePress = useCallback(async (carId: string) => {
    try {
      await buyUsedCarAPI.toggleSaveCar({
        carId,
        userId: 'current-user-id',
      });
      refresh();
    } catch (error) {
      console.error('Failed to unsave car:', error);
    }
  }, [refresh]);

  const renderCarItem = useCallback(({ item }: { item: Car }) => (
    <CarCard
      car={{ ...item, isSaved: true }}
      onPress={() => handleCarPress(item)}
      onSavePress={() => handleSavePress(item.id)}
    />
  ), [handleCarPress, handleSavePress]);

  const renderEmpty = useCallback(() => {
    if (loading) return null;
    return (
      <EmptyState
        icon="heart-outline"
        title="No Saved Cars"
        description="Start exploring and save your favorite cars to see them here"
        actionText="Browse Cars"
        onActionPress={() => navigation.navigate('CarFeed' as never)}
      />
    );
  }, [loading, navigation]);

  if (loading && savedCars.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={savedCars}
        renderItem={renderCarItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            colors={[colors.primary]}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
});