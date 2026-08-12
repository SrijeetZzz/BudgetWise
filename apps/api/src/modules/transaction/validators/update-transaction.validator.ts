import { z } from "zod";

import { PaymentMethod } from "../../../common/enums/payment-method.enum";
import { TransactionType } from "../../../common/enums/transaction-type.enum";

export const updateTransactionSchema = z.object({
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

    title: z
        .string()
        .trim()
        .min(1)
        .max(100)
        .optional(),

    description: z
        .string()
        .trim()
        .max(500)
        .optional(),

    paymentMethod: z.nativeEnum(PaymentMethod).optional(),

    transactionDate: z.coerce.date().optional(),
});

export type UpdateTransactionValidator = z.infer<
    typeof updateTransactionSchema
>;