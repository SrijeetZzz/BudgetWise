import { apiClient } from "../../../lib/api/client";
import { API_ENDPOINTS } from "../../../lib/api/endpoints";

import type {
  CreateTransactionInput,
  Transaction,
  TransactionPagination,
  TransactionQuery,
  UpdateRecurringTransactionInput,
  UpdateTransactionInput,
} from "../../../types/transaction.types";

/*
 * =========================================================
 * RESPONSE TYPES
 * =========================================================
 */

interface TransactionListResponse {
  data: Transaction[];
  meta: TransactionPagination;
}

/*
 * =========================================================
 * FILE TYPE
 * =========================================================
 */

export interface TransactionAttachmentFile {
  uri: string;
  name: string;
  type: string;
}

/*
 * =========================================================
 * TRANSACTION SERVICE
 * =========================================================
 */

export const transactionApi = {
  /*
   * =======================================================
   * GET TRANSACTIONS
   * =======================================================
   */

  getTransactions: async (
    query?: TransactionQuery,
  ): Promise<TransactionListResponse> => {
    const response = await apiClient.get(
      API_ENDPOINTS.TRANSACTIONS.BASE,
      {
        params: query,
      },
    );

    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  /*
   * =======================================================
   * GET SINGLE TRANSACTION
   * =======================================================
   */

  getTransaction: async (
    transactionId: string,
  ): Promise<Transaction> => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.TRANSACTIONS.BASE}/${transactionId}`,
    );

    return response.data.data;
  },

  /*
   * =======================================================
   * CREATE TRANSACTION
   * =======================================================
   */

  createTransaction: async (
    payload: CreateTransactionInput,
  ): Promise<Transaction> => {
    const formData = new FormData();

    formData.append(
      "categoryId",
      payload.categoryId,
    );

    if (payload.subcategoryId) {
      formData.append(
        "subcategoryId",
        payload.subcategoryId,
      );
    }

    formData.append(
      "type",
      payload.type,
    );

    formData.append(
      "amount",
      String(payload.amount),
    );

    formData.append(
      "currency",
      payload.currency,
    );

    formData.append(
      "title",
      payload.title,
    );

    if (payload.description) {
      formData.append(
        "description",
        payload.description,
      );
    }

    if (payload.paymentMethod) {
      formData.append(
        "paymentMethod",
        payload.paymentMethod,
      );
    }

    formData.append(
      "transactionDate",
      payload.transactionDate,
    );

    formData.append(
      "isRecurring",
      payload.isRecurring ? "true" : "false",
    );

    if (payload.recurrenceFrequency) {
      formData.append(
        "recurrenceFrequency",
        payload.recurrenceFrequency,
      );
    }

    if (payload.recurrenceStartDate) {
      formData.append(
        "recurrenceStartDate",
        payload.recurrenceStartDate,
      );
    }

    if (payload.recurrenceEndDate) {
      formData.append(
        "recurrenceEndDate",
        payload.recurrenceEndDate,
      );
    }

    if (payload.receipt) {
      formData.append(
        "receipt",
        {
          uri: payload.receipt.uri,
          name: payload.receipt.name,
          type: payload.receipt.type,
        } as any,
      );
    }

    const response = await apiClient.post(
      API_ENDPOINTS.TRANSACTIONS.BASE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.data;
  },

  /*
   * =======================================================
   * UPDATE TRANSACTION
   * =======================================================
   */

  updateTransaction: async (
    transactionId: string,
    payload: UpdateTransactionInput,
  ): Promise<Transaction> => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.TRANSACTIONS.BASE}/${transactionId}`,
      payload,
    );

    return response.data.data;
  },

  /*
   * =======================================================
   * UPDATE RECURRING TRANSACTION
   * =======================================================
   */

  updateRecurringTransaction: async (
    transactionId: string,
    payload: UpdateRecurringTransactionInput,
  ): Promise<Transaction> => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.TRANSACTIONS.RECURRING}/${transactionId}`,
      payload,
    );

    return response.data.data;
  },

  /*
   * =======================================================
   * DELETE TRANSACTION
   * =======================================================
   */

  deleteTransaction: async (
    transactionId: string,
  ): Promise<void> => {
    await apiClient.delete(
      `${API_ENDPOINTS.TRANSACTIONS.BASE}/${transactionId}`,
    );
  },

  /*
   * =======================================================
   * UPLOAD ATTACHMENT
   * =======================================================
   */

  uploadAttachment: async (
    transactionId: string,
    file: TransactionAttachmentFile,
  ): Promise<Transaction> => {
    const formData = new FormData();

    formData.append(
      "receipt",
      {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any,
    );

    const response = await apiClient.post(
      `${API_ENDPOINTS.TRANSACTIONS.BASE}/${transactionId}/attachments`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.data;
  },

  /*
   * =======================================================
   * DELETE ATTACHMENT
   * =======================================================
   */

  deleteAttachment: async (
    transactionId: string,
  ): Promise<Transaction> => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.TRANSACTIONS.BASE}/${transactionId}/attachment`,
    );

    return response.data.data;
  },
};