

import { Types } from "mongoose";

import { dashboardRepository } from "../repositories/dashboard.repository";
import { DashboardQueryDto } from "../dtos/dashboard-query.dto";
import { getDashboardDateRange } from "../../../common/helpers/dashboard-date-range";
import { DashboardFilter } from "../../../common/enums/dashboard-filter.enum";
import { formatTimeSeriesData } from "../../../common/helpers/dashboard-analytics.helper";

import { cacheService } from "../../../common/services/cache.service";
import {
  DASHBOARD_CACHE_TTL,
  getDashboardCacheKey,
  getDashboardAnalyticsCacheKey,
} from "../constants/dashboard-cache.constants";

class DashboardService {
  async getDashboard(userId: Types.ObjectId, query: DashboardQueryDto) {
    const filter = query.filter ?? DashboardFilter.THIS_MONTH;

    const cacheKey = getDashboardCacheKey(
      userId.toString(),
      filter,
    );

    // Check Redis first
    const cachedDashboard = await cacheService.get(cacheKey);

    if (cachedDashboard) {
      return cachedDashboard;
    }

    const { startDate, endDate } = getDashboardDateRange(filter);

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
      dashboardRepository.getDashboardSummary(
        userId,
        startDate,
        endDate,
      ),

      // Budgets remain current and are not filtered by transaction date
      dashboardRepository.getBudgetSummary(userId),

      dashboardRepository.getCategoryWiseSpending(
        userId,
        startDate,
        endDate,
      ),

      dashboardRepository.getSubcategoryWiseSpending(
        userId,
        startDate,
        endDate,
      ),

      dashboardRepository.getBudgetAlerts(userId),

      dashboardRepository.getRecentTransactions(
        userId,
        startDate,
        endDate,
      ),

      dashboardRepository.getMonthlyComparison(userId),

      dashboardRepository.getBudgetProgress(userId),

      dashboardRepository.getUpcomingRecurringTransactions(userId),
    ]);

    const result = {
      summary,

      budgetSummary,

      topSpendingCategory:
        categoryWiseSpend.length > 0
          ? categoryWiseSpend[0]
          : null,

      categoryWiseSpend,

      subcategoryWiseSpend,

      budgetAlerts,

      recentTransactions,

      monthlyComparison,

      budgetProgress,

      upcomingRecurringTransactions,
    };

    // Store dashboard result in Redis
    await cacheService.set(
      cacheKey,
      result,
      DASHBOARD_CACHE_TTL,
    );

    return result;
  }

  async getDashboardAnalytics(
    userId: Types.ObjectId,
    query: DashboardQueryDto,
  ) {
    const filter = query.filter ?? DashboardFilter.THIS_MONTH;

    const cacheKey = getDashboardAnalyticsCacheKey(
      userId.toString(),
      filter,
    );

    // Check Redis first
    const cachedAnalytics = await cacheService.get(cacheKey);

    if (cachedAnalytics) {
      return cachedAnalytics;
    }

    const { startDate, endDate } = getDashboardDateRange(filter);

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
        filter,
      ),

      dashboardRepository.getExpenseTrend(
        userId,
        startDate,
        endDate,
        filter,
      ),

      dashboardRepository.getCategoryTrend(
        userId,
        startDate,
        endDate,
      ),

      dashboardRepository.getPaymentMethodBreakdown(
        userId,
        startDate,
        endDate,
      ),

      dashboardRepository.getCashFlowTrend(
        userId,
        startDate,
        endDate,
        filter,
      ),
    ]);

    const result = {
      incomeVsExpenseTrend: formatTimeSeriesData(
        incomeVsExpenseTrend,
        filter,
      ),

      expenseTrend: formatTimeSeriesData(
        expenseTrend,
        filter,
      ),

      categoryTrend,

      paymentMethodBreakdown,

      cashFlowTrend: formatTimeSeriesData(
        cashFlowTrend,
        filter,
      ),
    };

    // Store analytics result in Redis
    await cacheService.set(
      cacheKey,
      result,
      DASHBOARD_CACHE_TTL,
    );

    return result;
  }
}

export const dashboardService = new DashboardService();