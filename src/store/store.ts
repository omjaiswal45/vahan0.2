import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authslice';
import userReducer from './slices/userslice';
import locationReducer from './slices/locationSlice';
import dealerReducer from './slices/dealerSlice';
import customerReducer from './slices/customerSlice';
import buyUsedCarReducer from './slices/buyUsedCarSlice';
import rcCheckReducer from './slices/rcCheckSlice'
import challanCheckReducer from './slices/challanCheckSlice';
import vehicleReducer from './slices/vehicleSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['vehicle', 'user', 'buyUsedCar'], // Removed 'auth' - users must login each time
  // Auth state will not persist, requiring login on each app launch
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  location: locationReducer,
  dealer: dealerReducer,
  customer: customerReducer,
  buyUsedCar: buyUsedCarReducer,
  rcCheck: rcCheckReducer,
  challanCheck: challanCheckReducer,
  vehicle: vehicleReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
