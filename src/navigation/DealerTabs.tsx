import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ProfileScreen from '../features/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const DealerTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    
    <Tab.Screen name="Profile" component={ProfileScreen} />
    {/* Add more dealer-specific tabs, like AddCar, ViewRequests, etc. */}
  </Tab.Navigator>
);

export default DealerTabs;
