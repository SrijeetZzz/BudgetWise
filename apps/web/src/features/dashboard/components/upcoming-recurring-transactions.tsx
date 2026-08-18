
"use client";

import { CalendarClock, Repeat } from "lucide-react";

import type {
  DashboardCategory,
  DashboardUpcomingRecurringTransaction,
} from "@/types/dashboard.types";

import { CategoryIcon } from "@/features/categories/components/category-icon";

interface UpcomingRecurringTransactionsProps {
  transactions: DashboardUpcomingRecurringTransaction[];
}

function getCategory(
  value: string | DashboardCategory | null | undefined,
) {
  if (!value || typeof value === "string") {
    return null;
  }

  return value;
}

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatFrequency(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");
}

export function UpcomingRecurringTransactions({
  transactions,
}: UpcomingRecurringTransactionsProps) {
  /* =====================================================
      Empty State
  ===================================================== */

  if (!transactions.length) {
    return (
      <section className="flex w-full min-w-0 flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
        {/* Header */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarClock className="size-5" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-bold tracking-tight text-foreground">
              Upcoming Recurring Transactions
            </h2>

            <p className="truncate text-xs text-muted-foreground">
              Your next scheduled recurring transactions
            </p>
          </div>
        </div>

        {/* Empty Content */}
        <div className="flex min-h-55 flex-col items-center justify-center px-2 text-center">
          <CalendarClock className="size-8 text-muted-foreground/50" />

          <p className="mt-2 text-sm font-semibold text-foreground">
            No upcoming recurring transactions
          </p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Scheduled recurring items will appear here when due.
          </p>
        </div>
      </section>
    );
  }

  /* =====================================================
      Main Card
  ===================================================== */

  return (
    <section className="flex h-95 w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xs">
      {/* =================================================
          Fixed Header
      ================================================= */}

      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 p-4 sm:p-6">
        {/* Header Title */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:size-10">
            <CalendarClock className="size-4 sm:size-5" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-bold tracking-tight text-foreground sm:text-lg">
              Upcoming Recurring Transactions
            </h2>

            <p className="truncate text-xs text-muted-foreground">
              Your next scheduled recurring transactions
            </p>
          </div>
        </div>

        {/* Scheduled Count */}
        <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-secondary-foreground sm:px-2.5 sm:text-xs">
          {transactions.length} scheduled
        </span>
      </div>

      {/* =================================================
          Scrollable Transactions List
      ================================================= */}

      <div className="min-h-0 flex-1 overflow-y-auto divide-y divide-border/50 [scrollbar-thin] [scrollbar-color:hsl(var(--border))_transparent]">
        {transactions.map((transaction) => {
          const category = getCategory(transaction.categoryId);
          const isIncome = transaction.type === "INCOME";

          return (
            <div
              key={transaction._id}
              className="group flex min-w-0 items-start gap-2.5 p-3 transition-colors hover:bg-muted/30 sm:items-center sm:gap-4 sm:p-5"
            >
              {/* =================================================
                  Left Side
              ================================================= */}

              <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:items-center sm:gap-3.5">
                {/* Category Icon */}
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 sm:size-10"
                  style={{
                    backgroundColor: category?.color
                      ? `${category.color}15`
                      : isIncome
                        ? "#10b98115"
                        : "#3b82f615",

                    color: category?.color
                      ? category.color
                      : isIncome
                        ? "#10b981"
                        : "#3b82f6",
                  }}
                >
                  {category?.icon ? (
                    <CategoryIcon
                      name={category.icon}
                      className="size-4 sm:size-5"
                    />
                  ) : (
                    <Repeat className="size-4 sm:size-5" />
                  )}
                </div>

                {/* =================================================
                    Transaction Details
                ================================================= */}

                <div className="min-w-0 flex-1">
                  {/* Title + Frequency */}
                  <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                    {/* Title */}
                    <p className="min-w-0 truncate text-xs font-bold text-foreground sm:text-sm">
                      {transaction.title}
                    </p>

                    {/* Frequency Badge */}
                    <span className="inline-flex max-w-22.5 shrink-0 items-center gap-1 truncate rounded-md bg-secondary px-1.5 py-0.5 text-[9px] font-bold text-secondary-foreground sm:max-w-none sm:text-[10px]">
                      <Repeat className="size-2.5 shrink-0" />

                      <span className="truncate">
                        {formatFrequency(
                          transaction.recurrenceFrequency,
                        )}
                      </span>
                    </span>
                  </div>

                  {/* Category + Next Execution */}
                  <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-muted-foreground sm:gap-x-2 sm:text-xs">
                    {/* Category */}
                    {category && (
                      <>
                        <span className="max-w-22.5 truncate font-medium text-foreground/80 sm:max-w-none">
                          {category.name}
                        </span>

                        <span>•</span>
                      </>
                    )}

                    {/* Next Execution Date */}
                    <div className="inline-flex min-w-0 items-center gap-1">
                      <CalendarClock className="size-2.5 shrink-0 sm:size-3" />

                      <span className="shrink-0">
                        Next:
                      </span>

                      <strong className="truncate font-semibold text-foreground">
                        {formatDate(
                          transaction.nextExecutionDate,
                        )}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  Amount
              ================================================= */}

              <div
                className={`max-w-[34%] shrink-0 wrap-break-word text-right text-[11px] font-extrabold leading-tight sm:max-w-none sm:text-sm ${
                  isIncome
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-foreground"
                }`}
              >
                {isIncome ? "+" : "-"}

                {formatCurrency(
                  transaction.amount,
                  transaction.currency,
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}