import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RCCheckStackParamList } from '../../../../navigation/types';
import RCCheckHomeScreen from './screens/RCCheckHomeScreen';
import RCCheckReportScreen from './screens/RCCheckReportScreen';
import SavedRCReportsScreen from './screens/SavedRCReportsScreen';

const Stack = createStackNavigator<RCCheckStackParamList>();

const RCCheckNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="RCCheckHome" component={RCCheckHomeScreen} />
    <Stack.Screen name="RCCheckReport" component={RCCheckReportScreen} />
    <Stack.Screen name="SavedRCReports" component={SavedRCReportsScreen} />
  </Stack.Navigator>
);

export default RCCheckNavigator;
