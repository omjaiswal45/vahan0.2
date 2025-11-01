import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RCCheckStackParamList } from '../../../../navigation/types';
import RCCheckHomeScreen from './screens/RCCheckHomeScreen';
import RCCheckReportScreen from './screens/RCCheckReportScreen';
import SavedRCReportsScreen from './screens/SavedRCReportsScreen';
import { defaultStackScreenOptions } from '../../../../navigation/navigationOptions';

const Stack = createStackNavigator<RCCheckStackParamList>();

const RCCheckNavigator = () => (
  <Stack.Navigator screenOptions={defaultStackScreenOptions}>
    <Stack.Screen
      name="RCCheckHome"
      component={RCCheckHomeScreen}
      options={{
        title: 'RC Check',
        headerShown: false, // This is the home screen, shown via tab
      }}
    />
    <Stack.Screen
      name="RCCheckReport"
      component={RCCheckReportScreen}
      options={{
        title: 'RC Report',
      }}
    />
    <Stack.Screen
      name="SavedRCReports"
      component={SavedRCReportsScreen}
      options={{
        title: 'Saved Reports',
      }}
    />
  </Stack.Navigator>
);

export default RCCheckNavigator;
