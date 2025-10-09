import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import profileScreen from "./screens/ProfileScreen";
import EditprofileScreen from './screens/EditProfileScreen';
import MyListingsScreen from "./screens/MyListingsScreen";
import SavedCarsScreen from "./screens/SavedCarsScreen";
import SettingsScreen from "./screens/SettingsScreen";

export type profileStackParamList = {
  profileMain: undefined;
  Editprofile: undefined;
  MyListings: undefined;
  SavedCars: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<profileStackParamList>();

const profileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="profileMain"
        component={profileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Editprofile"
        component={EditprofileScreen}
        options={{ title: "Edit profile" }}
      />
      <Stack.Screen
        name="MyListings"
        component={MyListingsScreen}
        options={{ title: "My Listings" }}
      />
      <Stack.Screen
        name="SavedCars"
        component={SavedCarsScreen}
        options={{ title: "Saved Cars" }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
    </Stack.Navigator>
  );
};

export default profileNavigator;
