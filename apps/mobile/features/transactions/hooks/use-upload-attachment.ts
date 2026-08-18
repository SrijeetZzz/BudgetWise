import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";



import {
  transactionKeys,
} from "./use-transactions";
import { transactionApi } from "../api/transaction.api";

interface UploadAttachmentVariables {
  transactionId: string;

  file: {
    uri: string;
    name: string;
    type: string;
  };
}

export function useUploadAttachment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      file,
    }: UploadAttachmentVariables) =>
      transactionApi.uploadAttachment(
        transactionId,
        file,
      ),

    onSuccess: (
      transaction,
    ) => {
      /*
       * Update detail cache if possible.
       */

      queryClient.setQueryData(
        transactionKeys.detail(
          transaction._id,
        ),
        transaction,
      );

      /*
       * Refresh transaction lists.
       */

      queryClient.invalidateQueries({
        queryKey:
          transactionKeys.lists(),
      });
    },
  });
}