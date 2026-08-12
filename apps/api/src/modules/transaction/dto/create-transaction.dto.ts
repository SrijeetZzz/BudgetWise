import { Types } from "mongoose";

import { PaymentMethod } from "../../../common/enums/payment-method.enum";
import { TransactionType } from "../../../common/enums/transaction-type.enum";
import { RecurrenceFrequency } from "../../../common/enums/recurrence-frequency.enum";

export interface CreateTransactionDto {
  categoryId: string;

  subcategoryId?: string;

  type: TransactionType;

  amount: number;

  currency: string;

  title: string;

  description?: string;

  paymentMethod?: PaymentMethod;

  transactionDate: Date;

  // Recurring Transaction
  isRecurring?: boolean;

  recurrenceFrequency?: RecurrenceFrequency;

  recurrenceStartDate?: Date;

  recurrenceEndDate?: Date;
}
