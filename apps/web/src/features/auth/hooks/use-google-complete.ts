'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { authApi } from '../api/auth.api';

import { authToken } from '@/lib/api/auth';
import { getDeviceId } from '@/lib/device';
import { useAuthStore } from '@/store/auth.store';

export function useGoogleComplete() {
  const router = useRouter();

  const login = useAuthStore(
    (state) => state.login,
  );

  const pendingGoogleRegistration =
    useAuthStore(
      (state) => state.pendingGoogleRegistration,
    );

  const clearPendingGoogleRegistration =
    useAuthStore(
      (state) =>
        state.clearPendingGoogleRegistration,
    );

  return useMutation({
    mutationKey: ['auth', 'google-complete'],

    mutationFn: async ({
      phone,
      otp,
    }: {
      phone: string;
      otp: string;
    }) => {
      if (!pendingGoogleRegistration) {
        throw new Error(
          'Google registration session has expired.',
        );
      }

      return authApi.googleComplete({
        idToken:
          pendingGoogleRegistration.idToken,
        phone,
        otp,
        deviceId: getDeviceId(),
      });
    },

    onSuccess: (response) => {
      const { user, accessToken } =
        response.data;

      authToken.set(accessToken);

      login(user, accessToken);

      clearPendingGoogleRegistration();

      toast.success(response.message);

      router.replace('/dashboard');
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          'Unable to complete Google registration.',
      );
    },
  });
}