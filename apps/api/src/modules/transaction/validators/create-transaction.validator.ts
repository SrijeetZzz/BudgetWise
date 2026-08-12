import { z } from "zod";

import { PaymentMethod } from "../../../common/enums/payment-method.enum";
import { RecurrenceFrequency } from "../../../common/enums/recurrence-frequency.enum";
import { TransactionType } from "../../../common/enums/transaction-type.enum";

export const createTransactionSchema = z
  .object({
    categoryId: z.string().trim().min(1, "Category is required"),

    subcategoryId: z.string().trim().optional(),

    type: z.nativeEnum(TransactionType),

    amount: z.coerce.number().positive("Amount must be greater than 0"),

    currency: z
      .string()
      .trim()
      .length(3, "Currency must be a 3-letter code")
      .transform((value) => value.toUpperCase()),

    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(100, "Title cannot exceed 100 characters"),

    description: z
      .string()
      .trim()
      .max(500, "Description cannot exceed 500 characters")
      .optional(),

    paymentMethod: z.nativeEnum(PaymentMethod).optional(),

    transactionDate: z.coerce.date(),

    // Recurring Transaction
    isRecurring: z
      .enum(["true", "false"])
      .optional()
      .transform((value) => value === "true"),

    recurrenceFrequency: z.nativeEnum(RecurrenceFrequency).optional(),

    recurrenceStartDate: z.coerce.date().optional(),

    recurrenceEndDate: z.coerce.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isRecurring) {
      if (!data.recurrenceFrequency) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["recurrenceFrequency"],
          message: "Recurrence frequency is required.",
        });
      }

      if (!data.recurrenceStartDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["recurrenceStartDate"],
          message: "Recurrence start date is required.",
        });
      }

      if (
        data.recurrenceStartDate &&
        data.recurrenceEndDate &&
        data.recurrenceEndDate < data.recurrenceStartDate
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["recurrenceEndDate"],
          message: "Recurrence end date must be after the start date.",
        });
      }
    }
  });

export type CreateTransactionValidator = z.infer<
  typeof createTransactionSchema
>;
