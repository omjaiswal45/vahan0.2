// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState } from '../../../store/store';
// import { login as loginAction, setRole as setRoleAction } from '../../../store/slices/authslice';
// import * as authAPI from '../services/authAPI';

// export const useAuth = () => {
//   const dispatch = useDispatch();
//   const role = useSelector((state: RootState) => state.auth.role);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const setRole = (newRole: 'customer' | 'dealer') => {
//     dispatch(setRoleAction(newRole));
//   };

//   const emailLoginHandler = async (email: string, password: string) => {
//     try {
//       setLoading(true);
//       const { data } = await authAPI.emailLogin(email, password);
//       dispatch(loginAction({ token: data.token, role: data.role }));
//       return true;
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Something went wrong');
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendOtpHandler = async (phone: string) => {
//     try {
//       setLoading(true);
//       await authAPI.sendOtp(phone);
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOtpHandler = async (phone: string, otp: string) => {
//     try {
//       setLoading(true);
//       const { data } = await authAPI.verifyOtp(phone, otp);
//       dispatch(loginAction({ token: data.token, role: data.role }));
//       return true;
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Something went wrong');
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     loading,
//     error,
//     role,
//     setRole,
//     emailLoginHandler,
//     sendOtpHandler,
//     verifyOtpHandler,
//   };
// };
// src/features/auth/hooks/useAuth.ts
import { useState } from 'react';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<'customer' | 'dealer'>('customer');

  const emailLoginHandler = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    // Fake delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email && password) {
      setLoading(false);
      return true; // success
    } else {
      setLoading(false);
      setError('Email or password cannot be empty');
      return false; // failure
    }
  };

  const sendOtpHandler = async (phone: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    return true;
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
