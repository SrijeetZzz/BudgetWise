import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";



import {
  transactionKeys,
} from "./use-transactions";
import { CreateTransactionInput } from "../../../types/transaction.types";
import { transactionApi } from "../api/transaction.api";

export function useCreateTransaction() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateTransactionInput,
    ) =>
      transactionApi.createTransaction(
        payload,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          transactionKeys.lists(),
      });
    },
  });
}