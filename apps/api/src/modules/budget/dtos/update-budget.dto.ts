import { BudgetPeriod, BudgetScope } from "../types/budget.types";

export interface UpdateBudgetDto {
  scope?: BudgetScope;

  categoryId?: string;

  subcategoryId?: string;

  period?: BudgetPeriod;

  startDate?: Date;

  endDate?: Date;

  budgetAmount?: number;
}