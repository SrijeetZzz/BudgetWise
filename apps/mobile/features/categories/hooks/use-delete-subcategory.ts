import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { categoryApi } from "../api/category.api";

export function useDeleteSubcategory() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      subcategoryId: string,
    ) =>
      categoryApi.deleteSubcategory(
        subcategoryId,
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