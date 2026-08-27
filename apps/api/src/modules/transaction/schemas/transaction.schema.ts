import { Schema, model } from "mongoose";

import {
  TransactionDocument,
  TransactionModel,
} from "../interfaces/transaction.interface";

import { PaymentMethod } from "../../../common/enums/payment-method.enum";
import { RecurrenceFrequency } from "../../../common/enums/recurrence-frequency.enum";
import { RecurrenceStatus } from "../../../common/enums/recurrence-status.enum";
import { TransactionSource } from "../../../common/enums/transaction-source.enum";
import { TransactionType } from "../../../common/enums/transaction-type.enum";
import { IAttachment } from "../interfaces/attachment.interface";

const attachmentSchema = new Schema<IAttachment>(
  {
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number,
      required: true,
      min: 0,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const transactionSchema = new Schema<TransactionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    subcategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: null,
    },

    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: null,
    },

    transactionDate: {
      type: Date,
      required: true,
    },

    attachments: {
      type: [attachmentSchema],
      default: [],
    },

    transactionSource: {
      type: String,
      enum: Object.values(TransactionSource),
      default: TransactionSource.MANUAL,
    },

    recurrenceFrequency: {
      type: String,
      enum: Object.values(RecurrenceFrequency),
      default: null,
    },

    recurrenceStartDate: {
      type: Date,
      default: null,
    },

    recurrenceEndDate: {
      type: Date,
      default: null,
    },

    nextExecutionDate: {
      type: Date,
      default: null,
    },

    recurrenceStatus: {
      type: String,
      enum: Object.values(RecurrenceStatus),
      default: null,
    },

    lastExecutedAt: {
      type: Date,
      default: null,
    },

    parentRecurringId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
    },

    isGenerated: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

transactionSchema.index({
  userId: 1,
  transactionDate: -1,
});

transactionSchema.index({
  userId: 1,
  categoryId: 1,
});

transactionSchema.index({
  userId: 1,
  transactionSource: 1,
});

transactionSchema.index({
  userId: 1,
  recurrenceStatus: 1,
});

transactionSchema.index({
  userId: 1,
  isDeleted: 1,
});

export const Transaction = model<TransactionDocument, TransactionModel>(
  "Transaction",
  transactionSchema,
);
