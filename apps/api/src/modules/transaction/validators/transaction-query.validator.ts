import { z } from "zod";

import { PaymentMethod } from "../../../common/enums/payment-method.enum";
import { TransactionType } from "../../../common/enums/transaction-type.enum";

export const transactionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),

  limit: z.coerce.number().int().min(1).max(100).optional(),

  search: z.string().trim().optional(),

  type: z.nativeEnum(TransactionType).optional(),

  categoryId: z.string().optional(),

  subcategoryId: z.string().optional(),

  paymentMethod: z.nativeEnum(PaymentMethod).optional(),

  startDate: z.string().optional(),

  endDate: z.string().optional(),

  minAmount: z.coerce.number().optional(),

  maxAmount: z.coerce.number().optional(),

  sortBy: z
    .enum(["transactionDate", "amount", "title"])
    .optional(),

  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export type TransactionQuery = z.infer<typeof transactionQuerySchema>;