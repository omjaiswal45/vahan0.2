// src/features/users/features/challanCheck/hooks/useChallanCheck.ts

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../store/store';
import {
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
} from '../../../../../store/slices/challanCheckSlice';
import challanCheckAPI from '../services/challanCheckAPI';
import { ChallanSearchRequest, ChallanStats } from '../types';

export const useChallanCheck = () => {
  const dispatch = useDispatch();
  const {
    currentChallanData,
    recentSearches,
    savedReports,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.challanCheck);

  const searchChallan = useCallback(async (request: ChallanSearchRequest) => {
    try {
      dispatch(setLoading(true));
      dispatch(clearError());
      
      const data = await challanCheckAPI.searchChallan(request);
      
      dispatch(setChallanData(data));
      dispatch(addRecentSearch(request.registrationNumber));
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch challan data';
      dispatch(setError(errorMessage));
      throw err;
    }
  }, [dispatch]);

  const saveCurrentReport = useCallback(() => {
    if (currentChallanData) {
      dispatch(saveReport(currentChallanData));
    }
  }, [currentChallanData, dispatch]);

  const removeReport = useCallback((registrationNumber: string) => {
    dispatch(removeSavedReport(registrationNumber));
  }, [dispatch]);

  const clearCurrentData = useCallback(() => {
    dispatch(clearChallanData());
  }, [dispatch]);

  const removeSearch = useCallback((registrationNumber: string) => {
    dispatch(removeRecentSearch(registrationNumber));
  }, [dispatch]);

  const clearAllSearches = useCallback(() => {
    dispatch(clearRecentSearches());
  }, [dispatch]);

  const payChallan = useCallback(async (challanId: string) => {
    try {
      const result = await challanCheckAPI.payChallan({
        challanId,
        amount: 0,
        paymentMethod: 'upi',
      });
      
      if (result.success) {
        dispatch(updateChallanStatus({ challanId, status: 'paid' }));
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      dispatch(setError(errorMessage));
      throw err;
    }
  }, [dispatch]);

  const getChallanStats = useCallback((): ChallanStats | null => {
    if (!currentChallanData) return null;

    const pendingChallans = currentChallanData.challans.filter(c => c.status === 'pending').length;
    const paidChallans = currentChallanData.challans.filter(c => c.status === 'paid').length;
    const overdueChallans = currentChallanData.challans.filter(c => c.status === 'overdue').length;

    return {
      totalChallans: currentChallanData.totalChallans,
      pendingChallans,
      paidChallans,
      overdueChallans,
      totalPendingAmount: currentChallanData.totalPendingAmount,
    };
  }, [currentChallanData]);

  return {
    currentChallanData,
    recentSearches,
    savedReports,
    isLoading,
    error,
    searchChallan,
    saveCurrentReport,
    removeReport,
    clearCurrentData,
    removeSearch,
    clearAllSearches,
    payChallan,
    getChallanStats,
  };
};