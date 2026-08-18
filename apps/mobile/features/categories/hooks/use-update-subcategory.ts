import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { categoryApi } from "../api/category.api";

interface UpdateSubcategoryVariables {
  subcategoryId: string;

  payload: {
    name?: string;
    icon?: string;
    color?: string;
  };
}

export function useUpdateSubcategory() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      subcategoryId,
      payload,
    }: UpdateSubcategoryVariables) =>
      categoryApi.updateSubcategory(
        subcategoryId,
        payload,
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