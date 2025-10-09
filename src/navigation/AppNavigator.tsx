import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../features/home/screens/HomeScreen';
import profileScreen from '../features/profile/screens/profileScreen';

const Tab = createBottomTabNavigator();

export type RootStackParamList = {
  Login: undefined;

  OTP: { phone: string };
  CustomerTabs: undefined;
  DealerTabs: undefined;
};

const AppNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="profile" component={profileScreen} />
  </Tab.Navigator>
);

export default AppNavigator;
