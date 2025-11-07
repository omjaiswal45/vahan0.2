// src/features/users/features/home/HomeStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import RCCheckNavigator from '../rcCheck/RCCheckNavigator';
import { ChallanCheckNavigator } from '../challanCheck/ChallanCheckNavigator';
import { CarInsuranceNavigator } from '../carInsurance/CarInsuranceNavigator';
import AddListingNavigator from '../../../dealer/navigators/AddListingNavigator';
import { defaultStackScreenOptions } from '../../../../navigation/navigationOptions';



const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="SellCarStack" component={AddListingNavigator} />
    <Stack.Screen
      name="RCCheckStack"
      component={RCCheckNavigator}
    />
    <Stack.Screen name="ChallanCheckStack" component={ChallanCheckNavigator} />
    <Stack.Screen name="CarInsuranceStack" component={CarInsuranceNavigator} />
  </Stack.Navigator>
);

export default HomeStack;

