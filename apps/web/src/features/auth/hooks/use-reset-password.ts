import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { authApi } from '../api/auth.api';

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationKey: ['auth', 'reset-password'],

    mutationFn: authApi.resetPassword,

    onSuccess: (response) => {
      toast.success(response.message);

      router.replace('/login');
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          'Unable to reset password. Please try again.',
      );
    },
  });
}