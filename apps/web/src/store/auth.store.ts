import { create } from 'zustand';

import type { User } from '@/types/auth.types';

interface PendingGoogleRegistration {
  idToken: string;
  email: string;
  displayName: string;
  picture?: string;
}

interface AuthState {
  user: User | null;

  accessToken: string | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  pendingGoogleRegistration:
    | PendingGoogleRegistration
    | null;

  setLoading: (loading: boolean) => void;

  setUser: (user: User | null) => void;

  setAccessToken: (token: string | null) => void;

  login: (user: User, token: string) => void;

  logout: () => void;

  setPendingGoogleRegistration: (
    data: PendingGoogleRegistration | null,
  ) => void;

  clearPendingGoogleRegistration: () => void;
}

export const useAuthStore = create<AuthState>(
  (set) => ({
    user: null,

    accessToken: null,

    isAuthenticated: false,

    isLoading: true,

    pendingGoogleRegistration: null,

    setLoading: (loading) =>
      set({
        isLoading: loading,
      }),

    setUser: (user) =>
      set({
        user,
        isAuthenticated: !!user,
      }),

    setAccessToken: (accessToken) =>
      set({
        accessToken,
      }),

    login: (user, accessToken) =>
      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      }),

    logout: () =>
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        pendingGoogleRegistration: null,
      }),

    setPendingGoogleRegistration: (data) =>
      set({
        pendingGoogleRegistration: data,
      }),

    clearPendingGoogleRegistration: () =>
      set({
        pendingGoogleRegistration: null,
      }),
  }),
);