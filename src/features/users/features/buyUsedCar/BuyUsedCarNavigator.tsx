// src/features/users/features/buyUsedCar/BuyUsedCarNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CarFeedScreen } from './screens/CarFeedScreen';
import { CarDetailScreen } from './screens/CarDetailScreen';
import { SavedCarsScreen } from './screens/SavedCarsScreen';
import { defaultNativeStackScreenOptions } from '../../../../navigation/navigationOptions';

export type BuyUsedCarStackParamList = {
  CarFeed: undefined;
  CarDetail: { carId: string };
  SavedCars: undefined;
};

const Stack = createNativeStackNavigator<BuyUsedCarStackParamList>();

export const BuyUsedCarNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={defaultNativeStackScreenOptions}>
      <Stack.Screen
        name="CarFeed"
        component={CarFeedScreen}
        options={{
          title: 'Buy Used Cars',
          headerLargeTitle: false,
        }}
      />
      <Stack.Screen
        name="CarDetail"
        component={CarDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SavedCars"
        component={SavedCarsScreen}
        options={{
          title: 'Saved Cars',
        }}
      />
    </Stack.Navigator>
  );
};