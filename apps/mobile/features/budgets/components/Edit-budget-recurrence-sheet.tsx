

import { useEffect, useState } from "react";

import {
  CalendarDays,
  Loader2,
  Repeat,
  X,
} from "lucide-react-native";

import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTheme } from "../../../providers/ThemeProvider";

import type {
  Budget,
  UpdateBudgetRecurrenceInput,
} from "../../../types/budget.types";

import { useUpdateBudgetRecurrence } from "../hooks/use-update-budget-recurrence";

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

interface EditBudgetRecurrenceSheetProps {
  budget: Budget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function toDateInputValue(
  date: string | null | undefined,
) {
  if (!date) {
    return "";
  }

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  const year = value.getFullYear();

  const month = String(
    value.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    value.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function toEndISOString(
  date: string,
) {
  return new Date(
    `${date}T23:59:59`,
  ).toISOString();
}

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export function EditBudgetRecurrenceSheet({
  budget,
  open,
  onOpenChange,
}: EditBudgetRecurrenceSheetProps) {
  const { theme } = useTheme();

  const updateRecurrence =
    useUpdateBudgetRecurrence();

  const recurrence =
    budget.recurrence;

  const [
    budgetAmount,
    setBudgetAmount,
  ] = useState("");

  const [
    endDate,
    setEndDate,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  /*
   * =======================================================
   * RESET
   * =======================================================
   */

  useEffect(() => {
    if (!open) {
      return;
    }

    setBudgetAmount(
      String(
        recurrence?.budgetAmount ??
          budget.budgetAmount,
      ),
    );

    setEndDate(
      toDateInputValue(
        recurrence?.endDate,
      ),
    );

    setError("");
  }, [
    open,
    budget,
    recurrence,
  ]);

  /*
   * =======================================================
   * SUBMIT
   * =======================================================
   */

  const handleSubmit = async () => {
    setError("");

    const amount =
      Number(budgetAmount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setError(
        "Budget amount must be greater than 0.",
      );

      return;
    }

    const payload: UpdateBudgetRecurrenceInput =
      {
        budgetAmount: amount,

        endDate: endDate
          ? toEndISOString(endDate)
          : null,
      };

    try {
      await updateRecurrence.mutateAsync(
        {
          budgetId: budget._id,
          payload,
        },
      );

      onOpenChange(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Unable to update recurrence. Please try again.",
      );
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
      onRequestClose={() =>
        onOpenChange(false)
      }
    >
      <View style={styles.overlay}>
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
              <View
                style={[
                  styles.headerIcon,
                  {
                    backgroundColor:
                      theme.surfaceSecondary,
                  },
                ]}
              >
                <Repeat
                  size={19}
                  color={theme.text}
                  strokeWidth={2}
                />
              </View>

              <View
                style={styles.headerText}
              >
                <Text
                  style={[
                    styles.title,
                    {
                      color:
                        theme.text,
                    },
                  ]}
                >
                  Edit Recurrence
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
                  Changes apply to future budget
                  periods.
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() =>
                onOpenChange(false)
              }
              disabled={
                updateRecurrence.isPending
              }
              style={[
                styles.closeButton,
                {
                  backgroundColor:
                    theme.surfaceSecondary,
                },
                updateRecurrence.isPending &&
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

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              styles.content
            }
          >
            {/* =================================================
                EXPLANATION
            ================================================= */}

            <View
              style={[
                styles.infoBox,
                {
                  borderColor:
                    theme.border,
                  backgroundColor:
                    theme.surfaceSecondary,
                },
              ]}
            >
              <Repeat
                size={15}
                color={
                  theme.textSecondary
                }
                strokeWidth={2}
              />

              <Text
                style={[
                  styles.infoText,
                  {
                    color:
                      theme.textSecondary,
                  },
                ]}
              >
                This changes the recurrence
                template. Already generated
                budgets will not be changed.
              </Text>
            </View>

            {/* =================================================
                AMOUNT
            ================================================= */}

            <Text
              style={[
                styles.label,
                {
                  color: theme.text,
                },
              ]}
            >
              Future Budget Amount
            </Text>

            <TextInput
              value={budgetAmount}
              onChangeText={
                setBudgetAmount
              }
              keyboardType="decimal-pad"
              placeholder="e.g. 10000"
              placeholderTextColor={
                theme.textSecondary
              }
              autoCapitalize="none"
              style={[
                styles.input,
                {
                  borderColor:
                    theme.border,
                  color:
                    theme.text,
                  backgroundColor:
                    theme.surface,
                },
              ]}
            />

            <Text
              style={[
                styles.helper,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              This amount will be used when
              future periods are generated.
            </Text>

            {/* =================================================
                END DATE
            ================================================= */}

            <Text
              style={[
                styles.label,
                styles.dateLabel,
                {
                  color: theme.text,
                },
              ]}
            >
              Recurrence End Date
            </Text>

            <View
              style={[
                styles.dateInputWrapper,
                {
                  borderColor:
                    theme.border,
                  backgroundColor:
                    theme.surface,
                },
              ]}
            >
              <CalendarDays
                size={16}
                color={
                  theme.textSecondary
                }
                strokeWidth={2}
              />

              <TextInput
                value={endDate}
                onChangeText={
                  setEndDate
                }
                placeholder="YYYY-MM-DD"
                placeholderTextColor={
                  theme.textSecondary
                }
                keyboardType="numbers-and-punctuation"
                maxLength={10}
                style={[
                  styles.dateInput,
                  {
                    color:
                      theme.text,
                  },
                ]}
              />
            </View>

            <Text
              style={[
                styles.helper,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              Leave empty to continue indefinitely.
            </Text>

            {/* =================================================
                ERROR
            ================================================= */}

            {error ? (
              <View
                style={[
                  styles.error,
                  {
                    borderColor:
                      theme.destructive,
                    backgroundColor:
                      theme.surfaceSecondary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.errorText,
                    {
                      color:
                        theme.destructive,
                    },
                  ]}
                >
                  {error}
                </Text>
              </View>
            ) : null}
          </ScrollView>

          {/* =================================================
              FOOTER
          ================================================= */}

          <View
            style={[
              styles.footer,
              {
                borderTopColor:
                  theme.border,
                backgroundColor:
                  theme.surface,
              },
            ]}
          >
            {/* Cancel */}

            <Pressable
              disabled={
                updateRecurrence.isPending
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
                updateRecurrence.isPending &&
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

            {/* Save */}

            <Pressable
              disabled={
                updateRecurrence.isPending ||
                !budgetAmount
              }
              onPress={handleSubmit}
              style={[
                styles.saveButton,
                {
                  backgroundColor:
                    theme.primary,
                },
                (updateRecurrence.isPending ||
                  !budgetAmount) &&
                  styles.disabledSave,
              ]}
            >
              {updateRecurrence.isPending ? (
                <Loader2
                  size={17}
                  color={
                    theme.primaryText
                  }
                  strokeWidth={2}
                />
              ) : (
                <Repeat
                  size={16}
                  color={
                    theme.primaryText
                  }
                  strokeWidth={2}
                />
              )}

              <Text
                style={[
                  styles.saveText,
                  {
                    color:
                      theme.primaryText,
                  },
                ]}
              >
                {updateRecurrence.isPending
                  ? "Saving..."
                  : "Save Recurrence"}
              </Text>
            </Pressable>
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
        "rgba(0,0,0,0.55)",
    },

    /*
     * =======================================================
     * SHEET
     * =======================================================
     */

    sheet: {
      maxHeight: "75%",

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

      flex: 1,

      gap: 11,
    },

    headerIcon: {
      width: 40,
      height: 40,

      alignItems: "center",

      justifyContent:
        "center",

      borderRadius: 12,
    },

    headerText: {
      flex: 1,
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
     * INFO BOX
     * =======================================================
     */

    infoBox: {
      flexDirection: "row",

      alignItems: "flex-start",

      gap: 9,

      padding: 12,

      marginBottom: 20,

      borderWidth: 1,

      borderRadius: 12,
    },

    infoText: {
      flex: 1,

      fontSize: 11,

      lineHeight: 17,

      fontWeight: "500",
    },

    /*
     * =======================================================
     * LABEL
     * =======================================================
     */

    label: {
      marginBottom: 7,

      fontSize: 11,

      fontWeight: "700",
    },

    dateLabel: {
      marginTop: 18,
    },

    /*
     * =======================================================
     * INPUT
     * =======================================================
     */

    input: {
      height: 44,

      paddingHorizontal: 13,

      borderWidth: 1,

      borderRadius: 12,

      fontSize: 12,

      fontWeight: "600",
    },

    helper: {
      marginTop: 6,

      fontSize: 10,

      lineHeight: 15,

      fontWeight: "500",
    },

    /*
     * =======================================================
     * DATE INPUT
     * =======================================================
     */

    dateInputWrapper: {
      height: 44,

      flexDirection: "row",

      alignItems: "center",

      gap: 8,

      paddingHorizontal: 12,

      borderWidth: 1,

      borderRadius: 12,
    },

    dateInput: {
      flex: 1,

      padding: 0,

      fontSize: 12,

      fontWeight: "600",
    },

    /*
     * =======================================================
     * ERROR
     * =======================================================
     */

    error: {
      padding: 11,

      marginTop: 18,

      borderWidth: 1,

      borderRadius: 11,
    },

    errorText: {
      fontSize: 11,

      lineHeight: 16,

      fontWeight: "600",
    },

    /*
     * =======================================================
     * FOOTER
     * =======================================================
     */

    footer: {
      flexDirection: "row",

      gap: 9,

      paddingHorizontal: 18,

      paddingTop: 12,

      paddingBottom: 18,

      borderTopWidth: 1,
    },

    cancelButton: {
      flex: 1,

      height: 44,

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

    saveButton: {
      flex: 1,

      height: 44,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",

      gap: 7,

      borderRadius: 12,
    },

    saveText: {
      fontSize: 11,

      fontWeight: "700",
    },

    /*
     * =======================================================
     * STATES
     * =======================================================
     */

    disabled: {
      opacity: 0.5,
    },

    disabledSave: {
      opacity: 0.4,
    },
  });