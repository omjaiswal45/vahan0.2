// src/features/users/features/buyUsedCar/screens/SavedCarsScreen.tsx

import React, { useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../store/store';
import { toggleSaveCar } from '../../../../../store/slices/buyUsedCarSlice';
import { CarCard } from '../components/CarCard';
import { EmptyState } from '../components/EmptyState';
import { Car } from '../types';
import { MOCK_CARS } from '../services/mockCarData';
import { colors } from '../../../../../styles/colors';
import { spacing } from '../../../../../styles/spacing';

export const SavedCarsScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const savedCarIds = useSelector((state: RootState) => state.buyUsedCar.savedCarIds);

  // Filter MOCK_CARS by savedCarIds from Redux
  const savedCars = useMemo(() =>
    MOCK_CARS.filter(car => savedCarIds.includes(car.id)),
    [savedCarIds]
  );

  const handleCarPress = useCallback((car: Car) => {
    navigation.navigate('CarDetail' as never, { carId: car.id } as never);
  }, [navigation]);

  const handleSavePress = useCallback(async (carId: string) => {
    const userId = auth.phone || 'guest-user';
    try {
      await dispatch(toggleSaveCar({ carId, userId })).unwrap();
    } catch (error) {
      console.error('Failed to unsave car:', error);
    }
  }, [auth.phone, dispatch]);

  const renderCarItem = useCallback(({ item }: { item: Car }) => (
    <CarCard
      car={{ ...item, isSaved: true }}
      onPress={() => handleCarPress(item)}
      onSavePress={() => handleSavePress(item.id)}
    />
  ), [handleCarPress, handleSavePress]);

  const renderEmpty = useCallback(() => {
    return (
      <EmptyState
        icon="heart-outline"
        title="No Saved Cars"
        description="Start exploring and save your favorite cars to see them here"
        actionText="Browse Cars"
        onActionPress={() => navigation.navigate('CarFeed' as never)}
      />
    );
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={savedCars}
        renderItem={renderCarItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
});