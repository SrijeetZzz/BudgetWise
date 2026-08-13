import { z } from "zod";

export const updateBudgetRecurrenceSchema = z.object({
  enabled: z.boolean().optional(),

  budgetAmount: z.coerce
    .number()
    .positive("Budget amount must be greater than 0.")
    .optional(),

  endDate: z.coerce
    .date()
    .nullable()
    .optional(),
});

export type UpdateBudgetRecurrenceValidator = z.infer<
  typeof updateBudgetRecurrenceSchema
>;