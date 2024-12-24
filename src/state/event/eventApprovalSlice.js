import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { putApprovalEvent } from '../api';
import { FAILED, IDLE, LOADING, SUCCEEDED } from '../statusEnum';

const initialState = {
  status: IDLE,
  isLoading: false,
  error: null,
};

export const approveOrRejectEvent = createAsyncThunk(
  'event/approveOrRejectEvent',
  async (params, { rejectWithValue }) => {
    try {
      const body = {
        status: params.status || '',
        remarks: params.remarks || '',
        confirmedDate: params.confirmedDate || '',
      };
      const response = await putApprovalEvent(params.eventId, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const eventSlice = createSlice({
  name: 'eventApproval',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(approveOrRejectEvent.pending, (state) => {
        state.isLoading = true;
        state.status = LOADING;
        state.error = null;
      })
      .addCase(approveOrRejectEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = SUCCEEDED;
        state.error = null;
      })
      .addCase(approveOrRejectEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.status = FAILED;
        state.error = action.payload;
      });
  },
});

export default eventSlice.reducer;
