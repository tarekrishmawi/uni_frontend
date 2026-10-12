
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import axiosClient from '../../api/axiosClient';
import {
  clearAccessToken,
  setAccessToken,
} from '../../auth/tokenStore';

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  username: string;
  role: string;
}

interface AuthState {
  username: string | null;
  role: string | null;
  isAuthenticated: boolean;
  initializing: boolean;
  sessionCheckStarted: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  username: null,
  role: null,
  isAuthenticated: false,
  initializing: true,
  sessionCheckStarted: false,
  loading: false,
  error: null,
};

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return 'Invalid username or password.';
    }

    if (error.response) {
      return (
        error.response.data?.message ??
        'The request could not be completed.'
      );
    }

    return 'Cannot connect to the server. Check that the backend is running.';
  }

  return 'An unexpected error occurred.';
}

function applyAuthenticatedUser(
  state: AuthState,
  user: AuthResponse,
): void {
  state.username = user.username;
  state.role = user.role;
  state.isAuthenticated = true;
  state.initializing = false;
  state.loading = false;
  state.error = null;
}

function clearAuthenticatedUser(state: AuthState): void {
  state.username = null;
  state.role = null;
  state.isAuthenticated = false;
  state.initializing = false;
  state.loading = false;
  state.error = null;
}

// Login with username and password.
// The backend sets the HttpOnly refresh-token cookie.
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    clearAccessToken();

    try {
      const response = await axiosClient.post<AuthResponse>(
        '/auth/login',
        credentials,
      );

      setAccessToken(response.data.accessToken);

      return response.data;
    } catch (error: unknown) {
      clearAccessToken();
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// Restore an existing session after a page reload.
export const restoreSession = createAsyncThunk<
  AuthResponse | null,
  void
>(
  'auth/restoreSession',
  async () => {
    try {
      const response = await axiosClient.post<AuthResponse>(
        '/auth/refresh',
      );

      setAccessToken(response.data.accessToken);

      return response.data;
    } catch {
      clearAccessToken();

      // No valid session is a normal outcome on first visit.
      return null;
    }
  },
  {
    // Only start one session restoration check.
    condition: (_, { getState }) => {
      const state = getState() as { auth: AuthState };

      return !state.auth.sessionCheckStarted;
    },
  },
);

// Logout and clear the server-side session.
export const logoutUser = createAsyncThunk<void>(
  'auth/logout',
  async () => {
    try {
      await axiosClient.post('/auth/logout');
    } finally {
      // Clear local credentials even if the server is unavailable.
      clearAccessToken();
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    clearAuthError(state) {
      state.error = null;
    },

    sessionExpired(state) {
      // The sessionEvents handler clears the access token.
      clearAuthenticatedUser(state);
    },
  },

  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        applyAuthenticatedUser(state, action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.username = null;
        state.role = null;
        state.error = action.payload ?? 'Login failed.';
      })

      // SESSION RESTORATION
      .addCase(restoreSession.pending, (state) => {
        state.initializing = true;
        state.sessionCheckStarted = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload) {
          applyAuthenticatedUser(state, action.payload);
        } else {
          clearAuthenticatedUser(state);
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        clearAuthenticatedUser(state);
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        clearAuthenticatedUser(state);
      })
      .addCase(logoutUser.rejected, (state) => {
        // End the local session even if logout fails on the server.
        clearAuthenticatedUser(state);
      });
  },
});

export const {
  clearAuthError,
  sessionExpired,
} = authSlice.actions;

export default authSlice.reducer;
