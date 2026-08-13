
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

import type {
  CreateTransactionInput,
  Transaction,
  TransactionPagination,
  TransactionQuery,
  UpdateRecurringTransactionInput,
  UpdateTransactionInput,
} from '@/types/transaction.types';

interface TransactionListResponse {
  data: Transaction[];
  meta: TransactionPagination;
}

export const transactionApi = {
  getTransactions: async (
    query?: TransactionQuery,
  ): Promise<TransactionListResponse> => {
    const { data } = await apiClient.get(
      API_ENDPOINTS.TRANSACTIONS.BASE,
      {
        params: query,
      },
    );

    return {
      data: data.data,
      meta: data.meta,
    };
  },

  getTransaction: async (
    transactionId: string,
  ): Promise<Transaction> => {
    const { data } = await apiClient.get(
      `${API_ENDPOINTS.TRANSACTIONS.BASE}/${transactionId}`,
    );

    return data.data;
  },

  createTransaction: async (
    payload: CreateTransactionInput,
  ): Promise<Transaction> => {
    const formData = new FormData();

    formData.append(
      'categoryId',
      payload.categoryId,
    );

    if (payload.subcategoryId) {
      formData.append(
        'subcategoryId',
        payload.subcategoryId,
      );
    }

    formData.append('type', payload.type);

    formData.append(
      'amount',
      String(payload.amount),
    );

    formData.append(
      'currency',
      payload.currency,
    );

    formData.append(
      'title',
      payload.title,
    );

    if (payload.description) {
      formData.append(
        'description',
        payload.description,
      );
    }

    if (payload.paymentMethod) {
      formData.append(
        'paymentMethod',
        payload.paymentMethod,
      );
    }

    formData.append(
      'transactionDate',
      payload.transactionDate,
    );

    formData.append(
      'isRecurring',
      payload.isRecurring ? 'true' : 'false',
    );

    if (payload.recurrenceFrequency) {
      formData.append(
        'recurrenceFrequency',
        payload.recurrenceFrequency,
      );
    }

    if (payload.recurrenceStartDate) {
      formData.append(
        'recurrenceStartDate',
        payload.recurrenceStartDate,
      );
    }

    if (payload.recurrenceEndDate) {
      formData.append(
        'recurrenceEndDate',
        payload.recurrenceEndDate,
      );
    }

    if (payload.receipt) {
      formData.append(
        'receipt',
        payload.receipt,
      );
    }

    const { data } = await apiClient.post(
      API_ENDPOINTS.TRANSACTIONS.BASE,
      formData,
    );

    return data.data;
  },

  updateTransaction: async (
    transactionId: string,
    payload: UpdateTransactionInput,
  ): Promise<Transaction> => {
    const { data } = await apiClient.patch(
      `${API_ENDPOINTS.TRANSACTIONS.BASE}/${transactionId}`,
      payload,
    );

    return data.data;
  },

  updateRecurringTransaction: async (
    transactionId: string,
    payload: UpdateRecurringTransactionInput,
  ): Promise<Transaction> => {
    const { data } = await apiClient.patch(
      `${API_ENDPOINTS.TRANSACTIONS.RECURRING}/${transactionId}`,
      payload,
    );

    return data.data;
  },

  deleteTransaction: async (
    transactionId: string,
  ): Promise<void> => {
    await apiClient.delete(
      `${API_ENDPOINTS.TRANSACTIONS.BASE}/${transactionId}`,
    );
  },

  uploadAttachment: async (
    transactionId: string,
    file: File,
  ): Promise<Transaction> => {
    const formData = new FormData();

    formData.append('receipt', file);

    const { data } = await apiClient.post(
      `${API_ENDPOINTS.TRANSACTIONS.BASE}/${transactionId}/attachments`,
      formData,
    );

    return data.data;
  },

  deleteAttachment: async (
    transactionId: string,
  ): Promise<Transaction> => {
    const { data } = await apiClient.delete(
      `${API_ENDPOINTS.TRANSACTIONS.BASE}/${transactionId}/attachment`,
    );

    return data.data;
  },
};