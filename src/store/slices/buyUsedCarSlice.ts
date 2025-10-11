// src/store/slices/buyUsedCarSlice.ts
// Optional: Use this if you want Redux integration for global state management

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { buyUsedCarAPI } from '../../features/users/features/buyUsedCar/services/buyUsedCarAPI';
import { Car, CarFilters, PaginationMeta } from '../../features/users/features/buyUsedCar/types';

interface BuyUsedCarState {
  cars: Car[];
  savedCarIds: string[];
  filters: CarFilters;
  searchQuery: string;
  currentPage: number;
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
}

const initialState: BuyUsedCarState = {
  cars: [],
  savedCarIds: [],
  filters: {},
  searchQuery: '',
  currentPage: 1,
  meta: null,
  loading: false,
  error: null,
  refreshing: false,
};

// Async thunks
export const fetchCars = createAsyncThunk(
  'buyUsedCar/fetchCars',
  async (
    { page, filters, searchQuery }: { page: number; filters?: CarFilters; searchQuery?: string },
    { rejectWithValue }
  ) => {
    try {
      if (searchQuery && searchQuery.trim()) {
        return await buyUsedCarAPI.searchCars(searchQuery, page, 10, filters);
      }
      return await buyUsedCarAPI.getCars(page, 10, filters);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleSaveCar = createAsyncThunk(
  'buyUsedCar/toggleSaveCar',
  async ({ carId, userId }: { carId: string; userId: string }, { rejectWithValue }) => {
    try {
      const result = await buyUsedCarAPI.toggleSaveCar({ carId, userId });
      return { carId, isSaved: result.isSaved };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSavedCars = createAsyncThunk(
  'buyUsedCar/fetchSavedCars',
  async ({ userId, page }: { userId: string; page: number }, { rejectWithValue }) => {
    try {
      return await buyUsedCarAPI.getSavedCars(userId, page, 10);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const buyUsedCarSlice = createSlice({
  name: 'buyUsedCar',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<CarFilters>) => {
      state.filters = action.payload;
      state.currentPage = 1;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
    },
    resetState: (state) => {
      return initialState;
    },
    addSavedCarId: (state, action: PayloadAction<string>) => {
      if (!state.savedCarIds.includes(action.payload)) {
        state.savedCarIds.push(action.payload);
      }
    },
    removeSavedCarId: (state, action: PayloadAction<string>) => {
      state.savedCarIds = state.savedCarIds.filter(id => id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // Fetch cars
    builder
      .addCase(fetchCars.pending, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        const { cars, meta } = action.payload;
        
        if (action.meta.arg.page === 1) {
          state.cars = cars;
        } else {
          state.cars = [...state.cars, ...cars];
        }
        
        state.meta = meta;
        state.currentPage = meta.currentPage;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Toggle save car
    builder
      .addCase(toggleSaveCar.fulfilled, (state, action) => {
        const { carId, isSaved } = action.payload;
        
        if (isSaved) {
          if (!state.savedCarIds.includes(carId)) {
            state.savedCarIds.push(carId);
          }
        } else {
          state.savedCarIds = state.savedCarIds.filter(id => id !== carId);
        }
        
        // Update car in the list
        const carIndex = state.cars.findIndex(car => car.id === carId);
        if (carIndex !== -1) {
          state.cars[carIndex].isSaved = isSaved;
        }
      });

    // Fetch saved cars
    builder
      .addCase(fetchSavedCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload.cars;
        state.meta = action.payload.meta;
      })
      .addCase(fetchSavedCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  setSearchQuery,
  clearFilters,
  resetState,
  addSavedCarId,
  removeSavedCarId,
} = buyUsedCarSlice.actions;

export default buyUsedCarSlice.reducer;

// Selectors
export const selectCars = (state: { buyUsedCar: BuyUsedCarState }) => state.buyUsedCar.cars;
export const selectSavedCarIds = (state: { buyUsedCar: BuyUsedCarState }) => state.buyUsedCar.savedCarIds;
export const selectFilters = (state: { buyUsedCar: BuyUsedCarState }) => state.buyUsedCar.filters;
export const selectLoading = (state: { buyUsedCar: BuyUsedCarState }) => state.buyUsedCar.loading;
export const selectHasMore = (state: { buyUsedCar: BuyUsedCarState }) => 
  state.buyUsedCar.meta?.hasNextPage ?? false;