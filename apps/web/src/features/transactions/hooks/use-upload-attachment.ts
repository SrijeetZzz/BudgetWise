import { useMutation, useQueryClient } from '@tanstack/react-query';

import { transactionApi } from '../api/transaction.api';

interface UploadAttachmentVariables {
  transactionId: string;
  file: File;
}

export function useUploadAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      file,
    }: UploadAttachmentVariables) =>
      transactionApi.uploadAttachment(
        transactionId,
        file,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['transactions'],
      });
    },
  });
}