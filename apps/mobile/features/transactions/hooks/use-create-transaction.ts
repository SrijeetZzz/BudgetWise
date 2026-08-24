// import {
//   useMutation,
//   useQueryClient,
// } from "@tanstack/react-query";



// import {
//   transactionKeys,
// } from "./use-transactions";
// import { CreateTransactionInput } from "../../../types/transaction.types";
// import { transactionApi } from "../api/transaction.api";

// export function useCreateTransaction() {
//   const queryClient =
//     useQueryClient();

//   return useMutation({
//     mutationFn: (
//       payload: CreateTransactionInput,
//     ) =>
//       transactionApi.createTransaction(
//         payload,
//       ),

//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey:
//           transactionKeys.lists(),
//       });
//     },
//   });
// }
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateTransactionInput,
    ) =>
      transactionApi.createTransaction(
        payload,
      ),

    onSuccess: async () => {
      await Promise.all([
        /*
         * Refresh transaction lists.
         */
        queryClient.invalidateQueries({
          queryKey: transactionKeys.all,
        }),

        /*
         * Refresh dashboard.
         *
         * This matches:
         * ["dashboard", query]
         *
         * and therefore invalidates all
         * dashboard filter variants.
         */
        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        }),
      ]);
    },
  });
}