import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

import type { ApiResponse } from '@/types/api.types';

import type {
  Category,
  CategoryQuery,
  CreateCategoryRequest,
  CreateSubcategoryRequest,
  UpdateCategoryRequest,
  UpdateSubcategoryRequest,
} from '@/types/category.types';

export const categoryApi = {
  // ----------------------------------------
  // Categories
  // ----------------------------------------

  getCategories: async (
    params?: CategoryQuery,
  ) => {
    const { data } =
      await apiClient.get<ApiResponse<Category[]>>(
        API_ENDPOINTS.CATEGORIES.BASE,
        {
          params,
        },
      );

    return data;
  },

  getCategoryById: async (
    categoryId: string,
  ) => {
    const { data } =
      await apiClient.get<ApiResponse<Category>>(
        `${API_ENDPOINTS.CATEGORIES.BASE}/${categoryId}`,
      );

    return data;
  },

  createCategory: async (
    payload: CreateCategoryRequest,
  ) => {
    const { data } =
      await apiClient.post<ApiResponse<Category>>(
        API_ENDPOINTS.CATEGORIES.BASE,
        payload,
      );

    return data;
  },

  updateCategory: async (
    categoryId: string,
    payload: UpdateCategoryRequest,
  ) => {
    const { data } =
      await apiClient.patch<ApiResponse<Category>>(
        `${API_ENDPOINTS.CATEGORIES.BASE}/${categoryId}`,
        payload,
      );

    return data;
  },

  deleteCategory: async (
    categoryId: string,
  ) => {
    const { data } =
      await apiClient.delete<ApiResponse<null>>(
        `${API_ENDPOINTS.CATEGORIES.BASE}/${categoryId}`,
      );

    return data;
  },

  // ----------------------------------------
  // Subcategories
  // ----------------------------------------

  getSubcategories: async () => {
    const { data } =
      await apiClient.get<ApiResponse<Category[]>>(
        API_ENDPOINTS.CATEGORIES.SUBCATEGORIES,
      );

    return data;
  },

  createSubcategory: async (
    payload: CreateSubcategoryRequest,
  ) => {
    const { data } =
      await apiClient.post<ApiResponse<Category>>(
        API_ENDPOINTS.CATEGORIES.SUBCATEGORIES,
        payload,
      );

    return data;
  },

  updateSubcategory: async (
    subcategoryId: string,
    payload: UpdateSubcategoryRequest,
  ) => {
    const { data } =
      await apiClient.patch<ApiResponse<Category>>(
        `${API_ENDPOINTS.CATEGORIES.SUBCATEGORIES}/${subcategoryId}`,
        payload,
      );

    return data;
  },

  deleteSubcategory: async (
    subcategoryId: string,
  ) => {
    const { data } =
      await apiClient.delete<ApiResponse<null>>(
        `${API_ENDPOINTS.CATEGORIES.SUBCATEGORIES}/${subcategoryId}`,
      );

    return data;
  },
};