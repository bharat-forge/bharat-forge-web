import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'dealer' | 'user';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Safely access localStorage (Next.js server-side rendering safeguard)
const getUserFromStorage = () => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('bharat_user');
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

const getTokenFromStorage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('bharat_token');
  }
  return null;
};

const initialState: AuthState = {
  user: getUserFromStorage(),
  token: getTokenFromStorage(),
  isAuthenticated: !!getTokenFromStorage(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('bharat_user', JSON.stringify(action.payload.user));
        localStorage.setItem('bharat_token', action.payload.token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('bharat_user');
        localStorage.removeItem('bharat_token');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;