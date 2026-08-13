import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { authApi } from '../api/auth.api';

export function useSendOtp() {
  return useMutation({
    mutationKey: ['auth', 'send-otp'],

    mutationFn: authApi.sendOtp,

    onSuccess: (response) => {
      toast.success(response.message);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          'Unable to send OTP.',
      );
    },
  });
}