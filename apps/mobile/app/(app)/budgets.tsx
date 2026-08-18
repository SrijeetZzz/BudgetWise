
import {
  Plus,
  SlidersHorizontal,
} from "lucide-react-native";

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";
import { useState } from "react";

import { useTheme } from "../../providers/ThemeProvider";

import AppHeader from "../../features/app/components/AppHeader";

import type { BudgetQuery } from "../../types/budget.types";

import { useBudgets } from "../../features/budgets/hooks/use-budgets";
import { BudgetList } from "../../features/budgets/components/BudgetList";
import { BudgetFilters } from "../../features/budgets/components/BudgetFilters";

export default function BudgetsScreen() {
  const { theme } = useTheme();

  /*
   * =========================================================
   * FILTER STATE
   * =========================================================
   */

  const [filters, setFilters] =
    useState<BudgetQuery>({
      page: 1,
      limit: 10,

      period: "MONTHLY",
      status: "ACTIVE",

      sortBy: "createdAt",
      sortOrder: "desc",
    });

  /*
   * =========================================================
   * DATA
   * =========================================================
   */

  const {
    data,
    isLoading,
    isError,
  } = useBudgets(filters);

  const budgets =
    data?.budgets ?? [];

  const pagination =
    data?.pagination;

  /*
   * =========================================================
   * CREATE
   * =========================================================
   */

  const handleCreateBudget = () => {
    router.push("/budgets/create");
  };

  /*
   * =========================================================
   * PAGINATION
   * =========================================================
   */

  const handlePageChange = (
    page: number,
  ) => {
    setFilters((previous) => ({
      ...previous,
      page,
    }));
  };

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

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
      {/* =====================================================
          APP HEADER
      ===================================================== */}

      <AppHeader />

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <View
        style={styles.header}
      >
        <View
          style={styles.headerText}
        >
          <Text
            style={[
              styles.title,
              {
                color: theme.text,
              },
            ]}
          >
            Budgets
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
            Manage your spending limits
            and track progress.
          </Text>
        </View>

        {/* Create */}

        <Pressable
          onPress={
            handleCreateBudget
          }
          style={({ pressed }) => [
            styles.createButton,
            {
              backgroundColor:
                theme.primary,
            },
            pressed &&
              styles.createPressed,
          ]}
        >
          <Plus
            size={17}
            color={theme.primaryText}
            strokeWidth={2.5}
          />

          <Text
            style={[
              styles.createText,
              {
                color:
                  theme.primaryText,
              },
            ]}
          >
            Create
          </Text>
        </Pressable>
      </View>

      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <View
        style={
          styles.filterRow
        }
      >
        <View
          style={
            styles.filterInfo
          }
        >
          <SlidersHorizontal
            size={15}
            color={
              theme.textSecondary
            }
            strokeWidth={2}
          />

          <Text
            style={[
              styles.filterInfoText,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            Search & filters
          </Text>
        </View>

        {pagination && (
          <Text
            style={[
              styles.resultText,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            {pagination.totalRecords}{" "}
            {pagination.totalRecords ===
            1
              ? "budget"
              : "budgets"}
          </Text>
        )}
      </View>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* ===================================================
            FILTER COMPONENT
        =================================================== */}

        <BudgetFilters
          filters={filters}
          onFiltersChange={
            setFilters
          }
        />

        {/* ===================================================
            BUDGET LIST
        =================================================== */}

        <View
          style={
            styles.listContainer
          }
        >
          <BudgetList
            budgets={budgets}
            isLoading={isLoading}
            isError={isError}
          />
        </View>

        {/* ===================================================
            PAGINATION
        =================================================== */}

        {pagination &&
          pagination.totalPages >
            1 && (
            <View
              style={[
                styles.pagination,
                {
                  borderTopColor:
                    theme.border,
                },
              ]}
            >
              {/* Previous */}

              <Pressable
                disabled={
                  !pagination.hasPrevious
                }
                onPress={() =>
                  handlePageChange(
                    pagination.page -
                      1,
                  )
                }
                style={({ pressed }) => [
                  styles.pageButton,
                  {
                    borderColor:
                      theme.border,
                    backgroundColor:
                      theme.surface,
                  },
                  !pagination.hasPrevious &&
                    styles.pageButtonDisabled,
                  pressed &&
                    pagination.hasPrevious &&
                    styles.pageButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.pageButtonText,
                    {
                      color:
                        theme.textSecondary,
                    },
                    !pagination.hasPrevious &&
                      styles.pageButtonTextDisabled,
                  ]}
                >
                  Previous
                </Text>
              </Pressable>

              {/* Page */}

              <Text
                style={[
                  styles.pageInfo,
                  {
                    color:
                      theme.textSecondary,
                  },
                ]}
              >
                Page{" "}
                {pagination.page}{" "}
                of{" "}
                {
                  pagination.totalPages
                }
              </Text>

              {/* Next */}

              <Pressable
                disabled={
                  !pagination.hasNext
                }
                onPress={() =>
                  handlePageChange(
                    pagination.page +
                      1,
                  )
                }
                style={({ pressed }) => [
                  styles.pageButton,
                  {
                    borderColor:
                      theme.border,
                    backgroundColor:
                      theme.surface,
                  },
                  !pagination.hasNext &&
                    styles.pageButtonDisabled,
                  pressed &&
                    pagination.hasNext &&
                    styles.pageButtonPressed,
                ]}
              >
                <Text
                  style={[
                    styles.pageButtonText,
                    {
                      color:
                        theme.textSecondary,
                    },
                    !pagination.hasNext &&
                      styles.pageButtonTextDisabled,
                  ]}
                >
                  Next
                </Text>
              </Pressable>
            </View>
          )}

        {/* ===================================================
            BOTTOM NAV SPACE
        =================================================== */}

        <View
          style={
            styles.bottomSpacing
          }
        />
      </ScrollView>
    </View>
  );
}

/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles =
  StyleSheet.create({
    /*
     * =======================================================
     * CONTAINER
     * =======================================================
     */

    container: {
      flex: 1,
    },

    /*
     * =======================================================
     * HEADER
     * =======================================================
     */

    header: {
      flexDirection:
        "row",

      alignItems:
        "flex-start",

      justifyContent:
        "space-between",

      paddingHorizontal: 16,

      paddingTop: 14,

      paddingBottom: 12,
    },

    headerText: {
      flex: 1,

      minWidth: 0,

      marginRight: 12,
    },

    title: {
      fontSize: 22,

      fontWeight: "800",
    },

    subtitle: {
      marginTop: 5,

      fontSize: 11,

      lineHeight: 16,

      fontWeight: "500",
    },

    /*
     * =======================================================
     * CREATE BUTTON
     * =======================================================
     */

    createButton: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "center",

      height: 38,

      paddingHorizontal: 13,

      gap: 6,

      borderRadius: 11,
    },

    createPressed: {
      opacity: 0.7,
    },

    createText: {
      fontSize: 11,

      fontWeight: "700",
    },

    /*
     * =======================================================
     * FILTER BAR
     * =======================================================
     */

    filterRow: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      paddingHorizontal: 16,

      paddingBottom: 12,
    },

    filterInfo: {
      flexDirection:
        "row",

      alignItems:
        "center",

      gap: 6,
    },

    filterInfoText: {
      fontSize: 10,

      fontWeight: "600",
    },

    resultText: {
      fontSize: 10,

      fontWeight: "500",
    },

    /*
     * =======================================================
     * SCROLL
     * =======================================================
     */

    scroll: {
      flex: 1,
    },

    scrollContent: {
      paddingHorizontal: 16,

      paddingBottom: 20,
    },

    /*
     * =======================================================
     * LIST
     * =======================================================
     */

    listContainer: {
      marginTop: 12,
    },

    /*
     * =======================================================
     * PAGINATION
     * =======================================================
     */

    pagination: {
      flexDirection:
        "row",

      alignItems:
        "center",

      justifyContent:
        "space-between",

      marginTop: 16,

      paddingTop: 14,

      borderTopWidth: 1,
    },

    pageButton: {
      minWidth: 78,

      alignItems:
        "center",

      justifyContent:
        "center",

      paddingHorizontal: 12,

      paddingVertical: 9,

      borderWidth: 1,

      borderRadius: 9,
    },

    pageButtonDisabled: {
      opacity: 0.4,
    },

    pageButtonPressed: {
      opacity: 0.7,
    },

    pageButtonText: {
      fontSize: 10,

      fontWeight: "600",
    },

    pageButtonTextDisabled: {
      color: "#A3A3A3",
    },

    pageInfo: {
      fontSize: 10,

      fontWeight: "600",
    },

    /*
     * =======================================================
     * BOTTOM NAV
     * =======================================================
     */

    bottomSpacing: {
      height: 90,
    },
  });