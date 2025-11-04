import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddListingScreen from '../screens/AddListingScreen';
import ListingDetailScreen from '../screens/ListingDetailScreen';
import EnhancedImagePickerScreen from '../screens/EnhancedImagePickerScreen';
import ReviewSubmitScreen from '../screens/ReviewSubmitScreen';
import CustomHeader from '../../../components/CustomHeader';

const Stack = createNativeStackNavigator();

const AddListingNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen
      name="AddListing"
      component={AddListingScreen}
      options={{
        header: () => <CustomHeader title="Add Listing" showBackButton={true} />,
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="ImagePickerScreen"
      component={EnhancedImagePickerScreen}
      options={{
        header: () => <CustomHeader title="Upload Photos" showBackButton={true} />,
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="ReviewSubmit"
      component={ReviewSubmitScreen}
      options={{
        header: () => <CustomHeader title="Review & Submit" showBackButton={true} />,
        headerShown: true,
      }}
    />
    <Stack.Screen
      name="ListingDetail"
      component={ListingDetailScreen}
      options={{
        header: () => <CustomHeader title="Listing Detail" showBackButton={true} />,
        headerShown: true,
      }}
    />
  </Stack.Navigator>
);

export default AddListingNavigator;
