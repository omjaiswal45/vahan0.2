// src/features/auth/hooks/useAuth.ts
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../../store/slices/authslice';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<'customer' | 'dealer'>('customer');

  const dispatch = useDispatch();

  const emailLoginHandler = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      // simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!email || !password) throw new Error('Enter email & password');
      // Dummy login: set token & role in Redux
      dispatch(login({ role, token: 'dummy-token' }));
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  const sendOtpHandler = async (phone: string) => {
    setLoading(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // simulate OTP sent
      console.log('OTP sent to', phone);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return {
    emailLoginHandler,
    sendOtpHandler,
    loading,
    error,
    role,
    setRole,
  };
};
