import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';

import { transactionApi } from '../api/transaction.api';

import type { TransactionQuery } from '@/types/transaction.types';

export const transactionKeys = {
  all: ['transactions'] as const,

  lists: () =>
    [...transactionKeys.all, 'list'] as const,

  list: (query?: TransactionQuery) =>
    [...transactionKeys.lists(), query] as const,

  details: () =>
    [...transactionKeys.all, 'detail'] as const,

  detail: (transactionId: string) =>
    [...transactionKeys.details(), transactionId] as const,
};

export function useTransactions(
  query?: TransactionQuery,
) {
  return useQuery({
    queryKey: transactionKeys.list(query),
    queryFn: () =>
      transactionApi.getTransactions(query),
    placeholderData: keepPreviousData,
  });
}