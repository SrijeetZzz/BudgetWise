
'use client';

import { AlertTriangle, Bell, CheckCircle2, Wallet } from 'lucide-react';

import type {
  DashboardBudgetAlert,
  DashboardCategory,
} from '@/types/dashboard.types';

interface BudgetAlertsProps {
  alerts: DashboardBudgetAlert[];
}

function getCategory(
  value: string | DashboardCategory | null | undefined,
) {
  if (!value || typeof value === 'string') {
    return null;
  }
  return value;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getBudgetName(alert: DashboardBudgetAlert) {
  const category = getCategory(alert.categoryId);
  const subcategory = getCategory(alert.subcategoryId);

  if (alert.scope === 'OVERALL') {
    return 'Overall Budget';
  }

  if (alert.scope === 'SUBCATEGORY' && subcategory) {
    return subcategory.name;
  }

  return category?.name ?? 'Category Budget';
}

function getAlertMessage(threshold: number) {
  if (threshold >= 100) {
    return 'Budget exceeded';
  }
  if (threshold >= 90) {
    return 'Budget almost exhausted';
  }
  if (threshold >= 75) {
    return 'Budget usage is high';
  }
  return 'Threshold reached';
}

export function BudgetAlerts({ alerts }: BudgetAlertsProps) {
  if (!alerts.length) {
    return (
      <section className="flex h-95 flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Bell className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground">
              Budget Alerts
            </h2>
            <p className="text-xs text-muted-foreground">
              Budgets approaching or exceeding limits
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-6" />
          </div>
          <p className="mt-3 text-sm font-semibold text-foreground">
            All budgets on track
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            No budget alerts triggered for this period.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-95 flex-col justify-between rounded-2xl border border-border/60 bg-card shadow-xs overflow-hidden">
      {/* Fixed Header */}
      <div className="flex items-center justify-between border-b border-border/60 p-5 shrink-0 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Bell className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              Budget Alerts
            </h2>
            <p className="text-xs text-muted-foreground">
              Budgets approaching or exceeding limits
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-500/20">
          <AlertTriangle className="size-3" />
          <span>{alerts.length} Active</span>
        </span>
      </div>

      {/* Scrollable Alerts List */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/50 [scrollbar-thin] [scrollbar-color:hsl(var(--border))_transparent]">
        {alerts.map((alert) => {
          const threshold = alert.lastAlertThreshold;
          const exceeded =
            threshold >= 100 || alert.spentAmount > alert.budgetAmount;

          const utilization = Math.min(
            Math.max(alert.utilization, 0),
            100,
          );

          return (
            <div
              key={alert._id}
              className="group flex flex-col gap-3 p-4 transition-colors hover:bg-muted/30 sm:p-5"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left Info */}
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
                      exceeded
                        ? 'bg-destructive/10 text-destructive border border-destructive/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {exceeded ? (
                      <AlertTriangle className="size-5" />
                    ) : (
                      <Wallet className="size-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-xs font-bold text-foreground sm:text-sm">
                        {getBudgetName(alert)}
                      </p>
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                          exceeded
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {getAlertMessage(threshold)}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>
                        Spent:{' '}
                        <strong className="text-foreground">
                          {formatCurrency(alert.spentAmount)}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Budget:{' '}
                        <strong className="text-foreground">
                          {formatCurrency(alert.budgetAmount)}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Percentage Display */}
                <div className="shrink-0 text-right">
                  <p
                    className={`text-sm font-extrabold sm:text-base ${
                      exceeded ? 'text-destructive' : 'text-foreground'
                    }`}
                  >
                    {alert.utilization.toFixed(1)}%
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    used
                  </p>
                </div>
              </div>

              {/* Progress Line */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
                <div
                  className={`h-full transition-all duration-500 ${
                    exceeded ? 'bg-destructive' : 'bg-amber-500'
                  }`}
                  style={{ width: `${utilization}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}