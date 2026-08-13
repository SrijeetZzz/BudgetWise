'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { toast } from 'sonner';

import { categoryApi } from '../api/category.api';

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      payload,
    }: {
      categoryId: string;
      payload: {
        name?: string;
        icon?: string;
        color?: string;
      };
    }) =>
      categoryApi.updateCategory(
        categoryId,
        payload,
      ),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      });

      toast.success(
        response.message ||
          'Category updated successfully',
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Unable to update category.',
      );
    },
  });
}