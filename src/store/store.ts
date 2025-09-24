import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authslice';
import userReducer from './slices/userslice';
import locationReducer from './slices/locationSlice';
import dealerReducer from './slices/dealerSlice';
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  location: locationReducer,
  dealer: dealerReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
