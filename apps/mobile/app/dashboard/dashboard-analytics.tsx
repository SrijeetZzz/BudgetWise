
import { useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  ArrowLeft,
} from "lucide-react-native";

import { useRouter } from "expo-router";

import AppHeader from "../../features/app/components/AppHeader";

import DashboardFilter from "../../features/dashboard/components/DashboardFilter";

import DashboardCategorySpending from "../../features/dashboard/components/DashboardCategorySpending";

import SpendingDonutChart from "../../features/dashboard/components/SpendingDonutChart";

import IncomeExpenseChart from "../../features/dashboard/components/IncomeExpenseChart";

import ExpenseTrendChart from "../../features/dashboard/components/ExpenseTrendChart";

import PaymentMethodBreakdownChart from "../../features/dashboard/components/PaymentMethodBreakdownChart";

import UpcomingRecurringTransactions from "../../features/dashboard/components/UpcomingRecurringTransactions";

import { useDashboard } from "../../features/dashboard/hooks/use-dashboard";

import { useDashboardAnalytics } from "../../features/dashboard/hooks/use-dashboard-analytics";

import type {
  DashboardFilterType,
} from "../../types/dashboard.types";

import { useTheme } from "../../providers/ThemeProvider";

/* =========================================================
   SCREEN
========================================================= */

export default function DashboardAnalytics() {
  const router = useRouter();

  const { theme } = useTheme();

  /* =======================================================
     FILTER
  ======================================================= */

  const [filter, setFilter] =
    useState<DashboardFilterType>(
      "THIS_MONTH",
    );

  /* =======================================================
     DASHBOARD DATA
  ======================================================= */

  const {
    data: dashboard,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    error: dashboardError,
  } = useDashboard({
    filter,
  });

  /* =======================================================
     ANALYTICS DATA
  ======================================================= */

  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
    error: analyticsError,
  } = useDashboardAnalytics({
    filter,
  });

  /* =======================================================
     COMBINED STATE
  ======================================================= */

  const isLoading =
    isDashboardLoading ||
    isAnalyticsLoading;

  const isError =
    isDashboardError ||
    isAnalyticsError;

  const error =
    dashboardError ||
    analyticsError;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.background,
        },
      ]}
    >
      {/* =================================================
          APP HEADER
      ================================================= */}

      <AppHeader />

      {/* =================================================
          SCROLLABLE CONTENT
      ================================================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <View style={styles.titleRow}>
          {/* ===============================================
              BACK BUTTON
          =============================================== */}

          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            style={({ pressed }) => [
              styles.backButton,
              {
                backgroundColor:
                  theme.surface,

                borderColor:
                  theme.border,
              },

              pressed &&
                styles.backButtonPressed,
            ]}
          >
            <ArrowLeft
              size={19}
              color={theme.text}
              strokeWidth={2.2}
            />
          </Pressable>

          {/* ===============================================
              TITLE
          =============================================== */}

          <View
            style={styles.titleContent}
          >
            <Text
              style={[
                styles.title,
                {
                  color: theme.text,
                },
              ]}
            >
              Financial Analytics
            </Text>

            <Text
              style={[
                styles.subtitle,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              Detailed breakdown of your
              financial activity.
            </Text>
          </View>
        </View>

        {/* =================================================
            FILTER
        ================================================= */}

        {!isError && (
          <View
            style={styles.filterSpacing}
          >
            <DashboardFilter
              value={filter}
              onChange={setFilter}
            />
          </View>
        )}

        {/* =================================================
            LOADING
        ================================================= */}

        {isLoading && (
          <View style={styles.loading}>
            <ActivityIndicator
              size="small"
              color={theme.text}
            />

            <Text
              style={[
                styles.loadingText,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              Loading analytics...
            </Text>
          </View>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {isError && !isLoading && (
          <View
            style={[
              styles.error,
              {
                backgroundColor:
                  "#FEF2F2",

                borderColor:
                  "#FECACA",
              },
            ]}
          >
            <Text
              style={[
                styles.errorText,
                {
                  color: "#DC2626",
                },
              ]}
            >
              Unable to load analytics.
            </Text>

            {error instanceof Error && (
              <Text
                style={[
                  styles.errorDetail,
                  {
                    color:
                      "#B91C1C",
                  },
                ]}
              >
                {error.message}
              </Text>
            )}
          </View>
        )}

        {/* =================================================
            SPENDING BY CATEGORY
        ================================================= */}

        {!isLoading &&
          !isError &&
          dashboard?.categoryWiseSpend && (
            <View style={styles.section}>
              <DashboardCategorySpending
                categories={
                  dashboard.categoryWiseSpend
                }
              />
            </View>
          )}

        {/* =================================================
            SUBCATEGORY BREAKDOWN
        ================================================= */}

        {!isLoading &&
          !isError &&
          dashboard?.subcategoryWiseSpend && (
            <View style={styles.section}>
              <SpendingDonutChart
                data={
                  dashboard.subcategoryWiseSpend
                }
                title="Subcategory Breakdown"
                description="Detailed breakdown of spending by subcategory"
              />
            </View>
          )}

        {/* =================================================
            INCOME VS EXPENSE
        ================================================= */}

        {!isLoading &&
          !isError &&
          analytics?.incomeVsExpenseTrend && (
            <View style={styles.section}>
              <IncomeExpenseChart
                data={
                  analytics.incomeVsExpenseTrend
                }
              />
            </View>
          )}

        {/* =================================================
            EXPENSE TREND
        ================================================= */}

        {!isLoading &&
          !isError &&
          analytics?.expenseTrend && (
            <View style={styles.section}>
              <ExpenseTrendChart
                data={
                  analytics.expenseTrend
                }
              />
            </View>
          )}

        {/* =================================================
            PAYMENT METHOD BREAKDOWN
        ================================================= */}

        {!isLoading &&
          !isError &&
          analytics?.paymentMethodBreakdown && (
            <View style={styles.section}>
              <PaymentMethodBreakdownChart
                data={
                  analytics.paymentMethodBreakdown
                }
              />
            </View>
          )}

        {/* =================================================
            UPCOMING RECURRING
        ================================================= */}

        {!isLoading &&
          !isError &&
          dashboard?.upcomingRecurringTransactions && (
            <View style={styles.section}>
              <UpcomingRecurringTransactions
                transactions={
                  dashboard.upcomingRecurringTransactions
                }
              />
            </View>
          )}

        {/* =================================================
            BOTTOM SPACING
        ================================================= */}

        <View
          style={styles.bottomSpacing}
        />
      </ScrollView>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  /* =======================================================
     SCREEN
  ======================================================= */

  container: {
    flex: 1,
  },

  /* =======================================================
     CONTENT
  ======================================================= */

  content: {
    paddingHorizontal: 16,

    paddingTop: 16,

    paddingBottom: 110,
  },

  /* =======================================================
     PAGE TITLE
  ======================================================= */

  titleRow: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 14,
  },

  backButton: {
    width: 40,

    height: 40,

    alignItems: "center",

    justifyContent: "center",

    marginRight: 10,

    borderRadius: 12,

    borderWidth: 1,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,

      height: 1,
    },

    shadowOpacity: 0.04,

    shadowRadius: 3,

    elevation: 2,
  },

  backButtonPressed: {
    opacity: 0.7,

    transform: [
      {
        scale: 0.96,
      },
    ],
  },

  titleContent: {
    flex: 1,

    minWidth: 0,
  },

  title: {
    fontSize: 22,

    fontWeight: "800",

    letterSpacing: -0.3,
  },

  subtitle: {
    marginTop: 3,

    fontSize: 11,

    fontWeight: "500",

    lineHeight: 16,
  },

  /* =======================================================
     FILTER SPACING
  ======================================================= */

  filterSpacing: {
    marginBottom: 20,
  },

  /* =======================================================
     SECTIONS
  ======================================================= */

  section: {
    width: "100%",

    marginBottom: 12,
  },

  /* =======================================================
     LOADING
  ======================================================= */

  loading: {
    minHeight: 150,

    alignItems: "center",

    justifyContent: "center",

    marginBottom: 12,
  },

  loadingText: {
    marginTop: 8,

    fontSize: 12,

    fontWeight: "500",
  },

  /* =======================================================
     ERROR
  ======================================================= */

  error: {
    marginBottom: 12,

    padding: 14,

    borderRadius: 14,

    borderWidth: 1,
  },

  errorText: {
    fontSize: 13,

    fontWeight: "700",
  },

  errorDetail: {
    marginTop: 4,

    fontSize: 11,

    fontWeight: "500",

    lineHeight: 16,
  },

  /* =======================================================
     BOTTOM SPACING
  ======================================================= */

  bottomSpacing: {
    height: 20,
  },
});