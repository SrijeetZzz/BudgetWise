

"use client";

import {
  AlertCircle,
  CalendarDays,
  ChevronRight,
  Plus,
  Repeat,
} from "lucide-react-native";

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import { useMemo, useState } from "react";
import { useRouter } from "expo-router";

import AppHeader from "../../../features/app/components/AppHeader";

import { useTheme } from "../../../providers/ThemeProvider";

import { useCategories } from "../../../features/categories/hooks/use-categories";
import { CategoryIcon } from "../../../features/categories/components/category-icon";

import { useCreateBudget } from "../../../features/budgets/hooks/use-create-budget";

import type {
  BudgetPeriod,
  BudgetScope,
  CreateBudgetInput,
} from "../../../types/budget.types";

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

/*
 * Get the first and last day of the
 * current month.
 */

function getCurrentMonthDateRange() {
  const now = new Date();

  const firstDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  );

  const lastDay = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
  );

  return {
    startDate: firstDay,
    endDate: lastDay,
  };
}

/*
 * Format Date for display.
 */

function formatDate(date: Date) {
  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

/*
 * Convert Date into the beginning
 * of the selected day.
 */

function getStartOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
  );
}

/*
 * Convert Date into the end
 * of the selected day.
 */

function getEndOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
  );
}

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export default function CreateBudgetPage() {
  const router = useRouter();

  const { theme } = useTheme();

  const createBudget =
    useCreateBudget();

  /*
   * =======================================================
   * CATEGORIES
   * =======================================================
   */

  const {
    data: categoryResponse,
    isLoading: categoriesLoading,
  } = useCategories();

  const categories =
    categoryResponse?.data ?? [];

  /*
   * =======================================================
   * CATEGORY DATA
   * =======================================================
   */

  const parentCategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.level === 0,
      ),
    [categories],
  );

  /*
   * =======================================================
   * FORM STATE
   * =======================================================
   */

  const [scope, setScope] =
    useState<BudgetScope>("OVERALL");

  const [categoryId, setCategoryId] =
    useState("");

  const [
    subcategoryId,
    setSubcategoryId,
  ] = useState("");

  const [period, setPeriod] =
    useState<BudgetPeriod>("MONTHLY");

  /*
   * Default dates:
   *
   * Start = first day of current month
   * End   = last day of current month
   */

  const defaultDateRange =
    useMemo(
      () =>
        getCurrentMonthDateRange(),
      [],
    );

  const [startDate, setStartDate] =
    useState<Date>(
      defaultDateRange.startDate,
    );

  const [endDate, setEndDate] =
    useState<Date>(
      defaultDateRange.endDate,
    );

  const [
    budgetAmount,
    setBudgetAmount,
  ] = useState("");

  /*
   * =======================================================
   * RECURRENCE
   * =======================================================
   */

  const [recurring, setRecurring] =
    useState(false);

  const [
    recurrenceAmount,
    setRecurrenceAmount,
  ] = useState("");

  const [
    recurrenceEndDate,
    setRecurrenceEndDate,
  ] = useState<Date | null>(null);

  /*
   * =======================================================
   * UI STATE
   * =======================================================
   */

  const [error, setError] =
    useState("");

  const [
    scopePickerOpen,
    setScopePickerOpen,
  ] = useState(false);

  const [
    periodPickerOpen,
    setPeriodPickerOpen,
  ] = useState(false);

  const [
    categoryPickerOpen,
    setCategoryPickerOpen,
  ] = useState(false);

  const [
    subcategoryPickerOpen,
    setSubcategoryPickerOpen,
  ] = useState(false);

  /*
   * Native date picker states
   */

  const [
    startDatePickerOpen,
    setStartDatePickerOpen,
  ] = useState(false);

  const [
    endDatePickerOpen,
    setEndDatePickerOpen,
  ] = useState(false);

  const [
    recurrenceDatePickerOpen,
    setRecurrenceDatePickerOpen,
  ] = useState(false);

  /*
   * =======================================================
   * SUBCATEGORIES
   * =======================================================
   */

  const subcategories = useMemo(
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
   * SCOPE
   * =======================================================
   */

  const handleScopeChange = (
    nextScope: BudgetScope,
  ) => {
    setScope(nextScope);

    if (nextScope === "OVERALL") {
      setCategoryId("");
      setSubcategoryId("");
    }

    if (nextScope === "CATEGORY") {
      setSubcategoryId("");
    }

    setScopePickerOpen(false);
  };

  /*
   * =======================================================
   * CATEGORY
   * =======================================================
   */

  const handleCategoryChange = (
    value: string,
  ) => {
    setCategoryId(value);
    setSubcategoryId("");
    setCategoryPickerOpen(false);
  };

  /*
   * =======================================================
   * PERIOD
   * =======================================================
   */

  const handlePeriodChange = (
    nextPeriod: BudgetPeriod,
  ) => {
    setPeriod(nextPeriod);

    /*
     * Custom budgets cannot recur.
     */

    if (nextPeriod === "CUSTOM") {
      setRecurring(false);
      setRecurrenceAmount("");
      setRecurrenceEndDate(null);
    }

    setPeriodPickerOpen(false);
  };

  /*
   * =======================================================
   * START DATE
   * =======================================================
   */

  const handleStartDateChange = (
    selectedDate?: Date,
  ) => {
    setStartDatePickerOpen(false);

    if (!selectedDate) {
      return;
    }

    const normalizedDate =
      getStartOfDay(selectedDate);

    setStartDate(normalizedDate);

    /*
     * If the selected start date becomes
     * later than the existing end date,
     * move the end date forward automatically.
     */

    if (
      normalizedDate.getTime() >
      endDate.getTime()
    ) {
      setEndDate(
        getEndOfDay(normalizedDate),
      );
    }

    /*
     * Recurrence end date cannot be
     * before the new budget end date.
     */

    if (
      recurrenceEndDate &&
      recurrenceEndDate.getTime() <
        getEndOfDay(normalizedDate).getTime()
    ) {
      setRecurrenceEndDate(null);
    }
  };

  /*
   * =======================================================
   * END DATE
   * =======================================================
   */

  const handleEndDateChange = (
    selectedDate?: Date,
  ) => {
    setEndDatePickerOpen(false);

    if (!selectedDate) {
      return;
    }

    const normalizedDate =
      getEndOfDay(selectedDate);

    setEndDate(normalizedDate);

    /*
     * Existing recurrence end date
     * must remain after the budget end date.
     */

    if (
      recurrenceEndDate &&
      recurrenceEndDate.getTime() <
        normalizedDate.getTime()
    ) {
      setRecurrenceEndDate(null);
    }
  };

  /*
   * =======================================================
   * RECURRENCE END DATE
   * =======================================================
   */

  const handleRecurrenceEndDateChange = (
    selectedDate?: Date,
  ) => {
    setRecurrenceDatePickerOpen(false);

    if (!selectedDate) {
      return;
    }

    setRecurrenceEndDate(
      getEndOfDay(selectedDate),
    );
  };

  /*
   * =======================================================
   * SUBMIT
   * =======================================================
   */

  const handleSubmit = async () => {
    setError("");

    /*
     * =====================================================
     * SCOPE VALIDATION
     * =====================================================
     */

    if (
      scope === "CATEGORY" &&
      !categoryId
    ) {
      setError(
        "Please select a category.",
      );

      return;
    }

    if (
      scope === "SUBCATEGORY" &&
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

    /*
     * =====================================================
     * DATE VALIDATION
     * =====================================================
     */

    if (
      startDate.getTime() >
      endDate.getTime()
    ) {
      setError(
        "End date must be after the start date.",
      );

      return;
    }

    /*
     * =====================================================
     * AMOUNT VALIDATION
     * =====================================================
     */

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

    /*
     * =====================================================
     * RECURRENCE VALIDATION
     * =====================================================
     */

    if (
      recurring &&
      period === "CUSTOM"
    ) {
      setError(
        "Recurring budgets are not supported for custom periods.",
      );

      return;
    }

    if (
      recurring &&
      recurrenceEndDate &&
      recurrenceEndDate.getTime() <
        endDate.getTime()
    ) {
      setError(
        "Recurrence end date must be after the current budget period.",
      );

      return;
    }

    /*
     * =====================================================
     * FUTURE BUDGET AMOUNT
     * =====================================================
     */

    let futureBudgetAmount:
      | number
      | undefined;

    if (
      recurring &&
      recurrenceAmount
    ) {
      futureBudgetAmount =
        Number(recurrenceAmount);

      if (
        !Number.isFinite(
          futureBudgetAmount,
        ) ||
        futureBudgetAmount <= 0
      ) {
        setError(
          "Future budget amount must be greater than 0.",
        );

        return;
      }
    }

    /*
     * =====================================================
     * PAYLOAD
     * =====================================================
     */

    const payload: CreateBudgetInput = {
      scope,

      period,

      startDate:
        getStartOfDay(
          startDate,
        ).toISOString(),

      endDate:
        getEndOfDay(
          endDate,
        ).toISOString(),

      budgetAmount: amount,
    };

    /*
     * =====================================================
     * CATEGORY
     * =====================================================
     */

    if (
      scope === "CATEGORY" ||
      scope === "SUBCATEGORY"
    ) {
      payload.categoryId =
        categoryId;
    }

    /*
     * =====================================================
     * SUBCATEGORY
     * =====================================================
     */

    if (
      scope === "SUBCATEGORY"
    ) {
      payload.subcategoryId =
        subcategoryId;
    }

    /*
     * =====================================================
     * RECURRENCE
     * =====================================================
     */

    if (recurring) {
      payload.recurrence = {
        enabled: true,
      };

      if (
        futureBudgetAmount !==
        undefined
      ) {
        payload.recurrence.budgetAmount =
          futureBudgetAmount;
      }

      if (recurrenceEndDate) {
        payload.recurrence.endDate =
          getEndOfDay(
            recurrenceEndDate,
          ).toISOString();
      }
    }

    /*
     * =====================================================
     * API
     * =====================================================
     */

    try {
      await createBudget.mutateAsync(
        payload,
      );

      router.back();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Unable to create budget. Please try again.",
      );
    }
  };

  /*
   * =======================================================
   * SUBMIT DISABLED
   * =======================================================
   */

  const isSubmitDisabled =
    createBudget.isPending ||
    !budgetAmount ||
    (scope !== "OVERALL" &&
      !categoryId) ||
    (scope === "SUBCATEGORY" &&
      !subcategoryId);

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
      {/* ===================================================
          SHARED APP HEADER
      =================================================== */}

      <AppHeader />

      {/* ===================================================
          FORM
      =================================================== */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          styles.content
        }
      >
        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <View
          style={styles.pageHeader}
        >
          <Text
            style={[
              styles.pageTitle,
              {
                color: theme.text,
              },
            ]}
          >
            Create Budget
          </Text>

          <Text
            style={[
              styles.pageSubtitle,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            Set a spending limit and
            track your progress.
          </Text>
        </View>

        {/* =================================================
            SCOPE
        ================================================= */}

        <View
          style={styles.section}
        >
          <Text
            style={[
              styles.label,
              {
                color: theme.text,
              },
            ]}
          >
            Budget Scope
          </Text>

          <Pressable
            onPress={() =>
              setScopePickerOpen(
                (value) => !value,
              )
            }
            style={({ pressed }) => [
              styles.selectButton,
              {
                borderColor:
                  theme.border,
                backgroundColor:
                  theme.surface,
              },
              pressed &&
                styles.pressed,
            ]}
          >
            <View>
              <Text
                style={[
                  styles.selectLabel,
                  {
                    color:
                      theme.textSecondary,
                  },
                ]}
              >
                Scope
              </Text>

              <Text
                style={[
                  styles.selectValue,
                  {
                    color:
                      theme.text,
                  },
                ]}
              >
                {formatEnum(scope)}
              </Text>
            </View>

            <ChevronRight
              size={18}
              color={
                theme.textSecondary
              }
            />
          </Pressable>

          {scopePickerOpen && (
            <View
              style={[
                styles.optionsBox,
                {
                  borderColor:
                    theme.border,
                  backgroundColor:
                    theme.surface,
                },
              ]}
            >
              {SCOPES.map(
                (item) => (
                  <Pressable
                    key={item}
                    onPress={() =>
                      handleScopeChange(
                        item,
                      )
                    }
                    style={[
                      styles.option,
                      {
                        backgroundColor:
                          scope === item
                            ? theme.surfaceSecondary
                            : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            scope === item
                              ? theme.text
                              : theme.textSecondary,
                        },
                        scope ===
                          item &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {formatEnum(
                        item,
                      )}
                    </Text>
                  </Pressable>
                ),
              )}
            </View>
          )}

          <Text
            style={[
              styles.helperText,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            {scope ===
            "OVERALL"
              ? "Tracks total spending across all categories."
              : scope ===
                  "CATEGORY"
                ? "Tracks spending within a specific category."
                : "Tracks spending within a specific subcategory."}
          </Text>
        </View>

        {/* =================================================
            CATEGORY
        ================================================= */}

        {scope !== "OVERALL" && (
          <View
            style={styles.section}
          >
            <Text
              style={[
                styles.label,
                {
                  color: theme.text,
                },
              ]}
            >
              Category
            </Text>

            <Pressable
              disabled={
                categoriesLoading
              }
              onPress={() =>
                setCategoryPickerOpen(
                  (value) => !value,
                )
              }
              style={({ pressed }) => [
                styles.selectButton,
                {
                  borderColor:
                    theme.border,
                  backgroundColor:
                    theme.surface,
                },
                pressed &&
                  styles.pressed,
              ]}
            >
              <View
                style={
                  styles.selectedValueRow
                }
              >
                {selectedCategory && (
                  <CategoryIcon
                    name={
                      selectedCategory.icon
                    }
                    size={18}
                    color={
                      theme.text
                    }
                  />
                )}

                <View>
                  <Text
                    style={[
                      styles.selectLabel,
                      {
                        color:
                          theme.textSecondary,
                      },
                    ]}
                  >
                    Category
                  </Text>

                  <Text
                    style={[
                      styles.selectValue,
                      {
                        color:
                          theme.text,
                      },
                    ]}
                  >
                    {categoriesLoading
                      ? "Loading..."
                      : selectedCategory
                        ?.name ??
                        "Select category"}
                  </Text>
                </View>
              </View>

              <ChevronRight
                size={18}
                color={
                  theme.textSecondary
                }
              />
            </Pressable>

            {categoryPickerOpen && (
              <View
                style={[
                  styles.optionsBox,
                  {
                    borderColor:
                      theme.border,
                    backgroundColor:
                      theme.surface,
                  },
                ]}
              >
                {parentCategories.map(
                  (category) => (
                    <Pressable
                      key={
                        category._id
                      }
                      onPress={() =>
                        handleCategoryChange(
                          category._id,
                        )
                      }
                      style={[
                        styles.option,
                        {
                          backgroundColor:
                            categoryId ===
                            category._id
                              ? theme.surfaceSecondary
                              : "transparent",
                        },
                      ]}
                    >
                      <View
                        style={
                          styles.optionCategory
                        }
                      >
                        <CategoryIcon
                          name={
                            category.icon
                          }
                          size={17}
                          color={
                            theme.text
                          }
                        />

                        <Text
                          style={[
                            styles.optionText,
                            {
                              color:
                                categoryId ===
                                category._id
                                  ? theme.text
                                  : theme.textSecondary,
                            },
                            categoryId ===
                              category._id &&
                              styles.optionTextSelected,
                          ]}
                        >
                          {
                            category.name
                          }
                        </Text>
                      </View>
                    </Pressable>
                  ),
                )}
              </View>
            )}
          </View>
        )}

        {/* =================================================
            SUBCATEGORY
        ================================================= */}

        {scope ===
          "SUBCATEGORY" && (
          <View
            style={styles.section}
          >
            <Text
              style={[
                styles.label,
                {
                  color: theme.text,
                },
              ]}
            >
              Subcategory
            </Text>

            <Pressable
              disabled={
                !categoryId ||
                subcategories.length ===
                  0
              }
              onPress={() =>
                setSubcategoryPickerOpen(
                  (value) => !value,
                )
              }
              style={({ pressed }) => [
                styles.selectButton,
                {
                  borderColor:
                    theme.border,
                  backgroundColor:
                    theme.surface,
                },
                pressed &&
                  styles.pressed,
              ]}
            >
              <View
                style={
                  styles.selectedValueRow
                }
              >
                {selectedSubcategory && (
                  <CategoryIcon
                    name={
                      selectedSubcategory.icon
                    }
                    size={18}
                    color={
                      theme.text
                    }
                  />
                )}

                <View>
                  <Text
                    style={[
                      styles.selectLabel,
                      {
                        color:
                          theme.textSecondary,
                      },
                    ]}
                  >
                    Subcategory
                  </Text>

                  <Text
                    style={[
                      styles.selectValue,
                      {
                        color:
                          theme.text,
                      },
                    ]}
                  >
                    {!categoryId
                      ? "Select category first"
                      : subcategories.length ===
                          0
                        ? "No subcategories found"
                        : selectedSubcategory
                          ?.name ??
                          "Select subcategory"}
                  </Text>
                </View>
              </View>

              <ChevronRight
                size={18}
                color={
                  theme.textSecondary
                }
              />
            </Pressable>

            {subcategoryPickerOpen &&
              subcategories.length >
                0 && (
                <View
                  style={[
                    styles.optionsBox,
                    {
                      borderColor:
                        theme.border,
                      backgroundColor:
                        theme.surface,
                    },
                  ]}
                >
                  {subcategories.map(
                    (
                      subcategory,
                    ) => (
                      <Pressable
                        key={
                          subcategory._id
                        }
                        onPress={() => {
                          setSubcategoryId(
                            subcategory._id,
                          );

                          setSubcategoryPickerOpen(
                            false,
                          );
                        }}
                        style={[
                          styles.option,
                          {
                            backgroundColor:
                              subcategoryId ===
                              subcategory._id
                                ? theme.surfaceSecondary
                                : "transparent",
                          },
                        ]}
                      >
                        <View
                          style={
                            styles.optionCategory
                          }
                        >
                          <CategoryIcon
                            name={
                              subcategory.icon
                            }
                            size={
                              17
                            }
                            color={
                              theme.text
                            }
                          />

                          <Text
                            style={[
                              styles.optionText,
                              {
                                color:
                                  subcategoryId ===
                                  subcategory._id
                                    ? theme.text
                                    : theme.textSecondary,
                              },
                              subcategoryId ===
                                subcategory._id &&
                                styles.optionTextSelected,
                            ]}
                          >
                            {
                              subcategory.name
                            }
                          </Text>
                        </View>
                      </Pressable>
                    ),
                  )}
                </View>
              )}
          </View>
        )}

        {/* =================================================
            PERIOD
        ================================================= */}

        <View
          style={styles.section}
        >
          <Text
            style={[
              styles.label,
              {
                color: theme.text,
              },
            ]}
          >
            Budget Period
          </Text>

          <Pressable
            onPress={() =>
              setPeriodPickerOpen(
                (value) => !value,
              )
            }
            style={({ pressed }) => [
              styles.selectButton,
              {
                borderColor:
                  theme.border,
                backgroundColor:
                  theme.surface,
              },
              pressed &&
                styles.pressed,
            ]}
          >
            <View>
              <Text
                style={[
                  styles.selectLabel,
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
                  styles.selectValue,
                  {
                    color:
                      theme.text,
                  },
                ]}
              >
                {formatEnum(period)}
              </Text>
            </View>

            <ChevronRight
              size={18}
              color={
                theme.textSecondary
              }
            />
          </Pressable>

          {periodPickerOpen && (
            <View
              style={[
                styles.optionsBox,
                {
                  borderColor:
                    theme.border,
                  backgroundColor:
                    theme.surface,
                },
              ]}
            >
              {PERIODS.map(
                (item) => (
                  <Pressable
                    key={item}
                    onPress={() =>
                      handlePeriodChange(
                        item,
                      )
                    }
                    style={[
                      styles.option,
                      {
                        backgroundColor:
                          period === item
                            ? theme.surfaceSecondary
                            : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color:
                            period === item
                              ? theme.text
                              : theme.textSecondary,
                        },
                        period ===
                          item &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {formatEnum(
                        item,
                      )}
                    </Text>
                  </Pressable>
                ),
              )}
            </View>
          )}

          {period ===
            "CUSTOM" && (
            <Text
              style={[
                styles.warningText,
                {
                  color:
                    theme.destructive,
                },
              ]}
            >
              Custom timeframe budgets
              cannot be configured to
              auto-recur.
            </Text>
          )}
        </View>

        {/* =================================================
            RECURRENCE
        ================================================= */}

        {period !==
          "CUSTOM" && (
          <View
            style={[
              styles.recurrenceCard,
              {
                borderColor:
                  theme.border,
                backgroundColor:
                  theme.surface,
              },
            ]}
          >
            <View
              style={
                styles.recurrenceHeader
              }
            >
              <View
                style={
                  styles.recurrenceTitleRow
                }
              >
                <View
                  style={[
                    styles.recurrenceIcon,
                    {
                      backgroundColor:
                        theme.surfaceSecondary,
                    },
                  ]}
                >
                  <Repeat
                    size={16}
                    color={
                      theme.text
                    }
                  />
                </View>

                <View>
                  <Text
                    style={[
                      styles.recurrenceTitle,
                      {
                        color:
                          theme.text,
                      },
                    ]}
                  >
                    Auto-Recurring Budget
                  </Text>

                  <Text
                    style={[
                      styles.recurrenceSubtitle,
                      {
                        color:
                          theme.textSecondary,
                      },
                    ]}
                  >
                    Automatically renew this
                    budget
                  </Text>
                </View>
              </View>

              <Switch
                value={recurring}
                onValueChange={
                  setRecurring
                }
                trackColor={{
                  false: theme.border,
                  true: theme.primary,
                }}
                thumbColor={
                  theme.primaryText
                }
              />
            </View>

            {recurring && (
              <View
                style={[
                  styles.recurrenceFields,
                  {
                    borderTopColor:
                      theme.border,
                  },
                ]}
              >
                {/* Future Amount */}

                <View
                  style={styles.field}
                >
                  <Text
                    style={[
                      styles.label,
                      {
                        color:
                          theme.text,
                      },
                    ]}
                  >
                    Next Cycle Budget
                    Amount
                  </Text>

                  <TextInput
                    value={
                      recurrenceAmount
                    }
                    onChangeText={
                      setRecurrenceAmount
                    }
                    keyboardType="decimal-pad"
                    placeholder={
                      budgetAmount
                        ? `Default: ₹${budgetAmount}`
                        : "e.g. 10000"
                    }
                    placeholderTextColor={
                      theme.textSecondary
                    }
                    style={[
                      styles.input,
                      {
                        borderColor:
                          theme.border,
                        backgroundColor:
                          theme.surface,
                        color:
                          theme.text,
                      },
                    ]}
                  />

                  <Text
                    style={[
                      styles.helperText,
                      {
                        color:
                          theme.textSecondary,
                      },
                    ]}
                  >
                    Leave empty to retain
                    the current budget
                    limit.
                  </Text>
                </View>

                {/* Recurrence End Date */}

                <View
                  style={styles.field}
                >
                  <Text
                    style={[
                      styles.label,
                      {
                        color:
                          theme.text,
                      },
                    ]}
                  >
                    Recurrence End Date
                  </Text>

                  <Pressable
                    onPress={() =>
                      setRecurrenceDatePickerOpen(
                        true,
                      )
                    }
                    style={({ pressed }) => [
                      styles.datePickerButtonFull,
                      {
                        borderColor:
                          theme.border,
                        backgroundColor:
                          theme.surface,
                      },
                      pressed &&
                        styles.pressed,
                    ]}
                  >
                    <CalendarDays
                      size={17}
                      color={
                        theme.textSecondary
                      }
                    />

                    <Text
                      style={[
                        styles.dateValue,
                        {
                          color:
                            theme.text,
                        },
                      ]}
                    >
                      {recurrenceEndDate
                        ? formatDate(
                            recurrenceEndDate,
                          )
                        : "No end date"}
                    </Text>
                  </Pressable>

                  {recurrenceDatePickerOpen && (
                    <DateTimePicker
                      value={
                        recurrenceEndDate ??
                        endDate
                      }
                      mode="date"
                      display="default"
                      minimumDate={
                        endDate
                      }
                      onChange={(
                        _event,
                        selectedDate,
                      ) =>
                        handleRecurrenceEndDateChange(
                          selectedDate,
                        )
                      }
                    />
                  )}

                  <Text
                    style={[
                      styles.helperText,
                      {
                        color:
                          theme.textSecondary,
                      },
                    ]}
                  >
                    Leave blank to repeat
                    indefinitely.
                  </Text>

                  {recurrenceEndDate && (
                    <Pressable
                      onPress={() =>
                        setRecurrenceEndDate(
                          null,
                        )
                      }
                      style={
                        styles.clearDateButton
                      }
                    >
                      <Text
                        style={[
                          styles.clearDateText,
                          {
                            color:
                              theme.destructive,
                          },
                        ]}
                      >
                        Remove end date
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            )}
          </View>
        )}

        {/* =================================================
            BUDGET DATES
        ================================================= */}

        <View
          style={styles.section}
        >
          <Text
            style={[
              styles.label,
              {
                color: theme.text,
              },
            ]}
          >
            Budget Dates
          </Text>

          <View
            style={styles.dateRow}
          >
            {/* Start Date */}

            <View
              style={
                styles.dateField
              }
            >
              <Text
                style={[
                  styles.smallLabel,
                  {
                    color:
                      theme.textSecondary,
                  },
                ]}
              >
                Start Date
              </Text>

              <Pressable
                onPress={() =>
                  setStartDatePickerOpen(
                    true,
                  )
                }
                style={({ pressed }) => [
                  styles.datePickerButton,
                  {
                    borderColor:
                      theme.border,
                    backgroundColor:
                      theme.surface,
                  },
                  pressed &&
                    styles.pressed,
                ]}
              >
                <CalendarDays
                  size={16}
                  color={
                    theme.textSecondary
                  }
                />

                <Text
                  style={[
                    styles.dateValue,
                    {
                      color:
                        theme.text,
                    },
                  ]}
                >
                  {formatDate(
                    startDate,
                  )}
                </Text>
              </Pressable>

              {startDatePickerOpen && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={(
                    _event,
                    selectedDate,
                  ) =>
                    handleStartDateChange(
                      selectedDate,
                    )
                  }
                />
              )}
            </View>

            {/* End Date */}

            <View
              style={
                styles.dateField
              }
            >
              <Text
                style={[
                  styles.smallLabel,
                  {
                    color:
                      theme.textSecondary,
                  },
                ]}
              >
                End Date
              </Text>

              <Pressable
                onPress={() =>
                  setEndDatePickerOpen(
                    true,
                  )
                }
                style={({ pressed }) => [
                  styles.datePickerButton,
                  {
                    borderColor:
                      theme.border,
                    backgroundColor:
                      theme.surface,
                  },
                  pressed &&
                    styles.pressed,
                ]}
              >
                <CalendarDays
                  size={16}
                  color={
                    theme.textSecondary
                  }
                />

                <Text
                  style={[
                    styles.dateValue,
                    {
                      color:
                        theme.text,
                    },
                  ]}
                >
                  {formatDate(
                    endDate,
                  )}
                </Text>
              </Pressable>

              {endDatePickerOpen && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  minimumDate={
                    startDate
                  }
                  onChange={(
                    _event,
                    selectedDate,
                  ) =>
                    handleEndDateChange(
                      selectedDate,
                    )
                  }
                />
              )}
            </View>
          </View>

          <Text
            style={[
              styles.helperText,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            Defaults to the first and
            last day of the current month.
          </Text>
        </View>

        {/* =================================================
            AMOUNT
        ================================================= */}

        <View
          style={styles.section}
        >
          <Text
            style={[
              styles.label,
              {
                color: theme.text,
              },
            ]}
          >
            Budget Amount
          </Text>

          <View
            style={[
              styles.amountInputContainer,
              {
                borderColor:
                  theme.border,
                backgroundColor:
                  theme.surface,
              },
            ]}
          >
            <Text
              style={[
                styles.currencySymbol,
                {
                  color:
                    theme.text,
                },
              ]}
            >
              ₹
            </Text>

            <TextInput
              value={
                budgetAmount
              }
              onChangeText={
                setBudgetAmount
              }
              keyboardType="decimal-pad"
              placeholder="25000"
              placeholderTextColor={
                theme.textSecondary
              }
              style={[
                styles.amountInput,
                {
                  color:
                    theme.text,
                },
              ]}
            />
          </View>
        </View>

        {/* =================================================
            ERROR
        ================================================= */}

        {Boolean(error) && (
          <View
            style={[
              styles.errorBox,
              {
                borderColor:
                  theme.destructive,
                backgroundColor:
                  theme.surfaceSecondary,
              },
            ]}
          >
            <AlertCircle
              size={17}
              color={
                theme.destructive
              }
            />

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
        )}

        {/* =================================================
            CREATE
        ================================================= */}

        <Pressable
          disabled={
            isSubmitDisabled
          }
          onPress={
            handleSubmit
          }
          style={({ pressed }) => [
            styles.createButton,
            {
              backgroundColor:
                theme.primary,
            },
            isSubmitDisabled &&
              styles.createButtonDisabled,
            pressed &&
              styles.pressed,
          ]}
        >
          <Plus
            size={19}
            color={
              theme.primaryText
            }
            strokeWidth={2.5}
          />

          <Text
            style={[
              styles.createButtonText,
              {
                color:
                  theme.primaryText,
              },
            ]}
          >
            {createBudget.isPending
              ? "Creating..."
              : recurring
                ? "Create Recurring Budget"
                : "Create Budget"}
          </Text>
        </Pressable>

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
     * PAGE HEADER
     * =======================================================
     */

    pageHeader: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 4,
    },

    pageTitle: {
      fontSize: 22,
      fontWeight: "800",
    },

    pageSubtitle: {
      marginTop: 5,

      fontSize: 11,
      lineHeight: 16,

      fontWeight: "500",
    },

    /*
     * =======================================================
     * CONTENT
     * =======================================================
     */

    content: {
      paddingBottom: 100,
    },

    /*
     * =======================================================
     * SECTIONS
     * =======================================================
     */

    section: {
      marginTop: 18,
      paddingHorizontal: 16,
    },

    label: {
      marginBottom: 7,

      fontSize: 11,
      fontWeight: "700",
    },

    smallLabel: {
      marginBottom: 6,

      fontSize: 10,
      fontWeight: "600",
    },

    /*
     * =======================================================
     * SELECT
     * =======================================================
     */

    selectButton: {
      minHeight: 56,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

      paddingHorizontal: 14,

      borderWidth: 1,

      borderRadius: 13,
    },

    selectedValueRow: {
      flexDirection: "row",
      alignItems: "center",

      gap: 9,
    },

    selectLabel: {
      fontSize: 9,
      fontWeight: "500",
    },

    selectValue: {
      marginTop: 2,

      fontSize: 13,
      fontWeight: "700",
    },

    /*
     * =======================================================
     * OPTIONS
     * =======================================================
     */

    optionsBox: {
      marginTop: 6,

      padding: 6,

      borderWidth: 1,

      borderRadius: 13,
    },

    option: {
      minHeight: 43,

      justifyContent: "center",

      paddingHorizontal: 11,

      borderRadius: 9,
    },

    optionText: {
      fontSize: 11,
      fontWeight: "600",
    },

    optionTextSelected: {
      fontWeight: "800",
    },

    optionCategory: {
      flexDirection: "row",
      alignItems: "center",

      gap: 9,
    },

    /*
     * =======================================================
     * HELPER
     * =======================================================
     */

    helperText: {
      marginTop: 6,

      fontSize: 10,
      lineHeight: 15,

      fontWeight: "500",
    },

    warningText: {
      marginTop: 7,

      fontSize: 10,
      lineHeight: 15,

      fontWeight: "600",
    },

    /*
     * =======================================================
     * RECURRENCE
     * =======================================================
     */

    recurrenceCard: {
      marginTop: 18,
      marginHorizontal: 16,

      padding: 14,

      borderWidth: 1,

      borderRadius: 15,
    },

    recurrenceHeader: {
      flexDirection: "row",

      alignItems: "center",
      justifyContent:
        "space-between",

      gap: 12,
    },

    recurrenceTitleRow: {
      flex: 1,

      flexDirection: "row",
      alignItems: "center",

      gap: 9,
    },

    recurrenceIcon: {
      width: 34,
      height: 34,

      alignItems: "center",
      justifyContent:
        "center",

      borderRadius: 10,
    },

    recurrenceTitle: {
      fontSize: 12,
      fontWeight: "800",
    },

    recurrenceSubtitle: {
      marginTop: 2,

      fontSize: 9,
      fontWeight: "500",
    },

    recurrenceFields: {
      marginTop: 14,

      paddingTop: 14,

      borderTopWidth: 1,

      gap: 15,
    },

    field: {},

    /*
     * =======================================================
     * INPUTS
     * =======================================================
     */

    input: {
      height: 46,

      paddingHorizontal: 13,

      borderWidth: 1,

      borderRadius: 12,

      fontSize: 12,
      fontWeight: "600",
    },

    /*
     * =======================================================
     * DATE PICKER
     * =======================================================
     */

    datePickerButton: {
      minHeight: 46,

      flexDirection: "row",
      alignItems: "center",

      gap: 8,

      paddingHorizontal: 12,

      borderWidth: 1,

      borderRadius: 12,
    },

    datePickerButtonFull: {
      height: 46,

      flexDirection: "row",
      alignItems: "center",

      gap: 8,

      paddingHorizontal: 12,

      borderWidth: 1,

      borderRadius: 12,
    },

    dateValue: {
      fontSize: 11,
      fontWeight: "700",
    },

    clearDateButton: {
      alignSelf: "flex-start",

      marginTop: 7,
    },

    clearDateText: {
      fontSize: 10,
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
    },

    dateField: {
      flex: 1,
    },

    /*
     * =======================================================
     * AMOUNT
     * =======================================================
     */

    amountInputContainer: {
      height: 52,

      flexDirection: "row",
      alignItems: "center",

      paddingHorizontal: 14,

      borderWidth: 1,

      borderRadius: 13,
    },

    currencySymbol: {
      marginRight: 8,

      fontSize: 18,
      fontWeight: "800",
    },

    amountInput: {
      flex: 1,

      height: "100%",

      padding: 0,

      fontSize: 17,
      fontWeight: "800",
    },

    /*
     * =======================================================
     * ERROR
     * =======================================================
     */

    errorBox: {
      flexDirection: "row",

      alignItems: "flex-start",

      gap: 9,

      marginTop: 18,
      marginHorizontal: 16,

      padding: 12,

      borderWidth: 1,

      borderRadius: 12,
    },

    errorText: {
      flex: 1,

      fontSize: 10,
      lineHeight: 15,

      fontWeight: "600",
    },

    /*
     * =======================================================
     * CREATE BUTTON
     * =======================================================
     */

    createButton: {
      height: 50,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      gap: 8,

      marginTop: 18,
      marginHorizontal: 16,

      borderRadius: 13,
    },

    createButtonDisabled: {
      opacity: 0.45,
    },

    createButtonText: {
      fontSize: 12,
      fontWeight: "800",
    },

    /*
     * =======================================================
     * PRESS
     * =======================================================
     */

    pressed: {
      opacity: 0.65,
    },

    /*
     * =======================================================
     * BOTTOM SPACING
     * =======================================================
     */

    bottomSpacing: {
      height: 30,
    },
  });