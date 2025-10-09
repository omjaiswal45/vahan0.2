// src/features/users/features/profile/services/profileAPI.ts
import axios from 'axios';
import { Userprofile, CarListing } from '../types';

const BASE_URL = 'https://api.example.com'; // <- update

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

export async function getprofileApi(token: string) {
  return api.get<Userprofile>('/api/customer/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function updateprofileApi(formData: FormData, token: string) {
  return api.put<Userprofile>('/api/customer/profile', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function getSavedCarsApi(token: string) {
  return api.get<CarListing[]>('/api/customer/saved-cars', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function getMyListingsApi(token: string) {
  return api.get<CarListing[]>('/api/customer/listings', {
    headers: { Authorization: `Bearer ${token}` },
  });
}
