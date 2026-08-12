import { z } from "zod";

import { PaymentMethod } from "../../../common/enums/payment-method.enum";
import { RecurrenceFrequency } from "../../../common/enums/recurrence-frequency.enum";
import { RecurrenceStatus } from "../../../common/enums/recurrence-status.enum";
import { TransactionType } from "../../../common/enums/transaction-type.enum";

export const updateRecurringTransactionSchema = z.object({
    categoryId: z.string().trim().optional(),

    subcategoryId: z.string().trim().optional(),

    type: z.nativeEnum(TransactionType).optional(),

    amount: z.number().positive().optional(),

    currency: z
        .string()
        .trim()
        .length(3)
        .transform((value) => value.toUpperCase())
        .optional(),

    title: z.string().trim().min(1).max(100).optional(),

    description: z
        .string()
        .trim()
        .max(500)
        .optional(),

    paymentMethod: z.nativeEnum(PaymentMethod).optional(),

    transactionDate: z.coerce.date().optional(),

    recurrenceFrequency: z.nativeEnum(RecurrenceFrequency).optional(),

    recurrenceStartDate: z.coerce.date().optional(),

    recurrenceEndDate: z.coerce.date().optional(),

    recurrenceStatus: z.nativeEnum(RecurrenceStatus).optional(),
});

export type UpdateRecurringTransactionValidator = z.infer<
    typeof updateRecurringTransactionSchema
>;