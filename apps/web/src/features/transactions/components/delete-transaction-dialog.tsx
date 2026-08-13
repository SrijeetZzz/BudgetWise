'use client';

import { AlertTriangle, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { Transaction } from '@/types/transaction.types';

import { useDeleteTransaction } from '../hooks/use-delete-transaction';

interface DeleteTransactionDialogProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteTransactionDialog({
  transaction,
  open,
  onOpenChange,
}: DeleteTransactionDialogProps) {
  const deleteTransaction =
    useDeleteTransaction();

  if (!open) {
    return null;
  }

  const handleDelete = async () => {
    try {
      await deleteTransaction.mutateAsync(
        transaction._id,
      );

      onOpenChange(false);
    } catch {
      // Keep dialog open so the user can retry.
    }
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border bg-card p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </div>

            <div>
              <h2 className="text-base font-bold sm:text-lg">
                Delete transaction?
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={deleteTransaction.isPending}
            onClick={() =>
              onOpenChange(false)
            }
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5 rounded-xl border bg-muted/20 p-4">
          <p className="truncate text-sm font-semibold">
            {transaction.title}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {transaction.currency}{' '}
            {transaction.amount.toLocaleString(
              'en-IN',
            )}
          </p>
        </div>

        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Are you sure you want to delete this
          transaction? It will no longer appear in
          your transaction history.
        </p>

        {deleteTransaction.isError && (
          <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
            Unable to delete the transaction.
            Please try again.
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={
              deleteTransaction.isPending
            }
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            loading={deleteTransaction.isPending}
            onClick={handleDelete}
          >
            Delete Transaction
          </Button>
        </div>
      </div>
    </div>
  );
}