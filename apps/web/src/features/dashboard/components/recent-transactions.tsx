

// 'use client';

// import { ArrowDownLeft, ArrowUpRight, ReceiptText, CreditCard } from 'lucide-react';

// import type {
//   DashboardRecentTransaction,
//   DashboardCategory,
// } from '@/types/dashboard.types';
// import { CategoryIcon } from '@/features/categories/components/category-icon';

// interface RecentTransactionsProps {
//   transactions: DashboardRecentTransaction[];
// }

// function getCategory(
//   value: string | DashboardCategory | null | undefined,
// ) {
//   if (!value || typeof value === 'string') {
//     return null;
//   }
//   return value;
// }

// function formatCurrency(amount: number, currency: string) {
//   try {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency,
//       maximumFractionDigits: 2,
//     }).format(amount);
//   } catch {
//     return `${currency} ${amount.toFixed(2)}`;
//   }
// }

// function formatDate(date: string) {
//   return new Intl.DateTimeFormat('en-IN', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//   }).format(new Date(date));
// }

// export function RecentTransactions({
//   transactions,
// }: RecentTransactionsProps) {
//   if (!transactions.length) {
//     return (
//       <section className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
//         <div className="flex items-center gap-3">
//           <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
//             <ReceiptText className="size-5" />
//           </div>
//           <div>
//             <h2 className="text-base font-bold tracking-tight text-foreground">
//               Recent Transactions
//             </h2>
//             <p className="text-xs text-muted-foreground">
//               Your latest financial activity
//             </p>
//           </div>
//         </div>

//         <div className="flex min-h-55 flex-col items-center justify-center text-center">
//           <ReceiptText className="size-8 text-muted-foreground/50" />
//           <p className="mt-2 text-sm font-semibold text-foreground">
//             No transactions found
//           </p>
//           <p className="mt-0.5 text-xs text-muted-foreground">
//             Logged transactions for this period will appear here.
//           </p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card shadow-xs">
//       {/* Header */}
//       <div className="flex items-center justify-between border-b border-border/60 p-5 sm:p-6">
//         <div className="flex items-center gap-3">
//           <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
//             <ReceiptText className="size-5" />
//           </div>
//           <div>
//             <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
//               Recent Transactions
//             </h2>
//             <p className="text-xs text-muted-foreground">
//               Your latest financial activity
//             </p>
//           </div>
//         </div>

//         <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
//           {transactions.length} items
//         </span>
//       </div>

//       {/* Transactions List */}
//       <div className="divide-y divide-border/50">
//         {transactions.map((transaction) => {
//           const category = getCategory(transaction.categoryId);
//           const isIncome = transaction.type === 'INCOME';

//           return (
//             <div
//               key={transaction._id}
//               className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/30 sm:p-5"
//             >
//               {/* Left Details */}
//               <div className="flex min-w-0 items-center gap-3.5">
//                 {/* Category or Flow Icon */}
//                 <div
//                   className="flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
//                   style={{
//                     backgroundColor: category?.color
//                       ? `${category.color}15`
//                       : isIncome
//                         ? '#10b98115'
//                         : '#ef444415',
//                     color: category?.color
//                       ? category.color
//                       : isIncome
//                         ? '#10b981'
//                         : '#ef4444',
//                   }}
//                 >
//                   {category?.icon ? (
//                     <CategoryIcon name={category.icon} className="size-5" />
//                   ) : isIncome ? (
//                     <ArrowDownLeft className="size-5" />
//                   ) : (
//                     <ArrowUpRight className="size-5" />
//                   )}
//                 </div>

//                 <div className="min-w-0">
//                   <p className="truncate text-xs font-bold text-foreground sm:text-sm">
//                     {transaction.title}
//                   </p>

//                   <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
//                     {category && (
//                       <>
//                         <span className="font-medium text-foreground/80 truncate">
//                           {category.name}
//                         </span>
//                         <span>•</span>
//                       </>
//                     )}

//                     <span>{formatDate(transaction.transactionDate)}</span>

//                     {transaction.paymentMethod && (
//                       <>
//                         <span>•</span>
//                         <span className="inline-flex items-center gap-1 text-[11px] capitalize">
//                           <CreditCard className="size-3 shrink-0" />
//                           <span>
//                             {transaction.paymentMethod
//                               .toLowerCase()
//                               .replaceAll('_', ' ')}
//                           </span>
//                         </span>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Amount Display */}
//               <div
//                 className={`shrink-0 text-right text-xs font-extrabold sm:text-sm ${
//                   isIncome
//                     ? 'text-emerald-600 dark:text-emerald-400'
//                     : 'text-destructive'
//                 }`}
//               >
//                 {isIncome ? '+' : '-'}
//                 {formatCurrency(transaction.amount, transaction.currency)}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// }

// 'use client';

// import { ArrowDownLeft, ArrowUpRight, ReceiptText, CreditCard } from 'lucide-react';

// import type {
//   DashboardRecentTransaction,
//   DashboardCategory,
// } from '@/types/dashboard.types';
// import { CategoryIcon } from '@/features/categories/components/category-icon';

// interface RecentTransactionsProps {
//   transactions: DashboardRecentTransaction[];
// }

// function getCategory(
//   value: string | DashboardCategory | null | undefined,
// ) {
//   if (!value || typeof value === 'string') {
//     return null;
//   }
//   return value;
// }

// function formatCurrency(amount: number, currency: string) {
//   try {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency,
//       maximumFractionDigits: 2,
//     }).format(amount);
//   } catch {
//     return `${currency} ${amount.toFixed(2)}`;
//   }
// }

// function formatDate(date: string) {
//   return new Intl.DateTimeFormat('en-IN', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//   }).format(new Date(date));
// }

// export function RecentTransactions({
//   transactions,
// }: RecentTransactionsProps) {
//   if (!transactions.length) {
//     return (
//       <section className="flex h-95 flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
//         <div className="flex items-center gap-3">
//           <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
//             <ReceiptText className="size-5" />
//           </div>
//           <div>
//             <h2 className="text-base font-bold tracking-tight text-foreground">
//               Recent Transactions
//             </h2>
//             <p className="text-xs text-muted-foreground">
//               Your latest financial activity
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-1 flex-col items-center justify-center text-center">
//           <ReceiptText className="size-8 text-muted-foreground/50" />
//           <p className="mt-2 text-sm font-semibold text-foreground">
//             No transactions found
//           </p>
//           <p className="mt-0.5 text-xs text-muted-foreground">
//             Logged transactions for this period will appear here.
//           </p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="flex h-95 flex-col justify-between rounded-2xl border border-border/60 bg-card shadow-xs overflow-hidden">
//       {/* Fixed Header */}
//       <div className="flex items-center justify-between border-b border-border/60 p-5 shrink-0 sm:p-6">
//         <div className="flex items-center gap-3">
//           <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
//             <ReceiptText className="size-5" />
//           </div>
//           <div>
//             <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
//               Recent Transactions
//             </h2>
//             <p className="text-xs text-muted-foreground">
//               Your latest financial activity
//             </p>
//           </div>
//         </div>

//         <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
//           {transactions.length} items
//         </span>
//       </div>

//       {/* Scrollable Transactions List */}
//       <div className="flex-1 overflow-y-auto divide-y divide-border/50 [scrollbar-thin] [scrollbar-color:hsl(var(--border))_transparent]">
//         {transactions.map((transaction) => {
//           const category = getCategory(transaction.categoryId);
//           const isIncome = transaction.type === 'INCOME';

//           return (
//             <div
//               key={transaction._id}
//               className="group flex items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/30 sm:p-5"
//             >
//               {/* Left Details */}
//               <div className="flex min-w-0 items-center gap-3.5">
//                 {/* Category or Flow Icon */}
//                 <div
//                   className="flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
//                   style={{
//                     backgroundColor: category?.color
//                       ? `${category.color}15`
//                       : isIncome
//                         ? '#10b98115'
//                         : '#ef444415',
//                     color: category?.color
//                       ? category.color
//                       : isIncome
//                         ? '#10b981'
//                         : '#ef4444',
//                   }}
//                 >
//                   {category?.icon ? (
//                     <CategoryIcon name={category.icon} className="size-5" />
//                   ) : isIncome ? (
//                     <ArrowDownLeft className="size-5" />
//                   ) : (
//                     <ArrowUpRight className="size-5" />
//                   )}
//                 </div>

//                 <div className="min-w-0">
//                   <p className="truncate text-xs font-bold text-foreground sm:text-sm">
//                     {transaction.title}
//                   </p>

//                   <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
//                     {category && (
//                       <>
//                         <span className="font-medium text-foreground/80 truncate">
//                           {category.name}
//                         </span>
//                         <span>•</span>
//                       </>
//                     )}

//                     <span>{formatDate(transaction.transactionDate)}</span>

//                     {transaction.paymentMethod && (
//                       <>
//                         <span>•</span>
//                         <span className="inline-flex items-center gap-1 text-[11px] capitalize">
//                           <CreditCard className="size-3 shrink-0" />
//                           <span>
//                             {transaction.paymentMethod
//                               .toLowerCase()
//                               .replaceAll('_', ' ')}
//                           </span>
//                         </span>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Amount Display */}
//               <div
//                 className={`shrink-0 text-right text-xs font-extrabold sm:text-sm ${
//                   isIncome
//                     ? 'text-emerald-600 dark:text-emerald-400'
//                     : 'text-destructive'
//                 }`}
//               >
//                 {isIncome ? '+' : '-'}
//                 {formatCurrency(transaction.amount, transaction.currency)}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// }

"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  ReceiptText,
  CreditCard,
} from "lucide-react";

import type {
  DashboardRecentTransaction,
  DashboardCategory,
} from "@/types/dashboard.types";
import { CategoryIcon } from "@/features/categories/components/category-icon";

interface RecentTransactionsProps {
  transactions: DashboardRecentTransaction[];
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

export function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  if (!transactions.length) {
    return (
      <section className="flex h-95 w-full min-w-0 flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ReceiptText className="size-5" />
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Recent Transactions
            </h2>

            <p className="text-xs text-muted-foreground">
              Your latest financial activity
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-2 text-center">
          <ReceiptText className="size-8 text-muted-foreground/50" />

          <p className="mt-2 text-sm font-semibold text-foreground">
            No transactions found
          </p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Logged transactions for this period will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-95 w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xs">
      {/* Header */}
      <div className="flex min-w-0 shrink-0 items-center justify-between gap-3 border-b border-border/60 p-4 sm:p-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:size-10">
            <ReceiptText className="size-4 sm:size-5" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-bold tracking-tight text-foreground sm:text-lg">
              Recent Transactions
            </h2>

            <p className="truncate text-xs text-muted-foreground">
              Your latest financial activity
            </p>
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-secondary-foreground sm:px-2.5 sm:text-xs">
          {transactions.length} items
        </span>
      </div>

      {/* Transactions */}
      <div className="min-w-0 flex-1 divide-y divide-border/50 overflow-y-auto [scrollbar-color:hsl(var(--border))_transparent] [scrollbar-thin]">
        {transactions.map((transaction) => {
          const category = getCategory(transaction.categoryId);
          const isIncome = transaction.type === "INCOME";

          return (
            <div
              key={transaction._id}
              className="group flex min-w-0 items-start gap-2.5 p-3 transition-colors hover:bg-muted/30 sm:items-center sm:gap-4 sm:p-5"
            >
              {/* Left Side */}
              <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:items-center sm:gap-3.5">
                {/* Category Icon */}
                <div
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 sm:size-10"
                  style={{
                    backgroundColor: category?.color
                      ? `${category.color}15`
                      : isIncome
                        ? "#10b98115"
                        : "#ef444415",
                    color: category?.color
                      ? category.color
                      : isIncome
                        ? "#10b981"
                        : "#ef4444",
                  }}
                >
                  {category?.icon ? (
                    <CategoryIcon
                      name={category.icon}
                      className="size-4 sm:size-5"
                    />
                  ) : isIncome ? (
                    <ArrowDownLeft className="size-4 sm:size-5" />
                  ) : (
                    <ArrowUpRight className="size-4 sm:size-5" />
                  )}
                </div>

                {/* Transaction Details */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-foreground sm:text-sm">
                    {transaction.title}
                  </p>

                  <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[10px] text-muted-foreground sm:text-xs">
                    {category && (
                      <>
                        <span className="max-w-25 truncate font-medium text-foreground/80 sm:max-w-none">
                          {category.name}
                        </span>

                        <span>•</span>
                      </>
                    )}

                    <span className="shrink-0">
                      {formatDate(transaction.transactionDate)}
                    </span>

                    {transaction.paymentMethod && (
                      <>
                        <span>•</span>

                        <span className="inline-flex min-w-0 items-center gap-1 capitalize">
                          <CreditCard className="size-2.5 shrink-0 sm:size-3" />

                          <span className="truncate">
                            {transaction.paymentMethod
                              .toLowerCase()
                              .replaceAll("_", " ")}
                          </span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div
                className={`w-auto max-w-[34%] shrink-0 wrap-break-word text-right text-[11px] font-extrabold leading-tight sm:max-w-none sm:text-sm ${
                  isIncome
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-destructive"
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