import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchEvents } from '../api';
import { FAILED, IDLE, LOADING, SUCCEEDED } from '../statusEnum';

const initialState = {
  data: [],
  status: IDLE,
  isLoading: false,
  error: null,
};

export const getEvents = createAsyncThunk(
  'event/fetchEvents',
  async (params, { rejectWithValue }) => {
    try {
      const query = {
        page: params.page || 1,
        size: params.page || 10,
        status: params.status,
        name: params.name,
      };
      const response = await fetchEvents(params.userId, query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const eventSlice = createSlice({
  name: 'event',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getEvents.pending, (state) => {
        state.isLoading = true;
        state.status = LOADING;
        state.error = null;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = SUCCEEDED;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.status = FAILED;
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;
