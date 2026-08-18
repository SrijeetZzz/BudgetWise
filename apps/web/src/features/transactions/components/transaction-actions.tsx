

'use client';

import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import type { Transaction } from '@/types/transaction.types';

import { TransactionDetailsDialog } from './transaction-details-dialog';
import { EditTransactionDialog } from './edit-transaction-dialog';
import { EditRecurringTransactionDialog } from './edit-recurring-transaction-dialog';
import { DeleteTransactionDialog } from './delete-transaction-dialog';

interface TransactionActionsProps {
  transaction: Transaction;
}

export function TransactionActions({
  transaction,
}: TransactionActionsProps) {
  const [openMenu, setOpenMenu] = useState(false);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [recurringEditOpen, setRecurringEditOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const isRecurring =
    transaction.transactionSource === 'RECURRING';

  return (
    <>
      <div className="relative">
        {/* Actions Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() =>
            setOpenMenu((previous) => !previous)
          }
          className="size-8"
        >
          <MoreHorizontal className="size-4" />
        </Button>

        {openMenu && (
          <>
            {/* Click outside */}
            <button
              type="button"
              aria-label="Close transaction actions"
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setOpenMenu(false)}
            />

            <div className="absolute right-0 top-9 z-50 w-48 rounded-xl border bg-popover p-1 shadow-lg">
              {/* View */}
              <button
                type="button"
                onClick={() => {
                  setOpenMenu(false);
                  setDetailsOpen(true);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                <Eye className="size-4" />
                <span>View transaction</span>
              </button>

              {/* Edit */}
              <button
                type="button"
                onClick={() => {
                  setOpenMenu(false);

                  if (isRecurring) {
                    setRecurringEditOpen(true);
                  } else {
                    setEditOpen(true);
                  }
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                <Pencil className="size-4" />

                <span>
                  {isRecurring
                    ? 'Edit recurring transaction'
                    : 'Edit transaction'}
                </span>
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => {
                  setOpenMenu(false);
                  setDeleteOpen(true);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-4" />
                <span>Delete transaction</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* View Dialog */}
      <TransactionDetailsDialog
        transaction={transaction}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      {/* Normal Transaction Edit Dialog */}
      {!isRecurring && (
        <EditTransactionDialog
          transaction={transaction}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}

      {/* Recurring Transaction Edit Dialog */}
      {isRecurring && (
        <EditRecurringTransactionDialog
          transaction={transaction}
          open={recurringEditOpen}
          onOpenChange={setRecurringEditOpen}
        />
      )}

      {/* Delete Dialog */}
      <DeleteTransactionDialog
        transaction={transaction}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}