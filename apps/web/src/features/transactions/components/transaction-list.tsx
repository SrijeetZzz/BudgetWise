
'use client';

import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  Loader2,
  Receipt,
  Repeat,
} from "lucide-react";

import { CategoryIcon } from "@/features/categories/components/category-icon";
import type { Category } from "@/types/category.types";
import type { Transaction } from "@/types/transaction.types";
import { TransactionActions } from "./transaction-actions";

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  isError?: boolean;
}

function getCategory(category: string | Category): Category | null {
  if (typeof category === "string") {
    return null;
  }
  return category;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatAmount(
  amount: number,
  currency: string,
  type: Transaction["type"],
) {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);

  return type === "EXPENSE" ? `- ${formatted}` : `+ ${formatted}`;
}

export function TransactionList({
  transactions,
  isLoading,
  isError,
}: TransactionListProps) {
  if (isLoading) {
    return (
      <div className="flex min-h-75 w-full items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span>Loading transactions...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-0">
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center text-sm text-destructive">
          Unable to load transactions.
        </div>
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-6 sm:px-0">
        <div className="rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm">
          <Receipt className="mx-auto size-10 text-muted-foreground/60" />
          <h3 className="mt-3 text-sm font-semibold text-foreground">
            No transactions found
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Your transactions will appear here once logged.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-0">
      {/* Removed overflow-hidden from this wrapper */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-sm">
        <div className="divide-y divide-border/60">
          {transactions.map((transaction) => {
            const category = getCategory(transaction.categoryId);
            const subcategory =
              transaction.subcategoryId &&
              typeof transaction.subcategoryId !== "string"
                ? transaction.subcategoryId
                : null;

            const isExpense = transaction.type === "EXPENSE";

            return (
              <div
                key={transaction._id}
                className="flex items-center gap-3.5 p-3.5 transition-colors hover:bg-muted/40 sm:p-4 first:rounded-t-2xl last:rounded-b-2xl"
              >
                {/* Category Icon Badge */}
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform active:scale-95 sm:size-11"
                  style={{
                    backgroundColor: category
                      ? `${category.color}15`
                      : undefined,
                    color: category?.color,
                  }}
                >
                  {category ? (
                    <CategoryIcon
                      name={category.icon}
                      className="size-5 sm:size-5"
                    />
                  ) : (
                    <Receipt className="size-5 text-muted-foreground" />
                  )}
                </div>

                {/* Details Section */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
                      {transaction.title}
                    </p>

                    {transaction.transactionSource === "RECURRING" && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground shrink-0">
                        <Repeat className="size-2.5" />
                        <span>Recurring</span>
                      </span>
                    )}
                  </div>

                  {/* Meta Details */}
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-muted-foreground sm:text-xs">
                    {category && (
                      <span className="font-medium text-foreground/80">
                        {category.name}
                      </span>
                    )}

                    {subcategory && (
                      <>
                        <span>•</span>
                        <span>{subcategory.name}</span>
                      </>
                    )}

                    {transaction.paymentMethod && (
                      <>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 capitalize">
                          <CreditCard className="size-3 shrink-0" />
                          <span>
                            {transaction.paymentMethod
                              .toLowerCase()
                              .replace("_", " ")}
                          </span>
                        </span>
                      </>
                    )}
                  </div>

                  {/* Transaction Date */}
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground/80 sm:text-[11px]">
                    <CalendarDays className="size-3 shrink-0" />
                    <span>{formatDate(transaction.transactionDate)}</span>
                  </div>
                </div>

                {/* Amount + Actions */}
                <div className="flex shrink-0 items-center gap-1">
                  {/* Amount */}
                  <div className="text-right">
                    <p
                      className={`flex items-center justify-end text-xs font-bold sm:text-sm ${
                        isExpense
                          ? "text-destructive"
                          : "text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      <span className="mr-0.5 inline-flex">
                        {isExpense ? (
                          <ArrowDownLeft className="size-3.5 shrink-0" />
                        ) : (
                          <ArrowUpRight className="size-3.5 shrink-0" />
                        )}
                      </span>

                      <span>
                        {formatAmount(
                          transaction.amount,
                          transaction.currency,
                          transaction.type,
                        )}
                      </span>
                    </p>
                  </div>

                  {/* Actions */}
                  <TransactionActions transaction={transaction} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}