import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddListingScreen from '../screens/AddListingScreen';
import ListingDetailScreen from '../screens/ListingDetailScreen';
import ImagePickerScreen from '../screens/ImagePickerScreen';

const Stack = createNativeStackNavigator();

const AddListingNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen
      name="AddListing"
      component={AddListingScreen}
      options={{ title: 'Add Listing' }}
    />
    <Stack.Screen
      name="ListingDetail"
      component={ListingDetailScreen}
      options={{ title: 'Listing Detail' }}
    />
    <Stack.Screen
      name="ImagePickerScreen"
      component={ImagePickerScreen}
      options={{ title: 'Upload Images' }}
    />
  </Stack.Navigator>
);

export default AddListingNavigator;
