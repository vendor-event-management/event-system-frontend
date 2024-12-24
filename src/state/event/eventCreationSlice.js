import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postEvent } from '../api';
import { FAILED, IDLE, LOADING, SUCCEEDED } from '../statusEnum';

const initialState = {
  status: IDLE,
  isLoading: false,
  error: null,
};

export const createEvent = createAsyncThunk(
  'event/createEvent',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await postEvent(payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const eventCreationSlice = createSlice({
  name: 'eventCreation',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
        state.status = LOADING;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = SUCCEEDED;
        state.error = null;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.status = FAILED;
        state.error = action.payload;
      });
  },
});

export default eventCreationSlice.reducer;
