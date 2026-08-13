'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { toast } from 'sonner';

import { categoryApi } from '../api/category.api';

export function useCreateSubcategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:
      categoryApi.createSubcategory,

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
          'Subcategory created successfully',
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Unable to create subcategory.',
      );
    },
  });
}