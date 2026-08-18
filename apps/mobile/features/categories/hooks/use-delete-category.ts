import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { categoryApi } from "../api/category.api";

export function useDeleteCategory() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      categoryId: string,
    ) =>
      categoryApi.deleteCategory(
        categoryId,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "categories",
          "subcategories",
        ],
      });
    },
  });
}