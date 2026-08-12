import { PaymentMethod } from "../../../common/enums/payment-method.enum";
import { TransactionType } from "../../../common/enums/transaction-type.enum";
import { TransactionSource } from "../../../common/enums/transaction-source.enum";

export interface TransactionQueryDto {
  page?: number;
  limit?: number;

  search?: string;

  type?: TransactionType;

  categoryId?: string;
  subcategoryId?: string;

  paymentMethod?: PaymentMethod;
   transactionSource?: TransactionSource;

  startDate?: string;
  endDate?: string;

  minAmount?: number;
  maxAmount?: number;

  sortBy?: "transactionDate" | "amount" | "title";
  sortOrder?: "asc" | "desc";
}