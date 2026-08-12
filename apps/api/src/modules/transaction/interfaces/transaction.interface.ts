import { HydratedDocument, Model, Types } from "mongoose";

import { IAttachment } from "./attachment.interface";

import { PaymentMethod } from "../../../common/enums/payment-method.enum";
import { RecurrenceFrequency } from "../../../common/enums/recurrence-frequency.enum";
import { RecurrenceStatus } from "../../../common/enums/recurrence-status.enum";
import { TransactionSource } from "../../../common/enums/transaction-source.enum";
import { TransactionType } from "../../../common/enums/transaction-type.enum";

export interface ITransaction {
    userId: Types.ObjectId;

    categoryId: Types.ObjectId;

    subcategoryId?: Types.ObjectId;

    type: TransactionType;

    amount: number;

    currency: string;

    title: string;

    description?: string;

    paymentMethod?: PaymentMethod;

    transactionDate: Date;

    attachments: IAttachment[];

    transactionSource: TransactionSource;

    recurrenceFrequency?: RecurrenceFrequency;

    recurrenceStartDate?: Date;

    recurrenceEndDate?: Date;

    nextExecutionDate?: Date;

    recurrenceStatus?: RecurrenceStatus;

    lastExecutedAt?: Date;

    parentRecurringId?: Types.ObjectId;

    isGenerated: boolean;

    isDeleted: boolean;

    createdAt: Date;

    updatedAt: Date;
}

export type TransactionDocument = HydratedDocument<ITransaction>;

export interface TransactionModel extends Model<ITransaction> {}