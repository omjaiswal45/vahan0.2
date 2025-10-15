// src/features/users/features/challanCheck/ChallanCheckNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ChallanCheckHomeScreen } from './screens/ChallanCheckHomeScreen';
import { ChallanCheckReportScreen } from './screens/ChallanCheckReportScreen';
import { SavedChallanReportsScreen } from './screens/SavedChallanReportsScreen';
import { colors } from '../../../../styles';

export type ChallanCheckStackParamList = {
  ChallanCheckHome: undefined;
  ChallanCheckReport: { registrationNumber: string };
  SavedChallanReports: undefined;
};

const Stack = createStackNavigator<ChallanCheckStackParamList>();

export const ChallanCheckNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen
        name="ChallanCheckHome"
        component={ChallanCheckHomeScreen}
        options={{
          title: 'Challan Check',
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