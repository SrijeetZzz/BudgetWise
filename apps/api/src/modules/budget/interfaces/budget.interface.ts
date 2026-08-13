import { Document, Model, Types } from "mongoose";

import {
  BudgetPeriod,
  BudgetRecurrenceStatus,
  BudgetScope,
  BudgetStatus,
} from "../types/budget.types";

export interface IBudgetRecurrence {
  enabled: boolean;

  /**
   * Budget amount to use for future generated periods.
   */
  budgetAmount: number;

  /**
   * Date when the scheduler should generate
   * the next budget period.
   */
  nextGenerationDate?: Date | null;

  /**
   * Optional date after which recurrence should stop.
   */
  endDate?: Date;

  /**
   * Status of the recurring budget series.
   */
  status: BudgetRecurrenceStatus;

  /**
   * ID of the original budget that started
   * the recurring budget series.
   */
  rootBudgetId?: Types.ObjectId;
}

export interface IBudget {
  userId: Types.ObjectId;

  scope: BudgetScope;

  categoryId?: Types.ObjectId;

  subcategoryId?: Types.ObjectId;

  period: BudgetPeriod;

  startDate: Date;

  endDate: Date;

  budgetAmount: number;

  spentAmount: number;

  remainingAmount: number;

  utilization: number;

  status: BudgetStatus;

  /**
   * Recurrence configuration.
   *
   * Undefined for one-time budgets.
   */
  recurrence?: IBudgetRecurrence;

  isDeleted: boolean;

  createdAt: Date;

  updatedAt: Date;

  lastAlertThreshold: number;
}

export interface IBudgetDocument extends IBudget, Document {}

export interface IBudgetModel extends Model<IBudgetDocument> {}