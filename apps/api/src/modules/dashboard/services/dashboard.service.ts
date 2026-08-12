import { Types } from "mongoose";

import { dashboardRepository } from "../repositories/dashboard.repository";
import { DashboardQueryDto } from "../dtos/dashboard-query.dto";
import { getDashboardDateRange } from "../../../common/helpers/dashboard-date-range";
import { DashboardFilter } from "../../../common/enums/dashboard-filter.enum";
import { formatTimeSeriesData } from "../../../common/helpers/dashboard-analytics.helper";
class DashboardService {
  async getDashboard(userId: Types.ObjectId, query: DashboardQueryDto) {
    const { startDate, endDate } = getDashboardDateRange(query.filter);

    const [
      summary,
      budgetSummary,
      categoryWiseSpend,
      subcategoryWiseSpend,
      budgetAlerts,
      recentTransactions,
      monthlyComparison,
      budgetProgress,
      upcomingRecurringTransactions,
    ] = await Promise.all([
      dashboardRepository.getDashboardSummary(userId, startDate, endDate),

      // Budgets remain current and are not filtered by transaction date
      dashboardRepository.getBudgetSummary(userId),

      dashboardRepository.getCategoryWiseSpending(userId, startDate, endDate),

      dashboardRepository.getSubcategoryWiseSpending(
        userId,
        startDate,
        endDate,
      ),

      dashboardRepository.getBudgetAlerts(userId),

      dashboardRepository.getRecentTransactions(userId, startDate, endDate),

      dashboardRepository.getMonthlyComparison(userId),

      dashboardRepository.getBudgetProgress(userId),
      dashboardRepository.getUpcomingRecurringTransactions(userId),
    ]);

    return {
      summary,

      budgetSummary,

      topSpendingCategory:
        categoryWiseSpend.length > 0 ? categoryWiseSpend[0] : null,

      categoryWiseSpend,

      subcategoryWiseSpend,

      budgetAlerts,

      recentTransactions,

      monthlyComparison,
      budgetProgress,
      upcomingRecurringTransactions,
    };
  }
  async getDashboardAnalytics(
    userId: Types.ObjectId,
    query: DashboardQueryDto,
  ) {
    const filter = query.filter ?? DashboardFilter.THIS_MONTH;
    const { startDate, endDate } = getDashboardDateRange(query.filter);

    const [
      incomeVsExpenseTrend,
      expenseTrend,
      categoryTrend,
      paymentMethodBreakdown,
      cashFlowTrend,
    ] = await Promise.all([
      dashboardRepository.getIncomeVsExpenseTrend(
        userId,
        startDate,
        endDate,
        query.filter,
      ),

      dashboardRepository.getExpenseTrend(userId, startDate, endDate, filter),

      dashboardRepository.getCategoryTrend(userId, startDate, endDate),

      dashboardRepository.getPaymentMethodBreakdown(userId, startDate, endDate),

      dashboardRepository.getCashFlowTrend(userId, startDate, endDate, filter),
    ]);
    return {
      incomeVsExpenseTrend: formatTimeSeriesData(incomeVsExpenseTrend, filter),

      expenseTrend: formatTimeSeriesData(expenseTrend, filter),

      categoryTrend,

      paymentMethodBreakdown,

      cashFlowTrend: formatTimeSeriesData(cashFlowTrend, filter),
    };
  }
}

export const dashboardService = new DashboardService();
