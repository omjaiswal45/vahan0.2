// src/features/users/features/rcCheck/hooks/useRCCheck.ts

import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchRCReport,
  fetchReportById,
  saveReport,
  fetchSavedReports,
  deleteSavedReport,
  clearCurrentReport,
  addRecentSearch,
  clearRecentSearches,
  updateFilters,
  clearError,
} from '../../../../../store/slices/rcCheckSlice';
import { RCCheckRequest } from '../types';
import rcCheckAPI from '../services/rcCheckAPI';

export const useRCCheck = () => {
  const dispatch = useDispatch();
  
  const {
    currentReport,
    savedReports,
    recentSearches,
    loading,
    error,
    filters,
  } = useSelector((state: any) => state.rcCheck);
  
  // Check RC
  const checkRC = useCallback(async (request: RCCheckRequest) => {
    dispatch(addRecentSearch(request.registrationNumber));
    return dispatch(fetchRCReport(request));
  }, [dispatch]);
  
  // Get report by ID
  const getReportById = useCallback((reportId: string) => {
    return dispatch(fetchReportById(reportId));
  }, [dispatch]);
  
  // Save current report
  const saveCurrentReport = useCallback(() => {
    if (currentReport?.reportId) {
      return dispatch(saveReport(currentReport.reportId));
    }
  }, [dispatch, currentReport]);
  
  // Load saved reports
  const loadSavedReports = useCallback(() => {
    return dispatch(fetchSavedReports());
  }, [dispatch]);
  
  // Delete a saved report
  const removeSavedReport = useCallback((reportId: string) => {
    return dispatch(deleteSavedReport(reportId));
  }, [dispatch]);
  
  // Clear current report
  const clearReport = useCallback(() => {
    dispatch(clearCurrentReport());
  }, [dispatch]);
  
  // Clear recent searches
  const clearRecent = useCallback(() => {
    dispatch(clearRecentSearches());
  }, [dispatch]);
  
  // Update filters
  const setFilters = useCallback((newFilters: any) => {
    dispatch(updateFilters(newFilters));
  }, [dispatch]);
  
  // Clear error
  const resetError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);
  
  // Verify registration number
  const verifyRegNumber = useCallback((regNumber: string) => {
    return rcCheckAPI.verifyRegNumberFormat(regNumber);
  }, []);
  
  // Get filtered saved reports
  const getFilteredSavedReports = useCallback(() => {
    let filtered = [...savedReports];
    
    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        report =>
          report.registrationNumber.toLowerCase().includes(query) ||
          report.vehicleName.toLowerCase().includes(query)
      );
    }
    
    // Grade filter
    if (filters.filterByGrade && filters.filterByGrade.length > 0) {
      // This would require trustGrade in SavedRCCheck type
      // For now, we'll skip this filter
    }
    
    // Sort
    switch (filters.sortBy) {
      case 'recent':
        filtered.sort((a, b) => 
          new Date(b.checkDate).getTime() - new Date(a.checkDate).getTime()
        );
        break;
      case 'trust_score':
        filtered.sort((a, b) => b.trustScore - a.trustScore);
        break;
      case 'price':
        filtered.sort((a, b) => 
          (b.estimatedPrice || 0) - (a.estimatedPrice || 0)
        );
        break;
    }
    
    return filtered;
  }, [savedReports, filters]);
  
  // Calculate trust score color
  const getTrustScoreColor = useCallback((score: number) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Amber
    if (score >= 40) return '#F97316'; // Orange
    return '#EF4444'; // Red
  }, []);
  
  // Get warning severity color
  const getWarningSeverityColor = useCallback((severity: string) => {
    switch (severity) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  }, []);
  
  // Check if report is saved
  const isReportSaved = useCallback((reportId: string) => {
    return savedReports.some(report => report.id === reportId);
  }, [savedReports]);
  
  return {
    // State
    currentReport,
    savedReports,
    recentSearches,
    loading,
    error,
    filters,
    
    // Actions
    checkRC,
    getReportById,
    saveCurrentReport,
    loadSavedReports,
    removeSavedReport,
    clearReport,
    clearRecent,
    setFilters,
    resetError,
    
    // Utilities
    verifyRegNumber,
    getFilteredSavedReports,
    getTrustScoreColor,
    getWarningSeverityColor,
    isReportSaved,
  };
};