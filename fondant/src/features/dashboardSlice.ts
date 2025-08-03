
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { DashboardStats } from '../types';

interface DashboardState {
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: {
    totalGalleries: 0,
    totalImages: 0,
    thisMonth: 0,
    avgImagesPerGallery: 0,
    recentGalleries: []
  },
  loading: false,
  error: null
};

export const getDashboardStats = createAsyncThunk(
  'dashboard/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/dashboard/stats`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
   
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;