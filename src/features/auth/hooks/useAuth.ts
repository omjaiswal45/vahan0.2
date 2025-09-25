import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import {
  setRole,
  sendOtpStart,
  sendOtpSuccess,
  sendOtpFailure,
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
} from '../../../store/slices/authslice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { role, phone, loading, error, isVerified } = useSelector((state: RootState) => state.auth);

  const selectRole = (selectedRole: 'customer' | 'dealer') => {
    dispatch(setRole(selectedRole));
  };

  const sendOtpHandler = async (phoneNumber: string) => {
    try {
      dispatch(sendOtpStart());
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate API
      console.log('OTP sent to', phoneNumber);
      dispatch(sendOtpSuccess(phoneNumber));
    } catch (err: any) {
      dispatch(sendOtpFailure(err.message));
    }
  };

  const verifyOtpHandler = async (phoneNumber: string, otp: string) => {
    try {
      dispatch(verifyOtpStart());
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate API
      console.log('OTP verified for', phoneNumber);
      dispatch(verifyOtpSuccess());
      return true;
    } catch (err: any) {
      dispatch(verifyOtpFailure(err.message));
      return false;
    }
  };

  return {
    role,
    phone,
    loading,
    error,
    isVerified,
    selectRole,
    sendOtpHandler,
    verifyOtpHandler,
  };
};
