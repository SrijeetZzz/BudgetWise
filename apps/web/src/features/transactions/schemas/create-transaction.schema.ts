import { z } from "zod";

import type {
  PaymentMethod,
  RecurrenceFrequency,
  TransactionType,
} from "@/types/transaction.types";

const transactionTypes = [
  "INCOME",
  "EXPENSE",
] as const satisfies readonly TransactionType[];

const paymentMethods = [
  "CASH",
  "CARD",
  "UPI",
  "BANK_TRANSFER",
  "WALLET",
  "CHEQUE",
  "OTHER",
] as const satisfies readonly PaymentMethod[];

const recurrenceFrequencies = [
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "HALF_YEARLY",
  "YEARLY",
] as const satisfies readonly RecurrenceFrequency[];

export const createTransactionSchema = z
  .object({
    categoryId: z.string().trim().min(1, "Category is required"),

    subcategoryId: z.string().trim().optional(),

    type: z.enum(transactionTypes),

    amount: z.number().positive("Amount must be greater than 0"),

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

    paymentMethod: z.enum(paymentMethods).optional(),

    transactionDate: z.string().min(1, "Transaction date is required"),

    isRecurring: z.boolean(),

    recurrenceFrequency: z.enum(recurrenceFrequencies).optional(),

    recurrenceStartDate: z.string().optional(),

    recurrenceEndDate: z.string().optional(),

    receipt: z.instanceof(File).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isRecurring) {
      return;
    }

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
      new Date(data.recurrenceEndDate) < new Date(data.recurrenceStartDate)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["recurrenceEndDate"],
        message: "Recurrence end date must be after the start date.",
      });
    }
  });

export type CreateTransactionFormValues = z.infer<
  typeof createTransactionSchema
>;
