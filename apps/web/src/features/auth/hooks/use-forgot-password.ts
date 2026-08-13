import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

import { authApi } from '../api/auth.api';

export function useForgotPassword() {
  const router = useRouter();

  return useMutation({
    mutationKey: ['auth', 'forgot-password'],

    mutationFn: authApi.forgotPassword,

    onSuccess: (response, variables) => {
      toast.success(response.message);

      router.push(
        `/reset-password?email=${encodeURIComponent(
          variables.email,
        )}`,
      );
    },

    onError: (
      error: AxiosError<{ message: string }>,
    ) => {
      toast.error(
        error.response?.data?.message ??
          'Unable to process your request.',
      );
    },
  });
}