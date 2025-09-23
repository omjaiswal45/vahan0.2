import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  role: 'customer' | 'dealer' | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ token: string; role: 'customer' | 'dealer' }>) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    logout: state => {
      state.isLoggedIn = false;
      state.token = null;
      state.role = null;
    },
    setRole: (state, action: PayloadAction<'customer' | 'dealer'>) => {
      state.role = action.payload;
    },
  },
});

export const { login, logout, setRole } = authSlice.actions;
export default authSlice.reducer;
