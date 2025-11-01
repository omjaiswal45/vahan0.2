// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  role: 'customer' | 'dealer' | null;
  phone: string | null;
  isVerified: boolean;
  loading: boolean;
  error: string;
}

const initialState: AuthState = {
  role: 'customer', // Default role selection (customer pre-selected)
  phone: null,
  isVerified: false, // Not authenticated until user logs in
  loading: false,
  error: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<'customer' | 'dealer'>) => {
      state.role = action.payload;
    },
    sendOtpStart: (state) => {
      state.loading = true;
      state.error = '';
    },
    sendOtpSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.phone = action.payload;
    },
    sendOtpFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    verifyOtpStart: (state) => {
      state.loading = true;
      state.error = '';
    },
    verifyOtpSuccess: (state) => {
      state.loading = false;
      state.isVerified = true;
    },
    verifyOtpFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.role = null;
      state.phone = null;
      state.isVerified = false;
      state.loading = false;
      state.error = '';
    },
  },
});

export const {
  setRole,
  sendOtpStart,
  sendOtpSuccess,
  sendOtpFailure,
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
