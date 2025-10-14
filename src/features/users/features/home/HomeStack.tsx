// src/features/users/features/home/HomeStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import RCCheckNavigator from '../rcCheck/RCCheckNavigator';

const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="RCCheckStack" component={RCCheckNavigator} />
  </Stack.Navigator>
);

export default HomeStack;
