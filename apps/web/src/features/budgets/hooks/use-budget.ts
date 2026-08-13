import { useQuery } from '@tanstack/react-query';

import {
  budgetKeys,
} from './use-budgets';
import { getBudget } from '../api/budget.api';



export function useBudget(
  budgetId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: budgetKeys.detail(budgetId),
    queryFn: () => getBudget(budgetId),
    enabled: Boolean(budgetId) && enabled,
  });
}