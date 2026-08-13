import { useQuery } from '@tanstack/react-query';
import { getBudgets } from '../api/budget.api';
import type { BudgetQuery } from '@/types/budget.types';

export const budgetKeys = {
  all: ['budgets'] as const,

  lists: () => [...budgetKeys.all, 'list'] as const,

  list: (query: BudgetQuery) =>
    [...budgetKeys.lists(), query] as const,

  detail: (budgetId: string) =>
    [...budgetKeys.all, 'detail', budgetId] as const,
};

export function useBudgets(query: BudgetQuery = {}) {
  return useQuery({
    queryKey: budgetKeys.list(query),
    queryFn: () => getBudgets(query),
  });
}