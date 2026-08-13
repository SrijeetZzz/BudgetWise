'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { toast } from 'sonner';

import { categoryApi } from '../api/category.api';

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.createCategory,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      });

      toast.success(
        response.message ||
          'Category created successfully',
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Unable to create category.',
      );
    },
  });
}