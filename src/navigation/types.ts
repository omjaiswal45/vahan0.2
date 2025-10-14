import { NavigatorScreenParams } from '@react-navigation/native';

// Screens inside RCCheck
export type RCCheckStackParamList = {
  RCCheckHome: undefined;
  RCCheckReport: undefined;
  SavedRCReports: undefined;
};

// Screens inside Home Stack
export type HomeStackParamList = {
  HomeMain: undefined;                // Main Home Screen
  RCCheckStack: { screen: 'RCCheckHome' | 'RCCheckReport' | 'SavedRCReports' } | undefined;
  BuyUsedCarStack: { screen: 'CarFeedScreen' | 'CarDetailScreen' | 'SavedCarsScreen' } | undefined;
  DealsScreen: undefined;
  ServicesScreen: undefined;
  FinanceScreen: undefined;
  NewCarsScreen: undefined;
  // Add more feature stacks or screens here
};