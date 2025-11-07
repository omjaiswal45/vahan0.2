// src/store/slices/carInsuranceSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CarInsuranceState, VehicleInsuranceData } from '../../features/users/features/carInsurance/types';

const MAX_RECENT_SEARCHES = 5;
const MAX_SAVED_REPORTS = 10;

const initialState: CarInsuranceState = {
  currentInsuranceData: null,
  recentSearches: [],
  savedReports: [],
  isLoading: false,
  error: null,
  hasExpiredInsurance: false,
};

const carInsuranceSlice = createSlice({
  name: 'carInsurance',
  initialState,
  reducers: {
    setInsuranceData: (state, action: PayloadAction<VehicleInsuranceData>) => {
      state.currentInsuranceData = action.payload;
      state.isLoading = false;
      state.error = null;

      // Check if the current policy is expired or if there's no current policy
      const hasExpired = !action.payload.currentPolicy ||
                         action.payload.currentPolicy.status === 'expired' ||
                         action.payload.currentPolicy.status === 'expiring-soon';
      state.hasExpiredInsurance = hasExpired;
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
    saveReport: (state, action: PayloadAction<VehicleInsuranceData>) => {
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
    clearInsuranceData: (state) => {
      state.currentInsuranceData = null;
      state.error = null;
    },
    clearBadgeState: (state) => {
      state.hasExpiredInsurance = false;
    },
    updatePolicyStatus: (state, action: PayloadAction<{ policyId: string; status: 'active' | 'expired' | 'expiring-soon' }>) => {
      if (state.currentInsuranceData?.currentPolicy?.id === action.payload.policyId) {
        state.currentInsuranceData.currentPolicy.status = action.payload.status;
      }
    },
  },
});

export const {
  setInsuranceData,
  setLoading,
  setError,
  clearError,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  saveReport,
  removeSavedReport,
  clearInsuranceData,
  clearBadgeState,
  updatePolicyStatus,
} = carInsuranceSlice.actions;

export default carInsuranceSlice.reducer;
