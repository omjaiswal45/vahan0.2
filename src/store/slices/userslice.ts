import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name?: string;
  email?: string;
  phone?: string;
}

const initialState: UserState = {};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
