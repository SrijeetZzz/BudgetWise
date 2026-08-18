
'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

import type { DashboardCategorySpending } from '@/types/dashboard.types';

interface DashboardCategorySpendingProps {
  categories: DashboardCategorySpending[];
}

const DEFAULT_COLORS = [
  '#3B82F6', // Blue
  '#F97316', // Orange
  '#10B981', // Emerald
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#EAB308', // Amber
  '#64748B', // Slate
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function DashboardCategorySpending({
  categories,
}: DashboardCategorySpendingProps) {
  const totalExpense = useMemo(
    () => categories.reduce((acc, cat) => acc + cat.amount, 0),
    [categories],
  );

  const chartData = useMemo(
    () =>
      categories.map((cat, idx) => ({
        ...cat,
        color: cat.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
      })),
    [categories],
  );

  if (!categories.length) {
    return (
      <section className="flex h-95 flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PieChartIcon className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Spending by Category
            </h2>
            <p className="text-xs text-muted-foreground">
              Your spending breakdown for the selected period
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <p className="text-xs font-medium text-muted-foreground">
            No expense data recorded for this period.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-95 flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <PieChartIcon className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              Spending by Category
            </h2>
            <p className="text-xs text-muted-foreground">
              Expense distribution across categories
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Total Spent
          </span>
          <p className="text-sm font-extrabold text-foreground sm:text-base">
            {formatCurrency(totalExpense)}
          </p>
        </div>
      </div>

      {/* Donut Chart & Legend Side-by-Side */}
      <div className="mt-4 grid grid-cols-1 items-center gap-6 md:grid-cols-12">
        {/* Donut Visual */}
        <div className="relative flex h-60 w-full items-center justify-center md:col-span-5">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as typeof chartData[0];
                    return (
                      <div className="rounded-xl border border-border/60 bg-card p-3 shadow-md">
                        <div className="flex items-center gap-2">
                          <span
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <p className="text-xs font-bold text-foreground">
                            {item.name}
                          </p>
                        </div>
                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                          {formatCurrency(item.amount)}{' '}
                          <span className="text-[10px] font-normal">
                            ({item.percentage.toFixed(1)}%)
                          </span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                dataKey="amount"
                stroke="none"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.categoryId}
                    fill={entry.color}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Donut Total Label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Categories
            </span>
            <span className="text-lg font-extrabold text-foreground">
              {categories.length}
            </span>
          </div>
        </div>

        {/* Scrollable Category Legend List */}
        <div className="max-h-62.5 space-y-2.5 overflow-y-auto pr-1 md:col-span-7 [scrollbar-thin] [scrollbar-color:hsl(var(--border))_transparent]">
          {chartData.map((cat) => {
            const pct = Math.min(Math.max(cat.percentage, 0), 100);

            return (
              <div
                key={cat.categoryId}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-muted/20 p-2.5 transition-colors hover:bg-muted/40"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="size-3 shrink-0 rounded-full transition-transform group-hover:scale-110"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="truncate text-xs font-semibold text-foreground sm:text-sm">
                    {cat.name}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {pct.toFixed(1)}%
                  </span>
                  <span className="text-xs font-bold text-foreground sm:text-sm">
                    {formatCurrency(cat.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}