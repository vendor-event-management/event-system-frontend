import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchEventDetail } from '../api';
import { FAILED, IDLE, LOADING, SUCCEEDED } from '../statusEnum';

const initialState = {
  data: {},
  status: IDLE,
  isLoading: false,
  error: null,
};

export const getDetailEvent = createAsyncThunk(
  'event/getDetailEvent',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetchEventDetail(params.id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const eventDetailSlice = createSlice({
  name: 'eventDetail',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getDetailEvent.pending, (state) => {
        state.isLoading = true;
        state.status = LOADING;
        state.error = null;
      })
      .addCase(getDetailEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = SUCCEEDED;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(getDetailEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.status = FAILED;
        state.error = action.payload;
      });
  },
});

export default eventDetailSlice.reducer;
