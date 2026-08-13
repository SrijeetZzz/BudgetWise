import { useQuery } from '@tanstack/react-query';

import {
  transactionApi,
} from '../api/transaction.api';

import { transactionKeys } from './use-transactions';

export function useTransaction(
  transactionId?: string,
) {
  return useQuery({
    queryKey: transactionId
      ? transactionKeys.detail(transactionId)
      : transactionKeys.detail(''),

    queryFn: () =>
      transactionApi.getTransaction(
        transactionId as string,
      ),

    enabled: Boolean(transactionId),
  });
}