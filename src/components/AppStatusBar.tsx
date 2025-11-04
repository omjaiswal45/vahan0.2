import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { colors } from '../styles/colors';

interface AppStatusBarProps {
  barStyle?: 'default' | 'light-content' | 'dark-content';
  backgroundColor?: string;
}

const AppStatusBar: React.FC<AppStatusBarProps> = ({
  barStyle = 'light-content', // Light icons for pink header
  backgroundColor = colors.primary, // Pink header background
}) => {
  return (
    <StatusBar
      barStyle={barStyle}
      backgroundColor={Platform.OS === 'android' ? backgroundColor : undefined}
      translucent={false}
    />
  );
};

export default AppStatusBar;
