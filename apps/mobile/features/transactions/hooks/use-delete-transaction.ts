import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";


import {
  transactionKeys,
} from "./use-transactions";
import { transactionApi } from "../api/transaction.api";

export function useDeleteTransaction() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      transactionId: string,
    ) =>
      transactionApi.deleteTransaction(
        transactionId,
      ),

    onSuccess: (
      _,
      transactionId,
    ) => {
      /*
       * Remove cached details.
       */

      queryClient.removeQueries({
        queryKey:
          transactionKeys.detail(
            transactionId,
          ),
      });

      /*
       * Refresh all transaction lists.
       */

      queryClient.invalidateQueries({
        queryKey:
          transactionKeys.lists(),
      });
    },
  });
}