import { z } from "zod";

import {
  BudgetPeriod,
  BudgetScope,
} from "../types/budget.types";

export const createBudgetSchema = z
  .object({
    scope: z.nativeEnum(BudgetScope),

    categoryId: z
      .string()
      .trim()
      .optional(),

    subcategoryId: z
      .string()
      .trim()
      .optional(),

    period: z.nativeEnum(BudgetPeriod),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),

    budgetAmount: z.coerce
      .number()
      .positive("Budget amount must be greater than 0"),

    /**
     * Optional recurrence configuration.
     *
     * If omitted → one-time budget.
     *
     * If enabled → scheduler will generate
     * future budget periods.
     */
    recurrence: z
      .object({
        enabled: z.boolean(),

        /**
         * Amount to use for future generated budgets.
         *
         * If omitted, backend will use budgetAmount.
         */
        budgetAmount: z.coerce
          .number()
          .positive(
            "Recurring budget amount must be greater than 0",
          )
          .optional(),

        /**
         * Optional date after which recurrence stops.
         */
        endDate: z.coerce.date().optional(),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    // -----------------------------------------
    // Category validation
    // -----------------------------------------

    if (
      data.scope === BudgetScope.CATEGORY &&
      !data.categoryId
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["categoryId"],
        message:
          "Category is required for CATEGORY budget.",
      });
    }

    // -----------------------------------------
    // Subcategory validation
    // -----------------------------------------

    if (data.scope === BudgetScope.SUBCATEGORY) {
      if (!data.categoryId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["categoryId"],
          message:
            "Category is required for SUBCATEGORY budget.",
        });
      }

      if (!data.subcategoryId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["subcategoryId"],
          message:
            "Subcategory is required for SUBCATEGORY budget.",
        });
      }
    }

    // -----------------------------------------
    // Budget date validation
    // -----------------------------------------

    if (data.endDate < data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message:
          "End date must be after start date.",
      });
    }

    // -----------------------------------------
    // Recurrence validation
    // -----------------------------------------

    if (data.recurrence?.enabled) {
      /**
       * CUSTOM budgets cannot currently be recurring.
       *
       * WEEKLY, MONTHLY and YEARLY are supported.
       */
      if (data.period === BudgetPeriod.CUSTOM) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["period"],
          message:
            "Recurring budgets are not supported for CUSTOM periods.",
        });
      }

      /**
       * Recurrence end date must not be before
       * the current budget period.
       */
      if (
        data.recurrence.endDate &&
        data.recurrence.endDate < data.endDate
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["recurrence", "endDate"],
          message:
            "Recurrence end date must be after the current budget period.",
        });
      }
    }
  });

export type CreateBudgetValidator = z.infer<
  typeof createBudgetSchema
>;