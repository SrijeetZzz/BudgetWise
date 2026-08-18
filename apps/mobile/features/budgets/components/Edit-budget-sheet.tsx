
import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  Check,
  ChevronDown,
  Loader2,
  Pencil,
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

import { useCategories } from "../../categories/hooks/use-categories";
import { CategoryIcon } from "../../categories/components/category-icon";

import { useUpdateBudget } from "../hooks/use-update-budget";

import type {
  Budget,
  BudgetPeriod,
  BudgetScope,
  UpdateBudgetInput,
} from "../../../types/budget.types";

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

interface EditBudgetSheetProps {
  budget: Budget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/*
 * =========================================================
 * CONSTANTS
 * =========================================================
 */

const SCOPES: BudgetScope[] = [
  "OVERALL",
  "CATEGORY",
  "SUBCATEGORY",
];

const PERIODS: BudgetPeriod[] = [
  "WEEKLY",
  "MONTHLY",
  "YEARLY",
  "CUSTOM",
];

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function getId(
  value:
    | string
    | { _id: string }
    | null
    | undefined,
) {
  if (!value) {
    return "";
  }

  return typeof value === "string"
    ? value
    : value._id;
}

function toDateInputValue(
  date: string,
) {
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

function formatEnum(value: string) {
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

function toStartISOString(
  date: string,
) {
  return new Date(
    `${date}T00:00:00`,
  ).toISOString();
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

export function EditBudgetSheet({
  budget,
  open,
  onOpenChange,
}: EditBudgetSheetProps) {
  const { theme } = useTheme();

  const updateBudget =
    useUpdateBudget();

  const {
    data: categoryResponse,
    isLoading: categoriesLoading,
  } = useCategories();

  const categories =
    categoryResponse?.data ?? [];

  /*
   * =======================================================
   * STATE
   * =======================================================
   */

  const [scope, setScope] =
    useState<BudgetScope>(
      budget.scope,
    );

  const [categoryId, setCategoryId] =
    useState("");

  const [
    subcategoryId,
    setSubcategoryId,
  ] = useState("");

  const [period, setPeriod] =
    useState<BudgetPeriod>(
      budget.period,
    );

  const [startDate, setStartDate] =
    useState(
      toDateInputValue(
        budget.startDate,
      ),
    );

  const [endDate, setEndDate] =
    useState(
      toDateInputValue(
        budget.endDate,
      ),
    );

  const [
    budgetAmount,
    setBudgetAmount,
  ] = useState(
    String(budget.budgetAmount),
  );

  const [error, setError] =
    useState("");

  const [selector, setSelector] =
    useState<
      | "scope"
      | "category"
      | "subcategory"
      | "period"
      | null
    >(null);

  /*
   * =======================================================
   * RESET WHEN OPENING
   * =======================================================
   */

  useEffect(() => {
    if (!open) {
      return;
    }

    setScope(budget.scope);

    setCategoryId(
      getId(budget.categoryId),
    );

    setSubcategoryId(
      getId(
        budget.subcategoryId,
      ),
    );

    setPeriod(budget.period);

    setStartDate(
      toDateInputValue(
        budget.startDate,
      ),
    );

    setEndDate(
      toDateInputValue(
        budget.endDate,
      ),
    );

    setBudgetAmount(
      String(budget.budgetAmount),
    );

    setError("");
    setSelector(null);
  }, [open, budget]);

  /*
   * =======================================================
   * CATEGORY DATA
   * =======================================================
   */

  const parentCategories =
    useMemo(
      () =>
        categories.filter(
          (category) =>
            category.level === 0,
        ),
      [categories],
    );

  const subcategories =
    useMemo(
      () =>
        categories.filter(
          (category) =>
            category.level === 1 &&
            category.parentCategoryId ===
              categoryId,
        ),
      [categories, categoryId],
    );

  const selectedCategory =
    categories.find(
      (category) =>
        category._id === categoryId,
    );

  const selectedSubcategory =
    categories.find(
      (category) =>
        category._id ===
        subcategoryId,
    );

  /*
   * =======================================================
   * DIRTY STATE
   * =======================================================
   */

  const isDirty =
    scope !== budget.scope ||
    categoryId !==
      getId(budget.categoryId) ||
    subcategoryId !==
      getId(
        budget.subcategoryId,
      ) ||
    period !== budget.period ||
    startDate !==
      toDateInputValue(
        budget.startDate,
      ) ||
    endDate !==
      toDateInputValue(
        budget.endDate,
      ) ||
    Number(budgetAmount) !==
      budget.budgetAmount;

  /*
   * =======================================================
   * HANDLERS
   * =======================================================
   */

  const handleScopeChange = (
    value: BudgetScope,
  ) => {
    setScope(value);

    if (value === "OVERALL") {
      setCategoryId("");
      setSubcategoryId("");
    }

    if (value === "CATEGORY") {
      setSubcategoryId("");
    }

    setSelector(null);
  };

  const handleCategoryChange = (
    value: string,
  ) => {
    setCategoryId(value);
    setSubcategoryId("");
    setSelector(null);
  };

  const handleSubcategoryChange = (
    value: string,
  ) => {
    setSubcategoryId(value);
    setSelector(null);
  };

  const handlePeriodChange = (
    value: BudgetPeriod,
  ) => {
    setPeriod(value);
    setSelector(null);
  };

  const handleSubmit = async () => {
    setError("");

    if (
      scope !== "OVERALL" &&
      !categoryId
    ) {
      setError(
        "Please select a category.",
      );

      return;
    }

    if (
      scope === "SUBCATEGORY" &&
      !subcategoryId
    ) {
      setError(
        "Please select a subcategory.",
      );

      return;
    }

    if (!startDate || !endDate) {
      setError(
        "Start and end dates are required.",
      );

      return;
    }

    if (endDate < startDate) {
      setError(
        "End date must be after the start date.",
      );

      return;
    }

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

    const payload: UpdateBudgetInput = {
      scope,
      period,

      startDate:
        toStartISOString(startDate),

      endDate:
        toEndISOString(endDate),

      budgetAmount: amount,
    };

    if (scope !== "OVERALL") {
      payload.categoryId =
        categoryId;
    }

    if (scope === "SUBCATEGORY") {
      payload.subcategoryId =
        subcategoryId;
    }

    try {
      await updateBudget.mutateAsync({
        budgetId: budget._id,
        payload,
      });

      onOpenChange(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Unable to update budget. Please try again.",
      );
    }
  };

  /*
   * =======================================================
   * SELECTOR OPTIONS
   * =======================================================
   */

  const renderSelector = () => {
    if (!selector) {
      return null;
    }

    let title = "";

    let options: {
      id: string;
      label: string;
      icon?: string;
    }[] = [];

    if (selector === "scope") {
      title = "Budget Scope";

      options = SCOPES.map(
        (item) => ({
          id: item,
          label: formatEnum(item),
        }),
      );
    }

    if (selector === "period") {
      title = "Budget Period";

      options = PERIODS.map(
        (item) => ({
          id: item,
          label: formatEnum(item),
        }),
      );
    }

    if (selector === "category") {
      title = "Select Category";

      options =
        parentCategories.map(
          (category) => ({
            id: category._id,
            label: category.name,
            icon: category.icon,
          }),
        );
    }

    if (selector === "subcategory") {
      title = "Select Subcategory";

      options =
        subcategories.map(
          (category) => ({
            id: category._id,
            label: category.name,
            icon: category.icon,
          }),
        );
    }

    return (
      <View
        style={[
          styles.selectorOverlay,
          {
            backgroundColor:
              "rgba(0,0,0,0.35)",
          },
        ]}
      >
        <View
          style={[
            styles.selectorCard,
            {
              backgroundColor:
                theme.surface,
            },
          ]}
        >
          {/* Selector Header */}

          <View
            style={[
              styles.selectorHeader,
              {
                borderBottomColor:
                  theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.selectorTitle,
                {
                  color:
                    theme.text,
                },
              ]}
            >
              {title}
            </Text>

            <Pressable
              onPress={() =>
                setSelector(null)
              }
              style={[
                styles.closeButton,
                {
                  backgroundColor:
                    theme.surfaceSecondary,
                },
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

          {/* Selector Options */}

          <ScrollView
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.selectorList
            }
          >
            {options.map((item) => {
              const isSelected =
                selector ===
                  "scope" &&
                item.id === scope
                  ? true
                  : selector ===
                      "period" &&
                    item.id === period
                    ? true
                    : selector ===
                        "category" &&
                      item.id ===
                        categoryId
                      ? true
                      : selector ===
                          "subcategory" &&
                        item.id ===
                          subcategoryId;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    if (
                      selector ===
                      "scope"
                    ) {
                      handleScopeChange(
                        item.id as BudgetScope,
                      );
                    } else if (
                      selector ===
                      "period"
                    ) {
                      handlePeriodChange(
                        item.id as BudgetPeriod,
                      );
                    } else if (
                      selector ===
                      "category"
                    ) {
                      handleCategoryChange(
                        item.id,
                      );
                    } else {
                      handleSubcategoryChange(
                        item.id,
                      );
                    }
                  }}
                  style={[
                    styles.option,
                    {
                      backgroundColor:
                        isSelected
                          ? theme.surfaceSecondary
                          : "transparent",
                    },
                  ]}
                >
                  <View
                    style={
                      styles.optionLeft
                    }
                  >
                    {item.icon ? (
                      <View
                        style={[
                          styles.optionIcon,
                          {
                            backgroundColor:
                              theme.surfaceSecondary,
                          },
                        ]}
                      >
                        <CategoryIcon
                          name={
                            item.icon
                          }
                          size={18}
                          color={
                            theme.textSecondary
                          }
                        />
                      </View>
                    ) : null}

                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            isSelected
                              ? theme.text
                              : theme.textSecondary,
                        },
                        isSelected &&
                          styles.selectedOptionText,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>

                  {isSelected && (
                    <Check
                      size={18}
                      color={
                        theme.text
                      }
                      strokeWidth={2.2}
                    />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    );
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
                <Pencil
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
                  Edit Budget
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
                  Update your budget settings.
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() =>
                onOpenChange(false)
              }
              disabled={
                updateBudget.isPending
              }
              style={[
                styles.closeButton,
                {
                  backgroundColor:
                    theme.surfaceSecondary,
                },
                updateBudget.isPending &&
                  styles.disabledButton,
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
            {/* Scope */}

            <FieldLabel>
              Budget Scope
            </FieldLabel>

            <SelectButton
              value={formatEnum(scope)}
              onPress={() =>
                setSelector("scope")
              }
            />

            {/* Category */}

            {scope !== "OVERALL" && (
              <>
                <FieldLabel>
                  Category
                </FieldLabel>

                <SelectButton
                  value={
                    selectedCategory
                      ?.name ??
                    (categoriesLoading
                      ? "Loading categories..."
                      : "Select category")
                  }
                  disabled={
                    categoriesLoading
                  }
                  icon={
                    selectedCategory?.icon
                  }
                  onPress={() =>
                    setSelector(
                      "category",
                    )
                  }
                />
              </>
            )}

            {/* Subcategory */}

            {scope ===
              "SUBCATEGORY" && (
              <>
                <FieldLabel>
                  Subcategory
                </FieldLabel>

                <SelectButton
                  value={
                    selectedSubcategory
                      ?.name ??
                    (!categoryId
                      ? "Select category first"
                      : subcategories.length ===
                          0
                        ? "No subcategories found"
                        : "Select subcategory")
                  }
                  disabled={
                    !categoryId ||
                    subcategories.length ===
                      0
                  }
                  icon={
                    selectedSubcategory?.icon
                  }
                  onPress={() =>
                    setSelector(
                      "subcategory",
                    )
                  }
                />
              </>
            )}

            {/* Period */}

            <FieldLabel>
              Budget Period
            </FieldLabel>

            <SelectButton
              value={formatEnum(period)}
              onPress={() =>
                setSelector("period")
              }
            />

            {/* Dates */}

            <View
              style={styles.dateRow}
            >
              <View
                style={styles.dateField}
              >
                <FieldLabel>
                  Start Date
                </FieldLabel>

                <DateInput
                  value={startDate}
                  onChangeText={
                    setStartDate
                  }
                />
              </View>

              <View
                style={styles.dateField}
              >
                <FieldLabel>
                  End Date
                </FieldLabel>

                <DateInput
                  value={endDate}
                  onChangeText={
                    setEndDate
                  }
                />
              </View>
            </View>

            {/* Amount */}

            <FieldLabel>
              Budget Amount
            </FieldLabel>

            <TextInput
              value={budgetAmount}
              onChangeText={
                setBudgetAmount
              }
              keyboardType="decimal-pad"
              placeholder="e.g. 25000"
              placeholderTextColor={
                theme.textSecondary
              }
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

            {/* Error */}

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
            <Pressable
              disabled={
                updateBudget.isPending
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
                updateBudget.isPending &&
                  styles.disabledButton,
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

            <Pressable
              disabled={
                !isDirty ||
                updateBudget.isPending
              }
              onPress={handleSubmit}
              style={[
                styles.saveButton,
                {
                  backgroundColor:
                    theme.primary,
                },
                (!isDirty ||
                  updateBudget.isPending) &&
                  styles.disabledSave,
              ]}
            >
              {updateBudget.isPending ? (
                <Loader2
                  size={17}
                  color={
                    theme.primaryText
                  }
                  strokeWidth={2}
                />
              ) : (
                <Pencil
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
                {updateBudget.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </Text>
            </Pressable>
          </View>
        </View>

        {renderSelector()}
      </View>
    </Modal>
  );
}

/*
 * =========================================================
 * SMALL COMPONENTS
 * =========================================================
 */

function FieldLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        styles.label,
        {
          color: theme.text,
        },
      ]}
    >
      {children}
    </Text>
  );
}

function SelectButton({
  value,
  icon,
  disabled,
  onPress,
}: {
  value: string;
  icon?: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.selectButton,
        {
          borderColor:
            theme.border,
          backgroundColor:
            theme.surface,
        },
        disabled &&
          styles.selectDisabled,
      ]}
    >
      <View
        style={styles.selectLeft}
      >
        {icon ? (
          <CategoryIcon
            name={icon}
            size={17}
            color={
              theme.textSecondary
            }
          />
        ) : null}

        <Text
          numberOfLines={1}
          style={[
            styles.selectText,
            {
              color: theme.text,
            },
          ]}
        >
          {value}
        </Text>
      </View>

      <ChevronDown
        size={17}
        color={theme.textSecondary}
        strokeWidth={2}
      />
    </Pressable>
  );
}

function DateInput({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (
    value: string,
  ) => void;
}) {
  const { theme } = useTheme();

  return (
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
        size={15}
        color={theme.textSecondary}
        strokeWidth={2}
      />

      <TextInput
        value={value}
        onChangeText={
          onChangeText
        }
        placeholder="YYYY-MM-DD"
        placeholderTextColor={
          theme.textSecondary
        }
        keyboardType="numbers-and-punctuation"
        style={[
          styles.dateInput,
          {
            color: theme.text,
          },
        ]}
        maxLength={10}
      />
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
      maxHeight: "92%",

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

    headerIcon: {
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

    headerText: {
      flex: 1,
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

    label: {
      marginTop: 4,

      marginBottom: 7,

      fontSize: 11,

      fontWeight: "700",
    },

    /*
     * =======================================================
     * SELECT
     * =======================================================
     */

    selectButton: {
      minHeight: 44,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      paddingHorizontal: 13,

      marginBottom: 15,

      borderWidth: 1,

      borderRadius: 12,
    },

    selectDisabled: {
      opacity: 0.5,
    },

    selectLeft: {
      flexDirection: "row",

      alignItems: "center",

      flex: 1,

      gap: 8,
    },

    selectText: {
      flex: 1,

      fontSize: 12,

      fontWeight: "600",
    },

    /*
     * =======================================================
     * INPUT
     * =======================================================
     */

    input: {
      height: 44,

      paddingHorizontal: 13,

      marginBottom: 15,

      borderWidth: 1,

      borderRadius: 12,

      fontSize: 12,

      fontWeight: "600",
    },

    /*
     * =======================================================
     * DATES
     * =======================================================
     */

    dateRow: {
      flexDirection: "row",

      gap: 10,

      marginBottom: 2,
    },

    dateField: {
      flex: 1,
    },

    dateInputWrapper: {
      height: 44,

      flexDirection: "row",

      alignItems: "center",

      paddingHorizontal: 11,

      marginBottom: 15,

      gap: 7,

      borderWidth: 1,

      borderRadius: 12,
    },

    dateInput: {
      flex: 1,

      padding: 0,

      fontSize: 11,

      fontWeight: "600",
    },

    /*
     * =======================================================
     * ERROR
     * =======================================================
     */

    error: {
      padding: 11,

      marginTop: 2,

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

    disabledButton: {
      opacity: 0.5,
    },

    disabledSave: {
      opacity: 0.4,
    },

    /*
     * =======================================================
     * SELECTOR
     * =======================================================
     */

    selectorOverlay: {
      position: "absolute",

      left: 0,
      right: 0,
      top: 0,
      bottom: 0,

      justifyContent:
        "flex-end",
    },

    selectorCard: {
      maxHeight: "70%",

      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,

      overflow: "hidden",
    },

    selectorHeader: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      paddingHorizontal: 18,

      paddingVertical: 15,

      borderBottomWidth: 1,
    },

    selectorTitle: {
      fontSize: 15,

      fontWeight: "800",
    },

    selectorList: {
      padding: 12,

      paddingBottom: 28,
    },

    option: {
      minHeight: 46,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      paddingHorizontal: 12,

      marginBottom: 5,

      borderRadius: 11,
    },

    optionLeft: {
      flexDirection: "row",

      alignItems: "center",

      flex: 1,

      gap: 9,
    },

    optionIcon: {
      width: 30,
      height: 30,

      alignItems: "center",

      justifyContent:
        "center",

      borderRadius: 8,
    },

    optionText: {
      fontSize: 12,

      fontWeight: "600",
    },

    selectedOptionText: {
      fontWeight: "800",
    },
  });