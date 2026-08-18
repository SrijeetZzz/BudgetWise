import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";



import {
  transactionKeys,
} from "./use-transactions";
import { UpdateRecurringTransactionInput } from "../../../types/transaction.types";
import { transactionApi } from "../api/transaction.api";

interface UpdateRecurringTransactionVariables {
  transactionId: string;

  payload: UpdateRecurringTransactionInput;
}

export function useUpdateRecurringTransaction() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      payload,
    }: UpdateRecurringTransactionVariables) =>
      transactionApi.updateRecurringTransaction(
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
        queryKey:
          transactionKeys.lists(),
      });
    },
  });
}