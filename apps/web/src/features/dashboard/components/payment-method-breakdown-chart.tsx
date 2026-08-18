

'use client';

import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CreditCard } from 'lucide-react';

import type { DashboardPaymentMethodBreakdown } from '@/types/dashboard.types';

interface PaymentMethodBreakdownChartProps {
  data: DashboardPaymentMethodBreakdown[];
}

const METHOD_COLORS: Record<string, string> = {
  UPI: '#3B82F6', // Blue
  Card: '#8B5CF6', // Purple
  Cash: '#10B981', // Emerald
  'Bank Transfer': '#F59E0B', // Amber
  Wallet: '#EC4899', // Pink
  Cheque: '#64748B', // Slate
  Other: '#06B6D4', // Cyan
};

const DEFAULT_COLORS = [
  '#3B82F6',
  '#8B5CF6',
  '#10B981',
  '#F59E0B',
  '#EC4899',
  '#06B6D4',
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPaymentMethod(value: string | null) {
  if (!value) return 'Unknown';

  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function PaymentMethodBreakdownChart({
  data,
}: PaymentMethodBreakdownChartProps) {
  const chartData = useMemo(() => {
    return data.map((item, idx) => {
      const name = formatPaymentMethod(item.paymentMethod);
      return {
        name,
        amount: item.amount,
        color: METHOD_COLORS[name] || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
      };
    });
  }, [data]);

  const total = useMemo(
    () => chartData.reduce((sum, item) => sum + item.amount, 0),
    [chartData],
  );

  if (!chartData.length || total === 0) {
    return (
      <section className="flex min-h-95 flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CreditCard className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Payment Method Breakdown
            </h2>
            <p className="text-xs text-muted-foreground">
              Expenses distributed across payment methods
            </p>
          </div>
        </div>

        <div className="flex min-h-55 items-center justify-center">
          <p className="text-xs font-medium text-muted-foreground">
            No payment data available for this period.
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
            <CreditCard className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              Payment Method Breakdown
            </h2>
            <p className="text-xs text-muted-foreground">
              Expenses distributed across payment methods
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Total Paid
          </span>
          <p className="text-sm font-extrabold text-foreground sm:text-base">
            {formatCurrency(total)}
          </p>
        </div>
      </div>

      {/* Donut Chart & Custom Legend Grid */}
      <div className="mt-4 grid grid-cols-1 items-center gap-6 md:grid-cols-12">
        {/* Donut Chart */}
        <div className="relative flex h-60 w-full items-center justify-center md:col-span-5">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as typeof chartData[0];
                    const percentage = total === 0 ? 0 : (item.amount / total) * 100;
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
                            ({percentage.toFixed(1)}%)
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
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`payment-${index}`}
                    fill={entry.color}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Donut Label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Methods
            </span>
            <span className="text-lg font-extrabold text-foreground">
              {chartData.length}
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-2.5 md:col-span-7">
          {chartData.map((item) => {
            const percentage = total === 0 ? 0 : (item.amount / total) * 100;

            return (
              <div
                key={item.name}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-muted/20 p-2.5 transition-colors hover:bg-muted/40"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="size-3 shrink-0 rounded-full transition-transform group-hover:scale-110"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-xs font-semibold text-foreground sm:text-sm">
                    {item.name}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {percentage.toFixed(1)}%
                  </span>
                  <span className="text-xs font-bold text-foreground sm:text-sm">
                    {formatCurrency(item.amount)}
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