import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import DashboardScreen from '../features/dealer/screens/DashboardScreen';
import ListingsScreen from '../features/dealer/screens/ListingsScreen';
import AddListingScreen from '../features/dealer/screens/AddListingScreen';
import ListingDetailScreen from '../features/dealer/screens/ListingDetailScreen';
import LeadsScreen from '../features/dealer/screens/LeadsScreen';
import ChatScreen from '../features/dealer/screens/ChatScreen';
import DealerProfileScreen from '../features/dealer/screens/DealerProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Listings Stack
const ListingsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen name="ListingsHome" component={ListingsScreen} options={{ title: 'Listings' }} />
    <Stack.Screen name="AddListing" component={AddListingScreen} options={{ title: 'Add Listing' }} />
    <Stack.Screen name="ListingDetail" component={ListingDetailScreen} options={{ title: 'Listing Detail' }} />
  </Stack.Navigator>
);

// Leads Stack
const LeadsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen name="LeadsHome" component={LeadsScreen} options={{ title: 'Leads' }} />
    <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
  </Stack.Navigator>
);

const DealerTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Listings" component={ListingsStack} />
    <Tab.Screen name="Leads" component={LeadsStack} />
    <Tab.Screen name="Profile" component={DealerProfileScreen} />
  </Tab.Navigator>
);

export default DealerTabs;
