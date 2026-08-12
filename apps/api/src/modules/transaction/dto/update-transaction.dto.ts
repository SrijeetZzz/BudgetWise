import { Types } from "mongoose";

import { PaymentMethod } from "../../../common/enums/payment-method.enum";
import { TransactionType } from "../../../common/enums/transaction-type.enum";

export interface UpdateTransactionDto {
    categoryId?: string;

    subcategoryId?: string;

    type?: TransactionType;

    amount?: number;

    currency?: string;

    title?: string;

    description?: string;

    paymentMethod?: PaymentMethod;

    transactionDate?: Date;
}