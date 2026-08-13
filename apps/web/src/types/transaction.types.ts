import type { Category } from "./category.types";

export type TransactionType = "INCOME" | "EXPENSE";

export type PaymentMethod =
  "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "WALLET" | "CHEQUE" | "OTHER";

export type RecurrenceFrequency =
  "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY";

export type RecurrenceStatus = "ACTIVE" | "PAUSED" | "COMPLETED";

export type TransactionSource = "MANUAL" | "RECURRING";

export interface TransactionAttachment {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface Transaction {
  _id: string;
  userId: string;

  categoryId: string | Category;

  subcategoryId: string | Category | null;

  type: TransactionType;

  amount: number;

  currency: string;

  title: string;

  description: string | null;

  paymentMethod: PaymentMethod | null;

  transactionDate: string;

  attachments: TransactionAttachment[];

  transactionSource: TransactionSource;

  recurrenceFrequency: RecurrenceFrequency | null;

  recurrenceStartDate: string | null;

  recurrenceEndDate: string | null;

  nextExecutionDate: string | null;

  recurrenceStatus: RecurrenceStatus | null;

  lastExecutedAt: string | null;

  parentRecurringId: string | null;

  isGenerated: boolean;

  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface TransactionPagination {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface TransactionQuery {
  page?: number;
  limit?: number;

  search?: string;

  type?: TransactionType;

  categoryId?: string;

  subcategoryId?: string;

  paymentMethod?: PaymentMethod;

  startDate?: string;

  endDate?: string;

  minAmount?: number;

  maxAmount?: number;

  transactionSource?: TransactionSource;

  sortBy?: "transactionDate" | "amount" | "title";

  sortOrder?: "asc" | "desc";
}

export interface CreateTransactionInput {
  categoryId: string;

  subcategoryId?: string;

  type: TransactionType;

  amount: number;

  currency: string;

  title: string;

  description?: string;

  paymentMethod?: PaymentMethod;

  transactionDate: string;

  isRecurring?: boolean;

  recurrenceFrequency?: RecurrenceFrequency;

  recurrenceStartDate?: string;

  recurrenceEndDate?: string;

  receipt?: File;
}

export interface UpdateTransactionInput {
  categoryId?: string;

  subcategoryId?: string;

  type?: TransactionType;

  amount?: number;

  currency?: string;

  title?: string;

  description?: string;

  paymentMethod?: PaymentMethod;

  transactionDate?: string;
}

export interface UpdateRecurringTransactionInput extends UpdateTransactionInput {
  recurrenceFrequency?: RecurrenceFrequency;

  recurrenceStartDate?: string;

  recurrenceEndDate?: string;

  recurrenceStatus?: RecurrenceStatus;
}
