// src/features/users/features/profile/hooks/useProfile.ts

import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'react-native';
import {
  fetchprofile,
  updateprofile,
  fetchSavedCars,
  fetchMyListings,
} from '../../../../../store/slices/customerSlice';
import {
  uploadAvatarApi,
  getProfileStatsApi,
  saveCarApi,
  unsaveCarApi,
  updateListingStatusApi,
  deleteListingApi,
  getSettingsApi,
  updateSettingsApi,
  deleteAccountApi,
} from '../services/profileAPI';
import {
  Userprofile,
  ProfileStats,
  SettingsConfig,
  AvatarUploadResult,
} from '../types';
import { RootState, AppDispatch } from '../../../../../store/store';
import { Form } from 'react-hook-form';

export const useProfile = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Get state from Redux
  const { profile, savedCars, myListings, loading, error } = useSelector(
    (state: RootState) => state.customer
  );
  const token = useSelector((state: RootState) => state.auth?.token);
  const savedCarIds = useSelector((state: RootState) => state.buyUsedCar.savedCarIds);

  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [settings, setSettings] = useState<SettingsConfig | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  // Fetch profile using Redux thunk
  const fetchProfileData = useCallback(() => {
    dispatch(fetchprofile());
  }, [dispatch]);

  // Update profile using Redux thunk
  const updateProfileData = useCallback(
    async (data: any) => {
      try {
        const formData = new FormData();
        
        if (data.name) formData.append('name', data.name);
        if (data.email) formData.append('email', data.email);
        if (data.location) {
          formData.append('city', data.location.city);
          formData.append('state', data.location.state);
          if (data.location.pincode) {
            formData.append('pincode', data.location.pincode);
          }
        }
        if (data.dealerInfo) {
          Object.keys(data.dealerInfo).forEach((key) => {
            formData.append(key, data.dealerInfo[key]);
          });
        }

        await dispatch(updateprofile({ formData })).unwrap();
        Alert.alert('Success', 'Profile updated successfully');
      } catch (err: any) {
        Alert.alert('Error', err || 'Failed to update profile');
        throw err;
      }
    },
    [dispatch]
  );

  // Upload avatar
  const uploadAvatar = useCallback(
    async (file: AvatarUploadResult) => {
      if (!token) return;

      try {
        setLocalLoading(true);
        const formData = new FormData();
        
        formData.append('avatar', {
          uri: file.uri,
          name: file.fileName,
          type: file.mimeType,
        } as any);

        const response = await uploadAvatarApi(formData, token);
        
        // Refresh profile after avatar upload
        dispatch(fetchprofile());
        
        Alert.alert('Success', 'Profile picture updated successfully');
        return response.data.avatarUrl;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to upload avatar';
        Alert.alert('Error', errorMessage);
        throw err;
      } finally {
        setLocalLoading(false);
      }
    },
    [token, dispatch]
  );

  // Fetch profile stats
  const fetchStats = useCallback(async () => {
    // Always set fallback stats with current savedCarIds count
    const fallbackStats: ProfileStats = {
      totalListings: myListings?.length || 0,
      activeListing: myListings?.filter(l => l.status === 'active').length || 0,
      soldCars: myListings?.filter(l => l.status === 'sold').length || 0,
      savedCars: savedCarIds.length,
      totalLeads: 0,
      activeLeads: 0,
    };

    if (!token) {
      setStats(fallbackStats);
      return fallbackStats;
    }

    try {
      const response = await getProfileStatsApi(token);
      // Merge API stats with Redux savedCarIds count
      const mergedStats = {
        ...response.data,
        savedCars: savedCarIds.length, // Use Redux count for saved cars
      };
      setStats(mergedStats);
      return mergedStats;
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      // Even if API fails, show saved cars count from Redux
      setStats(fallbackStats);
      return fallbackStats;
    }
  }, [token, savedCarIds.length, myListings]);

  // Fetch saved cars using Redux thunk
  const fetchSavedCarsData = useCallback(() => {
    dispatch(fetchSavedCars());
  }, [dispatch]);

  // Toggle save car
  const toggleSaveCar = useCallback(
    async (carId: string) => {
      if (!token) return;

      try {
        const isSaved = savedCars.some((car) => car.id === carId);
        
        if (isSaved) {
          await unsaveCarApi(carId, token);
          Alert.alert('Success', 'Car removed from saved list');
        } else {
          await saveCarApi(carId, token);
          Alert.alert('Success', 'Car saved successfully');
        }
        
        // Refresh saved cars
        dispatch(fetchSavedCars());
      } catch (err: any) {
        Alert.alert('Error', err.response?.data?.message || 'Failed to update saved cars');
        throw err;
      }
    },
    [token, savedCars, dispatch]
  );

  // Fetch user listings using Redux thunk
  const fetchUserListings = useCallback(() => {
    dispatch(fetchMyListings());
  }, [dispatch]);

  // Update listing status
  const updateListingStatus = useCallback(
    async (listingId: string, status: 'active' | 'sold' | 'inactive') => {
      if (!token) return;

      try {
        await updateListingStatusApi(listingId, status, token);
        Alert.alert('Success', `Listing marked as ${status}`);
        
        // Refresh listings
        dispatch(fetchMyListings());
      } catch (err: any) {
        Alert.alert('Error', err.response?.data?.message || 'Failed to update listing');
        throw err;
      }
    },
    [token, dispatch]
  );

  // Delete listing
  const deleteListing = useCallback(
    async (listingId: string) => {
      if (!token) return;

      try {
        await deleteListingApi(listingId, token);
        Alert.alert('Success', 'Listing deleted successfully');
        
        // Refresh listings
        dispatch(fetchMyListings());
      } catch (err: any) {
        Alert.alert('Error', err.response?.data?.message || 'Failed to delete listing');
        throw err;
      }
    },
    [token, dispatch]
  );

  // Fetch settings
  const fetchSettings = useCallback(async () => {
    if (!token) return null;

    try {
      const response = await getSettingsApi(token);
      setSettings(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch settings:', err);
      return null;
    }
  }, [token]);

  // Update settings
  const updateSettings = useCallback(
    async (newSettings: Partial<SettingsConfig>) => {
      if (!token) return;

      try {
        setLocalLoading(true);
        const response = await updateSettingsApi(newSettings, token);
        setSettings(response.data);
        Alert.alert('Success', 'Settings updated successfully');
        return response.data;
      } catch (err: any) {
        Alert.alert('Error', err.response?.data?.message || 'Failed to update settings');
        throw err;
      } finally {
        setLocalLoading(false);
      }
    },
    [token]
  );

  // Delete account
  const deleteAccount = useCallback(async () => {
    if (!token) return;

    return new Promise<void>((resolve, reject) => {
      Alert.alert(
        'Delete Account',
        'Are you sure you want to delete your account? This action cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => reject() },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteAccountApi(token);
                Alert.alert('Account Deleted', 'Your account has been deleted successfully');
                resolve();
              } catch (err: any) {
                Alert.alert('Error', err.response?.data?.message || 'Failed to delete account');
                reject(err);
              }
            },
          },
        ]
      );
    });
  }, [token]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    try {
      setRefreshing(true);
      await Promise.all([
        dispatch(fetchprofile()),
        dispatch(fetchSavedCars()),
        dispatch(fetchMyListings()),
        fetchStats(),
      ]);
    } catch (err) {
      console.error('Failed to refresh data:', err);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, fetchStats]);

  // Initial load
  useEffect(() => {
    if (token) {
      fetchProfileData();
    }
    // Always fetch stats (will use fallback if no token)
    fetchStats();
  }, [token, fetchStats]);

  // Update stats when savedCarIds changes
  useEffect(() => {
    setStats((prevStats) => {
      if (!prevStats) {
        // If stats don't exist yet, create them with savedCarIds count
        return {
          totalListings: myListings?.length || 0,
          activeListing: myListings?.filter(l => l.status === 'active').length || 0,
          soldCars: myListings?.filter(l => l.status === 'sold').length || 0,
          savedCars: savedCarIds.length,
          totalLeads: 0,
          activeLeads: 0,
        };
      }
      // Update existing stats with new savedCarIds count
      return {
        ...prevStats,
        savedCars: savedCarIds.length,
      };
    });
  }, [savedCarIds.length, myListings]);

  return {
    // Redux state
    profile,
    savedCars,
    myListings: myListings || [],
    loading: loading || localLoading,
    error,
    
    // Local state
    stats,
    settings,
    refreshing,
    
    // Actions
    fetchProfile: fetchProfileData,
    updateProfile: updateProfileData,
    uploadAvatar,
    fetchStats,
    fetchSavedCars: fetchSavedCarsData,
    toggleSaveCar,
    fetchUserListings,
    updateListingStatus,
    deleteListing,
    fetchSettings,
    updateSettings,
    deleteAccount,
    refreshData,
  };
};