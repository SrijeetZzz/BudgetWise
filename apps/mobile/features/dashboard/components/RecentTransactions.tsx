
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  ReceiptText,
} from "lucide-react-native";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  DashboardCategory,
  DashboardRecentTransaction,
} from "../../../types/dashboard.types";

import { CategoryIcon } from "../../categories/components/category-icon";

import { useTheme } from "../../../providers/ThemeProvider";

interface RecentTransactionsProps {
  transactions: DashboardRecentTransaction[];
}

/* =========================================================
   HELPERS
========================================================= */

function getCategory(
  value:
    | string
    | DashboardCategory
    | null
    | undefined,
) {
  if (!value || typeof value === "string") {
    return null;
  }

  return value;
}

function formatCurrency(
  amount: number,
  currency: string,
) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatPaymentMethod(
  value: string,
) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}

/* =========================================================
   COMPONENT
========================================================= */

export default function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  const { theme } = useTheme();

  /*
   * =======================================================
   * SEMANTIC COLORS
   * =======================================================
   */

  const incomeColor = "#059669";
  const incomeIconColor = "#10B981";

  const expenseColor = "#DC2626";
  const expenseIconColor = "#EF4444";

  /*
   * =======================================================
   * EMPTY STATE
   * =======================================================
   */

  if (!transactions.length) {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor:
              theme.surface,

            borderColor:
              theme.border,
          },
        ]}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View
          style={[
            styles.header,
            {
              borderBottomColor:
                theme.border,
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.headerIcon,
                {
                  backgroundColor:
                    theme.surfaceSecondary,
                },
              ]}
            >
              <ReceiptText
                size={20}
                color={theme.text}
                strokeWidth={2}
              />
            </View>

            <View
              style={styles.headerContent}
            >
              <Text
                style={[
                  styles.title,
                  {
                    color: theme.text,
                  },
                ]}
              >
                Recent Transactions
              </Text>

              <Text
                style={[
                  styles.description,
                  {
                    color:
                      theme.textSecondary,
                  },
                ]}
              >
                Your latest financial activity
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            EMPTY
        ================================================= */}

        <View style={styles.emptyState}>
          <ReceiptText
            size={32}
            color={theme.textSecondary}
            strokeWidth={1.7}
          />

          <Text
            style={[
              styles.emptyTitle,
              {
                color: theme.text,
              },
            ]}
          >
            No transactions found
          </Text>

          <Text
            style={[
              styles.emptyText,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            Logged transactions for this
            period will appear here.
          </Text>
        </View>
      </View>
    );
  }

  /*
   * =======================================================
   * MAIN CARD
   * =======================================================
   */

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor:
            theme.surface,

          borderColor:
            theme.border,
        },
      ]}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <View
        style={[
          styles.header,
          {
            borderBottomColor:
              theme.border,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor:
                  theme.surfaceSecondary,
              },
            ]}
          >
            <ReceiptText
              size={20}
              color={theme.text}
              strokeWidth={2}
            />
          </View>

          <View
            style={styles.headerContent}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.title,
                {
                  color: theme.text,
                },
              ]}
            >
              Recent Transactions
            </Text>

            <Text
              numberOfLines={1}
              style={[
                styles.description,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              Your latest financial activity
            </Text>
          </View>
        </View>

        {/* =================================================
            COUNT
        ================================================= */}

        <View
          style={[
            styles.countBadge,
            {
              backgroundColor:
                theme.surfaceSecondary,
            },
          ]}
        >
          <Text
            style={[
              styles.countText,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            {transactions.length}{" "}
            {transactions.length === 1
              ? "item"
              : "items"}
          </Text>
        </View>
      </View>

      {/* =================================================
          TRANSACTIONS
      ================================================= */}

      <View style={styles.list}>
        {transactions.map(
          (transaction) => {
            const category =
              getCategory(
                transaction.categoryId,
              );

            const isIncome =
              transaction.type ===
              "INCOME";

            /*
             * -------------------------------------------------
             * CATEGORY / TRANSACTION COLORS
             * -------------------------------------------------
             */

            const iconColor =
              category?.color ??
              (isIncome
                ? incomeIconColor
                : expenseIconColor);

            const iconBackground =
              category?.color
                ? `${category.color}15`
                : isIncome
                  ? `${incomeIconColor}15`
                  : `${expenseIconColor}15`;

            return (
              <View
                key={transaction._id}
                style={[
                  styles.transaction,
                  {
                    borderBottomColor:
                      theme.border,
                  },
                ]}
              >
                {/* =========================================
                    LEFT
                ========================================= */}

                <View
                  style={
                    styles.transactionLeft
                  }
                >
                  {/* =========================================
                      CATEGORY ICON
                  ========================================= */}

                  <View
                    style={[
                      styles.categoryIcon,
                      {
                        backgroundColor:
                          iconBackground,
                      },
                    ]}
                  >
                    {category?.icon ? (
                      <CategoryIcon
                        name={
                          category.icon
                        }
                        size={18}
                        color={
                          iconColor
                        }
                      />
                    ) : isIncome ? (
                      <ArrowDownLeft
                        size={18}
                        color={
                          incomeIconColor
                        }
                        strokeWidth={2}
                      />
                    ) : (
                      <ArrowUpRight
                        size={18}
                        color={
                          expenseIconColor
                        }
                        strokeWidth={2}
                      />
                    )}
                  </View>

                  {/* =========================================
                      DETAILS
                  ========================================= */}

                  <View
                    style={
                      styles.details
                    }
                  >
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.transactionTitle,
                        {
                          color:
                            theme.text,
                        },
                      ]}
                    >
                      {
                        transaction.title
                      }
                    </Text>

                    {/* =======================================
                        METADATA
                    ======================================= */}

                    <View
                      style={
                        styles.metadata
                      }
                    >
                      {/* Category */}

                      {category && (
                        <>
                          <Text
                            numberOfLines={
                              1
                            }
                            style={[
                              styles.categoryName,
                              {
                                color:
                                  theme.textSecondary,
                              },
                            ]}
                          >
                            {
                              category.name
                            }
                          </Text>

                          <Text
                            style={[
                              styles.separator,
                              {
                                color:
                                  theme.textSecondary,
                              },
                            ]}
                          >
                            •
                          </Text>
                        </>
                      )}

                      {/* Date */}

                      <Text
                        style={[
                          styles.metadataText,
                          {
                            color:
                              theme.textSecondary,
                          },
                        ]}
                      >
                        {formatDate(
                          transaction.transactionDate,
                        )}
                      </Text>

                      {/* Payment Method */}

                      {transaction.paymentMethod && (
                        <>
                          <Text
                            style={[
                              styles.separator,
                              {
                                color:
                                  theme.textSecondary,
                              },
                            ]}
                          >
                            •
                          </Text>

                          <View
                            style={
                              styles.paymentMethod
                            }
                          >
                            <CreditCard
                              size={
                                11
                              }
                              color={
                                theme.textSecondary
                              }
                              strokeWidth={
                                2
                              }
                            />

                            <Text
                              numberOfLines={
                                1
                              }
                              style={[
                                styles.metadataText,
                                {
                                  color:
                                    theme.textSecondary,
                                },
                              ]}
                            >
                              {formatPaymentMethod(
                                transaction.paymentMethod,
                              )}
                            </Text>
                          </View>
                        </>
                      )}
                    </View>
                  </View>
                </View>

                {/* =========================================
                    AMOUNT
                ========================================= */}

                <Text
                  numberOfLines={1}
                  style={[
                    styles.amount,
                    {
                      color:
                        isIncome
                          ? incomeColor
                          : expenseColor,
                    },
                  ]}
                >
                  {isIncome
                    ? "+"
                    : "-"}
                  {formatCurrency(
                    transaction.amount,
                    transaction.currency,
                  )}
                </Text>
              </View>
            );
          },
        )}
      </View>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({
    /* =====================================================
       CARD
    ===================================================== */

    card: {
      width: "100%",

      borderRadius: 18,

      borderWidth: 1,

      overflow: "hidden",

      shadowColor: "#000000",

      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity: 0.05,

      shadowRadius: 6,

      elevation: 2,
    },

    /* =====================================================
       HEADER
    ===================================================== */

    header: {
      minHeight: 72,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      paddingHorizontal: 16,

      paddingVertical: 12,

      borderBottomWidth: 1,
    },

    headerLeft: {
      flex: 1,

      flexDirection: "row",

      alignItems: "center",

      marginRight: 10,
    },

    headerIcon: {
      width: 40,

      height: 40,

      borderRadius: 12,

      alignItems: "center",

      justifyContent: "center",
    },

    headerContent: {
      flex: 1,

      marginLeft: 10,
    },

    title: {
      fontSize: 16,

      fontWeight: "800",
    },

    description: {
      marginTop: 2,

      fontSize: 11,

      fontWeight: "500",
    },

    /* =====================================================
       COUNT
    ===================================================== */

    countBadge: {
      paddingHorizontal: 9,

      paddingVertical: 4,

      borderRadius: 999,
    },

    countText: {
      fontSize: 10,

      fontWeight: "700",
    },

    /* =====================================================
       LIST
    ===================================================== */

    list: {
      width: "100%",
    },

    /* =====================================================
       TRANSACTION
    ===================================================== */

    transaction: {
      minHeight: 64,

      flexDirection: "row",

      alignItems: "center",

      paddingHorizontal: 14,

      paddingVertical: 10,

      borderBottomWidth: 1,
    },

    transactionLeft: {
      flex: 1,

      minWidth: 0,

      flexDirection: "row",

      alignItems: "center",

      marginRight: 10,
    },

    /* =====================================================
       CATEGORY ICON
    ===================================================== */

    categoryIcon: {
      width: 38,

      height: 38,

      flexShrink: 0,

      borderRadius: 11,

      alignItems: "center",

      justifyContent: "center",

      marginRight: 10,
    },

    /* =====================================================
       DETAILS
    ===================================================== */

    details: {
      flex: 1,

      minWidth: 0,
    },

    transactionTitle: {
      fontSize: 12,

      fontWeight: "800",
    },

    /* =====================================================
       METADATA
    ===================================================== */

    metadata: {
      flexDirection: "row",

      alignItems: "center",

      flexWrap: "wrap",

      marginTop: 3,
    },

    categoryName: {
      maxWidth: 90,

      fontSize: 10,

      fontWeight: "600",
    },

    separator: {
      marginHorizontal: 5,

      fontSize: 9,
    },

    metadataText: {
      fontSize: 10,

      fontWeight: "500",
    },

    paymentMethod: {
      flexDirection: "row",

      alignItems: "center",

      gap: 3,

      maxWidth: 90,
    },

    /* =====================================================
       AMOUNT
    ===================================================== */

    amount: {
      maxWidth: 92,

      flexShrink: 0,

      fontSize: 11,

      fontWeight: "800",

      textAlign: "right",
    },

    /* =====================================================
       EMPTY STATE
    ===================================================== */

    emptyState: {
      minHeight: 260,

      alignItems: "center",

      justifyContent: "center",

      paddingHorizontal: 20,
    },

    emptyTitle: {
      marginTop: 10,

      fontSize: 14,

      fontWeight: "700",
    },

    emptyText: {
      marginTop: 4,

      fontSize: 11,

      fontWeight: "500",

      textAlign: "center",
    },
  });