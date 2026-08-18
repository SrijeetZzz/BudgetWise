import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";


import {
  transactionKeys,
} from "./use-transactions";
import { transactionApi } from "../api/transaction.api";

export function useDeleteAttachment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      transactionId: string,
    ) =>
      transactionApi.deleteAttachment(
        transactionId,
      ),

    onSuccess: (
      transaction,
    ) => {
      queryClient.setQueryData(
        transactionKeys.detail(
          transaction._id,
        ),
        transaction,
      );

      queryClient.invalidateQueries({
        queryKey:
          transactionKeys.lists(),
      });
    },
  });
}