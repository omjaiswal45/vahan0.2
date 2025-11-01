import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VehicleState {
  vehicleNumber: string | null;
  isVehicleNumberSet: boolean;
  hasSkipped: boolean;
}

const initialState: VehicleState = {
  vehicleNumber: null,
  isVehicleNumberSet: false,
  hasSkipped: false,
};

const vehicleSlice = createSlice({
  name: 'vehicle',
  initialState,
  reducers: {
    setVehicleNumber: (state, action: PayloadAction<string>) => {
      state.vehicleNumber = action.payload.toUpperCase();
      state.isVehicleNumberSet = true;
      state.hasSkipped = false;
    },
    clearVehicleNumber: (state) => {
      state.vehicleNumber = null;
      state.isVehicleNumberSet = false;
      state.hasSkipped = false;
    },
    skipVehicleNumber: (state) => {
      state.hasSkipped = true;
    },
    resetSkipStatus: (state) => {
      state.hasSkipped = false;
    },
  },
});

export const {
  setVehicleNumber,
  clearVehicleNumber,
  skipVehicleNumber,
  resetSkipStatus,
} = vehicleSlice.actions;

export default vehicleSlice.reducer;
