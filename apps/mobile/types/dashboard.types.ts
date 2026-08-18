/* =========================================================
   Dashboard Filters
========================================================= */

export type DashboardFilterType =
  | "TODAY"
  | "THIS_WEEK"
  | "THIS_MONTH"
  | "LAST_3_MONTHS"
  | "LAST_6_MONTHS"
  | "THIS_YEAR";

/* =========================================================
   Summary
========================================================= */

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

/* =========================================================
   Budget Summary
========================================================= */

export interface DashboardBudgetSummaryItem {
  totalBudgets: number;
  activeBudgets: number;
  expiredBudgets: number;
  totalBudgetAmount: number;
  totalSpent: number;
  totalRemaining: number;
  overBudgetCount: number;
}

export interface DashboardBudgetSummary {
  overall: DashboardBudgetSummaryItem;
  category: DashboardBudgetSummaryItem;
  subcategory: DashboardBudgetSummaryItem;
}

/* =========================================================
   Category Spending
========================================================= */

export interface DashboardCategorySpending {
  categoryId: string;
  name: string;
  icon?: string;
  color?: string;
  amount: number;
  percentage: number;
}

export interface DashboardSubcategorySpending {
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  icon?: string;
  color?: string;
  amount: number;
  percentage: number;
}

/* =========================================================
   Populated Category
========================================================= */

export interface DashboardCategory {
  _id: string;
  name: string;
  icon?: string;
  color?: string;
}

/* =========================================================
   Budget Alerts
========================================================= */

export interface DashboardBudgetAlert {
  _id: string;

  scope:
    | "OVERALL"
    | "CATEGORY"
    | "SUBCATEGORY";

  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  utilization: number;
  lastAlertThreshold: number;

  categoryId?:
    | string
    | DashboardCategory
    | null;

  subcategoryId?:
    | string
    | DashboardCategory
    | null;
}

/* =========================================================
   Recent Transactions
========================================================= */

export type DashboardTransactionType =
  | "INCOME"
  | "EXPENSE";

export type DashboardPaymentMethod =
  | "CASH"
  | "CARD"
  | "UPI"
  | "BANK_TRANSFER"
  | "WALLET"
  | "CHEQUE"
  | "OTHER";

export interface DashboardRecentTransaction {
  _id: string;
  title: string;
  amount: number;
  type: DashboardTransactionType;
  currency: string;
  paymentMethod?:
    | DashboardPaymentMethod
    | null;

  transactionDate: string;

  categoryId?:
    | string
    | DashboardCategory
    | null;

  subcategoryId?:
    | string
    | DashboardCategory
    | null;
}

/* =========================================================
   Monthly Comparison
========================================================= */

export type MonthlyComparisonTrend =
  | "INCREASE"
  | "DECREASE"
  | "NO_CHANGE";

export interface DashboardMonthlyComparison {
  currentExpense: number;
  previousExpense: number;
  difference: number;
  percentage: number;
  trend: MonthlyComparisonTrend;
}

/* =========================================================
   Budget Progress
========================================================= */

export interface DashboardBudgetProgress {
  scope:
    | "OVERALL"
    | "CATEGORY"
    | "SUBCATEGORY";

  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  utilization: number;

  categoryId?:
    | string
    | DashboardCategory
    | null;

  subcategoryId?:
    | string
    | DashboardCategory
    | null;
}

/* =========================================================
   Upcoming Recurring Transactions
========================================================= */

export type RecurrenceFrequency =
  | "DAILY"
  | "WEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "HALF_YEARLY"
  | "YEARLY";

export interface DashboardUpcomingRecurringTransaction {
  _id: string;
  title: string;
  amount: number;
  currency: string;
  type: DashboardTransactionType;

  recurrenceFrequency: RecurrenceFrequency;

  nextExecutionDate: string;

  categoryId?:
    | string
    | DashboardCategory
    | null;

  subcategoryId?:
    | string
    | DashboardCategory
    | null;
}

/* =========================================================
   Main Dashboard Response
========================================================= */

export interface DashboardData {
  summary: DashboardSummary;

  budgetSummary: DashboardBudgetSummary;

  topSpendingCategory:
    | DashboardCategorySpending
    | null;

  categoryWiseSpend:
    DashboardCategorySpending[];

  subcategoryWiseSpend:
    DashboardSubcategorySpending[];

  budgetAlerts:
    DashboardBudgetAlert[];

  recentTransactions:
    DashboardRecentTransaction[];

  monthlyComparison:
    DashboardMonthlyComparison;

  budgetProgress:
    DashboardBudgetProgress[];

  upcomingRecurringTransactions:
    DashboardUpcomingRecurringTransaction[];
}

/* =========================================================
   Dashboard Analytics
========================================================= */

export interface DashboardIncomeExpenseTrend {
  label: string;
  income: number;
  expense: number;
}

export interface DashboardExpenseTrend {
  label: string;
  expense: number;
  value: number;
}

export interface DashboardCategoryTrend {
  categoryId: string;
  name: string;
  icon?: string;
  color?: string;
  amount: number;
}

export interface DashboardPaymentMethodBreakdown {
  paymentMethod:
    | DashboardPaymentMethod
    | null;

  amount: number;
}

export interface DashboardCashFlowTrend {
  label: string;
  income: number;
  expense: number;
  balance: number;
}

export interface DashboardAnalytics {
  incomeVsExpenseTrend:
    DashboardIncomeExpenseTrend[];

  expenseTrend:
    DashboardExpenseTrend[];

  categoryTrend:
    DashboardCategoryTrend[];

  paymentMethodBreakdown:
    DashboardPaymentMethodBreakdown[];

  cashFlowTrend:
    DashboardCashFlowTrend[];
}

/* =========================================================
   API Query
========================================================= */

export interface DashboardQuery {
  filter?: DashboardFilterType;
}