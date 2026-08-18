import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createBudget,
} from "../api/budget.api";

import {
  budgetKeys,
} from "./use-budgets";

import type {
  CreateBudgetInput,
} from "../../../types/budget.types";

export function useCreateBudget() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateBudgetInput,
    ) =>
      createBudget(
        payload,
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