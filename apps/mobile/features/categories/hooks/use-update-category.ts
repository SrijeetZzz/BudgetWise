import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { categoryApi } from "../api/category.api";

interface UpdateCategoryVariables {
  categoryId: string;

  payload: {
    name?: string;
    icon?: string;
    color?: string;
  };
}

export function useUpdateCategory() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      payload,
    }: UpdateCategoryVariables) =>
      categoryApi.updateCategory(
        categoryId,
        payload,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
}