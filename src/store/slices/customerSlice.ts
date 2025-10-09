// src/store/slices/customerSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getprofileApi,
  updateprofileApi,
  getSavedCarsApi,
  getMyListingsApi,
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
  profile: undefined,
  savedCars: [],
  myListings: [],
  loading: false,
  error: null,
};

// Thunks
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchprofile.pending, (s) => ({ ...s, loading: true, error: null }))
      .addCase(fetchprofile.fulfilled, (s, a: PayloadAction<Userprofile>) => ({
        ...s,
        loading: false,
        profile: a.payload,
      }))
      .addCase(fetchprofile.rejected, (s, a) => ({ ...s, loading: false, error: String(a.payload) }))
      .addCase(updateprofile.pending, (s) => ({ ...s, loading: true, error: null }))
      .addCase(updateprofile.fulfilled, (s, a: PayloadAction<Userprofile>) => ({
        ...s,
        loading: false,
        profile: a.payload,
      }))
      .addCase(updateprofile.rejected, (s, a) => ({ ...s, loading: false, error: String(a.payload) }))
      .addCase(fetchSavedCars.pending, (s) => ({ ...s, loading: true }))
      .addCase(fetchSavedCars.fulfilled, (s, a: PayloadAction<CarListing[]>) => ({
        ...s,
        loading: false,
        savedCars: a.payload,
      }))
      .addCase(fetchSavedCars.rejected, (s, a) => ({ ...s, loading: false, error: String(a.payload) }))
      .addCase(fetchMyListings.pending, (s) => ({ ...s, loading: true }))
      .addCase(fetchMyListings.fulfilled, (s, a: PayloadAction<CarListing[]>) => ({
        ...s,
        loading: false,
        myListings: a.payload,
      }))
      .addCase(fetchMyListings.rejected, (s, a) => ({ ...s, loading: false, error: String(a.payload) }));
  },
});

export const { logoutCustomer } = customerSlice.actions;
export default customerSlice.reducer;
