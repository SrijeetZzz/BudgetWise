import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";


import {
  transactionKeys,
} from "./use-transactions";
import { UpdateTransactionInput } from "../../../types/transaction.types";
import { transactionApi } from "../api/transaction.api";

interface UpdateTransactionVariables {
  transactionId: string;

  payload: UpdateTransactionInput;
}

export function useUpdateTransaction() {
  const queryClient =
    useQueryClient();

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
      /*
       * Update detail cache immediately.
       */

      queryClient.setQueryData(
        transactionKeys.detail(
          variables.transactionId,
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