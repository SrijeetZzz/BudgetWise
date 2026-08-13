'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { DashboardCategoryTrend } from '@/types/dashboard.types';

interface CategoryTrendChartProps {
  data: DashboardCategoryTrend[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function CategoryTrendChart({
  data,
}: CategoryTrendChartProps) {
  if (!data.length) {
    return (
      <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold">
          Spending by Category
        </h2>

        <p className="mt-1 text-xs text-muted-foreground">
          Compare your expenses across categories.
        </p>

        <div className="flex min-h-72 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            No category spending data available.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-sm font-semibold">
          Spending by Category
        </h2>

        <p className="mt-1 text-xs text-muted-foreground">
          Compare your expenses across categories.
        </p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
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
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={60}
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
                'Expense',
              ]}
            />

            <Bar
              dataKey="amount"
              name="Expense"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}