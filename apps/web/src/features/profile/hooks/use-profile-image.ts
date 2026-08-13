'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { toast } from 'sonner';

import { profileApi } from '../api/profile.api';

export function useProfileImage() {
  const queryClient = useQueryClient();

  const upload = useMutation({
    mutationFn: (file: File) =>
      profileApi.uploadProfileImage(file),

    onSuccess: (response) => {
      queryClient.setQueryData(
        ['profile'],
        response,
      );

      toast.success(
        'Profile image updated successfully',
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          'Failed to upload profile image.',
      );
    },
  });

  const remove = useMutation({
    mutationFn: profileApi.deleteProfileImage,

    onSuccess: (response) => {
      queryClient.setQueryData(
        ['profile'],
        response,
      );

      toast.success(
        'Profile image removed successfully',
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          'Failed to remove profile image.',
      );
    },
  });

  return {
    upload,
    remove,
  };
}