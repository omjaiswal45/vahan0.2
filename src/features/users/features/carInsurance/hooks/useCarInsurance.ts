// src/features/users/features/carInsurance/hooks/useCarInsurance.ts

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/store';
import {
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
  updatePolicyStatus,
} from '../../../../../store/slices/carInsuranceSlice';
import carInsuranceAPI from '../services/carInsuranceAPI';
import { InsuranceSearchRequest, InsuranceStats } from '../types';

export const useCarInsurance = () => {
  const dispatch = useDispatch();
  const {
    currentInsuranceData,
    recentSearches,
    savedReports,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.carInsurance);

  const searchInsurance = useCallback(async (request: InsuranceSearchRequest) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());

      const data = await carInsuranceAPI.searchInsurance(request);

      dispatch(setInsuranceData(data));
      dispatch(addRecentSearch(request.registrationNumber));

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch insurance data';
      dispatch(setError(errorMessage));
      throw err;
    }
  }, [dispatch]);

  const saveCurrentReport = useCallback(() => {
    if (currentInsuranceData) {
      dispatch(saveReport(currentInsuranceData));
    }
  }, [currentInsuranceData, dispatch]);

  const removeReport = useCallback((registrationNumber: string) => {
    dispatch(removeSavedReport(registrationNumber));
  }, [dispatch]);

  const clearCurrentData = useCallback(() => {
    dispatch(clearInsuranceData());
  }, [dispatch]);

  const removeSearch = useCallback((registrationNumber: string) => {
    dispatch(removeRecentSearch(registrationNumber));
  }, [dispatch]);

  const clearAllSearches = useCallback(() => {
    dispatch(clearRecentSearches());
  }, [dispatch]);

  const renewPolicy = useCallback(async (policyNumber: string) => {
    try {
      const result = await carInsuranceAPI.renewPolicy(policyNumber);

      if (result.success) {
        // Optionally update the status or refresh data
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Policy renewal failed';
      dispatch(setError(errorMessage));
      throw err;
    }
  }, [dispatch]);

  const getInsuranceStats = useCallback((): InsuranceStats | null => {
    if (!currentInsuranceData) return null;

    const activePolicies = currentInsuranceData.policyHistory.filter(p => p.status === 'active').length;
    const expiredPolicies = currentInsuranceData.policyHistory.filter(p => p.status === 'expired').length;
    const expiringSoonPolicies = currentInsuranceData.policyHistory.filter(p => p.status === 'expiring-soon').length;
    const totalPremiumPaid = currentInsuranceData.policyHistory.reduce((sum, p) => sum + p.premiumAmount, 0);
    const currentNCB = currentInsuranceData.currentPolicy?.ncbPercentage || 0;

    return {
      totalPolicies: currentInsuranceData.totalPolicies,
      activePolicies,
      expiredPolicies,
      expiringSoonPolicies,
      totalPremiumPaid,
      totalClaimsMade: currentInsuranceData.totalClaimsMade,
      currentNCB,
    };
  }, [currentInsuranceData]);

  return {
    currentInsuranceData,
    recentSearches,
    savedReports,
    isLoading,
    error,
    searchInsurance,
    saveCurrentReport,
    removeReport,
    clearCurrentData,
    removeSearch,
    clearAllSearches,
    renewPolicy,
    getInsuranceStats,
  };
};
