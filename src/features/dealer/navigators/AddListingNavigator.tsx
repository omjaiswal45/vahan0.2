import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddListingScreen from '../screens/AddListingScreen';
import ListingDetailScreen from '../screens/ListingDetailScreen';
import ImagePickerScreen from '../screens/ImagePickerScreen';
import { defaultNativeStackScreenOptions } from '../../../navigation/navigationOptions';

const Stack = createNativeStackNavigator();

const AddListingNavigator = () => (
  <Stack.Navigator screenOptions={{ ...defaultNativeStackScreenOptions, headerShown: false }}>
    <Stack.Screen
      name="AddListing"
      component={AddListingScreen}
    />
    <Stack.Screen
      name="ListingDetail"
      component={ListingDetailScreen}
      options={{ headerShown: true, title: 'Listing Detail' }}
    />
    <Stack.Screen
      name="ImagePickerScreen"
      component={ImagePickerScreen}
      options={{ headerShown: true, title: 'Upload Images' }}
    />
  </Stack.Navigator>
);

export default AddListingNavigator;
