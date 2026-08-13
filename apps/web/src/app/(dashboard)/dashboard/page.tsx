
"use client";

import { useState } from "react";

import { DashboardFilter } from "@/features/dashboard/components/dashboard-filter";
import { DashboardSummaryCards } from "@/features/dashboard/components/dashboard-summary-cards";
import { DashboardBudgetSummary } from "@/features/dashboard/components/dashboard-budget-summary";
import { DashboardCategorySpending } from "@/features/dashboard/components/dashboard-category-spending";
import { SpendingDonutChart } from "@/features/dashboard/components/spending-donut-chart";

import { useDashboard } from "@/features/dashboard/hooks/use-dashboard";
import { useDashboardAnalytics } from "@/features/dashboard/hooks/use-dashboard-analytics";

import type { DashboardFilterType } from "@/types/dashboard.types";
import { IncomeExpenseChart } from "@/features/dashboard/components/income-expense-chart";
import { ExpenseTrendChart } from "@/features/dashboard/components/expense-trend-chart";
import { PaymentMethodBreakdownChart } from "@/features/dashboard/components/payment-method-breakdown-chart";
import { RecentTransactions } from "@/features/dashboard/components/recent-transactions";
import { BudgetAlerts } from "@/features/dashboard/components/budget-alerts";
import { UpcomingRecurringTransactions } from "@/features/dashboard/components/upcoming-recurring-transactions";
import { MonthlyComparison } from "@/features/dashboard/components/monthly-comparison";

export default function DashboardPage() {
  const [filter, setFilter] = useState<DashboardFilterType>("THIS_MONTH");

  const query = { filter };

  const {
    data: dashboard,
    isLoading: dashboardLoading,
    isError: dashboardError,
  } = useDashboard(query);

  const {
    data: analytics,
    isLoading: analyticsLoading,
    isError: analyticsError,
  } = useDashboardAnalytics(query);

  const isLoading = dashboardLoading || analyticsLoading;
  const isError = dashboardError || analyticsError;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      {/* Header with Monthly Comparison on the Right */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Overview of your financial activity and spending.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!isLoading && !isError && dashboard && (
            <MonthlyComparison data={dashboard.monthlyComparison} />
          )}
          <DashboardFilter value={filter} onChange={setFilter} />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-2xl border border-border/60 bg-card p-6 text-sm text-muted-foreground shadow-xs">
          Loading dashboard...
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-sm font-medium text-destructive">
          Unable to load dashboard data. Please try again.
        </div>
      )}

      {/* Main Dashboard Content */}
      {!isLoading && !isError && dashboard && (
        <div className="space-y-6">
          {/* Top Section: KPI Stats & Budget Overview */}
          <DashboardSummaryCards summary={dashboard.summary} />
          <DashboardBudgetSummary budgetSummary={dashboard.budgetSummary} />

          {/* Spending Analytics (Category & Subcategory Side-by-Side) */}
          <div className="grid gap-6 lg:grid-cols-2">
            <DashboardCategorySpending
              categories={dashboard.categoryWiseSpend}
            />
            {dashboard.subcategoryWiseSpend && (
              <SpendingDonutChart
                data={dashboard.subcategoryWiseSpend}
                title="Subcategory Breakdown"
                description="Detailed breakdown of spending by subcategory"
              />
            )}
          </div>

          {/* Trends: Income vs Expense & Expense Trend Side-by-Side */}
          {analytics && (
            <div className="grid gap-6 lg:grid-cols-2">
              <IncomeExpenseChart data={analytics.incomeVsExpenseTrend} />
              <ExpenseTrendChart data={analytics.expenseTrend} />
            </div>
          )}

          {/* Payment Method Breakdown Pie Chart & Budget Alerts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {analytics && (
              <PaymentMethodBreakdownChart
                data={analytics.paymentMethodBreakdown}
              />
            )}
            <BudgetAlerts alerts={dashboard.budgetAlerts} />
          </div>

          {/* Activity Section: Recent Transactions & Upcoming Recurring */}
          <div className="grid gap-6 lg:grid-cols-2">
            <RecentTransactions
              transactions={dashboard.recentTransactions}
            />
            <UpcomingRecurringTransactions
              transactions={dashboard.upcomingRecurringTransactions}
            />
          </div>
        </div>
      )}
    </main>
  );
}