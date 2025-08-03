
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice'
import galleryReducer from './features/gallerySlice';
import   dashboardReducer from './features/dashboardSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    gallery: galleryReducer,
     dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;