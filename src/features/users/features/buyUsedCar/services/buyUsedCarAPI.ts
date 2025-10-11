// src/features/users/features/buyUsedCar/services/buyUsedCarAPI.ts

import axios from 'axios';
import { Car, CarsResponse, CarFilters, FilterOptions, SavedCarPayload } from '../types';
import { 
  MOCK_CARS, 
  MOCK_FILTER_OPTIONS, 
  generateMockCarsResponse 
} from './mockCarData';

const API_BASE_URL = 'YOUR_API_BASE_URL'; // Replace with your actual API URL

// 🎭 TOGGLE THIS TO SWITCH BETWEEN MOCK AND REAL API
// Set to true = Use dummy data (no API needed)
// Set to false = Use real API calls
const USE_MOCK_DATA = true;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  // Add token from storage if available
  // const token = await getToken();
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const buyUsedCarAPI = {
  // Get cars with pagination and filters
  getCars: async (
    page: number = 1,
    limit: number = 10,
    filters?: CarFilters
  ): Promise<CarsResponse> => {
    // 🎭 MOCK DATA
    if (USE_MOCK_DATA) {
      await delay(500); // Simulate network delay
      return generateMockCarsResponse(page, limit, filters);
    }

    // 🌐 REAL API
    const params: any = { page, limit };
    
    if (filters) {
      if (filters.brands?.length) params.brands = filters.brands.join(',');
      if (filters.models?.length) params.models = filters.models.join(',');
      if (filters.priceMin) params.priceMin = filters.priceMin;
      if (filters.priceMax) params.priceMax = filters.priceMax;
      if (filters.yearMin) params.yearMin = filters.yearMin;
      if (filters.yearMax) params.yearMax = filters.yearMax;
      if (filters.kmMax) params.kmMax = filters.kmMax;
      if (filters.fuelTypes?.length) params.fuelTypes = filters.fuelTypes.join(',');
      if (filters.transmissions?.length) params.transmissions = filters.transmissions.join(',');
      if (filters.ownerNumbers?.length) params.ownerNumbers = filters.ownerNumbers.join(',');
      if (filters.cities?.length) params.cities = filters.cities.join(',');
      if (filters.sortBy) params.sortBy = filters.sortBy;
    }

    const response = await api.get<CarsResponse>('/cars', { params });
    return response.data;
  },

  // Search cars
  searchCars: async (
    query: string,
    page: number = 1,
    limit: number = 10,
    filters?: CarFilters
  ): Promise<CarsResponse> => {
    // 🎭 MOCK DATA
    if (USE_MOCK_DATA) {
      await delay(500);
      const mockResponse = generateMockCarsResponse(page, limit, filters);
      
      // Filter by search query
      const searchLower = query.toLowerCase();
      const filteredCars = mockResponse.cars.filter(car =>
        car.brand.toLowerCase().includes(searchLower) ||
        car.model.toLowerCase().includes(searchLower) ||
        car.variant?.toLowerCase().includes(searchLower)
      );

      return {
        cars: filteredCars,
        meta: {
          ...mockResponse.meta,
          totalItems: filteredCars.length,
          totalPages: Math.ceil(filteredCars.length / limit),
          hasNextPage: page < Math.ceil(filteredCars.length / limit),
        },
      };
    }

    // 🌐 REAL API
    const params: any = { query, page, limit };
    
    if (filters) {
      Object.assign(params, filters);
    }

    const response = await api.get<CarsResponse>('/cars/search', { params });
    return response.data;
  },

  // Get car details
  getCarById: async (carId: string): Promise<Car> => {
    // 🎭 MOCK DATA
    if (USE_MOCK_DATA) {
      await delay(300);
      const car = MOCK_CARS.find(c => c.id === carId);
      if (!car) {
        throw new Error('Car not found');
      }
      return car;
    }

    // 🌐 REAL API
    const response = await api.get<Car>(`/cars/${carId}`);
    return response.data;
  },

  // Get filter options
  getFilterOptions: async (): Promise<FilterOptions> => {
    // 🎭 MOCK DATA
    if (USE_MOCK_DATA) {
      await delay(200);
      return MOCK_FILTER_OPTIONS;
    }

    // 🌐 REAL API
    const response = await api.get<FilterOptions>('/cars/filters');
    return response.data;
  },

  // Save/Unsave car
  toggleSaveCar: async (payload: SavedCarPayload): Promise<{ isSaved: boolean }> => {
    // 🎭 MOCK DATA
    if (USE_MOCK_DATA) {
      await delay(300);
      // Toggle the saved state
      const car = MOCK_CARS.find(c => c.id === payload.carId);
      if (car) {
        car.isSaved = !car.isSaved;
        return { isSaved: car.isSaved };
      }
      return { isSaved: false };
    }

    // 🌐 REAL API
    const response = await api.post<{ isSaved: boolean }>('/cars/save', payload);
    return response.data;
  },

  // Get saved cars
  getSavedCars: async (userId: string, page: number = 1, limit: number = 10): Promise<CarsResponse> => {
    // 🎭 MOCK DATA
    if (USE_MOCK_DATA) {
      await delay(400);
      // Return only saved cars
      const savedCars = MOCK_CARS.filter(car => car.isSaved);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCars = savedCars.slice(startIndex, endIndex);

      return {
        cars: paginatedCars,
        meta: {
          currentPage: page,
          totalPages: Math.ceil(savedCars.length / limit),
          totalItems: savedCars.length,
          itemsPerPage: limit,
          hasNextPage: endIndex < savedCars.length,
          hasPreviousPage: page > 1,
        },
      };
    }

    // 🌐 REAL API
    const response = await api.get<CarsResponse>(`/users/${userId}/saved-cars`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get similar cars
  getSimilarCars: async (carId: string, limit: number = 5): Promise<Car[]> => {
    // 🎭 MOCK DATA
    if (USE_MOCK_DATA) {
      await delay(300);
      const currentCar = MOCK_CARS.find(c => c.id === carId);
      if (!currentCar) return [];

      // Get similar cars (same brand or similar price range)
      const similarCars = MOCK_CARS
        .filter(car => 
          car.id !== carId && 
          (car.brand === currentCar.brand || 
           Math.abs(car.price - currentCar.price) < 500000)
        )
        .slice(0, limit);

      return similarCars;
    }

    // 🌐 REAL API
    const response = await api.get<Car[]>(`/cars/${carId}/similar`, {
      params: { limit },
    });
    return response.data;
  },

  // Get recently viewed cars
  getRecentlyViewed: async (userId: string, limit: number = 10): Promise<Car[]> => {
    // 🎭 MOCK DATA
    if (USE_MOCK_DATA) {
      await delay(300);
      // Return random cars as "recently viewed"
      return MOCK_CARS.slice(0, limit);
    }

    // 🌐 REAL API
    const response = await api.get<Car[]>(`/users/${userId}/recently-viewed`, {
      params: { limit },
    });
    return response.data;
  },

  // Track car view
  trackCarView: async (carId: string, userId: string): Promise<void> => {
    // 🎭 MOCK DATA
    if (USE_MOCK_DATA) {
      await delay(100);
      console.log(`✅ Tracked view: Car ${carId} by User ${userId}`);
      return;
    }

    // 🌐 REAL API
    await api.post('/cars/track-view', { carId, userId });
  },
};