import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateBudgetRecurrence,
} from "../api/budget.api";

import { budgetKeys } from "./use-budgets";

import type {
  UpdateBudgetRecurrenceInput,
} from "@/types/budget.types";

interface UpdateBudgetRecurrenceVariables {
  budgetId: string;
  payload: UpdateBudgetRecurrenceInput;
}

export function useUpdateBudgetRecurrence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      budgetId,
      payload,
    }: UpdateBudgetRecurrenceVariables) =>
      updateBudgetRecurrence(
        budgetId,
        payload,
      ),

    onSuccess: (budget) => {
      queryClient.invalidateQueries({
        queryKey: budgetKeys.lists(),
      });

      queryClient.setQueryData(
        budgetKeys.detail(budget._id),
        budget,
      );
    },
  });
}