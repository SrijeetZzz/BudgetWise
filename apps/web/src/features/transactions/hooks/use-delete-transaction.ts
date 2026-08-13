import { useMutation, useQueryClient } from '@tanstack/react-query';

import { transactionApi } from '../api/transaction.api';

import { transactionKeys } from './use-transactions';

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string) =>
      transactionApi.deleteTransaction(
        transactionId,
      ),

    onSuccess: (_, transactionId) => {
      queryClient.removeQueries({
        queryKey: transactionKeys.detail(
          transactionId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: transactionKeys.lists(),
      });
    },
  });
}