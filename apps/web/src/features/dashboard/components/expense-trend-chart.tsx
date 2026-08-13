
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
import { TrendingDown } from 'lucide-react';

import type { DashboardExpenseTrend } from '@/types/dashboard.types';

interface ExpenseTrendChartProps {
  data: DashboardExpenseTrend[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function ExpenseTrendChart({ data }: ExpenseTrendChartProps) {
  const gradientId = useId();

  if (!data.length) {
    return (
      <section className="flex min-h-95 flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <TrendingDown className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Expense Trend
            </h2>
            <p className="text-xs text-muted-foreground">
              Track how your expenses changed over the selected period
            </p>
          </div>
        </div>

        <div className="flex min-h-55 items-center justify-center">
          <p className="text-xs font-medium text-muted-foreground">
            No expense data available for this period.
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
          <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <TrendingDown className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              Expense Trend
            </h2>
            <p className="text-xs text-muted-foreground">
              Expense fluctuation over time
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
          <span className="size-2.5 rounded-full bg-destructive" />
          <span>Outflow</span>
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
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
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
                  const item = payload[0];
                  return (
                    <div className="rounded-xl border border-border/60 bg-card p-3 shadow-md space-y-1">
                      <p className="text-xs font-bold text-foreground">
                        Period: {label}
                      </p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="size-2 rounded-full bg-destructive" />
                        <span className="font-medium text-muted-foreground">
                          Expense:
                        </span>
                        <span className="font-bold text-destructive">
                          {formatCurrency(Number(item.value))}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              name="Expense"
              stroke="#EF4444"
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}