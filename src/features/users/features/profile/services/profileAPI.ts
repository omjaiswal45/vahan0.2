// src/features/users/features/profile/services/profileAPI.ts

import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.yourapp.com';

// ============ EXISTING API FUNCTIONS (from your customerSlice) ============

export const getprofileApi = async (token: string): Promise<AxiosResponse> => {
  return axios.get(`${API_BASE_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateprofileApi = async (
  formData: FormData,
  token: string
): Promise<AxiosResponse> => {
  return axios.put(`${API_BASE_URL}/profile`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getSavedCarsApi = async (token: string): Promise<AxiosResponse> => {
  return axios.get(`${API_BASE_URL}/profile/saved-cars`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getMyListingsApi = async (token: string): Promise<AxiosResponse> => {
  return axios.get(`${API_BASE_URL}/profile/listings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ============ ADDITIONAL API FUNCTIONS ============

export const uploadAvatarApi = async (
  formData: FormData,
  token: string
): Promise<AxiosResponse> => {
  return axios.post(`${API_BASE_URL}/profile/avatar`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getProfileStatsApi = async (token: string): Promise<AxiosResponse> => {
  return axios.get(`${API_BASE_URL}/profile/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const saveCarApi = async (carId: string, token: string): Promise<AxiosResponse> => {
  return axios.post(
    `${API_BASE_URL}/profile/saved-cars`,
    { carId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const unsaveCarApi = async (carId: string, token: string): Promise<AxiosResponse> => {
  return axios.delete(`${API_BASE_URL}/profile/saved-cars/${carId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateListingStatusApi = async (
  listingId: string,
  status: 'active' | 'sold' | 'inactive',
  token: string
): Promise<AxiosResponse> => {
  return axios.patch(
    `${API_BASE_URL}/listings/${listingId}/status`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

export const deleteListingApi = async (
  listingId: string,
  token: string
): Promise<AxiosResponse> => {
  return axios.delete(`${API_BASE_URL}/listings/${listingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getSettingsApi = async (token: string): Promise<AxiosResponse> => {
  return axios.get(`${API_BASE_URL}/profile/settings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateSettingsApi = async (
  settings: any,
  token: string
): Promise<AxiosResponse> => {
  return axios.put(`${API_BASE_URL}/profile/settings`, settings, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteAccountApi = async (token: string): Promise<AxiosResponse> => {
  return axios.delete(`${API_BASE_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};