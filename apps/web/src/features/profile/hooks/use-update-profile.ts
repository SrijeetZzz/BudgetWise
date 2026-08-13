'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { profileApi } from '../api/profile.api';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['profile', 'update'],

    mutationFn: profileApi.updateProfile,

    onSuccess: (response) => {
      queryClient.setQueryData(
        ['profile'],
        response,
      );

      toast.success(response.message);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          'Unable to update profile.',
      );
    },
  });
}