import { configureStore } from '@reduxjs/toolkit';

import authReducer, {
  sessionExpired,
} from '../features/auth/authSlice';

import { clearAccessToken } from '../auth/tokenStore';
import studentsReducer from '../features/students/studentsSlice';
import { setSessionExpiredHandler } from '../auth/sessionEvents';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentsReducer,
  },
});

setSessionExpiredHandler(() => {
  clearAccessToken();
  store.dispatch(sessionExpired());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;