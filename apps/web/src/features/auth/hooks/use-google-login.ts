'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { authApi } from '../api/auth.api';

import { authToken } from '@/lib/api/auth';
import { getDeviceId } from '@/lib/device';
import { useAuthStore } from '@/store/auth.store';

export function useGoogleLogin() {
  const router = useRouter();

  const login = useAuthStore(
    (state) => state.login,
  );

  const setPendingGoogleRegistration =
    useAuthStore(
      (state) =>
        state.setPendingGoogleRegistration,
    );

  return useMutation({
    mutationKey: ['auth', 'google-login'],

    mutationFn: async (idToken: string) => {
      return authApi.googleLogin({
        idToken,
        deviceId: getDeviceId(),
      });
    },

    onSuccess: (response, idToken) => {
      const data = response.data;

      // Existing Google account
      if (
        'user' in data &&
        'accessToken' in data
      ) {
        authToken.set(data.accessToken);

        login(
          data.user,
          data.accessToken,
        );

        toast.success(response.message);

        router.replace('/dashboard');

        return;
      }

      // New Google account
      if (
        'requiresPhoneVerification' in data &&
        data.requiresPhoneVerification
      ) {
        setPendingGoogleRegistration({
          idToken,
          email: data.email,
          displayName: data.displayName,
          picture: data.picture,
        });

        router.push('/google-complete');

        return;
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          'Google login failed. Please try again.',
      );
    },
  });
}