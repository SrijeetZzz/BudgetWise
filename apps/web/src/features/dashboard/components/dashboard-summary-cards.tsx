// 'use client';

// import {
//   ArrowDownRight,
//   ArrowUpRight,
//   Wallet,
// } from 'lucide-react';

// import type { DashboardSummary } from '@/types/dashboard.types';

// interface DashboardSummaryCardsProps {
//   summary: DashboardSummary;
// }

// function formatCurrency(amount: number) {
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     maximumFractionDigits: 2,
//   }).format(amount);
// }

// export function DashboardSummaryCards({
//   summary,
// }: DashboardSummaryCardsProps) {
//   const cards = [
//     {
//       title: 'Total Income',
//       value: summary.totalIncome,
//       icon: ArrowUpRight,
//       iconClass:
//         'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
//       valueClass:
//         'text-emerald-600 dark:text-emerald-400',
//     },
//     {
//       title: 'Total Expense',
//       value: summary.totalExpense,
//       icon: ArrowDownRight,
//       iconClass:
//         'bg-destructive/10 text-destructive',
//       valueClass: 'text-destructive',
//     },
//     {
//       title: 'Balance',
//       value: summary.balance,
//       icon: Wallet,
//       iconClass: 'bg-primary/10 text-primary',
//       valueClass:
//         summary.balance >= 0
//           ? 'text-foreground'
//           : 'text-destructive',
//     },
//   ];

//   return (
//     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//       {cards.map((card) => {
//         const Icon = card.icon;

//         return (
//           <div
//             key={card.title}
//             className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
//           >
//             <div className="flex items-start justify-between">
//               <div>
//                 <p className="text-xs font-medium text-muted-foreground">
//                   {card.title}
//                 </p>

//                 <p
//                   className={`mt-2 text-xl font-bold tracking-tight sm:text-2xl ${card.valueClass}`}
//                 >
//                   {formatCurrency(card.value)}
//                 </p>
//               </div>

//               <div
//                 className={`flex size-10 items-center justify-center rounded-xl ${card.iconClass}`}
//               >
//                 <Icon className="size-5" />
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

'use client';

import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  TrendingUp,
  TrendingDown,
  Scale,
} from 'lucide-react';

import type { DashboardSummary } from '@/types/dashboard.types';

interface DashboardSummaryCardsProps {
  summary: DashboardSummary;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function DashboardSummaryCards({
  summary,
}: DashboardSummaryCardsProps) {
  const cards = [
    {
      title: 'Total Income',
      value: summary.totalIncome,
      subtitle: 'Recorded revenue',
      icon: ArrowUpRight,
      badgeIcon: TrendingUp,
      badgeText: 'Inflow',
      cardBorder: 'hover:border-emerald-500/30',
      iconClass:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
      valueClass: 'text-emerald-600 dark:text-emerald-400',
      badgeClass:
        'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
    },
    {
      title: 'Total Expense',
      value: summary.totalExpense,
      subtitle: 'Recorded outgoings',
      icon: ArrowDownRight,
      badgeIcon: TrendingDown,
      badgeText: 'Outflow',
      cardBorder: 'hover:border-destructive/30',
      iconClass:
        'bg-destructive/10 text-destructive border border-destructive/20',
      valueClass: 'text-destructive',
      badgeClass:
        'bg-destructive/10 text-destructive border-destructive/20',
    },
    {
      title: 'Net Balance',
      value: summary.balance,
      subtitle: 'Net available funds',
      icon: Wallet,
      badgeIcon: Scale,
      badgeText: summary.balance >= 0 ? 'Surplus' : 'Deficit',
      cardBorder: 'hover:border-primary/30',
      iconClass:
        'bg-primary/10 text-primary border border-primary/20',
      valueClass:
        summary.balance >= 0
          ? 'text-foreground'
          : 'text-destructive',
      badgeClass:
        summary.balance >= 0
          ? 'bg-primary/10 text-primary border-primary/20'
          : 'bg-destructive/10 text-destructive border-destructive/20',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const BadgeIcon = card.badgeIcon;

        return (
          <div
            key={card.title}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-xs transition-all duration-200 hover:shadow-md ${card.cardBorder}`}
          >
            <div>
              {/* Header: Title & Icon Badge */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {card.title}
                  </span>
                  <p
                    className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${card.valueClass}`}
                  >
                    {formatCurrency(card.value)}
                  </p>
                </div>

                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${card.iconClass}`}
                >
                  <Icon className="size-5" />
                </div>
              </div>
            </div>

            {/* Footer: Subtitle & Status Badge */}
            <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3">
              <span className="text-[11px] font-medium text-muted-foreground/80">
                {card.subtitle}
              </span>

              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${card.badgeClass}`}
              >
                <BadgeIcon className="size-3" />
                <span>{card.badgeText}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}