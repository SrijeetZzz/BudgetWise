import { useQuery } from "@tanstack/react-query";

import {
  getBudget,
} from "../api/budget.api";

import {
  budgetKeys,
} from "./use-budgets";

export function useBudget(
  budgetId: string,
  enabled = true,
) {
  return useQuery({
    queryKey:
      budgetKeys.detail(
        budgetId,
      ),

    queryFn: () =>
      getBudget(budgetId),

    enabled:
      Boolean(budgetId) &&
      enabled,
  });
}