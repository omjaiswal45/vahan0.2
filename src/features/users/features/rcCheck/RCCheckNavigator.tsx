// src/features/users/features/rcCheck/RCCheckNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RCCheckHomeScreen from './screens/RCCheckHomeScreen';
import RCCheckReportScreen from './screens/RCCheckReportScreen';
import SavedRCReportsScreen from './screens/SavedRCReportsScreen';

const Stack = createStackNavigator();

const RCCheckNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="RCCheckHome" component={RCCheckHomeScreen} />
      <Stack.Screen name="RCCheckReport" component={RCCheckReportScreen} />
      <Stack.Screen name="SavedRCReports" component={SavedRCReportsScreen} />
    </Stack.Navigator>
  );
};

export default RCCheckNavigator;