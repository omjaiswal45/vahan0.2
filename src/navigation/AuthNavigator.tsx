import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/screens/LoginScreen';

import OTPScreen from '../features/auth/screens/OTPScreen';

export type AuthStackParamList = {
  Login: undefined;

  OTP: { phone: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    
    <Stack.Screen name="OTP" component={OTPScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
