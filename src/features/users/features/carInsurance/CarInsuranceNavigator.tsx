// src/features/users/features/carInsurance/CarInsuranceNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CarInsuranceHomeScreen } from './screens/CarInsuranceHomeScreen';
import { InsuranceReportScreen } from './screens/InsuranceReportScreen';
import { defaultStackScreenOptions } from '../../../../navigation/navigationOptions';

export type CarInsuranceStackParamList = {
  CarInsuranceHome: undefined;
  InsuranceReport: { registrationNumber: string };
  SavedInsuranceReports: undefined;
};

const Stack = createStackNavigator<CarInsuranceStackParamList>();

export const CarInsuranceNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={defaultStackScreenOptions}>
      <Stack.Screen
        name="CarInsuranceHome"
        component={CarInsuranceHomeScreen}
        options={{
          title: 'Car Insurance',
          headerBackTitle: '',
        }}
      />
      <Stack.Screen
        name="InsuranceReport"
        component={InsuranceReportScreen}
        options={{
          title: 'Insurance Report',
          headerBackTitle: '',
        }}
      />
    </Stack.Navigator>
  );
};
