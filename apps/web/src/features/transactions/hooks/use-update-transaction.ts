import { useMutation, useQueryClient } from '@tanstack/react-query';

import { transactionApi } from '../api/transaction.api';

import type {
  UpdateTransactionInput,
} from '@/types/transaction.types';

import { transactionKeys } from './use-transactions';

interface UpdateTransactionVariables {
  transactionId: string;
  payload: UpdateTransactionInput;
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      payload,
    }: UpdateTransactionVariables) =>
      transactionApi.updateTransaction(
        transactionId,
        payload,
      ),

    onSuccess: (
      transaction,
      variables,
    ) => {
      queryClient.setQueryData(
        transactionKeys.detail(
          variables.transactionId,
        ),
        transaction,
      );

      queryClient.invalidateQueries({
        queryKey: transactionKeys.lists(),
      });
    },
  });
}