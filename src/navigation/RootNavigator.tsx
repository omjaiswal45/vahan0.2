import React from 'react';
import AuthNavigator from './AuthNavigator';
import DealerTabs from './DealerTabs';
import CustomerTabs from './CustomerTabs';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const RootNavigator = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const role = useSelector((state: RootState) => state.auth.role); // 'dealer' or 'customer'

  return (
    <>
      {!isLoggedIn && <AuthNavigator />}
      {isLoggedIn && role === 'dealer' && <DealerTabs />}
      {isLoggedIn && role === 'customer' && <CustomerTabs />}
    </>
  );
};

export default RootNavigator;
