'use client';

import { Loader2, Wallet } from 'lucide-react';

import type { Budget } from '@/types/budget.types';

import { BudgetCard } from './budget-card';

interface BudgetListProps {
  budgets: Budget[];
  isLoading?: boolean;
  isError?: boolean;
}

export function BudgetList({
  budgets,
  isLoading,
  isError,
}: BudgetListProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-2xl border border-border/60 bg-card">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading budgets...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5">
        <p className="text-sm font-medium text-destructive">
          Unable to load budgets.
        </p>
      </div>
    );
  }

  if (!budgets.length) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-border/60 bg-card p-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
          <Wallet className="size-5 text-muted-foreground" />
        </div>

        <h3 className="mt-3 text-sm font-semibold">
          No budgets found
        </h3>

        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Create your first budget to start tracking
          your spending.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {budgets.map((budget) => (
        <BudgetCard
          key={budget._id}
          budget={budget}
        />
      ))}
    </div>
  );
}