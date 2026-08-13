import { useMutation, useQueryClient } from '@tanstack/react-query';

import { transactionApi } from '../api/transaction.api';

export function useDeleteAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string) =>
      transactionApi.deleteAttachment(
        transactionId,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transactions'],
      });
    },
  });
}