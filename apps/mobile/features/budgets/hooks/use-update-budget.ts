import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateBudget,
} from "../api/budget.api";

import {
  budgetKeys,
} from "./use-budgets";

import type {
  UpdateBudgetInput,
} from "../../../types/budget.types";

interface UpdateBudgetVariables {
  budgetId: string;

  payload: UpdateBudgetInput;
}

export function useUpdateBudget() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      budgetId,
      payload,
    }: UpdateBudgetVariables) =>
      updateBudget(
        budgetId,
        payload,
      ),

    onSuccess: (
      budget,
    ) => {
      queryClient.invalidateQueries(
        {
          queryKey:
            budgetKeys.lists(),
        },
      );

      queryClient.setQueryData(
        budgetKeys.detail(
          budget._id,
        ),
        budget,
      );
    },
  });
}