'use client';

import { useEffect } from 'react';

import { authApi } from '../api/auth.api';

import { authToken } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth.store';

export function useRestoreSession() {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const setLoading = useAuthStore(
    (state) => state.setLoading,
  );

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const refresh = await authApi.refresh();

        const { accessToken } = refresh.data;

        authToken.set(accessToken);

        const user = await authApi.me();

        login(user, accessToken);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [login, logout, setLoading]);
}