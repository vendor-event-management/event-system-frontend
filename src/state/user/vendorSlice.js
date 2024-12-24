import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchVendors } from '../api';
import { FAILED, IDLE, LOADING, SUCCEEDED } from '../statusEnum';

const initialState = {
  data: [],
  status: IDLE,
  isLoading: false,
  error: null,
};

export const getVendors = createAsyncThunk(
  'user/getVendors',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await fetchVendors(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const getVendorSlice = createSlice({
  name: 'getVendors',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getVendors.pending, (state) => {
        state.isLoading = true;
        state.status = LOADING;
        state.error = null;
      })
      .addCase(getVendors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = SUCCEEDED;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(getVendors.rejected, (state, action) => {
        state.isLoading = false;
        state.status = FAILED;
        state.error = action.payload;
      });
  },
});

export default getVendorSlice.reducer;
