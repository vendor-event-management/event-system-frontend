import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import eventReducer from './event/eventSlice';
import eventDetailReducer from './event/eventDetailSlice';
import eventApprovalReducer from './event/eventApprovalSlice';
import eventCreationReducer from './event/eventCreationSlice';
import vendorReducer from './user/vendorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    eventDetail: eventDetailReducer,
    eventApproval: eventApprovalReducer,
    eventCreation: eventCreationReducer,
    userVendors: vendorReducer,
  },
});
