import { useMutation, useQueryClient } from '@tanstack/react-query';

import { transactionApi } from '../api/transaction.api';

import type { CreateTransactionInput } from '@/types/transaction.types';

import { transactionKeys } from './use-transactions';

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateTransactionInput,
    ) =>
      transactionApi.createTransaction(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: transactionKeys.lists(),
      });
    },
  });
}