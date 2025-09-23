import React from 'react';
import { useSelector } from 'react-redux';
import AuthNavigator from './AuthNavigator';
import CustomerTabs from './CustomerTabs';
import DealerTabs from './DealerTabs';
import { RootState } from '../store/store';

const RootNavigator = () => {
  const { isLoggedIn, role } = useSelector((state: RootState) => state.auth);

  if (!isLoggedIn) return <AuthNavigator />;

  return role === 'customer' ? <CustomerTabs /> : <DealerTabs />;
};

export default RootNavigator;
