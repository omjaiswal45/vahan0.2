// ============================================
// src/navigation/CustomerTabs.tsx
// ============================================

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../features/users/features/home/screens/HomeScreen";
import ProfileNavigator from "../features/users/features/profile/ProfileNavigator";
import { BuyUsedCarNavigator } from "../features/users/features/buyUsedCar/BuyUsedCarNavigator";
import { Colors } from "../styles/colors";

const Tab = createBottomTabNavigator();

const CustomerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "BuyUsedCar") {
            iconName = focused ? "car-sport" : "car-sport-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="BuyUsedCar" component={BuyUsedCarNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default CustomerTabs;
