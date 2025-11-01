// src/store/slices/customerSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getprofileApi,
  updateprofileApi,
  getSavedCarsApi,
  getMyListingsApi,
  saveCarApi,
  unsaveCarApi,
} from '../../features/users/features/profile/services/profileAPI';
import { Userprofile, CarListing } from '../../features/users/features/profile/types';

type CustomerState = {
  profile?: Userprofile;
  savedCars: CarListing[];
  myListings: CarListing[];
  loading: boolean;
  error?: string | null;
};

const initialState: CustomerState = {
  profile: {
    id: 'dummy-user-1',
    name: 'Om Jaiswal',
    email: 'omjai11022000@gmail.com',
    phone: '+91 75710 74720',
    avatar: undefined,
    role: 'customer',
    location: { city: 'Noida', state: 'UP', pincode: '560001' },
    dealerInfo: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  savedCars: [],
  myListings: [
    {
      id: 'listing-1',
      brand: 'Hyundai',
      model: 'i20',
      variant: 'Sportz',
      year: 2020,
      price: 735000,
      kmDriven: 21000,
      fuelType: 'Diesel',
      transmission: 'Manual',
      ownerNumber: 1,
      registrationNumber: 'KA03CD5678',
      color: 'White',
      location: { city: 'Bengaluru', state: 'Karnataka' },
      images: ['https://picsum.photos/seed/i20/600/400'],
      status: 'active',
      views: 320,
      leads: 15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  loading: false,
  error: null,
};

// ============ EXISTING THUNKS ============

export const fetchprofile = createAsyncThunk(
  'customer/fetchprofile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth?.token;
      const res = await getprofileApi(token);
      return res.data as Userprofile;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

export const updateprofile = createAsyncThunk(
  'customer/updateprofile',
  async (payload: { formData: FormData }, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth?.token;
      const res = await updateprofileApi(payload.formData, token);
      return res.data as Userprofile;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

export const fetchSavedCars = createAsyncThunk(
  'customer/fetchSavedCars',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth?.token;
      const res = await getSavedCarsApi(token);
      return res.data as CarListing[];
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

export const fetchMyListings = createAsyncThunk(
  'customer/fetchMyListings',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth?.token;
      const res = await getMyListingsApi(token);
      return res.data as CarListing[];
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

// ============ ADDITIONAL THUNKS ============

export const saveCar = createAsyncThunk(
  'customer/saveCar',
  async (carId: string, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth?.token;
      await saveCarApi(carId, token);
      // Refetch saved cars after saving
      const res = await getSavedCarsApi(token);
      return res.data as CarListing[];
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

export const unsaveCar = createAsyncThunk(
  'customer/unsaveCar',
  async (carId: string, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as any).auth?.token;
      await unsaveCarApi(carId, token);
      // Refetch saved cars after unsaving
      const res = await getSavedCarsApi(token);
      return res.data as CarListing[];
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    logoutCustomer(state) {
      state.profile = undefined;
      state.savedCars = [];
      state.myListings = [];
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
    // Optimistic update for saved cars
    toggleSavedCarOptimistic(state, action: PayloadAction<string>) {
      const carId = action.payload;
      const index = state.savedCars.findIndex(car => car.id === carId);
      if (index !== -1) {
        state.savedCars.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchprofile.pending, (s) => ({ ...s, loading: true, error: null }))
      .addCase(fetchprofile.fulfilled, (s, a: PayloadAction<Userprofile>) => ({
        ...s,
        loading: false,
        profile: a.payload,
      }))
      .addCase(fetchprofile.rejected, (s, a) => ({
        ...s,
        loading: false,
        error: String(a.payload)
      }))

      // Update Profile
      .addCase(updateprofile.pending, (s) => ({ ...s, loading: true, error: null }))
      .addCase(updateprofile.fulfilled, (s, a: PayloadAction<Userprofile>) => ({
        ...s,
        loading: false,
        profile: a.payload,
      }))
      .addCase(updateprofile.rejected, (s, a) => ({
        ...s,
        loading: false,
        error: String(a.payload)
      }))

      // Fetch Saved Cars
      .addCase(fetchSavedCars.pending, (s) => ({ ...s, loading: true }))
      .addCase(fetchSavedCars.fulfilled, (s, a: PayloadAction<CarListing[]>) => ({
        ...s,
        loading: false,
        savedCars: a.payload,
      }))
      .addCase(fetchSavedCars.rejected, (s, a) => ({
        ...s,
        loading: false,
        error: String(a.payload)
      }))

      // Fetch My Listings
      .addCase(fetchMyListings.pending, (s) => ({ ...s, loading: true }))
      .addCase(fetchMyListings.fulfilled, (s, a: PayloadAction<CarListing[]>) => ({
        ...s,
        loading: false,
        myListings: a.payload,
      }))
      .addCase(fetchMyListings.rejected, (s, a) => ({
        ...s,
        loading: false,
        error: String(a.payload)
      }))

     

      // Save Car
      .addCase(saveCar.pending, (s) => ({ ...s, loading: true }))
      .addCase(saveCar.fulfilled, (s, a: PayloadAction<CarListing[]>) => ({
        ...s,
        loading: false,
        savedCars: a.payload,
      }))
      .addCase(saveCar.rejected, (s, a) => ({
        ...s,
        loading: false,
        error: String(a.payload)
      }))

      // Unsave Car
      .addCase(unsaveCar.pending, (s) => ({ ...s, loading: true }))
      .addCase(unsaveCar.fulfilled, (s, a: PayloadAction<CarListing[]>) => ({
        ...s,
        loading: false,
        savedCars: a.payload,
      }))
      .addCase(unsaveCar.rejected, (s, a) => ({
        ...s,
        loading: false,
        error: String(a.payload)
      }));
  },
});

export const { logoutCustomer, clearError, toggleSavedCarOptimistic } = customerSlice.actions;
export default customerSlice.reducer;