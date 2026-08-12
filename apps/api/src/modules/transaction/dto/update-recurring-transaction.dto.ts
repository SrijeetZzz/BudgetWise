import { Types } from "mongoose";

import { PaymentMethod } from "../../../common/enums/payment-method.enum";
import { RecurrenceFrequency } from "../../../common/enums/recurrence-frequency.enum";
import { RecurrenceStatus } from "../../../common/enums/recurrence-status.enum";
import { TransactionType } from "../../../common/enums/transaction-type.enum";

export interface UpdateRecurringTransactionDto {
    categoryId?: string;

    subcategoryId?: string;

    type?: TransactionType;

    amount?: number;

    currency?: string;

    title?: string;

    description?: string;

    paymentMethod?: PaymentMethod;

    transactionDate?: Date;

    recurrenceFrequency?: RecurrenceFrequency;

    recurrenceStartDate?: Date;

    recurrenceEndDate?: Date;

    recurrenceStatus?: RecurrenceStatus;
}