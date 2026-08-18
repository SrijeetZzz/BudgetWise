import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteBudget,
} from "../api/budget.api";

import {
  budgetKeys,
} from "./use-budgets";

export function useDeleteBudget() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      budgetId: string,
    ) =>
      deleteBudget(
        budgetId,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries(
        {
          queryKey:
            budgetKeys.lists(),
        },
      );
    },
  });
}