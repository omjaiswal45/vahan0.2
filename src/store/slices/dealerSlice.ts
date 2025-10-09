import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDashboard, getListings, getLeads, getprofile } from '../../features/dealer/services/dealerAPI';

// --- Async Thunks ---
export const fetchDashboard = createAsyncThunk('dealer/fetchDashboard', async () => {
  const response = await getDashboard();
  return response.data;
});

export const fetchListings = createAsyncThunk('dealer/fetchListings', async () => {
  const response = await getListings();
  return response.data;
});

export const fetchLeads = createAsyncThunk('dealer/fetchLeads', async () => {
  const response = await getLeads();
  return response.data;
});

export const fetchprofile = createAsyncThunk('dealer/fetchprofile', async () => {
  const response = await getprofile();
  return response.data;
});

// --- Initial State ---
interface DealerState {
  dashboard: any | null;
  listings: any[];
  leads: any[];
  profile: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: DealerState = {
  dashboard: null,
  listings: [],
  leads: [],
  profile: null,
  loading: false,
  error: null,
};

// --- Slice ---
const dealerSlice = createSlice({
  name: 'dealer',
  initialState,
  reducers: {
    // optional synchronous reducers can go here
  },
  extraReducers: (builder) => {
    builder
      // --- Dashboard ---
      .addCase(fetchDashboard.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDashboard.fulfilled, (state, action) => { state.dashboard = action.payload; state.loading = false; })
      .addCase(fetchDashboard.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch dashboard'; })

      // --- Listings ---
      .addCase(fetchListings.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchListings.fulfilled, (state, action) => { state.listings = action.payload; state.loading = false; })
      .addCase(fetchListings.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch listings'; })

      // --- Leads ---
      .addCase(fetchLeads.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchLeads.fulfilled, (state, action) => { state.leads = action.payload; state.loading = false; })
      .addCase(fetchLeads.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch leads'; })

      // --- profile ---
      .addCase(fetchprofile.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchprofile.fulfilled, (state, action) => { state.profile = action.payload; state.loading = false; })
      .addCase(fetchprofile.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch profile'; });
  },
});

export default dealerSlice.reducer;



//for testing without backend
// Dummy data and APIs for frontend testing without backend
// src/store/slices/dealerSlice.ts
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { getDashboard, getListings, getLeads, getprofile, DashboardData, Listing, Lead, profile } from '../../features/dealer/services/dealerAPI';

// // --- Async Thunks ---
// export const fetchDashboard = createAsyncThunk('dealer/fetchDashboard', async () => {
//   return await getDashboard();
// });

// export const fetchListings = createAsyncThunk('dealer/fetchListings', async () => {
//   return await getListings();
// });

// export const fetchLeads = createAsyncThunk('dealer/fetchLeads', async () => {
//   return await getLeads();
// });

// export const fetchprofile = createAsyncThunk('dealer/fetchprofile', async () => {
//   return await getprofile();
// });

// // --- Initial State ---
// interface DealerState {
//   dashboard: DashboardData | null;
//   listings: Listing[];
//   leads: Lead[];
//   profile: profile | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: DealerState = {
//   dashboard: null,
//   listings: [],
//   leads: [],
//   profile: null,
//   loading: false,
//   error: null,
// };

// // --- Slice ---
// const dealerSlice = createSlice({
//   name: 'dealer',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Dashboard
//       .addCase(fetchDashboard.pending, (state) => { state.loading = true; state.error = null; })
//       .addCase(fetchDashboard.fulfilled, (state, action) => { state.dashboard = action.payload; state.loading = false; })
//       .addCase(fetchDashboard.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch dashboard'; })

//       // Listings
//       .addCase(fetchListings.pending, (state) => { state.loading = true; state.error = null; })
//       .addCase(fetchListings.fulfilled, (state, action) => { state.listings = action.payload; state.loading = false; })
//       .addCase(fetchListings.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch listings'; })

//       // Leads
//       .addCase(fetchLeads.pending, (state) => { state.loading = true; state.error = null; })
//       .addCase(fetchLeads.fulfilled, (state, action) => { state.leads = action.payload; state.loading = false; })
//       .addCase(fetchLeads.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch leads'; })

//       // profile
//       .addCase(fetchprofile.pending, (state) => { state.loading = true; state.error = null; })
//       .addCase(fetchprofile.fulfilled, (state, action) => { state.profile = action.payload; state.loading = false; })
//       .addCase(fetchprofile.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch profile'; });
//   },
// });

// export default dealerSlice.reducer;
