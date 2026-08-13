// 'use client';

// import {
//   AlertTriangle,
//   CheckCircle2,
//   Wallet,
// } from 'lucide-react';

// import type {
//   DashboardBudgetSummary,
//   DashboardBudgetSummaryItem,
// } from '@/types/dashboard.types';

// interface DashboardBudgetSummaryProps {
//   budgetSummary: DashboardBudgetSummary;
// }

// function formatCurrency(amount: number) {
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     maximumFractionDigits: 2,
//   }).format(amount);
// }

// function BudgetSummaryCard({
//   title,
//   data,
// }: {
//   title: string;
//   data: DashboardBudgetSummaryItem;
// }) {
//   return (
//     <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-xs font-medium text-muted-foreground">
//             {title}
//           </p>

//           <p className="mt-1 text-lg font-bold tracking-tight">
//             {formatCurrency(data.totalBudgetAmount)}
//           </p>

//           <p className="mt-0.5 text-xs text-muted-foreground">
//             Total allocated
//           </p>
//         </div>

//         <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
//           <Wallet className="size-5" />
//         </div>
//       </div>

//       <div className="mt-5 grid grid-cols-2 gap-3">
//         <div className="rounded-xl bg-muted/40 p-3">
//           <p className="text-[11px] text-muted-foreground">
//             Spent
//           </p>

//           <p className="mt-1 text-sm font-semibold">
//             {formatCurrency(data.totalSpent)}
//           </p>
//         </div>

//         <div className="rounded-xl bg-muted/40 p-3">
//           <p className="text-[11px] text-muted-foreground">
//             Remaining
//           </p>

//           <p className="mt-1 text-sm font-semibold">
//             {formatCurrency(data.totalRemaining)}
//           </p>
//         </div>
//       </div>

//       <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
//         <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
//           <CheckCircle2 className="size-3.5" />
//           <span>
//             {data.activeBudgets} active
//           </span>
//         </div>

//         {data.overBudgetCount > 0 && (
//           <div className="flex items-center gap-1.5 text-xs font-medium text-destructive">
//             <AlertTriangle className="size-3.5" />

//             <span>
//               {data.overBudgetCount} over budget
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export function DashboardBudgetSummary({
//   budgetSummary,
// }: DashboardBudgetSummaryProps) {
//   return (
//     <section className="space-y-3">
//       <div>
//         <h2 className="text-base font-semibold tracking-tight">
//           Budget Overview
//         </h2>

//         <p className="text-xs text-muted-foreground">
//           Current budget allocation and spending status.
//         </p>
//       </div>

//       <div className="grid gap-4 md:grid-cols-3">
//         <BudgetSummaryCard
//           title="Overall"
//           data={budgetSummary.overall}
//         />

//         <BudgetSummaryCard
//           title="Category"
//           data={budgetSummary.category}
//         />

//         <BudgetSummaryCard
//           title="Subcategory"
//           data={budgetSummary.subcategory}
//         />
//       </div>
//     </section>
//   );
// }

'use client';

import {
  AlertTriangle,
  CheckCircle2,
  PieChart,
  Layers,
  FolderTree,
} from 'lucide-react';

import type {
  DashboardBudgetSummary,
  DashboardBudgetSummaryItem,
} from '@/types/dashboard.types';

interface DashboardBudgetSummaryProps {
  budgetSummary: DashboardBudgetSummary;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function BudgetSummaryCard({
  title,
  data,
  icon: Icon,
}: {
  title: string;
  data: DashboardBudgetSummaryItem;
  icon: React.ElementType;
}) {
  const isOverBudget = data.overBudgetCount > 0;
  
  // Calculate percentage used safely
  const percentUsed =
    data.totalBudgetAmount > 0
      ? Math.min(Math.round((data.totalSpent / data.totalBudgetAmount) * 100), 100)
      : 0;

  // Determine indicator colors based on usage state
  const getProgressColor = () => {
    if (isOverBudget || percentUsed >= 100) return 'bg-destructive';
    if (percentUsed >= 85) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card p-5 shadow-xs transition-all ${
        isOverBudget
          ? 'border-destructive/30 bg-destructive/5'
          : 'border-border/60 hover:border-border/80'
      }`}
    >
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <p className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {formatCurrency(data.totalBudgetAmount)}
            </p>
            <p className="text-[11px] text-muted-foreground">Total Allocated</p>
          </div>

          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
              isOverBudget
                ? 'bg-destructive/10 text-destructive'
                : 'bg-primary/10 text-primary'
            }`}
          >
            <Icon className="size-5" />
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Usage</span>
            <span
              className={`font-bold ${
                isOverBudget ? 'text-destructive' : 'text-foreground'
              }`}
            >
              {percentUsed}%
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
            <div
              className={`h-full transition-all duration-500 ease-out ${getProgressColor()}`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-border/40 bg-muted/30 p-2.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Spent
            </p>
            <p className="mt-0.5 text-xs font-bold text-foreground sm:text-sm">
              {formatCurrency(data.totalSpent)}
            </p>
          </div>

          <div className="rounded-xl border border-border/40 bg-muted/30 p-2.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Remaining
            </p>
            <p
              className={`mt-0.5 text-xs font-bold sm:text-sm ${
                data.totalRemaining < 0
                  ? 'text-destructive'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {formatCurrency(data.totalRemaining)}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Status Indicators */}
      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          <span>{data.activeBudgets} Active</span>
        </div>

        {isOverBudget ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
            <AlertTriangle className="size-3.5 animate-pulse" />
            <span>{data.overBudgetCount} Over Limit</span>
          </div>
        ) : (
          <span className="text-[11px] font-medium text-muted-foreground/80">
            On Track
          </span>
        )}
      </div>
    </div>
  );
}

export function DashboardBudgetSummary({
  budgetSummary,
}: DashboardBudgetSummaryProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
          Budget Overview
        </h2>
        <p className="text-xs text-muted-foreground">
          Current budget allocation and spending status across tiers
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <BudgetSummaryCard
          title="Overall"
          data={budgetSummary.overall}
          icon={PieChart}
        />

        <BudgetSummaryCard
          title="Categories"
          data={budgetSummary.category}
          icon={Layers}
        />

        <BudgetSummaryCard
          title="Subcategories"
          data={budgetSummary.subcategory}
          icon={FolderTree}
        />
      </div>
    </section>
  );
}