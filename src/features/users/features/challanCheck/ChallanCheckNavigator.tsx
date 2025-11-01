// src/features/users/features/challanCheck/ChallanCheckNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChallanCheckHomeScreen } from './screens/ChallanCheckHomeScreen';
import { ChallanCheckReportScreen } from './screens/ChallanCheckReportScreen';
import { SavedChallanReportsScreen } from './screens/SavedChallanReportsScreen';
import { defaultStackScreenOptions } from '../../../../navigation/navigationOptions';

export type ChallanCheckStackParamList = {
  ChallanCheckHome: undefined;
  ChallanCheckReport: { registrationNumber: string };
  SavedChallanReports: undefined;
};

const Stack = createStackNavigator<ChallanCheckStackParamList>();

export const ChallanCheckNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={defaultStackScreenOptions}>
      <Stack.Screen
        name="ChallanCheckHome"
        component={ChallanCheckHomeScreen}
        options={{
          title: 'Challan Check',
          headerBackTitle: '', // Hide back button text, show only arrow
        }}
      />
      <Stack.Screen
        name="ChallanCheckReport"
        component={ChallanCheckReportScreen}
        options={{
          title: 'Challan Report',
        }}
      />
      <Stack.Screen
        name="SavedChallanReports"
        component={SavedChallanReportsScreen}
        options={{
          title: 'Saved Reports',
        }}
      />
    </Stack.Navigator>
  );
};