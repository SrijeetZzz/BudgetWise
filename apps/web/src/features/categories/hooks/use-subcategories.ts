'use client';

import { useQuery } from '@tanstack/react-query';

import { categoryApi } from '../api/category.api';

export function useSubcategories() {
  return useQuery({
    queryKey: ['categories', 'subcategories'],
    queryFn: categoryApi.getSubcategories,
  });
}