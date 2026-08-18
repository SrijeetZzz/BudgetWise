import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";
import { TransactionQuery } from "../../../types/transaction.types";
import { transactionApi } from "../api/transaction.api";



/*
 * =========================================================
 * QUERY KEYS
 * =========================================================
 */

export const transactionKeys = {
  all: ["transactions"] as const,

  lists: () =>
    [
      ...transactionKeys.all,
      "list",
    ] as const,

  list: (
    query?: TransactionQuery,
  ) =>
    [
      ...transactionKeys.lists(),
      query,
    ] as const,

  details: () =>
    [
      ...transactionKeys.all,
      "detail",
    ] as const,

  detail: (
    transactionId: string,
  ) =>
    [
      ...transactionKeys.details(),
      transactionId,
    ] as const,
};

/*
 * =========================================================
 * GET TRANSACTIONS
 * =========================================================
 */

export function useTransactions(
  query?: TransactionQuery,
) {
  return useQuery({
    queryKey:
      transactionKeys.list(query),

    queryFn: () =>
      transactionApi.getTransactions(
        query,
      ),

    placeholderData:
      keepPreviousData,
  });
}