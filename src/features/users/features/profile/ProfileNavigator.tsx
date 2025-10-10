// src/features/users/features/profile/ProfileNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from './screens/ProfileScreen';
import { EditProfileScreen } from './screens/EditProfileScreen';
import { SavedCarsScreen } from './screens/SavedCarsScreen';
import { MyListingsScreen } from './screens/MyListingsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { Colors, Typography } from '../../../../styles';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  SavedCars: undefined;
  MyListings: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
        headerStyle: { backgroundColor: Colors.card },
        headerTintColor: Colors.text,
        headerTitleStyle: { fontFamily: (Typography as any).fontFamily?.semiBold, fontSize: 16 },
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: 'Profile', headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen
        name="SavedCars"
        component={SavedCarsScreen}
        options={{ title: 'Saved Cars' }}
      />
      <Stack.Screen
        name="MyListings"
        component={MyListingsScreen}
        options={({ navigation }) => ({
          title: 'My Listings',
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('AddListing' as never)}>
              <Ionicons name="add" size={22} color={Colors.primary} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};

export { ProfileNavigator };
export default ProfileNavigator;