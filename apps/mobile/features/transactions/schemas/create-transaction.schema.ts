import { z } from "zod";

export const createTransactionSchema = z
  .object({
    type: z.enum(["INCOME", "EXPENSE"], {
      message: "Transaction type is required",
    }),

    categoryId: z
      .string()
      .trim()
      .min(1, "Category is required"),

    subcategoryId: z
      .string()
      .optional()
      .or(z.literal("")),

    amount: z
      .number({
        message: "Amount is required",
      })
      .positive("Amount must be greater than 0"),

    /*
     * Currency is fixed to INR for now.
     */
    currency: z.literal("INR"),

    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(100, "Title cannot exceed 100 characters"),

    description: z
      .string()
      .max(
        500,
        "Description cannot exceed 500 characters",
      )
      .optional()
      .or(z.literal("")),

    paymentMethod: z.enum(
      [
        "CASH",
        "CARD",
        "UPI",
        "BANK_TRANSFER",
        "WALLET",
        "CHEQUE",
        "OTHER",
      ],
      {
        message: "Payment method is required",
      },
    ),

    transactionDate: z
      .string()
      .trim()
      .min(1, "Transaction date is required"),

    isRecurring: z.boolean(),

    recurrenceFrequency: z
      .enum([
        "DAILY",
        "WEEKLY",
        "MONTHLY",
        "QUARTERLY",
        "HALF_YEARLY",
        "YEARLY",
      ])
      .optional(),

    recurrenceStartDate: z
      .string()
      .optional()
      .or(z.literal("")),

    recurrenceEndDate: z
      .string()
      .optional()
      .or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    /*
     * =========================================================
     * RECURRING VALIDATION
     * =========================================================
     */

    if (data.isRecurring) {
      if (!data.recurrenceFrequency) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["recurrenceFrequency"],
          message:
            "Frequency is required for recurring transactions",
        });
      }

      if (!data.recurrenceStartDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["recurrenceStartDate"],
          message:
            "Start date is required for recurring transactions",
        });
      }

      /*
       * If both dates exist, end date cannot be
       * earlier than start date.
       */

      if (
        data.recurrenceStartDate &&
        data.recurrenceEndDate &&
        data.recurrenceEndDate <
          data.recurrenceStartDate
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["recurrenceEndDate"],
          message:
            "End date cannot be earlier than start date",
        });
      }
    }
  });

export type CreateTransactionFormValues =
  z.infer<typeof createTransactionSchema>;