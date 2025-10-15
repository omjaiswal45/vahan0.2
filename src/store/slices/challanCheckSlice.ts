// src/store/slices/challanCheckSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChallanCheckState, VehicleChallanData } from '../../features/users/features/challanCheck/types';

const MAX_RECENT_SEARCHES = 5;
const MAX_SAVED_REPORTS = 10;

const initialState: ChallanCheckState = {
  currentChallanData: null,
  recentSearches: [],
  savedReports: [],
  isLoading: false,
  error: null,
};

const challanCheckSlice = createSlice({
  name: 'challanCheck',
  initialState,
  reducers: {
    setChallanData: (state, action: PayloadAction<VehicleChallanData>) => {
      state.currentChallanData = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const registrationNumber = action.payload.toUpperCase();
      state.recentSearches = [
        registrationNumber,
        ...state.recentSearches.filter(rc => rc !== registrationNumber)
      ].slice(0, MAX_RECENT_SEARCHES);
    },
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(
        rc => rc !== action.payload
      );
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    saveReport: (state, action: PayloadAction<VehicleChallanData>) => {
      const exists = state.savedReports.findIndex(
        report => report.registrationNumber === action.payload.registrationNumber
      );
      
      if (exists !== -1) {
        state.savedReports[exists] = action.payload;
      } else {
        state.savedReports = [
          action.payload,
          ...state.savedReports
        ].slice(0, MAX_SAVED_REPORTS);
      }
    },
    removeSavedReport: (state, action: PayloadAction<string>) => {
      state.savedReports = state.savedReports.filter(
        report => report.registrationNumber !== action.payload
      );
    },
    clearChallanData: (state) => {
      state.currentChallanData = null;
      state.error = null;
    },
    updateChallanStatus: (state, action: PayloadAction<{ challanId: string; status: 'paid' }>) => {
      if (state.currentChallanData) {
        const challanIndex = state.currentChallanData.challans.findIndex(
          c => c.id === action.payload.challanId
        );
        if (challanIndex !== -1) {
          state.currentChallanData.challans[challanIndex].status = action.payload.status;
        }
      }
    },
  },
});

export const {
  setChallanData,
  setLoading,
  setError,
  clearError,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  saveReport,
  removeSavedReport,
  clearChallanData,
  updateChallanStatus,
} = challanCheckSlice.actions;

export default challanCheckSlice.reducer;