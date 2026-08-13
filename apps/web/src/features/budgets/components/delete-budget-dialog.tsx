'use client';

import { AlertTriangle, Trash2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { Budget } from '@/types/budget.types';

import { useDeleteBudget } from '../hooks/use-delete-budget';

interface DeleteBudgetDialogProps {
  budget: Budget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getBudgetName(budget: Budget) {
  if (budget.scope === 'OVERALL') {
    return 'Overall Budget';
  }

  if (
    budget.categoryId &&
    typeof budget.categoryId !== 'string'
  ) {
    if (
      budget.subcategoryId &&
      typeof budget.subcategoryId !== 'string'
    ) {
      return `${budget.categoryId.name} / ${budget.subcategoryId.name}`;
    }

    return budget.categoryId.name;
  }

  return 'Category Budget';
}

export function DeleteBudgetDialog({
  budget,
  open,
  onOpenChange,
}: DeleteBudgetDialogProps) {
  const deleteBudget = useDeleteBudget();

  if (!open) {
    return null;
  }

  const budgetName = getBudgetName(budget);

  const handleDelete = async () => {
    try {
      await deleteBudget.mutateAsync(budget._id);

      onOpenChange(false);
    } catch {
      // Error is handled by the mutation hook.
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-0">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border/60 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Trash2 className="size-5" />
            </div>

            <div>
              <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                Delete Budget
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={deleteBudget.isPending}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />

            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Are you sure you want to delete this budget?
              </p>

              <p className="text-xs leading-relaxed text-muted-foreground">
                You are about to delete{' '}
                <span className="font-semibold text-foreground">
                  {budgetName}
                </span>
                . The budget and its current tracking information
                will no longer appear in your budget list.
              </p>
            </div>
          </div>

          {/* Budget Summary */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] text-muted-foreground">
                  Budget Amount
                </p>

                <p className="mt-0.5 text-sm font-semibold">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 2,
                  }).format(budget.budgetAmount)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[11px] text-muted-foreground">
                  Period
                </p>

                <p className="mt-0.5 text-sm font-semibold">
                  {budget.period
                    .toLowerCase()
                    .split('_')
                    .map(
                      (part) =>
                        part.charAt(0).toUpperCase() +
                        part.slice(1),
                    )
                    .join(' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 border-t border-border/60 pt-4 sm:flex-row sm:justify-end sm:gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={deleteBudget.isPending}
              onClick={() => onOpenChange(false)}
              className="h-10 text-xs font-medium sm:text-sm"
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={deleteBudget.isPending}
              onClick={handleDelete}
              className="h-10 gap-2 text-xs font-semibold sm:text-sm"
            >
              <Trash2 className="size-4" />

              {deleteBudget.isPending
                ? 'Deleting...'
                : 'Delete Budget'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}