import { Schema, model } from "mongoose";

import {
  IBudgetDocument,
  IBudgetModel,
  IBudgetRecurrence,
} from "../interfaces/budget.interface";

import {
  BudgetPeriod,
  BudgetRecurrenceStatus,
  BudgetScope,
  BudgetStatus,
} from "../types/budget.types";

/**
 * Embedded recurrence configuration.
 *
 * This is stored inside the Budget document.
 * It is NOT a separate MongoDB collection.
 */
const budgetRecurrenceSchema = new Schema<IBudgetRecurrence>(
  {
    enabled: {
      type: Boolean,
      required: true,
      default: false,
    },

    /**
     * Amount to use when generating future budget periods.
     *
     * This is intentionally separate from the current
     * budgetAmount so the user can modify the current
     * period without changing future recurring periods.
     */
    budgetAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    /**
     * Date when the scheduler should generate
     * the next budget period.
     */
    nextGenerationDate: {
      type: Date,
      default: null,
    },

    /**
     * Optional date after which recurrence stops.
     */
    endDate: {
      type: Date,
      default: null,
    },

    /**
     * Status of the recurring budget series.
     */
    status: {
      type: String,
      enum: Object.values(BudgetRecurrenceStatus),
      default: BudgetRecurrenceStatus.ACTIVE,
    },

    /**
     * Original budget that started this recurring series.
     *
     * Generated budget instances can use this to
     * identify the recurring budget series.
     */
    rootBudgetId: {
      type: Schema.Types.ObjectId,
      ref: "Budget",
      default: null,
    },
  },
  {
    _id: false,
  },
);

const budgetSchema = new Schema<IBudgetDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    scope: {
      type: String,
      enum: Object.values(BudgetScope),
      required: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    subcategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    period: {
      type: String,
      enum: Object.values(BudgetPeriod),
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    budgetAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    spentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    remainingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    utilization: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(BudgetStatus),
      default: BudgetStatus.ACTIVE,
    },

    /**
     * Recurrence configuration.
     *
     * One-time budgets do not have this field.
     *
     * Recurring budgets contain the configuration
     * required by the scheduler.
     */
    recurrence: {
      type: budgetRecurrenceSchema,
      default: undefined,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    /**
     * Highest notification threshold already triggered.
     *
     * Example:
     * 50 → 75 → 90 → 100
     */
    lastAlertThreshold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * Existing budget lookup index.
 *
 * Used for identifying budgets by:
 * user + scope + category/subcategory + period.
 */
budgetSchema.index({
  userId: 1,
  scope: 1,
  categoryId: 1,
  subcategoryId: 1,
  startDate: 1,
  endDate: 1,
  isDeleted: 1,
});

/**
 * Scheduler index.
 *
 * Allows the scheduler to efficiently find recurring
 * budget sources whose next generation date has arrived.
 */
budgetSchema.index({
  "recurrence.enabled": 1,
  "recurrence.status": 1,
  "recurrence.nextGenerationDate": 1,
  isDeleted: 1,
});

export const Budget = model<IBudgetDocument, IBudgetModel>(
  "Budget",
  budgetSchema,
);