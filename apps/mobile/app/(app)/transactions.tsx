

import {
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react-native";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import { useState } from "react";

import AppHeader from "../../features/app/components/AppHeader";

import type {
  TransactionQuery,
} from "../../types/transaction.types";

import {
  useTransactions,
} from "../../features/transactions/hooks/use-transactions";

import {
  TransactionFilterToolbar,
} from "../../features/transactions/components/Transaction-filter-toolbar";

import TransactionFilterSheet from "../../features/transactions/components/TransactionFilterSheet";

import {
  TransactionList,
} from "../../features/transactions/components/TransactionList";

import { useTheme } from "../../providers/ThemeProvider";

export default function TransactionsPage() {
  const router = useRouter();

  const { theme } = useTheme();

  /*
   * =========================================================
   * FILTER STATE
   * =========================================================
   */

  const [filters, setFilters] =
    useState<TransactionQuery>({
      page: 1,
      limit: 10,
      sortBy: "transactionDate",
      sortOrder: "desc",
    });

  /*
   * =========================================================
   * FILTER SHEET STATE
   * =========================================================
   */

  const [filterOpen, setFilterOpen] =
    useState(false);

  /*
   * =========================================================
   * TRANSACTIONS
   * =========================================================
   */

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useTransactions(filters);

  const transactions =
    data?.data ?? [];

  const pagination =
    data?.meta;

  /*
   * =========================================================
   * FILTER CHANGE
   * =========================================================
   */

  const handleFiltersChange = (
    newFilters: TransactionQuery,
  ) => {
    setFilters(newFilters);
  };

  /*
   * =========================================================
   * PAGE CHANGE
   * =========================================================
   */

  const handlePageChange = (
    page: number,
  ) => {
    if (page < 1) {
      return;
    }

    if (
      pagination &&
      page > pagination.totalPages
    ) {
      return;
    }

    setFilters((previous) => ({
      ...previous,
      page,
    }));
  };

  /*
   * =========================================================
   * CREATE TRANSACTION
   * =========================================================
   */

  const handleCreateTransaction = () => {
    router.push(
      "/transactions/create",
    );
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
          PAGE SCROLL
      ===================================================== */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <View style={styles.content}>
          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <View style={styles.header}>
            <View style={styles.heading}>
              <Text
                style={[
                  styles.title,
                  {
                    color: theme.text,
                  },
                ]}
              >
                Transactions
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
                Track and manage your income
                and expenses.
              </Text>
            </View>

            {/* ===============================================
                ADD TRANSACTION
            =============================================== */}

            <Pressable
              onPress={
                handleCreateTransaction
              }
              hitSlop={4}
              style={({ pressed }) => [
                styles.addButton,
                {
                  backgroundColor:
                    theme.text,
                },
                pressed &&
                  styles.addButtonPressed,
              ]}
            >
              <Plus
                size={16}
                color={theme.background}
                strokeWidth={2.5}
              />

              <Text
                style={[
                  styles.addButtonText,
                  {
                    color:
                      theme.background,
                  },
                ]}
              >
                Transaction
              </Text>
            </Pressable>
          </View>

          {/* =================================================
              COMPACT FILTER TOOLBAR
          ================================================= */}

          <View
            style={styles.filterSection}
          >
            <TransactionFilterToolbar
              filters={filters}
              onFiltersChange={
                handleFiltersChange
              }
              onOpenFilters={() =>
                setFilterOpen(true)
              }
            />
          </View>

          {/* =================================================
              FETCHING INDICATOR
          ================================================= */}

          {isFetching && !isLoading && (
            <View
              style={
                styles.fetchingContainer
              }
            >
              <ActivityIndicator
                size="small"
                color={
                  theme.textSecondary
                }
              />

              <Text
                style={[
                  styles.fetchingText,
                  {
                    color:
                      theme.textSecondary,
                  },
                ]}
              >
                Updating transactions...
              </Text>
            </View>
          )}

          {/* =================================================
              TRANSACTION LIST
          ================================================= */}

          <View
            style={styles.listSection}
          >
            <TransactionList
              transactions={
                transactions
              }
              isLoading={isLoading}
              isError={isError}
            />
          </View>

          {/* =================================================
              PAGINATION
          ================================================= */}

          {pagination &&
            pagination.totalPages > 1 && (
              <View
                style={[
                  styles.paginationContainer,
                  {
                    backgroundColor:
                      theme.surface,

                    borderColor:
                      theme.border,
                  },
                ]}
              >
                {/* =========================================
                    PREVIOUS
                ========================================= */}

                <Pressable
                  disabled={
                    !pagination.hasPrevious ||
                    isFetching
                  }
                  onPress={() =>
                    handlePageChange(
                      (filters.page ?? 1) -
                        1,
                    )
                  }
                  hitSlop={3}
                  style={({ pressed }) => [
                    styles.paginationButton,

                    !pagination.hasPrevious &&
                      styles.paginationButtonDisabled,

                    pressed &&
                      pagination.hasPrevious && {
                        backgroundColor:
                          theme.surfaceSecondary,
                      },
                  ]}
                >
                  <ChevronLeft
                    size={16}
                    color={
                      pagination.hasPrevious
                        ? theme.text
                        : theme.muted
                    }
                    strokeWidth={2}
                  />

                  <Text
                    style={[
                      styles.paginationButtonText,
                      {
                        color:
                          pagination.hasPrevious
                            ? theme.text
                            : theme.muted,
                      },
                    ]}
                  >
                    Previous
                  </Text>
                </Pressable>

                {/* =========================================
                    PAGE INFORMATION
                ========================================= */}

                <View
                  style={
                    styles.pageInformation
                  }
                >
                  <Text
                    style={[
                      styles.pageLabel,
                      {
                        color:
                          theme.textSecondary,
                      },
                    ]}
                  >
                    Page
                  </Text>

                  <View
                    style={[
                      styles.pageNumber,
                      {
                        backgroundColor:
                          theme.text,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.pageNumberText,
                        {
                          color:
                            theme.background,
                        },
                      ]}
                    >
                      {filters.page ?? 1}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.pageLabel,
                      {
                        color:
                          theme.textSecondary,
                      },
                    ]}
                  >
                    of
                  </Text>

                  <Text
                    style={[
                      styles.totalPages,
                      {
                        color:
                          theme.text,
                      },
                    ]}
                  >
                    {pagination.totalPages}
                  </Text>
                </View>

                {/* =========================================
                    NEXT
                ========================================= */}

                <Pressable
                  disabled={
                    !pagination.hasNext ||
                    isFetching
                  }
                  onPress={() =>
                    handlePageChange(
                      (filters.page ?? 1) +
                        1,
                    )
                  }
                  hitSlop={3}
                  style={({ pressed }) => [
                    styles.paginationButton,

                    !pagination.hasNext &&
                      styles.paginationButtonDisabled,

                    pressed &&
                      pagination.hasNext && {
                        backgroundColor:
                          theme.surfaceSecondary,
                      },
                  ]}
                >
                  <Text
                    style={[
                      styles.paginationButtonText,
                      {
                        color:
                          pagination.hasNext
                            ? theme.text
                            : theme.muted,
                      },
                    ]}
                  >
                    Next
                  </Text>

                  <ChevronRight
                    size={16}
                    color={
                      pagination.hasNext
                        ? theme.text
                        : theme.muted
                    }
                    strokeWidth={2}
                  />
                </Pressable>
              </View>
            )}

          {/* =================================================
              RECORD COUNT
          ================================================= */}

          {pagination &&
            pagination.totalRecords > 0 && (
              <View
                style={
                  styles.recordCountContainer
                }
              >
                <Text
                  style={[
                    styles.recordCountText,
                    {
                      color:
                        theme.textSecondary,
                    },
                  ]}
                >
                  Showing{" "}
                  <Text
                    style={[
                      styles.recordCountStrong,
                      {
                        color:
                          theme.text,
                      },
                    ]}
                  >
                    {transactions.length}
                  </Text>{" "}
                  of{" "}
                  <Text
                    style={[
                      styles.recordCountStrong,
                      {
                        color:
                          theme.text,
                      },
                    ]}
                  >
                    {pagination.totalRecords}
                  </Text>{" "}
                  transactions
                </Text>
              </View>
            )}
        </View>
      </ScrollView>

      {/* =====================================================
          FILTER SHEET

          IMPORTANT:
          This remains OUTSIDE the ScrollView.

          The sheet itself is responsible for scrolling.
      ===================================================== */}

      <TransactionFilterSheet
        visible={filterOpen}
        filters={filters}
        onApply={handleFiltersChange}
        onClose={() =>
          setFilterOpen(false)
        }
      />
    </View>
  );
}

/*
 * ===========================================================
 * STYLES
 * ===========================================================
 */

const styles = StyleSheet.create({
  /*
   * =========================================================
   * CONTAINER
   * =========================================================
   */

  container: {
    flex: 1,
  },

  /*
   * =========================================================
   * SCROLL
   * =========================================================
   */

  scrollContent: {
    flexGrow: 1,

    paddingBottom: 110,
  },

  /*
   * =========================================================
   * CONTENT
   * =========================================================
   */

  content: {
    paddingHorizontal: 16,

    paddingTop: 16,

    paddingBottom: 20,
  },

  /*
   * =========================================================
   * HEADER
   * =========================================================
   */

  header: {
    flexDirection: "row",

    alignItems: "flex-end",

    justifyContent: "space-between",

    gap: 12,

    marginBottom: 16,
  },

  heading: {
    flex: 1,

    minWidth: 0,
  },

  title: {
    fontSize: 24,

    fontWeight: "800",

    letterSpacing: -0.3,
  },

  subtitle: {
    marginTop: 4,

    fontSize: 12,

    lineHeight: 18,

    fontWeight: "500",
  },

  /*
   * =========================================================
   * ADD BUTTON
   * =========================================================
   */

  addButton: {
    height: 40,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 6,

    paddingHorizontal: 13,

    borderRadius: 10,
  },

  addButtonPressed: {
    opacity: 0.7,

    transform: [
      {
        scale: 0.97,
      },
    ],
  },

  addButtonText: {
    fontSize: 10,

    fontWeight: "800",
  },

  /*
   * =========================================================
   * FILTER SECTION
   * =========================================================
   */

  filterSection: {
    marginBottom: 16,

    zIndex: 100,
  },

  /*
   * =========================================================
   * FETCHING
   * =========================================================
   */

  fetchingContainer: {
    minHeight: 28,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 7,

    marginBottom: 8,
  },

  fetchingText: {
    fontSize: 9,

    fontWeight: "500",
  },

  /*
   * =========================================================
   * LIST
   * =========================================================
   */

  listSection: {
    marginTop: 4,
  },

  /*
   * =========================================================
   * PAGINATION
   * =========================================================
   */

  paginationContainer: {
    minHeight: 50,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginTop: 18,

    paddingHorizontal: 10,

    borderWidth: 1,

    borderRadius: 14,
  },

  paginationButton: {
    minWidth: 82,

    height: 36,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 3,

    paddingHorizontal: 8,

    borderRadius: 9,
  },

  paginationButtonDisabled: {
    opacity: 0.5,
  },

  paginationPressed: {
    opacity: 0.8,
  },

  paginationButtonText: {
    fontSize: 10,

    fontWeight: "700",
  },

  paginationDisabledText: {
    opacity: 0.5,
  },

  /*
   * =========================================================
   * PAGE INFORMATION
   * =========================================================
   */

  pageInformation: {
    flexDirection: "row",

    alignItems: "center",

    gap: 5,
  },

  pageLabel: {
    fontSize: 9,

    fontWeight: "500",
  },

  pageNumber: {
    minWidth: 25,

    height: 25,

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 6,

    borderRadius: 7,
  },

  pageNumberText: {
    fontSize: 10,

    fontWeight: "800",
  },

  totalPages: {
    fontSize: 10,

    fontWeight: "700",
  },

  /*
   * =========================================================
   * RECORD COUNT
   * =========================================================
   */

  recordCountContainer: {
    alignItems: "center",

    paddingTop: 10,
  },

  recordCountText: {
    fontSize: 9,

    fontWeight: "500",
  },

  recordCountStrong: {
    fontWeight: "700",
  },
});