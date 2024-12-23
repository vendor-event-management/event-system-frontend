import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IDLE, LOADING, SUCCEEDED, FAILED } from '../statusEnum';
import { TOKEN_NAME } from '../../utils';
import { login } from '../api';

const initialState = {
  user: null,
  status: IDLE,
  token: null,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const params = { username, password };
      const response = await login(params);
      const token = response?.data?.token;
      localStorage.setItem(TOKEN_NAME, JSON.stringify(token));
      return token;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.status = null;
      state.status = IDLE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = LOADING;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = SUCCEEDED;
        state.token = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = FAILED;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
