import { useQuery } from "@tanstack/react-query";

import { categoryApi } from "../api/category.api";
import { CategoryQuery } from "../../../types/category.types";



export function useCategories(
  params?: CategoryQuery,
) {
  return useQuery({
    queryKey: ["categories", params],

    queryFn: () =>
      categoryApi.getCategories(params),
  });
}