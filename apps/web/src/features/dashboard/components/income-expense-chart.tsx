
'use client';

import { useId } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

import type { DashboardIncomeExpenseTrend } from '@/types/dashboard.types';

interface IncomeExpenseChartProps {
  data: DashboardIncomeExpenseTrend[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  const incomeGradientId = useId();
  const expenseGradientId = useId();

  if (!data.length) {
    return (
      <section className="flex min-h-95 flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TrendingUp className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Income vs Expense
            </h2>
            <p className="text-xs text-muted-foreground">
              Compare your income and expenses over the selected period
            </p>
          </div>
        </div>

        <div className="flex min-h-55 items-center justify-center">
          <p className="text-xs font-medium text-muted-foreground">
            No transaction data available for this period.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TrendingUp className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              Income vs Expense
            </h2>
            <p className="text-xs text-muted-foreground">
              Cash inflow and outflow trend over time
            </p>
          </div>
        </div>

        {/* Custom Legend Header */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-emerald-500" />
            <span className="text-foreground">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-destructive" />
            <span className="text-foreground">Expense</span>
          </div>
        </div>
      </div>

      {/* Area Chart Container */}
      <div className="mt-4 h-70 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -15,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id={incomeGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id={expenseGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-border/50"
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-muted-foreground"
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-muted-foreground"
              tickFormatter={(val) => formatCurrency(Number(val))}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-border/60 bg-card p-3 shadow-md space-y-1.5">
                      <p className="text-xs font-bold text-foreground">
                        Period: {label}
                      </p>
                      <div className="space-y-1">
                        {payload.map((entry, index) => {
                          const isIncome = entry.dataKey === 'income';
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-3 text-xs justify-between"
                            >
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`size-2 rounded-full ${
                                    isIncome ? 'bg-emerald-500' : 'bg-destructive'
                                  }`}
                                />
                                <span className="font-medium text-muted-foreground">
                                  {isIncome ? 'Income' : 'Expense'}:
                                </span>
                              </div>
                              <span
                                className={`font-bold ${
                                  isIncome
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-destructive'
                                }`}
                              >
                                {formatCurrency(Number(entry.value))}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#10B981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${incomeGradientId})`}
            />

            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#EF4444"
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${expenseGradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}