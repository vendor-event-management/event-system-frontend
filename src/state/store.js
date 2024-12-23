import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import eventReducer from './event/eventSlice';
import eventDetailReducer from './event/eventDetailSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    eventDetail: eventDetailReducer,
  },
});
