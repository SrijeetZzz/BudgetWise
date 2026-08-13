import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { authApi } from '../api/auth.api';

import { authToken } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth.store';

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationKey: ['auth', 'logout'],

    mutationFn: authApi.logout,

    onSuccess: async (response) => {
      authToken.clear();

      logout();

      await queryClient.clear();

      toast.success(response.message);

      router.replace('/login');
    },

    onError: () => {
      toast.error('Unable to logout.');
    },
  });
}