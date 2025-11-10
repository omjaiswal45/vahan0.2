// src/features/users/features/profile/WishlistNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SavedCarsScreen } from './screens/SavedCarsScreen';
import { defaultNativeStackScreenOptions } from '../../../../navigation/navigationOptions';

export type WishlistStackParamList = {
  SavedCars: undefined;
};

const Stack = createNativeStackNavigator<WishlistStackParamList>();

const WishlistNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={defaultNativeStackScreenOptions}>
      <Stack.Screen
        name="SavedCars"
        component={SavedCarsScreen}
        options={{ title: 'Wishlist' }}
      />
    </Stack.Navigator>
  );
};

export default WishlistNavigator;
