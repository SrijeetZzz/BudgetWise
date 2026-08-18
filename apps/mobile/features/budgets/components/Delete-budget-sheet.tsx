
import {
  AlertTriangle,
  Loader2,
  Trash2,
  X,
} from "lucide-react-native";

import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { Budget } from "../../../types/budget.types";

import { useTheme } from "../../../providers/ThemeProvider";
import { useDeleteBudget } from "../hooks/use-delete-budget";

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

interface DeleteBudgetSheetProps {
  budget: Budget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function getBudgetName(
  budget: Budget,
) {
  if (budget.scope === "OVERALL") {
    return "Overall Budget";
  }

  if (
    budget.categoryId &&
    typeof budget.categoryId !== "string"
  ) {
    if (
      budget.subcategoryId &&
      typeof budget.subcategoryId !== "string"
    ) {
      return `${budget.categoryId.name} / ${budget.subcategoryId.name}`;
    }

    return budget.categoryId.name;
  }

  return "Category Budget";
}

function formatCurrency(
  amount: number,
) {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    },
  ).format(amount);
}

function formatEnum(
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

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export function DeleteBudgetSheet({
  budget,
  open,
  onOpenChange,
}: DeleteBudgetSheetProps) {
  const { theme } = useTheme();

  const deleteBudget =
    useDeleteBudget();

  const budgetName =
    getBudgetName(budget);

  /*
   * =======================================================
   * DELETE
   * =======================================================
   */

  const handleDelete = async () => {
    try {
      await deleteBudget.mutateAsync(
        budget._id,
      );

      onOpenChange(false);
    } catch {
      /*
       * Error handling is delegated
       * to the mutation hook.
       */
    }
  };

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={() => {
        if (!deleteBudget.isPending) {
          onOpenChange(false);
        }
      }}
    >
      <View style={styles.overlay}>
        {/* =================================================
            SHEET
        ================================================= */}

        <View
          style={[
            styles.sheet,
            {
              backgroundColor:
                theme.surface,
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
            <View
              style={styles.headerLeft}
            >
              {/* Delete Icon */}

              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor:
                      theme.surfaceSecondary,
                  },
                ]}
              >
                <Trash2
                  size={19}
                  color={
                    theme.destructive
                  }
                  strokeWidth={2}
                />
              </View>

              {/* Title */}

              <View>
                <Text
                  style={[
                    styles.title,
                    {
                      color:
                        theme.text,
                    },
                  ]}
                >
                  Delete Budget
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
                  This action cannot be undone.
                </Text>
              </View>
            </View>

            {/* Close */}

            <Pressable
              disabled={
                deleteBudget.isPending
              }
              onPress={() =>
                onOpenChange(false)
              }
              style={[
                styles.closeButton,
                {
                  backgroundColor:
                    theme.surfaceSecondary,
                },
                deleteBudget.isPending &&
                  styles.disabled,
              ]}
            >
              <X
                size={18}
                color={
                  theme.textSecondary
                }
                strokeWidth={2}
              />
            </Pressable>
          </View>

          {/* =================================================
              CONTENT
          ================================================= */}

          <View style={styles.content}>
            {/* =================================================
                WARNING
            ================================================= */}

            <View
              style={[
                styles.warning,
                {
                  borderColor:
                    theme.destructive,
                  backgroundColor:
                    theme.surfaceSecondary,
                },
              ]}
            >
              {/* Warning Icon */}

              <View
                style={[
                  styles.warningIcon,
                  {
                    backgroundColor:
                      theme.muted,
                  },
                ]}
              >
                <AlertTriangle
                  size={17}
                  color={
                    theme.destructive
                  }
                  strokeWidth={2}
                />
              </View>

              {/* Warning Text */}

              <View
                style={
                  styles.warningContent
                }
              >
                <Text
                  style={[
                    styles.warningTitle,
                    {
                      color:
                        theme.text,
                    },
                  ]}
                >
                  Are you sure?
                </Text>

                <Text
                  style={[
                    styles.warningText,
                    {
                      color:
                        theme.textSecondary,
                    },
                  ]}
                >
                  You are about to delete{" "}
                  <Text
                    style={[
                      styles.warningStrong,
                      {
                        color:
                          theme.text,
                      },
                    ]}
                  >
                    {budgetName}
                  </Text>
                  . The budget and its current
                  tracking information will no
                  longer appear in your budget
                  list.
                </Text>
              </View>
            </View>

            {/* =================================================
                BUDGET SUMMARY
            ================================================= */}

            <View
              style={[
                styles.summary,
                {
                  borderColor:
                    theme.border,
                  backgroundColor:
                    theme.surfaceSecondary,
                },
              ]}
            >
              {/* Budget Amount */}

              <View>
                <Text
                  style={[
                    styles.summaryLabel,
                    {
                      color:
                        theme.textSecondary,
                    },
                  ]}
                >
                  Budget Amount
                </Text>

                <Text
                  style={[
                    styles.summaryValue,
                    {
                      color:
                        theme.text,
                    },
                  ]}
                >
                  {formatCurrency(
                    budget.budgetAmount,
                  )}
                </Text>
              </View>

              {/* Period */}

              <View
                style={
                  styles.periodContainer
                }
              >
                <Text
                  style={[
                    styles.summaryLabel,
                    {
                      color:
                        theme.textSecondary,
                    },
                  ]}
                >
                  Period
                </Text>

                <Text
                  style={[
                    styles.summaryValue,
                    {
                      color:
                        theme.text,
                    },
                  ]}
                >
                  {formatEnum(
                    budget.period,
                  )}
                </Text>
              </View>
            </View>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <View
              style={[
                styles.actions,
                {
                  borderTopColor:
                    theme.border,
                },
              ]}
            >
              {/* Cancel */}

              <Pressable
                disabled={
                  deleteBudget.isPending
                }
                onPress={() =>
                  onOpenChange(false)
                }
                style={[
                  styles.cancelButton,
                  {
                    borderColor:
                      theme.border,
                    backgroundColor:
                      theme.surface,
                  },
                  deleteBudget.isPending &&
                    styles.disabled,
                ]}
              >
                <Text
                  style={[
                    styles.cancelText,
                    {
                      color:
                        theme.text,
                    },
                  ]}
                >
                  Cancel
                </Text>
              </Pressable>

              {/* Delete */}

              <Pressable
                disabled={
                  deleteBudget.isPending
                }
                onPress={handleDelete}
                style={[
                  styles.deleteButton,
                  {
                    backgroundColor:
                      theme.destructive,
                  },
                  deleteBudget.isPending &&
                    styles.deleteDisabled,
                ]}
              >
                {deleteBudget.isPending ? (
                  <Loader2
                    size={17}
                    color={
                      theme.primaryText
                    }
                    strokeWidth={2}
                  />
                ) : (
                  <Trash2
                    size={16}
                    color={
                      theme.primaryText
                    }
                    strokeWidth={2}
                  />
                )}

                <Text
                  style={[
                    styles.deleteText,
                    {
                      color:
                        theme.primaryText,
                    },
                  ]}
                >
                  {deleteBudget.isPending
                    ? "Deleting..."
                    : "Delete Budget"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
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
     * OVERLAY
     * =======================================================
     */

    overlay: {
      flex: 1,

      justifyContent:
        "flex-end",

      backgroundColor:
        "rgba(0, 0, 0, 0.55)",
    },

    /*
     * =======================================================
     * SHEET
     * =======================================================
     */

    sheet: {
      width: "100%",

      borderTopLeftRadius: 26,
      borderTopRightRadius: 26,

      overflow: "hidden",
    },

    /*
     * =======================================================
     * HEADER
     * =======================================================
     */

    header: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      paddingHorizontal: 18,

      paddingTop: 18,

      paddingBottom: 15,

      borderBottomWidth: 1,
    },

    headerLeft: {
      flexDirection: "row",

      alignItems: "center",

      gap: 11,

      flex: 1,
    },

    iconContainer: {
      width: 40,
      height: 40,

      alignItems: "center",

      justifyContent:
        "center",

      borderRadius: 12,
    },

    title: {
      fontSize: 17,

      fontWeight: "800",
    },

    subtitle: {
      marginTop: 2,

      fontSize: 10,

      fontWeight: "500",
    },

    closeButton: {
      width: 34,
      height: 34,

      alignItems: "center",

      justifyContent:
        "center",

      borderRadius: 10,
    },

    /*
     * =======================================================
     * CONTENT
     * =======================================================
     */

    content: {
      padding: 18,

      paddingBottom: 24,
    },

    /*
     * =======================================================
     * WARNING
     * =======================================================
     */

    warning: {
      flexDirection: "row",

      gap: 11,

      padding: 14,

      borderWidth: 1,

      borderRadius: 14,
    },

    warningIcon: {
      width: 30,
      height: 30,

      alignItems: "center",

      justifyContent:
        "center",

      borderRadius: 9,
    },

    warningContent: {
      flex: 1,
    },

    warningTitle: {
      fontSize: 13,

      fontWeight: "800",
    },

    warningText: {
      marginTop: 5,

      fontSize: 11,

      lineHeight: 17,

      fontWeight: "500",
    },

    warningStrong: {
      fontWeight: "800",
    },

    /*
     * =======================================================
     * SUMMARY
     * =======================================================
     */

    summary: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      marginTop: 14,

      padding: 14,

      borderWidth: 1,

      borderRadius: 14,
    },

    periodContainer: {
      alignItems: "flex-end",
    },

    summaryLabel: {
      fontSize: 10,

      fontWeight: "500",
    },

    summaryValue: {
      marginTop: 3,

      fontSize: 13,

      fontWeight: "700",
    },

    /*
     * =======================================================
     * ACTIONS
     * =======================================================
     */

    actions: {
      flexDirection: "row",

      gap: 9,

      marginTop: 18,

      paddingTop: 14,

      borderTopWidth: 1,
    },

    cancelButton: {
      flex: 1,

      height: 45,

      alignItems: "center",

      justifyContent:
        "center",

      borderWidth: 1,

      borderRadius: 12,
    },

    cancelText: {
      fontSize: 11,

      fontWeight: "700",
    },

    deleteButton: {
      flex: 1,

      height: 45,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",

      gap: 7,

      borderRadius: 12,
    },

    deleteText: {
      fontSize: 11,

      fontWeight: "800",
    },

    /*
     * =======================================================
     * STATES
     * =======================================================
     */

    deleteDisabled: {
      opacity: 0.5,
    },

    disabled: {
      opacity: 0.5,
    },
  });