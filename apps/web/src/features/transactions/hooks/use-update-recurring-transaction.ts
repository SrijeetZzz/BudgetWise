import { useMutation, useQueryClient } from "@tanstack/react-query";

import { transactionApi } from "../api/transaction.api";

import type {
  UpdateRecurringTransactionInput,
} from "@/types/transaction.types";

interface UpdateRecurringTransactionParams {
  transactionId: string;
  payload: UpdateRecurringTransactionInput;
}

export function useUpdateRecurringTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      payload,
    }: UpdateRecurringTransactionParams) =>
      transactionApi.updateRecurringTransaction(
        transactionId,
        payload,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
    },
  });
}