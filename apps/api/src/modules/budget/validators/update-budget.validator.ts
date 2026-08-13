import { z } from "zod";

import {
  BudgetPeriod,
  BudgetScope,
} from "../types/budget.types";

export const updateBudgetSchema = z
  .object({
    scope: z
      .nativeEnum(BudgetScope)
      .optional(),

    categoryId: z
      .string()
      .trim()
      .optional(),

    subcategoryId: z
      .string()
      .trim()
      .optional(),

    period: z
      .nativeEnum(BudgetPeriod)
      .optional(),

    startDate: z
      .coerce
      .date()
      .optional(),

    endDate: z
      .coerce
      .date()
      .optional(),

    budgetAmount: z
      .coerce
      .number()
      .positive("Budget amount must be greater than 0")
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Validate dates when both are provided.
    if (
      data.startDate &&
      data.endDate &&
      data.endDate < data.startDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message:
          "End date must be after start date.",
      });
    }

    // CUSTOM is allowed for an individual budget.
    // Recurrence restrictions are handled separately
    // when recurrence configuration is updated.
  });

export type UpdateBudgetValidator = z.infer<
  typeof updateBudgetSchema
>;