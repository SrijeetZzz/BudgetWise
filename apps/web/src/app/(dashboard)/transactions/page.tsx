"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { TransactionList } from "@/features/transactions/components/transaction-list";
import { TransactionFilterToolbar } from "@/features/transactions/components/transaction-filter-toolbar";
import { CreateTransactionDialog } from "@/features/transactions/components/create-transaction-dialog";
import { useTransactions } from "@/features/transactions/hooks/use-transactions";

import type { TransactionQuery } from "@/types/transaction.types";

export default function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionQuery>({
    page: 1,
    limit: 10,
    sortBy: "transactionDate",
    sortOrder: "desc",
  });

  const { data, isLoading, isError } = useTransactions(filters);

  const transactions = data?.data ?? [];
  const pagination = data?.meta;

  const handleFiltersChange = (newFilters: TransactionQuery) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters((previous) => ({
      ...previous,
      page,
    }));
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between px-4 sm:px-0">
        {/* Heading */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage your income and expenses.
          </p>
        </div>

        {/* Add Transaction */}
        <CreateTransactionDialog />
      </div>

      {/* Filters */}
      <TransactionFilterToolbar
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        isLoading={isLoading}
        isError={isError}
      />

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm">
          {/* Previous */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!pagination.hasPrevious || isLoading}
            onClick={() => handlePageChange((filters.page ?? 1) - 1)}
          >
            Previous
          </Button>

          {/* Page Information */}
          <div className="text-xs text-muted-foreground sm:text-sm">
            Page{" "}
            <span className="font-semibold text-foreground">
              {filters.page ?? 1}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">
              {pagination.totalPages}
            </span>
          </div>

          {/* Next */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!pagination.hasNext || isLoading}
            onClick={() => handlePageChange((filters.page ?? 1) + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
