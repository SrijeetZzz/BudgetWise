import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

import type {
  Budget,
  BudgetListResponse,
  BudgetQuery,
  CreateBudgetInput,
  UpdateBudgetInput,
  UpdateBudgetRecurrenceInput,
} from '@/types/budget.types';

export async function getBudgets(
  params?: BudgetQuery,
): Promise<BudgetListResponse> {
  const response = await apiClient.get(
    API_ENDPOINTS.BUDGETS.BASE,
    {
      params,
    },
  );

  return response.data.data;
}

export async function getBudget(
  budgetId: string,
): Promise<Budget> {
  const response = await apiClient.get(
    `${API_ENDPOINTS.BUDGETS.BASE}/${budgetId}`,
  );

  return response.data.data;
}

export async function createBudget(
  payload: CreateBudgetInput,
): Promise<Budget> {
  const response = await apiClient.post(
    API_ENDPOINTS.BUDGETS.BASE,
    payload,
  );

  return response.data.data;
}

export async function updateBudget(
  budgetId: string,
  payload: UpdateBudgetInput,
): Promise<Budget> {
  const response = await apiClient.patch(
    `${API_ENDPOINTS.BUDGETS.BASE}/${budgetId}`,
    payload,
  );

  return response.data.data;
}

export async function deleteBudget(
  budgetId: string,
): Promise<void> {
  await apiClient.delete(
    `${API_ENDPOINTS.BUDGETS.BASE}/${budgetId}`,
  );
}

export async function updateBudgetRecurrence(
  budgetId: string,
  payload: UpdateBudgetRecurrenceInput,
): Promise<Budget> {
  const response = await apiClient.patch(
    `${API_ENDPOINTS.BUDGETS.BASE}/${budgetId}/recurrence`,
    payload,
  );

  return response.data.data;
}