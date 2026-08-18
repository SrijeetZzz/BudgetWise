

import { useState } from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import AppHeader from "../../features/app/components/AppHeader";

import DashboardFilter from "../../features/dashboard/components/DashboardFilter";

import DashboardSummaryCards from "../../features/dashboard/components/DashboardSummaryCards";

import MonthlyComparison from "../../features/dashboard/components/MonthlyComparison";

import DashboardCategorySpending from "../../features/dashboard/components/DashboardCategorySpending";

import BudgetAlerts from "../../features/dashboard/components/BudgetAlerts";

import RecentTransactions from "../../features/dashboard/components/RecentTransactions";

import { useDashboard } from "../../features/dashboard/hooks/use-dashboard";

import type {
  DashboardFilterType,
} from "../../types/dashboard.types";

import { useTheme } from "../../providers/ThemeProvider";

/* =========================================================
   SCREEN
========================================================= */

export default function AppHome() {
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
     
     GET /dashboard?filter=THIS_MONTH
     
     Analytics data is intentionally NOT fetched here.
     The detailed analytics screen handles that separately.
  ======================================================= */

  const {
    data: dashboard,
    isLoading,
    isError,
    error,
  } = useDashboard({
    filter,
  });

  /* =======================================================
     DATA
  ======================================================= */

  const summary = dashboard?.summary;

  const monthlyComparison =
    dashboard?.monthlyComparison;

  /* =======================================================
     VIEW MORE
     
     Opens:
     
     /dashboard/dashboard-analytics
  ======================================================= */

  const handleViewMore = () => {
    router.push(
      "/dashboard/dashboard-analytics",
    );
  };

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
          CONTENT
      ================================================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {/* =================================================
            DASHBOARD HEADING
        ================================================= */}

        <View style={styles.heading}>
          <Text
            style={[
              styles.title,
              {
                color: theme.text,
              },
            ]}
          >
            Dashboard
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
            Overview of your financial
            activity and spending.
          </Text>
        </View>

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
              Loading dashboard...
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
                  theme.background ===
                    "#111111"
                    ? "#351717"
                    : "#FEF2F2",

                borderColor:
                  theme.background ===
                    "#111111"
                    ? "#7F1D1D"
                    : "#FECACA",
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
              Unable to load dashboard
              data.
            </Text>

            {error instanceof Error && (
              <Text
                style={[
                  styles.errorDetail,
                  {
                    color:
                      theme.background ===
                        "#111111"
                        ? "#FCA5A5"
                        : "#B91C1C",
                  },
                ]}
              >
                {error.message}
              </Text>
            )}
          </View>
        )}

        {/* =================================================
            FILTER + MONTHLY COMPARISON
        ================================================= */}

        {!isLoading && !isError && (
          <View style={styles.periodRow}>
            {/* =============================================
                PERIOD FILTER
            ============================================= */}

            <View
              style={styles.filterWrapper}
            >
              <DashboardFilter
                value={filter}
                onChange={setFilter}
              />
            </View>

            {/* =============================================
                MONTHLY COMPARISON
            ============================================= */}

            {monthlyComparison && (
              <View
                style={
                  styles.comparisonWrapper
                }
              >
                <MonthlyComparison
                  data={monthlyComparison}
                />
              </View>
            )}
          </View>
        )}

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        {!isLoading &&
          !isError &&
          summary && (
            <View style={styles.section}>
              <DashboardSummaryCards
                summary={summary}
              />
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
                onViewMore={
                  handleViewMore
                }
              />
            </View>
          )}

        {/* =================================================
            RECENT TRANSACTIONS
        ================================================= */}

        {!isLoading &&
          !isError &&
          dashboard?.recentTransactions && (
            <View style={styles.section}>
              <RecentTransactions
                transactions={
                  dashboard.recentTransactions
                }
              />
            </View>
          )}

        {/* =================================================
            BUDGET ALERTS
        ================================================= */}

        {!isLoading &&
          !isError &&
          dashboard?.budgetAlerts && (
            <View style={styles.section}>
              <BudgetAlerts
                alerts={
                  dashboard.budgetAlerts
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

    /*
     * Space for floating bottom navigation.
     */

    paddingBottom: 110,
  },

  /* =======================================================
     HEADING
  ======================================================= */

  heading: {
    marginBottom: 14,
  },

  title: {
    fontSize: 24,

    fontWeight: "800",
  },

  subtitle: {
    marginTop: 4,

    fontSize: 12,

    fontWeight: "500",

    lineHeight: 17,
  },

  /* =======================================================
     FILTER + MONTHLY COMPARISON
  ======================================================= */

  periodRow: {
    width: "100%",

    flexDirection: "row",

    alignItems: "center",

    gap: 8,

    marginBottom: 12,

    /*
     * Important because both the filter dropdown
     * and monthly comparison can use absolute popovers.
     */

    zIndex: 100,
  },

  filterWrapper: {
    width: 180,

    flexShrink: 0,

    zIndex: 110,
  },

  comparisonWrapper: {
    flex: 1,

    minWidth: 0,

    zIndex: 100,
  },

  /* =======================================================
     GENERAL SECTION
  ======================================================= */

  section: {
    width: "100%",

    marginBottom: 12,
  },

  /* =======================================================
     LOADING
  ======================================================= */

  loading: {
    minHeight: 120,

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