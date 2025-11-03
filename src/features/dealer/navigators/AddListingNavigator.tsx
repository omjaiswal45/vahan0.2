import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddListingScreen from '../screens/AddListingScreen';
import ListingDetailScreen from '../screens/ListingDetailScreen';
import EnhancedImagePickerScreen from '../screens/EnhancedImagePickerScreen';
import ReviewSubmitScreen from '../screens/ReviewSubmitScreen';
import { defaultNativeStackScreenOptions } from '../../../navigation/navigationOptions';

const Stack = createNativeStackNavigator();

const AddListingNavigator = () => (
  <Stack.Navigator screenOptions={defaultNativeStackScreenOptions}>
    <Stack.Screen
      name="AddListing"
      component={AddListingScreen}
      options={{ headerShown: true, title: 'Add Listing' }}
    />
    <Stack.Screen
      name="ImagePickerScreen"
      component={EnhancedImagePickerScreen}
      options={{ headerShown: true, title: 'Upload Photos' }}
    />
    <Stack.Screen
      name="ReviewSubmit"
      component={ReviewSubmitScreen}
      options={{ headerShown: true, title: 'Review & Submit' }}
    />
    <Stack.Screen
      name="ListingDetail"
      component={ListingDetailScreen}
      options={{ headerShown: true, title: 'Listing Detail' }}
    />
  </Stack.Navigator>
);

export default AddListingNavigator;
