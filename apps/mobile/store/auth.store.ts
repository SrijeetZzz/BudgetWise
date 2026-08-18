import { create } from "zustand";
import { User } from "../types/auth.types";



interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setLoading: (loading: boolean) => void;

  setUser: (user: User | null) => void;

  setAccessToken: (token: string | null) => void;

  login: (
    user: User,
    accessToken: string,
  ) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthState>((set) => ({
    user: null,

    accessToken: null,

    isAuthenticated: false,

    isLoading: true,

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
      }),
  }));