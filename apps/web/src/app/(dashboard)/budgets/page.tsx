
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { BudgetList } from "@/features/budgets/components/budget-list";
import { BudgetFilters } from "@/features/budgets/components/budget-filters";
import { CreateBudgetDialog } from "@/features/budgets/components/create-budget-dialog";
import { useBudgets } from "@/features/budgets/hooks/use-budgets";
import { BudgetQuery } from "@/types/budget.types";

export default function BudgetsPage() {
  const [filters, setFilters] = useState<BudgetQuery>({
    page: 1,
    limit: 10,
    period: "MONTHLY",
    status: "ACTIVE",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isError } = useBudgets(filters);

  const budgets = data?.budgets ?? [];
  const pagination = data?.pagination;

  const handlePageChange = (page: number) => {
    setFilters((previous) => ({
      ...previous,
      page,
    }));
  };

  return (
    <div className="w-full space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Heading */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your spending limits and track progress.
          </p>
        </div>

        {/* Create Budget */}
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Plus className="size-4" />
          <span>Create Budget</span>
        </button>
      </div>

      {/* Filters */}
      <BudgetFilters filters={filters} onFiltersChange={setFilters} />

      {/* List */}
      <BudgetList budgets={budgets} isLoading={isLoading} isError={isError} />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/60 pt-4">
          {/* Previous */}
          <button
            type="button"
            disabled={!pagination.hasPrevious}
            onClick={() => handlePageChange(pagination.page - 1)}
            className="rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          >
            Previous
          </button>

          {/* Page Information */}
          <span className="text-xs text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          {/* Next */}
          <button
            type="button"
            disabled={!pagination.hasNext}
            onClick={() => handlePageChange(pagination.page + 1)}
            className="rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Budget Dialog */}
      <CreateBudgetDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
