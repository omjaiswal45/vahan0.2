import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import DashboardScreen from '../features/dealer/screens/DashboardScreen';
import ListingsScreen from '../features/dealer/screens/ListingsScreen';
import AddListingScreen from '../features/dealer/screens/AddListingScreen';
import ListingDetailScreen from '../features/dealer/screens/ListingDetailScreen';
import LeadsScreen from '../features/dealer/screens/LeadsScreen';
import ChatScreen from '../features/dealer/screens/ChatScreen';
import DealerprofileScreen from '../features/dealer/screens/DealerProfileScreen';
import AddListingNavigator from '../features/dealer/navigators/AddListingNavigator';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Listings Stack
const ListingsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen
      name="ListingsHome"
      component={ListingsScreen}
      options={{ title: 'Listings' }}
    />
    <Stack.Screen
      name="AddListingStack"
      component={AddListingNavigator}
      options={{ headerShown: false }}
    />
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
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color }) => {
        let iconName: string = 'home';

        if (route.name === 'Dashboard') {
          iconName = focused ? 'speedometer' : 'speedometer-outline';
        } else if (route.name === 'Listings') {
          iconName = focused ? 'car' : 'car-outline';
        } else if (route.name === 'Leads') {
          iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
        } else if (route.name === 'profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return (
          <Ionicons
            name={iconName}
            size={focused ? 30 : 24}
            color={focused ? '#ff1ea5ff' : '#7f8c8d'}
            style={{ transform: [{ scale: focused ? 1.2 : 1 }] }} // interactive scaling
          />
        );
      },
      tabBarActiveTintColor: '#0b0b0bff',
      tabBarInactiveTintColor: '#7f8c8d',
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 2,
      },
      tabBarStyle: {
        backgroundColor: '#ffffff',
        height: 65,
        borderTopWidth: 0,
        elevation: 8, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -2 },
        shadowRadius: 6,
        position: 'absolute', // floating effect
        bottom: 0,
        left: 0,
        right: 0,
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Listings" component={ListingsStack} />
    <Tab.Screen name="Leads" component={LeadsStack} />
    <Tab.Screen name="profile" component={DealerprofileScreen} />
  </Tab.Navigator>
);

export default DealerTabs;
