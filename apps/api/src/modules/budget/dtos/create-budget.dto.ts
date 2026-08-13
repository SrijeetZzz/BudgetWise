import { BudgetPeriod, BudgetScope } from "../types/budget.types";

export interface CreateBudgetDto {
  scope: BudgetScope;

  categoryId?: string;

  subcategoryId?: string;

  period: BudgetPeriod;

  startDate: Date;

  endDate: Date;

  budgetAmount: number;

  recurrence?: {
    enabled: boolean;

    /**
     * Amount to use for future generated budgets.
     * Defaults to the current budgetAmount if not supplied.
     */
    budgetAmount?: number;

    /**
     * Optional date at which recurrence should stop.
     */
    endDate?: Date;
  };
}