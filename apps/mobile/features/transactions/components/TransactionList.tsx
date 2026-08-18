
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  Loader2,
  Receipt,
  Repeat,
} from "lucide-react-native";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useState } from "react";

import type { Transaction } from "../../../types/transaction.types";
import type { Category } from "../../../types/category.types";

import { CategoryIcon } from "../../categories/components/category-icon";

import TransactionActions from "./TransactionActions";
import TransactionDetailsSheet from "./Transaction-details-sheet";

import { useTheme } from "../../../providers/ThemeProvider";

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

interface TransactionListProps {
  transactions: Transaction[];

  isLoading?: boolean;

  isError?: boolean;

  /*
   * Optional callback for parent screen.
   */
  onTransactionPress?: (
    transaction: Transaction,
  ) => void;

  /*
   * Optional callback for parent screen.
   */
  onTransactionActions?: (
    transaction: Transaction,
  ) => void;
}

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function getCategory(
  category: string | Category,
): Category | null {
  if (typeof category === "string") {
    return null;
  }

  return category;
}

/*
 * =========================================================
 * DATE
 * =========================================================
 */

function formatDate(date: string) {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(date));
}

/*
 * =========================================================
 * AMOUNT
 * =========================================================
 */

function formatAmount(
  amount: number,
  currency: string,
  type: Transaction["type"],
) {
  const formatted =
    new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      },
    ).format(amount);

  return type === "EXPENSE"
    ? `- ${formatted}`
    : `+ ${formatted}`;
}

/*
 * =========================================================
 * PAYMENT METHOD
 * =========================================================
 */

function formatPaymentMethod(
  paymentMethod:
    | Transaction["paymentMethod"],
) {
  if (!paymentMethod) {
    return "";
  }

  return paymentMethod
    .toLowerCase()
    .replace("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export function TransactionList({
  transactions,
  isLoading,
  isError,
  onTransactionPress,
  onTransactionActions,
}: TransactionListProps) {
  const { theme } = useTheme();

  /*
   * =======================================================
   * DETAILS SHEET
   * =======================================================
   */

  const [
    selectedTransaction,
    setSelectedTransaction,
  ] = useState<Transaction | null>(
    null,
  );

  const [
    detailsVisible,
    setDetailsVisible,
  ] = useState(false);

  /*
   * =======================================================
   * TRANSACTION PRESS
   * =======================================================
   */

  const handleTransactionPress = (
    transaction: Transaction,
  ) => {
    setSelectedTransaction(
      transaction,
    );

    setDetailsVisible(true);

    onTransactionPress?.(
      transaction,
    );
  };

  /*
   * =======================================================
   * ACTION PRESS
   * =======================================================
   */

  const handleTransactionActions = (
    transaction: Transaction,
  ) => {
    onTransactionActions?.(
      transaction,
    );
  };

  /*
   * =======================================================
   * CLOSE DETAILS
   * =======================================================
   */

  const handleCloseDetails = () => {
    setDetailsVisible(false);

    setTimeout(() => {
      setSelectedTransaction(
        null,
      );
    }, 200);
  };

  /*
   * =======================================================
   * LOADING
   * =======================================================
   */

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <Loader2
          size={18}
          color={theme.textSecondary}
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
          Loading transactions...
        </Text>
      </View>
    );
  }

  /*
   * =======================================================
   * ERROR
   * =======================================================
   */

  if (isError) {
    return (
      <View
        style={[
          styles.error,
          {
            backgroundColor:
              theme.surface,

            borderColor:
              theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.errorIcon,
            {
              backgroundColor:
                theme.surfaceSecondary,
            },
          ]}
        >
          <Receipt
            size={20}
            color="#DC2626"
          />
        </View>

        <Text
          style={[
            styles.errorTitle,
            {
              color: "#DC2626",
            },
          ]}
        >
          Unable to load transactions
        </Text>

        <Text
          style={[
            styles.errorText,
            {
              color:
                theme.textSecondary,
            },
          ]}
        >
          Please try again later.
        </Text>
      </View>
    );
  }

  /*
   * =======================================================
   * EMPTY
   * =======================================================
   */

  if (!transactions.length) {
    return (
      <View
        style={[
          styles.empty,
          {
            backgroundColor:
              theme.surface,

            borderColor:
              theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.emptyIcon,
            {
              backgroundColor:
                theme.surfaceSecondary,
            },
          ]}
        >
          <Receipt
            size={24}
            color={
              theme.textSecondary
            }
          />
        </View>

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
              color:
                theme.textSecondary,
            },
          ]}
        >
          Your transactions will appear
          here once you add one.
        </Text>
      </View>
    );
  }

  /*
   * =======================================================
   * LIST
   * =======================================================
   */

  return (
    <>
      <View
        style={[
          styles.list,
          {
            backgroundColor:
              theme.surface,

            borderColor:
              theme.border,
          },
        ]}
      >
        {transactions.map(
          (
            transaction,
            index,
          ) => {
            const category =
              getCategory(
                transaction.categoryId,
              );

            const subcategory =
              transaction.subcategoryId &&
              typeof transaction.subcategoryId !==
                "string"
                ? transaction.subcategoryId
                : null;

            const isExpense =
              transaction.type ===
              "EXPENSE";

            const isLast =
              index ===
              transactions.length - 1;

            /*
             * =================================================
             * CATEGORY COLORS
             *
             * Category colors come from
             * the API and should remain unchanged.
             *
             * Only fallback colors are theme-aware.
             * =================================================
             */

            const categoryBackground =
              category?.color
                ? `${category.color}15`
                : theme.surfaceSecondary;

            const categoryColor =
              category?.color ??
              theme.textSecondary;

            return (
              <View
                key={
                  transaction._id
                }
                style={[
                  styles.transactionRow,

                  !isLast && {
                    borderBottomColor:
                      theme.border,
                  },
                ]}
              >
                {/* =============================================
                    MAIN TRANSACTION
                ============================================= */}

                <Pressable
                  onPress={() =>
                    handleTransactionPress(
                      transaction,
                    )
                  }
                  style={({
                    pressed,
                  }) => [
                    styles.transactionButton,

                    pressed && {
                      opacity: 0.65,
                    },
                  ]}
                >
                  {/* ===========================================
                      CATEGORY ICON
                  =========================================== */}

                  <View
                    style={[
                      styles.categoryIcon,
                      {
                        backgroundColor:
                          categoryBackground,
                      },
                    ]}
                  >
                    {category ? (
                      <CategoryIcon
                        name={
                          category.icon
                        }
                        size={20}
                        color={
                          categoryColor
                        }
                      />
                    ) : (
                      <Receipt
                        size={19}
                        color={
                          theme.textSecondary
                        }
                      />
                    )}
                  </View>

                  {/* ===========================================
                      DETAILS
                  =========================================== */}

                  <View
                    style={
                      styles.details
                    }
                  >
                    {/* TITLE */}

                    <View
                      style={
                        styles.titleRow
                      }
                    >
                      <Text
                        numberOfLines={
                          1
                        }
                        style={[
                          styles.title,
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

                      {transaction.transactionSource ===
                        "RECURRING" && (
                        <View
                          style={[
                            styles.recurringBadge,
                            {
                              backgroundColor:
                                theme.surfaceSecondary,
                            },
                          ]}
                        >
                          <Repeat
                            size={9}
                            color={
                              theme.textSecondary
                            }
                          />

                          <Text
                            style={[
                              styles.recurringText,
                              {
                                color:
                                  theme.textSecondary,
                              },
                            ]}
                          >
                            Recurring
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* CATEGORY / SUBCATEGORY / PAYMENT */}

                    <View
                      style={
                        styles.metaRow
                      }
                    >
                      {category && (
                        <Text
                          numberOfLines={
                            1
                          }
                          style={[
                            styles.categoryText,
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
                      )}

                      {subcategory && (
                        <>
                          <Text
                            style={[
                              styles.separator,
                              {
                                color:
                                  theme.border,
                              },
                            ]}
                          >
                            •
                          </Text>

                          <Text
                            numberOfLines={
                              1
                            }
                            style={[
                              styles.metaText,
                              {
                                color:
                                  theme.textSecondary,
                              },
                            ]}
                          >
                            {
                              subcategory.name
                            }
                          </Text>
                        </>
                      )}

                      {transaction.paymentMethod && (
                        <>
                          <Text
                            style={[
                              styles.separator,
                              {
                                color:
                                  theme.border,
                              },
                            ]}
                          >
                            •
                          </Text>

                          <View
                            style={
                              styles.paymentRow
                            }
                          >
                            <CreditCard
                              size={
                                11
                              }
                              color={
                                theme.textSecondary
                              }
                            />

                            <Text
                              numberOfLines={
                                1
                              }
                              style={[
                                styles.metaText,
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

                    {/* DATE */}

                    <View
                      style={
                        styles.dateRow
                      }
                    >
                      <CalendarDays
                        size={11}
                        color={
                          theme.textSecondary
                        }
                      />

                      <Text
                        style={[
                          styles.dateText,
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
                    </View>
                  </View>

                  {/* ===========================================
                      AMOUNT
                  =========================================== */}

                  <View
                    style={
                      styles.amountContainer
                    }
                  >
                    <View
                      style={
                        styles.amountRow
                      }
                    >
                      {isExpense ? (
                        <ArrowDownLeft
                          size={13}
                          color="#DC2626"
                          strokeWidth={
                            2.5
                          }
                        />
                      ) : (
                        <ArrowUpRight
                          size={13}
                          color="#059669"
                          strokeWidth={
                            2.5
                          }
                        />
                      )}

                      <Text
                        numberOfLines={
                          1
                        }
                        style={[
                          styles.amount,

                          isExpense
                            ? styles.expenseAmount
                            : styles.incomeAmount,
                        ]}
                      >
                        {formatAmount(
                          transaction.amount,
                          transaction.currency,
                          transaction.type,
                        )}
                      </Text>
                    </View>
                  </View>
                </Pressable>

                {/* =============================================
                    ACTION BUTTON
                ============================================= */}

                <TransactionActions
                  transaction={
                    transaction
                  }
                />
              </View>
            );
          },
        )}
      </View>

      {/* =====================================================
          DETAILS SHEET
      ===================================================== */}

      {selectedTransaction && (
        <TransactionDetailsSheet
          transaction={
            selectedTransaction
          }
          visible={
            detailsVisible
          }
          onClose={
            handleCloseDetails
          }
        />
      )}
    </>
  );
}

/*
 * ===========================================================
 * STYLES
 * ===========================================================
 */

const styles =
  StyleSheet.create({
    /*
     * =======================================================
     * LIST
     * =======================================================
     */

    list: {
      width: "100%",

      overflow: "hidden",

      borderWidth: 1,

      borderRadius: 16,
    },

    transactionRow: {
      flexDirection: "row",

      alignItems: "center",

      minHeight: 76,

      paddingLeft: 12,

      paddingRight: 4,

      borderBottomWidth: 1,
    },

    /*
     * =======================================================
     * MAIN BUTTON
     * =======================================================
     */

    transactionButton: {
      flex: 1,

      minWidth: 0,

      flexDirection: "row",

      alignItems: "center",

      paddingVertical: 11,

      paddingRight: 4,
    },

    /*
     * =======================================================
     * CATEGORY
     * =======================================================
     */

    categoryIcon: {
      width: 40,

      height: 40,

      alignItems: "center",

      justifyContent: "center",

      borderRadius: 12,
    },

    /*
     * =======================================================
     * DETAILS
     * =======================================================
     */

    details: {
      flex: 1,

      minWidth: 0,

      marginLeft: 10,

      marginRight: 8,
    },

    titleRow: {
      flexDirection: "row",

      alignItems: "center",

      minWidth: 0,

      gap: 6,
    },

    title: {
      flexShrink: 1,

      fontSize: 13,

      fontWeight: "700",
    },

    recurringBadge: {
      flexDirection: "row",

      alignItems: "center",

      gap: 3,

      paddingHorizontal: 5,

      paddingVertical: 3,

      borderRadius: 5,
    },

    recurringText: {
      fontSize: 8,

      fontWeight: "600",
    },

    /*
     * =======================================================
     * META
     * =======================================================
     */

    metaRow: {
      flexDirection: "row",

      alignItems: "center",

      minWidth: 0,

      marginTop: 3,

      gap: 5,
    },

    categoryText: {
      maxWidth: "45%",

      fontSize: 10,

      fontWeight: "600",
    },

    metaText: {
      flexShrink: 1,

      fontSize: 9,
    },

    separator: {
      fontSize: 9,
    },

    paymentRow: {
      flexDirection: "row",

      alignItems: "center",

      gap: 3,

      flexShrink: 1,
    },

    /*
     * =======================================================
     * DATE
     * =======================================================
     */

    dateRow: {
      flexDirection: "row",

      alignItems: "center",

      gap: 4,

      marginTop: 4,
    },

    dateText: {
      fontSize: 9,

      fontWeight: "500",
    },

    /*
     * =======================================================
     * AMOUNT
     * =======================================================
     */

    amountContainer: {
      alignItems: "flex-end",

      minWidth: 82,

      marginRight: 2,
    },

    amountRow: {
      flexDirection: "row",

      alignItems: "center",

      maxWidth: 100,

      gap: 2,
    },

    amount: {
      fontSize: 11,

      fontWeight: "800",

      flexShrink: 1,
    },

    /*
     * These remain semantic colors.
     * They should NOT change with the theme.
     */

    expenseAmount: {
      color: "#DC2626",
    },

    incomeAmount: {
      color: "#059669",
    },

    /*
     * =======================================================
     * LOADING
     * =======================================================
     */

    loading: {
      minHeight: 180,

      alignItems: "center",

      justifyContent: "center",

      gap: 8,
    },

    loadingText: {
      fontSize: 12,

      fontWeight: "500",
    },

    /*
     * =======================================================
     * ERROR
     * =======================================================
     */

    error: {
      minHeight: 180,

      alignItems: "center",

      justifyContent: "center",

      padding: 20,

      borderWidth: 1,

      borderRadius: 16,
    },

    errorIcon: {
      width: 42,

      height: 42,

      alignItems: "center",

      justifyContent: "center",

      borderRadius: 12,
    },

    errorTitle: {
      marginTop: 10,

      fontSize: 13,

      fontWeight: "700",
    },

    errorText: {
      marginTop: 3,

      fontSize: 10,

      fontWeight: "500",
    },

    /*
     * =======================================================
     * EMPTY
     * =======================================================
     */

    empty: {
      minHeight: 220,

      alignItems: "center",

      justifyContent: "center",

      padding: 24,

      borderWidth: 1,

      borderRadius: 16,
    },

    emptyIcon: {
      width: 50,

      height: 50,

      alignItems: "center",

      justifyContent: "center",

      borderRadius: 15,
    },

    emptyTitle: {
      marginTop: 12,

      fontSize: 14,

      fontWeight: "800",
    },

    emptyText: {
      marginTop: 4,

      fontSize: 11,

      fontWeight: "500",

      textAlign: "center",
    },
  });