import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { categoryApi } from "../api/category.api";

export function useCreateCategory() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      categoryApi.createCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
}