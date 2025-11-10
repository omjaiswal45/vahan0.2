// ============================================
// src/navigation/CustomerTabs.tsx
// ============================================

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeStack from "../features/users/features/home/HomeStack";
import ProfileNavigator from "../features/users/features/profile/ProfileNavigator";
import { BuyUsedCarNavigator } from "../features/users/features/buyUsedCar/BuyUsedCarNavigator";
import WishlistNavigator from "../features/users/features/profile/WishlistNavigator";
import { Colors } from "../styles/colors"; // Using your Colors object

const Tab = createBottomTabNavigator();

const CustomerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 6, // extra spacing
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "BuyUsedCar") {
            iconName = focused ? "car-sport" : "car-sport-outline";
          } else if (route.name === "Wishlist") {
            iconName = focused ? "heart" : "heart-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName as any} size={22} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary, // use primary color
        tabBarInactiveTintColor: Colors.gray[500], // inactive gray
        tabBarStyle: {
          backgroundColor: Colors.white, // background from palette
          borderTopWidth: 0.5,
          borderTopColor: Colors.border, // border from palette
          height: 70, // height for spacing
          paddingBottom: 10, // extra spacing
          paddingTop: 6,
          elevation: 8,
          shadowColor: Colors.black,
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: -1 },
          shadowRadius: 3,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="BuyUsedCar" component={BuyUsedCarNavigator} />
      <Tab.Screen name="Wishlist" component={WishlistNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

export default CustomerTabs;
