import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import AuthNavigator from './AuthNavigator';
import DealerTabs from './DealerTabs';
import CustomerTabs from './CustomerTabs';
import SplashScreenComponent from '../features/auth/screens/SplashScreen';

const RootNavigator = () => {
  const { role, isVerified } = useSelector((state: RootState) => state.auth);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Show splash screen for 3 seconds
  if (showSplash) {
    return <SplashScreenComponent />;
  }

  // After splash, check authentication status
  // If user is verified and has a role, show appropriate tabs
  if (isVerified && role === 'dealer') {
    return <DealerTabs />;
  }

  if (isVerified && role === 'customer') {
    return <CustomerTabs />;
  }

  // Default: Show login/auth screen
  return <AuthNavigator />;
};

export default RootNavigator;
