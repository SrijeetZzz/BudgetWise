'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { toast } from 'sonner';

import { categoryApi } from '../api/category.api';

export function useUpdateSubcategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subcategoryId,
      payload,
    }: {
      subcategoryId: string;
      payload: {
        name?: string;
        icon?: string;
        color?: string;
      };
    }) =>
      categoryApi.updateSubcategory(
        subcategoryId,
        payload,
      ),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      });

      queryClient.invalidateQueries({
        queryKey: [
          'categories',
          'subcategories',
        ],
      });

      toast.success(
        response.message ||
          'Subcategory updated successfully',
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Unable to update subcategory.',
      );
    },
  });
}