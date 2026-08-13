'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { DashboardCashFlowTrend } from '@/types/dashboard.types';

interface CashFlowTrendChartProps {
  data: DashboardCashFlowTrend[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function CashFlowTrendChart({
  data,
}: CashFlowTrendChartProps) {
  if (!data.length) {
    return (
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold">Cash Flow Trend</h2>

        <p className="mt-1 text-xs text-muted-foreground">
          Track your net cash flow over the selected period.
        </p>

        <div className="flex min-h-72 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            No cash flow data available for this period.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-sm font-semibold">
          Cash Flow Trend
        </h2>

        <p className="mt-1 text-xs text-muted-foreground">
          Track your net cash flow over the selected period.
        </p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={(value) =>
                formatCurrency(Number(value))
              }
            />

            <Tooltip
              formatter={(value) => [
                formatCurrency(Number(value)),
                'Net Cash Flow',
              ]}
              labelFormatter={(label) =>
                `Period: ${label}`
              }
            />

            <Line
              type="monotone"
              dataKey="balance"
              name="Net Cash Flow"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}