import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authslice';
import userReducer from './slices/userslice';
import locationReducer from './slices/locationSlice';
import dealerReducer from './slices/dealerSlice';
import customerReducer from './slices/customerSlice';
import buyUsedCarReducer from './slices/buyUsedCarSlice';
import rcCheckReducer from './slices/rcCheckSlice'
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  location: locationReducer,
  dealer: dealerReducer,
  customer: customerReducer,
  buyUsedCar: buyUsedCarReducer,
  rcCheck: rcCheckReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
