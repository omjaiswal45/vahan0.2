import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import AuthNavigator from './AuthNavigator';
import DealerTabs from './DealerTabs';
import CustomerTabs from './CustomerTabs';
import SplashScreenComponent from '../features/auth/screens/SplashScreen';
import RCCheckNavigator from '../features/users/features/rcCheck/RCCheckNavigator';

const RootNavigator = () => {
  const { role, isVerified } = useSelector((state: RootState) => state.auth);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <SplashScreenComponent />;

  if (isVerified && role === 'dealer') return <DealerTabs />;
  if (isVerified && role === 'customer') return <CustomerTabs />;1
  return <AuthNavigator />;
};

export default RootNavigator;
