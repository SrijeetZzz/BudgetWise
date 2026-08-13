'use client';

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { toast } from 'sonner';

import { categoryApi } from '../api/category.api';

export function useDeleteSubcategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subcategoryId: string) =>
      categoryApi.deleteSubcategory(
        subcategoryId,
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
          'Subcategory deleted successfully',
      );
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Unable to delete subcategory.',
      );
    },
  });
}