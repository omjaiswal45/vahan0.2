import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  city: string | null;   // ✅ changed from district to city
}

const initialState: LocationState = {
  latitude: null,
  longitude: null,
  city: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (
      state,
      action: PayloadAction<{ latitude: number; longitude: number }>
    ) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
  },
});

export const { setLocation, setCity } = locationSlice.actions;
export default locationSlice.reducer;
