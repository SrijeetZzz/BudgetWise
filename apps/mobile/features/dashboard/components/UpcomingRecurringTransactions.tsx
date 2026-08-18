
import {
  CalendarClock,
  Repeat,
} from "lucide-react-native";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  DashboardCategory,
  DashboardUpcomingRecurringTransaction,
} from "../../../types/dashboard.types";

import { CategoryIcon } from "../../categories/components/category-icon";

import { useTheme } from "../../../providers/ThemeProvider";

interface UpcomingRecurringTransactionsProps {
  transactions: DashboardUpcomingRecurringTransaction[];
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
  if (
    !value ||
    typeof value === "string"
  ) {
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

function formatFrequency(
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

export default function UpcomingRecurringTransactions({
  transactions,
}: UpcomingRecurringTransactionsProps) {
  const { theme } = useTheme();

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
              <CalendarClock
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
                Upcoming Recurring
                Transactions
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
                Your next scheduled recurring
                transactions
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            EMPTY
        ================================================= */}

        <View style={styles.emptyState}>
          <CalendarClock
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
            No upcoming recurring
            transactions
          </Text>

          <Text
            style={[
              styles.emptyText,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            Scheduled recurring items will
            appear here when due.
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
            <CalendarClock
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
              Upcoming Recurring
              Transactions
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
              Your next scheduled recurring
              transactions
            </Text>
          </View>
        </View>

        {/* =================================================
            SCHEDULED COUNT
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
            {transactions.length} scheduled
          </Text>
        </View>
      </View>

      {/* =================================================
          LIST

          Normal View instead of ScrollView.

          The card height now grows naturally based
          on the number of transactions.
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
             * Keep category colors from
             * the API.
             *
             * Income fallback remains green.
             * Expense fallback uses theme text.
             */

            const iconColor =
              category?.color ??
              (isIncome
                ? "#10B981"
                : theme.text);

            const iconBackground =
              category?.color
                ? `${category.color}15`
                : isIncome
                  ? "#10B98115"
                  : theme.surfaceSecondary;

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
                  {/* =======================================
                      CATEGORY ICON
                  ======================================= */}

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
                    ) : (
                      <Repeat
                        size={18}
                        color={
                          iconColor
                        }
                        strokeWidth={2}
                      />
                    )}
                  </View>

                  {/* =======================================
                      DETAILS
                  ======================================= */}

                  <View
                    style={styles.details}
                  >
                    {/* =====================================
                        TITLE + FREQUENCY
                    ===================================== */}

                    <View
                      style={
                        styles.titleRow
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

                      {/* =================================
                          FREQUENCY
                      ================================= */}

                      <View
                        style={[
                          styles.frequencyBadge,
                          {
                            backgroundColor:
                              theme.surfaceSecondary,
                          },
                        ]}
                      >
                        <Repeat
                          size={10}
                          color={
                            theme.textSecondary
                          }
                          strokeWidth={2}
                        />

                        <Text
                          numberOfLines={
                            1
                          }
                          style={[
                            styles.frequencyText,
                            {
                              color:
                                theme.textSecondary,
                            },
                          ]}
                        >
                          {formatFrequency(
                            transaction.recurrenceFrequency,
                          )}
                        </Text>
                      </View>
                    </View>

                    {/* =====================================
                        CATEGORY + NEXT DATE
                    ===================================== */}

                    <View
                      style={
                        styles.metadata
                      }
                    >
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

                      {/* =================================
                          NEXT EXECUTION
                      ================================= */}

                      <View
                        style={
                          styles.nextExecution
                        }
                      >
                        <CalendarClock
                          size={11}
                          color={
                            theme.textSecondary
                          }
                          strokeWidth={2}
                        />

                        <Text
                          style={[
                            styles.nextLabel,
                            {
                              color:
                                theme.textSecondary,
                            },
                          ]}
                        >
                          Next:
                        </Text>

                        <Text
                          numberOfLines={
                            1
                          }
                          style={[
                            styles.nextDate,
                            {
                              color:
                                theme.text,
                            },
                          ]}
                        >
                          {formatDate(
                            transaction.nextExecutionDate,
                          )}
                        </Text>
                      </View>
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
                      color: isIncome
                        ? "#059669"
                        : theme.text,
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

const styles = StyleSheet.create({
  /* =======================================================
     CARD

     NO FIXED HEIGHT.
     Height is determined by content.
  ======================================================= */

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

  /* =======================================================
     HEADER
  ======================================================= */

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

    minWidth: 0,
  },

  headerIcon: {
    width: 40,

    height: 40,

    borderRadius: 12,

    alignItems: "center",

    justifyContent: "center",

    flexShrink: 0,
  },

  headerContent: {
    flex: 1,

    minWidth: 0,

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

  /* =======================================================
     COUNT
  ======================================================= */

  countBadge: {
    paddingHorizontal: 9,

    paddingVertical: 4,

    borderRadius: 999,

    flexShrink: 0,
  },

  countText: {
    fontSize: 10,

    fontWeight: "700",
  },

  /* =======================================================
     LIST

     No flex: 1.
  ======================================================= */

  list: {
    width: "100%",
  },

  /* =======================================================
     TRANSACTION
  ======================================================= */

  transaction: {
    minHeight: 68,

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

  /* =======================================================
     CATEGORY ICON
  ======================================================= */

  categoryIcon: {
    width: 38,

    height: 38,

    flexShrink: 0,

    borderRadius: 11,

    alignItems: "center",

    justifyContent: "center",

    marginRight: 10,
  },

  /* =======================================================
     DETAILS
  ======================================================= */

  details: {
    flex: 1,

    minWidth: 0,
  },

  titleRow: {
    flexDirection: "row",

    alignItems: "center",

    minWidth: 0,
  },

  transactionTitle: {
    flex: 1,

    minWidth: 0,

    fontSize: 12,

    fontWeight: "800",

    marginRight: 6,
  },

  /* =======================================================
     FREQUENCY
  ======================================================= */

  frequencyBadge: {
    maxWidth: 92,

    flexShrink: 0,

    flexDirection: "row",

    alignItems: "center",

    gap: 3,

    paddingHorizontal: 6,

    paddingVertical: 3,

    borderRadius: 6,
  },

  frequencyText: {
    flexShrink: 1,

    fontSize: 9,

    fontWeight: "700",
  },

  /* =======================================================
     METADATA
  ======================================================= */

  metadata: {
    flexDirection: "row",

    alignItems: "center",

    flexWrap: "wrap",

    marginTop: 4,
  },

  categoryName: {
    maxWidth: 80,

    fontSize: 10,

    fontWeight: "600",
  },

  separator: {
    marginHorizontal: 5,

    fontSize: 9,
  },

  /* =======================================================
     NEXT EXECUTION
  ======================================================= */

  nextExecution: {
    flexDirection: "row",

    alignItems: "center",

    gap: 3,

    minWidth: 0,
  },

  nextLabel: {
    fontSize: 10,

    fontWeight: "500",
  },

  nextDate: {
    flexShrink: 1,

    fontSize: 10,

    fontWeight: "700",
  },

  /* =======================================================
     AMOUNT
  ======================================================= */

  amount: {
    maxWidth: 92,

    flexShrink: 0,

    fontSize: 11,

    fontWeight: "800",

    textAlign: "right",
  },

  /* =======================================================
     EMPTY STATE

     No flex: 1.
     No minHeight.
  ======================================================= */

  emptyState: {
    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 20,

    paddingVertical: 42,
  },

  emptyTitle: {
    marginTop: 10,

    fontSize: 14,

    fontWeight: "700",

    textAlign: "center",
  },

  emptyText: {
    marginTop: 4,

    fontSize: 11,

    fontWeight: "500",

    textAlign: "center",

    lineHeight: 16,
  },
});