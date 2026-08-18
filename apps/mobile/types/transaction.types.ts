import type { Category } from "./category.types";

/*
 * =========================================================
 * TRANSACTION ENUMS
 * =========================================================
 */

export type TransactionType = "INCOME" | "EXPENSE";

export type PaymentMethod =
  "CASH" | "CARD" | "UPI" | "BANK_TRANSFER" | "WALLET" | "CHEQUE" | "OTHER";

export type RecurrenceFrequency =
  "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "YEARLY";

export type RecurrenceStatus = "ACTIVE" | "PAUSED" | "COMPLETED";

export type TransactionSource = "MANUAL" | "RECURRING";

/*
 * =========================================================
 * ATTACHMENTS
 * =========================================================
 */

export interface TransactionAttachment {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

/*
 * =========================================================
 * TRANSACTION
 * =========================================================
 */

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

/*
 * =========================================================
 * PAGINATION
 * =========================================================
 */

export interface TransactionPagination {
  page: number;

  limit: number;

  totalRecords: number;

  totalPages: number;

  hasNext: boolean;

  hasPrevious: boolean;
}

/*
 * =========================================================
 * QUERY / FILTERS
 * =========================================================
 */

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

/*
 * =========================================================
 * CREATE
 * =========================================================
 */

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

  receipt?: MobileReceiptFile;
}

/*
 * =========================================================
 * MOBILE RECEIPT FILE
 * =========================================================
 *
 * React Native does not use the browser File object
 * in the same way as the web application.
 *
 * We will use this when implementing receipt upload.
 */

export interface MobileReceiptFile {
  uri: string;

  name: string;

  type: string;
}

/*
 * =========================================================
 * UPDATE
 * =========================================================
 */

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

/*
 * =========================================================
 * UPDATE RECURRING
 * =========================================================
 */

export interface UpdateRecurringTransactionInput extends UpdateTransactionInput {
  recurrenceFrequency?: RecurrenceFrequency;

  recurrenceStartDate?: string;

  recurrenceEndDate?: string;

  recurrenceStatus?: RecurrenceStatus;
}
