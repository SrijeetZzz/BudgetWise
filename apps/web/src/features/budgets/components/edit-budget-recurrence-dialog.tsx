"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Repeat,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useUpdateBudgetRecurrence } from "../hooks/use-update-budget-recurrence";

import type {
  Budget,
  UpdateBudgetRecurrenceInput,
} from "@/types/budget.types";

interface EditBudgetRecurrenceDialogProps {
  budget: Budget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function toDateInputValue(
  date: string | null | undefined,
) {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  const year = value.getFullYear();
  const month = String(
    value.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    value.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function EditBudgetRecurrenceDialog({
  budget,
  open,
  onOpenChange,
}: EditBudgetRecurrenceDialogProps) {
  const updateRecurrence =
    useUpdateBudgetRecurrence();

  const recurrence = budget.recurrence;

  const [budgetAmount, setBudgetAmount] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!open) return;

    setBudgetAmount(
      String(
        recurrence?.budgetAmount ??
          budget.budgetAmount,
      ),
    );

    setEndDate(
      toDateInputValue(
        recurrence?.endDate,
      ),
    );

    setError("");
  }, [open, budget, recurrence]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");

    const amount = Number(
      budgetAmount,
    );

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setError(
        "Budget amount must be greater than 0.",
      );
      return;
    }

    const payload: UpdateBudgetRecurrenceInput =
      {
        budgetAmount: amount,
        endDate: endDate
          ? new Date(
              `${endDate}T23:59:59`,
            ).toISOString()
          : null,
      };

    try {
      await updateRecurrence.mutateAsync({
        budgetId: budget._id,
        payload,
      });

      onOpenChange(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Unable to update recurrence. Please try again.",
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-0">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border/60 bg-card shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Repeat className="size-5" />
            </div>

            <div>
              <h2 className="text-base font-bold sm:text-lg">
                Edit Recurrence
              </h2>

              <p className="text-xs text-muted-foreground">
                Changes apply to future budget periods.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onOpenChange(false)
            }
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5 sm:p-6"
        >
          {/* Explanation */}
          <div className="rounded-xl border border-border/60 bg-muted/40 p-3">
            <p className="text-xs leading-5 text-muted-foreground">
              This changes the recurrence template.
              Already generated budgets will not be
              changed.
            </p>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label>
              Future Budget Amount
            </Label>

            <Input
              type="number"
              min="0"
              step="0.01"
              value={budgetAmount}
              onChange={(event) =>
                setBudgetAmount(
                  event.target.value,
                )
              }
              className="h-10 rounded-xl"
            />

            <p className="text-[11px] text-muted-foreground">
              This amount will be used when future
              periods are generated.
            </p>
          </div>

          {/* Recurrence End Date */}
          <div className="space-y-1.5">
            <Label>
              Recurrence End Date
            </Label>

            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                type="date"
                value={endDate}
                min={toDateInputValue(
                  budget.startDate,
                )}
                onChange={(event) =>
                  setEndDate(
                    event.target.value,
                  )
                }
                className="h-10 rounded-xl pl-9"
              />
            </div>

            <p className="text-[11px] text-muted-foreground">
              Leave empty to continue indefinitely.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 border-t border-border/60 pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={
                updateRecurrence.isPending
              }
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                updateRecurrence.isPending ||
                !budgetAmount
              }
            >
              {updateRecurrence.isPending
                ? "Saving..."
                : "Save Recurrence"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}