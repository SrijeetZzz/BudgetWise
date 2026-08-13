'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { toast } from 'sonner';

import { profileApi } from '../api/profile.api';

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['profile', 'settings', 'update'],

    mutationFn: profileApi.updateSettings,

    onSuccess: (response) => {
      queryClient.setQueryData(
        ['profile', 'settings'],
        response,
      );

      toast.success(
        response.message ||
          'Settings updated successfully',
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Unable to update settings.',
      );
    },
  });
}