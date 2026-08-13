import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { authApi } from '../api/auth.api';

import { authToken } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth.store';

export function useRegister() {
  const login = useAuthStore(
    (state) => state.login,
  );

  return useMutation({
    mutationKey: ['auth', 'register'],

    mutationFn: authApi.register,

    onSuccess: (response) => {
      const { user, accessToken } = response.data;

      authToken.set(accessToken);

      login(user, accessToken);

      toast.success(response.message);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          'Registration failed.',
      );
    },
  });
}