'use client';

import { useQuery } from '@tanstack/react-query';

import { categoryApi } from '../api/category.api';

export function useCategory(
  categoryId: string,
) {
  return useQuery({
    queryKey: ['categories', categoryId],
    queryFn: () =>
      categoryApi.getCategoryById(categoryId),
    enabled: !!categoryId,
  });
}