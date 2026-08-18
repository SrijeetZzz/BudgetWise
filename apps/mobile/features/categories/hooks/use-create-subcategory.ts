import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { categoryApi } from "../api/category.api";

export function useCreateSubcategory() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      categoryApi.createSubcategory,

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