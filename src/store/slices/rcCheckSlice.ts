// src/store/slices/rcCheckSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RCCheckState, RCCheckReport, SavedRCCheck, RCCheckRequest } from '../../features/users/features/rcCheck/types';
import rcCheckAPI from '../../features/users/features/rcCheck/services/rcCheckAPI';

const initialState: RCCheckState = {
  currentReport: null,
  savedReports: [],
  recentSearches: [],
  loading: false,
  error: null,
  filters: {
    sortBy: 'recent',
    searchQuery: '',
  },
};

// Async Thunks
export const fetchRCReport = createAsyncThunk(
  'rcCheck/fetchReport',
  async (request: RCCheckRequest, { rejectWithValue }) => {
    try {
      const report = await rcCheckAPI.getRCReport(request);
      return report;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchReportById = createAsyncThunk(
  'rcCheck/fetchReportById',
  async (reportId: string, { rejectWithValue }) => {
    try {
      const report = await rcCheckAPI.getReportById(reportId);
      return report;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveReport = createAsyncThunk(
  'rcCheck/saveReport',
  async (reportId: string, { rejectWithValue }) => {
    try {
      const savedReport = await rcCheckAPI.saveReport(reportId);
      return savedReport;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSavedReports = createAsyncThunk(
  'rcCheck/fetchSavedReports',
  async (_, { rejectWithValue }) => {
    try {
      const reports = await rcCheckAPI.getSavedReports();
      return reports;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSavedReport = createAsyncThunk(
  'rcCheck/deleteSavedReport',
  async (reportId: string, { rejectWithValue }) => {
    try {
      await rcCheckAPI.deleteSavedReport(reportId);
      return reportId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const rcCheckSlice = createSlice({
  name: 'rcCheck',
  initialState,
  reducers: {
    clearCurrentReport: (state) => {
      state.currentReport = null;
      state.error = null;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const regNumber = action.payload.toUpperCase();
      state.recentSearches = [
        regNumber,
        ...state.recentSearches.filter(r => r !== regNumber)
      ].slice(0, 5);
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
    },
    updateFilters: (state, action: PayloadAction<Partial<RCCheckState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch RC Report
    builder
      .addCase(fetchRCReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRCReport.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload;
      })
      .addCase(fetchRCReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Fetch Report By ID
    builder
      .addCase(fetchReportById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload;
      })
      .addCase(fetchReportById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Save Report
    builder
      .addCase(saveReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveReport.fulfilled, (state, action) => {
        state.loading = false;
        state.savedReports = [action.payload, ...state.savedReports];
      })
      .addCase(saveReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Fetch Saved Reports
    builder
      .addCase(fetchSavedReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSavedReports.fulfilled, (state, action) => {
        state.loading = false;
        state.savedReports = action.payload;
      })
      .addCase(fetchSavedReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Delete Saved Report
    builder
      .addCase(deleteSavedReport.fulfilled, (state, action) => {
        state.savedReports = state.savedReports.filter(
          report => report.id !== action.payload
        );
      });
  },
});

export const {
  clearCurrentReport,
  addRecentSearch,
  clearRecentSearches,
  updateFilters,
  clearError,
} = rcCheckSlice.actions;

export default rcCheckSlice.reducer;