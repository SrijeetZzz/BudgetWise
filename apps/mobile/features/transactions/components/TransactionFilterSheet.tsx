

import {
  CalendarDays,
  Check,
  ChevronDown,
  RotateCcw,
  X,
} from "lucide-react-native";

import { useEffect, useMemo, useState } from "react";

import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { useCategories } from "../../categories/hooks/use-categories";



import type { Category } from "../../../types/category.types";

import type {
  TransactionQuery,
  TransactionType,
} from "../../../types/transaction.types";
import { useTheme } from "../../../providers/ThemeProvider";

/*
 * ===========================================================
 * PROPS
 * ===========================================================
 */

interface TransactionFilterSheetProps {
  visible: boolean;

  filters: TransactionQuery;

  onApply: (
    filters: TransactionQuery,
  ) => void;

  onClose: () => void;
}

/*
 * ===========================================================
 * DROPDOWNS
 * ===========================================================
 */

type OpenDropdown =
  | "category"
  | "subcategory"
  | "sort"
  | null;

/*
 * ===========================================================
 * DATE PICKER TARGET
 * ===========================================================
 */

type DatePickerTarget =
  | "startDate"
  | "endDate"
  | null;

/*
 * ===========================================================
 * COMPONENT
 * ===========================================================
 */

export default function TransactionFilterSheet({
  visible,
  filters,
  onApply,
  onClose,
}: TransactionFilterSheetProps) {
  /*
   * =========================================================
   * THEME
   * =========================================================
   */

  const { theme } = useTheme();

  /*
   * =========================================================
   * DRAFT FILTERS
   * =========================================================
   */

  const [
    draftFilters,
    setDraftFilters,
  ] = useState<TransactionQuery>(
    filters,
  );

  /*
   * =========================================================
   * DROPDOWN
   * =========================================================
   */

  const [
    openDropdown,
    setOpenDropdown,
  ] = useState<OpenDropdown>(null);

  /*
   * =========================================================
   * DATE PICKER
   * =========================================================
   */

  const [
    datePickerTarget,
    setDatePickerTarget,
  ] = useState<DatePickerTarget>(
    null,
  );

  const [
    datePickerValue,
    setDatePickerValue,
  ] = useState<Date>(
    new Date(),
  );

  /*
   * =========================================================
   * CATEGORY DATA
   * =========================================================
   */

  const {
    data,
    isLoading: categoriesLoading,
  } = useCategories();

  const categories =
    data?.data ?? [];

  /*
   * =========================================================
   * RESET LOCAL STATE WHEN OPENING
   * =========================================================
   */

  useEffect(() => {
    if (!visible) {
      return;
    }

    setDraftFilters(filters);
    setOpenDropdown(null);
    setDatePickerTarget(null);
  }, [visible, filters]);

  /*
   * =========================================================
   * PARENT CATEGORIES
   * =========================================================
   */

  const parentCategories =
    useMemo(() => {
      return categories.filter(
        (category) =>
          category.level === 0 &&
          (!draftFilters.type ||
            category.type ===
              draftFilters.type),
      );
    }, [
      categories,
      draftFilters.type,
    ]);

  /*
   * =========================================================
   * SUBCATEGORIES
   * =========================================================
   */

  const subcategories =
    useMemo(() => {
      return categories.filter(
        (category) =>
          category.level === 1 &&
          category.parentCategoryId ===
            draftFilters.categoryId &&
          (!draftFilters.type ||
            category.type ===
              draftFilters.type),
      );
    }, [
      categories,
      draftFilters.categoryId,
      draftFilters.type,
    ]);

  /*
   * =========================================================
   * APPLY
   * =========================================================
   */

  const handleApply = () => {
    /*
     * Basic date validation.
     */

    if (
      draftFilters.startDate &&
      draftFilters.endDate &&
      draftFilters.startDate >
        draftFilters.endDate
    ) {
      return;
    }

    /*
     * Basic amount validation.
     */

    if (
      draftFilters.minAmount !==
        undefined &&
      draftFilters.maxAmount !==
        undefined &&
      draftFilters.minAmount >
        draftFilters.maxAmount
    ) {
      return;
    }

    onApply({
      ...draftFilters,
      page: 1,
    });

    setOpenDropdown(null);
    setDatePickerTarget(null);

    onClose();
  };

  /*
   * =========================================================
   * RESET
   * =========================================================
   */

  const handleReset = () => {
    setDraftFilters({
      page: 1,

      limit:
        filters.limit ?? 10,

      sortBy:
        "transactionDate",

      sortOrder:
        "desc",
    });

    setOpenDropdown(null);
    setDatePickerTarget(null);
  };

  /*
   * =========================================================
   * GENERIC FILTER UPDATE
   * =========================================================
   */

  const updateFilter = <
    K extends keyof TransactionQuery,
  >(
    key: K,
    value: TransactionQuery[K],
  ) => {
    setDraftFilters(
      (previous) => ({
        ...previous,

        [key]: value,

        page: 1,
      }),
    );
  };

  /*
   * =========================================================
   * TYPE CHANGE
   * =========================================================
   */

  const handleTypeChange = (
    type:
      | TransactionType
      | undefined,
  ) => {
    setDraftFilters(
      (previous) => ({
        ...previous,

        type,

        categoryId:
          undefined,

        subcategoryId:
          undefined,

        page: 1,
      }),
    );

    setOpenDropdown(null);
  };

  /*
   * =========================================================
   * CATEGORY CHANGE
   * =========================================================
   */

  const handleCategoryChange = (
    categoryId:
      | string
      | undefined,
  ) => {
    setDraftFilters(
      (previous) => ({
        ...previous,

        categoryId,

        subcategoryId:
          undefined,

        page: 1,
      }),
    );
  };

  /*
   * =========================================================
   * DROPDOWN TOGGLE
   * =========================================================
   */

  const toggleDropdown = (
    dropdown: Exclude<
      OpenDropdown,
      null
    >,
  ) => {
    setOpenDropdown(
      (previous) =>
        previous === dropdown
          ? null
          : dropdown,
    );
  };

  /*
   * =========================================================
   * OPEN DATE PICKER
   * =========================================================
   */

  const openDatePicker = (
    target: DatePickerTarget,
  ) => {
    if (!target) {
      return;
    }

    const currentValue =
      target === "startDate"
        ? draftFilters.startDate
        : draftFilters.endDate;

    const parsedDate =
      parseDateString(
        currentValue,
      );

    setDatePickerValue(
      parsedDate ?? new Date(),
    );

    setDatePickerTarget(target);

    setOpenDropdown(null);
  };

  /*
   * =========================================================
   * DATE PICKER CHANGE
   * =========================================================
   */

  const handleDatePickerChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    /*
     * Android closes the picker after
     * selection/cancel.
     */

    if (Platform.OS === "android") {
      setDatePickerTarget(null);
    }

    if (
      event.type === "dismissed" ||
      !selectedDate ||
      !datePickerTarget
    ) {
      return;
    }

    const formattedDate =
      formatDateForQuery(
        selectedDate,
      );

    updateFilter(
      datePickerTarget,
      formattedDate,
    );
  };

  /*
   * =========================================================
   * CLOSE DATE PICKER
   * =========================================================
   */

  const closeDatePicker = () => {
    setDatePickerTarget(null);
  };

  /*
   * =========================================================
   * DATE RANGE ERROR
   * =========================================================
   */

  const dateRangeError =
    Boolean(
      draftFilters.startDate &&
        draftFilters.endDate &&
        draftFilters.startDate >
          draftFilters.endDate,
    );

  /*
   * =========================================================
   * AMOUNT RANGE ERROR
   * =========================================================
   */

  const amountRangeError =
    Boolean(
      draftFilters.minAmount !==
        undefined &&
        draftFilters.maxAmount !==
          undefined &&
        draftFilters.minAmount >
          draftFilters.maxAmount,
    );

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[
          styles.modalContainer,
          {
            backgroundColor:
              "transparent",
          },
        ]}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        {/* =================================================
            BACKDROP
        ================================================= */}

        <Pressable
          style={[
            styles.backdrop,
            {
              backgroundColor:
                "rgba(0, 0, 0, 0.45)",
            },
          ]}
          onPress={onClose}
        />

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
          onStartShouldSetResponder={() =>
            true
          }
        >
          {/* =================================================
              HANDLE
          ================================================= */}

          <View
            style={[
              styles.handle,
              {
                backgroundColor:
                  theme.border,
              },
            ]}
          />

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
                Filters
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
                Refine your transactions
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={({
                pressed,
              }) => [
                styles.closeButton,
                {
                  backgroundColor:
                    theme.surfaceSecondary,
                },
                pressed && {
                  opacity: 0.7,
                  transform: [
                    {
                      scale: 0.95,
                    },
                  ],
                },
              ]}
            >
              <X
                size={19}
                color={theme.text}
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
              styles.scrollContent
            }
          >
            {/* =================================================
                TRANSACTION TYPE
            ================================================= */}

            <FilterSection
              title="Transaction Type"
              theme={theme}
            >
              <View
                style={[
                  styles.segmentRow,
                  {
                    backgroundColor:
                      theme.surfaceSecondary,
                  },
                ]}
              >
                <SegmentButton
                  label="All"
                  active={
                    !draftFilters.type
                  }
                  onPress={() =>
                    handleTypeChange(
                      undefined,
                    )
                  }
                  theme={theme}
                />

                <SegmentButton
                  label="Expense"
                  active={
                    draftFilters.type ===
                    "EXPENSE"
                  }
                  onPress={() =>
                    handleTypeChange(
                      "EXPENSE",
                    )
                  }
                  theme={theme}
                />

                <SegmentButton
                  label="Income"
                  active={
                    draftFilters.type ===
                    "INCOME"
                  }
                  onPress={() =>
                    handleTypeChange(
                      "INCOME",
                    )
                  }
                  theme={theme}
                />
              </View>
            </FilterSection>

            {/* =================================================
                SOURCE
            ================================================= */}

            <FilterSection
              title="Transaction Source"
              theme={theme}
            >
              <View
                style={styles.inlineOptions}
              >
                <MiniOption
                  label="All"
                  active={
                    !draftFilters.transactionSource
                  }
                  onPress={() =>
                    updateFilter(
                      "transactionSource",
                      undefined,
                    )
                  }
                  theme={theme}
                />

                <MiniOption
                  label="Manual"
                  active={
                    draftFilters.transactionSource ===
                    "MANUAL"
                  }
                  onPress={() =>
                    updateFilter(
                      "transactionSource",
                      "MANUAL",
                    )
                  }
                  theme={theme}
                />

                <MiniOption
                  label="Recurring"
                  active={
                    draftFilters.transactionSource ===
                    "RECURRING"
                  }
                  onPress={() =>
                    updateFilter(
                      "transactionSource",
                      "RECURRING",
                    )
                  }
                  theme={theme}
                />
              </View>
            </FilterSection>

            {/* =================================================
                CATEGORY
            ================================================= */}

            <FilterSection
              title="Category"
              theme={theme}
            >
              <SelectField
                value={
                  draftFilters.categoryId
                    ? getCategoryName(
                        categories,
                        draftFilters.categoryId,
                      )
                    : "All Categories"
                }
                disabled={
                  categoriesLoading
                }
                open={
                  openDropdown ===
                  "category"
                }
                onPress={() =>
                  toggleDropdown(
                    "category",
                  )
                }
                theme={theme}
              />

              {openDropdown ===
                "category" && (
                <View
                  style={[
                    styles.dropdownList,
                    {
                      backgroundColor:
                        theme.surfaceSecondary,
                      borderColor:
                        theme.border,
                    },
                  ]}
                >
                  <ChoiceRow
                    label="All Categories"
                    active={
                      !draftFilters.categoryId
                    }
                    onPress={() => {
                      handleCategoryChange(
                        undefined,
                      );

                      setOpenDropdown(
                        null,
                      );
                    }}
                    theme={theme}
                  />

                  {parentCategories.map(
                    (category) => (
                      <ChoiceRow
                        key={
                          category._id
                        }
                        label={
                          category.name
                        }
                        active={
                          draftFilters.categoryId ===
                          category._id
                        }
                        onPress={() => {
                          handleCategoryChange(
                            category._id,
                          );

                          setOpenDropdown(
                            null,
                          );
                        }}
                        theme={theme}
                      />
                    ),
                  )}
                </View>
              )}
            </FilterSection>

            {/* =================================================
                SUBCATEGORY
            ================================================= */}

            <FilterSection
              title="Subcategory"
              theme={theme}
            >
              <SelectField
                value={
                  draftFilters.subcategoryId
                    ? getCategoryName(
                        categories,
                        draftFilters.subcategoryId,
                      )
                    : "All Subcategories"
                }
                disabled={
                  !draftFilters.categoryId ||
                  categoriesLoading
                }
                open={
                  openDropdown ===
                  "subcategory"
                }
                onPress={() => {
                  if (
                    !draftFilters.categoryId
                  ) {
                    return;
                  }

                  toggleDropdown(
                    "subcategory",
                  );
                }}
                theme={theme}
              />

              {openDropdown ===
                "subcategory" &&
                draftFilters.categoryId && (
                  <View
                    style={[
                      styles.dropdownList,
                      {
                        backgroundColor:
                          theme.surfaceSecondary,
                        borderColor:
                          theme.border,
                      },
                    ]}
                  >
                    <ChoiceRow
                      label="All Subcategories"
                      active={
                        !draftFilters.subcategoryId
                      }
                      onPress={() => {
                        updateFilter(
                          "subcategoryId",
                          undefined,
                        );

                        setOpenDropdown(
                          null,
                        );
                      }}
                      theme={theme}
                    />

                    {subcategories.map(
                      (category) => (
                        <ChoiceRow
                          key={
                            category._id
                          }
                          label={
                            category.name
                          }
                          active={
                            draftFilters.subcategoryId ===
                            category._id
                          }
                          onPress={() => {
                            updateFilter(
                              "subcategoryId",
                              category._id,
                            );

                            setOpenDropdown(
                              null,
                            );
                          }}
                          theme={theme}
                        />
                      ),
                    )}

                    {!subcategories.length && (
                      <Text
                        style={[
                          styles.helperText,
                          {
                            color:
                              theme.textSecondary,
                          },
                        ]}
                      >
                        No subcategories
                        available.
                      </Text>
                    )}
                  </View>
                )}
            </FilterSection>

            {/* =================================================
                PAYMENT METHOD
            ================================================= */}

            <FilterSection
              title="Payment Method"
              theme={theme}
            >
              <View
                style={styles.optionGrid}
              >
                <PaymentOption
                  label="All"
                  active={
                    !draftFilters.paymentMethod
                  }
                  onPress={() =>
                    updateFilter(
                      "paymentMethod",
                      undefined,
                    )
                  }
                  theme={theme}
                />

                <PaymentOption
                  label="Cash"
                  active={
                    draftFilters.paymentMethod ===
                    "CASH"
                  }
                  onPress={() =>
                    updateFilter(
                      "paymentMethod",
                      "CASH",
                    )
                  }
                  theme={theme}
                />

                <PaymentOption
                  label="Card"
                  active={
                    draftFilters.paymentMethod ===
                    "CARD"
                  }
                  onPress={() =>
                    updateFilter(
                      "paymentMethod",
                      "CARD",
                    )
                  }
                  theme={theme}
                />

                <PaymentOption
                  label="UPI"
                  active={
                    draftFilters.paymentMethod ===
                    "UPI"
                  }
                  onPress={() =>
                    updateFilter(
                      "paymentMethod",
                      "UPI",
                    )
                  }
                  theme={theme}
                />

                <PaymentOption
                  label="Bank Transfer"
                  active={
                    draftFilters.paymentMethod ===
                    "BANK_TRANSFER"
                  }
                  onPress={() =>
                    updateFilter(
                      "paymentMethod",
                      "BANK_TRANSFER",
                    )
                  }
                  theme={theme}
                />

                <PaymentOption
                  label="Wallet"
                  active={
                    draftFilters.paymentMethod ===
                    "WALLET"
                  }
                  onPress={() =>
                    updateFilter(
                      "paymentMethod",
                      "WALLET",
                    )
                  }
                  theme={theme}
                />

                <PaymentOption
                  label="Cheque"
                  active={
                    draftFilters.paymentMethod ===
                    "CHEQUE"
                  }
                  onPress={() =>
                    updateFilter(
                      "paymentMethod",
                      "CHEQUE",
                    )
                  }
                  theme={theme}
                />

                <PaymentOption
                  label="Other"
                  active={
                    draftFilters.paymentMethod ===
                    "OTHER"
                  }
                  onPress={() =>
                    updateFilter(
                      "paymentMethod",
                      "OTHER",
                    )
                  }
                  theme={theme}
                />
              </View>
            </FilterSection>

            {/* =================================================
                DATE RANGE
            ================================================= */}

            <FilterSection
              title="Date Range"
              theme={theme}
            >
              <View
                style={styles.twoColumn}
              >
                <DateInput
                  label="From"
                  value={
                    draftFilters.startDate
                  }
                  onPress={() =>
                    openDatePicker(
                      "startDate",
                    )
                  }
                  theme={theme}
                />

                <DateInput
                  label="To"
                  value={
                    draftFilters.endDate
                  }
                  onPress={() =>
                    openDatePicker(
                      "endDate",
                    )
                  }
                  theme={theme}
                />
              </View>

              {dateRangeError && (
                <Text
                  style={[
                    styles.validationText,
                    {
                      color:
                        theme.destructive ??
                        "#DC2626",
                    },
                  ]}
                >
                  The start date cannot be
                  after the end date.
                </Text>
              )}
            </FilterSection>

            {/* =================================================
                AMOUNT RANGE
            ================================================= */}

            <FilterSection
              title="Amount Range"
              theme={theme}
            >
              <View
                style={styles.twoColumn}
              >
                <AmountInput
                  label="Minimum"
                  value={
                    draftFilters.minAmount?.toString() ??
                    ""
                  }
                  onChange={(value) =>
                    updateFilter(
                      "minAmount",
                      value
                        ? Number(value)
                        : undefined,
                    )
                  }
                  theme={theme}
                />

                <AmountInput
                  label="Maximum"
                  value={
                    draftFilters.maxAmount?.toString() ??
                    ""
                  }
                  onChange={(value) =>
                    updateFilter(
                      "maxAmount",
                      value
                        ? Number(value)
                        : undefined,
                    )
                  }
                  theme={theme}
                />
              </View>

              {amountRangeError && (
                <Text
                  style={[
                    styles.validationText,
                    {
                      color:
                        theme.destructive ??
                        "#DC2626",
                    },
                  ]}
                >
                  Minimum amount cannot be
                  greater than maximum.
                </Text>
              )}
            </FilterSection>

            {/* =================================================
                SORT
            ================================================= */}

            <FilterSection
              title="Sort By"
              theme={theme}
            >
              <SelectField
                value={getSortLabel(
                  draftFilters.sortBy,
                  draftFilters.sortOrder,
                )}
                open={
                  openDropdown ===
                  "sort"
                }
                onPress={() =>
                  toggleDropdown("sort")
                }
                theme={theme}
              />

              {openDropdown ===
                "sort" && (
                <View
                  style={[
                    styles.dropdownList,
                    {
                      backgroundColor:
                        theme.surfaceSecondary,
                      borderColor:
                        theme.border,
                    },
                  ]}
                >
                  <ChoiceRow
                    label="Newest first"
                    active={
                      draftFilters.sortBy ===
                        "transactionDate" &&
                      draftFilters.sortOrder ===
                        "desc"
                    }
                    onPress={() => {
                      setDraftFilters(
                        (previous) => ({
                          ...previous,

                          sortBy:
                            "transactionDate",

                          sortOrder:
                            "desc",

                          page: 1,
                        }),
                      );

                      setOpenDropdown(
                        null,
                      );
                    }}
                    theme={theme}
                  />

                  <ChoiceRow
                    label="Oldest first"
                    active={
                      draftFilters.sortBy ===
                        "transactionDate" &&
                      draftFilters.sortOrder ===
                        "asc"
                    }
                    onPress={() => {
                      setDraftFilters(
                        (previous) => ({
                          ...previous,

                          sortBy:
                            "transactionDate",

                          sortOrder:
                            "asc",

                          page: 1,
                        }),
                      );

                      setOpenDropdown(
                        null,
                      );
                    }}
                    theme={theme}
                  />

                  <ChoiceRow
                    label="Highest amount"
                    active={
                      draftFilters.sortBy ===
                        "amount" &&
                      draftFilters.sortOrder ===
                        "desc"
                    }
                    onPress={() => {
                      setDraftFilters(
                        (previous) => ({
                          ...previous,

                          sortBy:
                            "amount",

                          sortOrder:
                            "desc",

                          page: 1,
                        }),
                      );

                      setOpenDropdown(
                        null,
                      );
                    }}
                    theme={theme}
                  />

                  <ChoiceRow
                    label="Lowest amount"
                    active={
                      draftFilters.sortBy ===
                        "amount" &&
                      draftFilters.sortOrder ===
                        "asc"
                    }
                    onPress={() => {
                      setDraftFilters(
                        (previous) => ({
                          ...previous,

                          sortBy:
                            "amount",

                          sortOrder:
                            "asc",

                          page: 1,
                        }),
                      );

                      setOpenDropdown(
                        null,
                      );
                    }}
                    theme={theme}
                  />

                  <ChoiceRow
                    label="Title A–Z"
                    active={
                      draftFilters.sortBy ===
                        "title" &&
                      draftFilters.sortOrder ===
                        "asc"
                    }
                    onPress={() => {
                      setDraftFilters(
                        (previous) => ({
                          ...previous,

                          sortBy:
                            "title",

                          sortOrder:
                            "asc",

                          page: 1,
                        }),
                      );

                      setOpenDropdown(
                        null,
                      );
                    }}
                    theme={theme}
                  />

                  <ChoiceRow
                    label="Title Z–A"
                    active={
                      draftFilters.sortBy ===
                        "title" &&
                      draftFilters.sortOrder ===
                        "desc"
                    }
                    onPress={() => {
                      setDraftFilters(
                        (previous) => ({
                          ...previous,

                          sortBy:
                            "title",

                          sortOrder:
                            "desc",

                          page: 1,
                        }),
                      );

                      setOpenDropdown(
                        null,
                      );
                    }}
                    theme={theme}
                  />
                </View>
              )}
            </FilterSection>
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
              onPress={handleReset}
              hitSlop={4}
              style={({ pressed }) => [
                styles.resetFooterButton,
                {
                  borderColor:
                    theme.border,
                  backgroundColor:
                    theme.surface,
                },
                pressed && {
                  opacity: 0.7,
                },
              ]}
            >
              <RotateCcw
                size={15}
                color={theme.text}
                strokeWidth={2}
              />

              <Text
                style={[
                  styles.resetFooterText,
                  {
                    color:
                      theme.text,
                  },
                ]}
              >
                Reset
              </Text>
            </Pressable>

            <Pressable
              disabled={
                dateRangeError ||
                amountRangeError
              }
              onPress={handleApply}
              hitSlop={4}
              style={({ pressed }) => [
                styles.applyButton,
                {
                  backgroundColor:
                    theme.primary,
                },
                (pressed ||
                  dateRangeError ||
                  amountRangeError) && {
                  opacity:
                    dateRangeError ||
                    amountRangeError
                      ? 0.45
                      : 0.75,
                },
              ]}
            >
              <Check
                size={16}
                color={
                  theme.primaryText ??
                  "#FFFFFF"
                }
                strokeWidth={2.5}
              />

              <Text
                style={[
                  styles.applyButtonText,
                  {
                    color:
                      theme.primaryText ??
                      "#FFFFFF",
                  },
                ]}
              >
                Apply Filters
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* =====================================================
          NATIVE DATE PICKER
      ===================================================== */}

      {datePickerTarget && (
        <DateTimePicker
          value={datePickerValue}
          mode="date"
          display={
            Platform.OS === "ios"
              ? "spinner"
              : "default"
          }
          maximumDate={
            datePickerTarget ===
              "startDate" &&
            draftFilters.endDate
              ? parseDateString(
                  draftFilters.endDate,
                )
              : undefined
          }
          minimumDate={
            datePickerTarget ===
              "endDate" &&
            draftFilters.startDate
              ? parseDateString(
                  draftFilters.startDate,
                )
              : undefined
          }
          onChange={
            handleDatePickerChange
          }
        />
      )}
    </Modal>
  );
}

/*
 * ===========================================================
 * FILTER SECTION
 * ===========================================================
 */

interface ThemeLike {
  background: string;
  surface: string;
  surfaceSecondary: string;
  border: string;
  text: string;
  textSecondary: string;
  muted?: string;
  primary: string;
  primaryText?: string;
  danger?: string;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  theme: ThemeLike;
}

function FilterSection({
  title,
  children,
  theme,
}: FilterSectionProps) {
  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: theme.text,
          },
        ]}
      >
        {title}
      </Text>

      {children}
    </View>
  );
}

/*
 * ===========================================================
 * SEGMENT BUTTON
 * ===========================================================
 */

interface SegmentButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
  theme: ThemeLike;
}

function SegmentButton({
  label,
  active,
  onPress,
  theme,
}: SegmentButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={3}
      style={({ pressed }) => [
        styles.segmentButton,

        active && {
          backgroundColor:
            theme.surface,

          shadowColor:
            "#000000",

          shadowOpacity: 0.05,

          shadowRadius: 4,

          shadowOffset: {
            width: 0,
            height: 1,
          },

          elevation: 1,
        },

        pressed && {
          opacity: 0.65,
        },
      ]}
    >
      <Text
        style={[
          styles.segmentText,
          {
            color: active
              ? theme.text
              : theme.textSecondary,
          },

          active && {
            fontWeight: "800",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/*
 * ===========================================================
 * MINI OPTION
 * ===========================================================
 */

interface MiniOptionProps {
  label: string;
  active: boolean;
  onPress: () => void;
  theme: ThemeLike;
}

function MiniOption({
  label,
  active,
  onPress,
  theme,
}: MiniOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={3}
      style={({ pressed }) => [
        styles.miniOption,

        {
          borderColor:
            active
              ? theme.primary
              : theme.border,

          backgroundColor:
            active
              ? theme.primary
              : theme.surface,
        },

        pressed && {
          opacity: 0.65,
        },
      ]}
    >
      <Text
        style={[
          styles.miniOptionText,

          {
            color: active
              ? theme.primaryText ??
                "#FFFFFF"
              : theme.textSecondary,
          },

          active && {
            fontWeight: "700",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/*
 * ===========================================================
 * CHOICE ROW
 * ===========================================================
 */

interface ChoiceRowProps {
  label: string;
  active: boolean;
  disabled?: boolean;
  onPress: () => void;
  theme: ThemeLike;
}

function ChoiceRow({
  label,
  active,
  disabled,
  onPress,
  theme,
}: ChoiceRowProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.choiceRow,

        {
          borderColor:
            active
              ? theme.border
              : theme.border,

          backgroundColor:
            active
              ? theme.surfaceSecondary
              : theme.surface,
        },

        disabled && {
          opacity: 0.4,
        },

        pressed &&
          !disabled && {
            opacity: 0.65,
          },
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.choiceText,

          {
            color: active
              ? theme.text
              : theme.textSecondary,
          },

          active && {
            fontWeight: "700",
          },
        ]}
      >
        {label}
      </Text>

      {active && (
        <Check
          size={16}
          color={theme.text}
          strokeWidth={2.5}
        />
      )}
    </Pressable>
  );
}

/*
 * ===========================================================
 * PAYMENT OPTION
 * ===========================================================
 */

interface PaymentOptionProps {
  label: string;
  active: boolean;
  onPress: () => void;
  theme: ThemeLike;
}

function PaymentOption({
  label,
  active,
  onPress,
  theme,
}: PaymentOptionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.paymentOption,

        {
          borderColor:
            active
              ? theme.primary
              : theme.border,

          backgroundColor:
            active
              ? theme.primary
              : theme.surface,
        },

        pressed && {
          opacity: 0.65,
        },
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.paymentOptionText,

          {
            color: active
              ? theme.primaryText ??
                "#FFFFFF"
              : theme.textSecondary,
          },

          active && {
            fontWeight: "700",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/*
 * ===========================================================
 * SELECT FIELD
 * ===========================================================
 */

interface SelectFieldProps {
  value: string;
  disabled?: boolean;
  open?: boolean;
  onPress: () => void;
  theme: ThemeLike;
}

function SelectField({
  value,
  disabled,
  open = false,
  onPress,
  theme,
}: SelectFieldProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.selectField,

        {
          borderColor: open
            ? theme.text
            : theme.border,

          backgroundColor:
            theme.surface,
        },

        disabled && {
          opacity: 0.5,
        },

        pressed &&
          !disabled && {
            backgroundColor:
              theme.surfaceSecondary,
          },
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.selectFieldText,

          {
            color: disabled
              ? theme.textSecondary
              : theme.text,
          },
        ]}
      >
        {value}
      </Text>

      <ChevronDown
        size={16}
        color={
          disabled
            ? theme.border
            : theme.textSecondary
        }
        strokeWidth={2}
        style={{
          transform: [
            {
              rotate: open
                ? "180deg"
                : "0deg",
            },
          ],
        }}
      />
    </Pressable>
  );
}

/*
 * ===========================================================
 * DATE INPUT
 * ===========================================================
 */

interface DateInputProps {
  label: string;
  value?: string;
  onPress: () => void;
  theme: ThemeLike;
}

function DateInput({
  label,
  value,
  onPress,
  theme,
}: DateInputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text
        style={[
          styles.inputLabel,
          {
            color:
              theme.textSecondary,
          },
        ]}
      >
        {label}
      </Text>

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.inputContainer,

          {
            borderColor:
              theme.border,

            backgroundColor:
              theme.surface,
          },

          pressed && {
            opacity: 0.7,
          },
        ]}
      >
        <CalendarDays
          size={15}
          color={
            theme.textSecondary
          }
        />

        <Text
          numberOfLines={1}
          style={[
            styles.dateValue,
            {
              color: value
                ? theme.text
                : theme.textSecondary,
            },
          ]}
        >
          {value ??
            "Select date"}
        </Text>
      </Pressable>
    </View>
  );
}

/*
 * ===========================================================
 * AMOUNT INPUT
 * ===========================================================
 */

interface AmountInputProps {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  theme: ThemeLike;
}

function AmountInput({
  label,
  value,
  onChange,
  theme,
}: AmountInputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text
        style={[
          styles.inputLabel,
          {
            color:
              theme.textSecondary,
          },
        ]}
      >
        {label}
      </Text>

      <View
        style={[
          styles.inputContainer,
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
            styles.rupee,
            {
              color:
                theme.textSecondary,
            },
          ]}
        >
          ₹
        </Text>

        <TextInput
          value={value}
          onChangeText={(text) =>
            onChange(
              text.replace(
                /[^0-9.]/g,
                "",
              ),
            )
          }
          placeholder="0"
          placeholderTextColor={
            theme.textSecondary
          }
          keyboardType="decimal-pad"
          style={[
            styles.textInput,
            {
              color: theme.text,
            },
          ]}
        />
      </View>
    </View>
  );
}

/*
 * ===========================================================
 * CATEGORY NAME
 * ===========================================================
 */

function getCategoryName(
  categories: Category[],
  id: string,
) {
  return (
    categories.find(
      (category) =>
        category._id === id,
    )?.name ?? "Category"
  );
}

/*
 * ===========================================================
 * SORT LABEL
 * ===========================================================
 */

function getSortLabel(
  sortBy?: TransactionQuery["sortBy"],
  sortOrder?: TransactionQuery["sortOrder"],
) {
  if (
    sortBy ===
      "transactionDate" &&
    sortOrder === "asc"
  ) {
    return "Oldest first";
  }

  if (
    sortBy === "amount" &&
    sortOrder === "desc"
  ) {
    return "Highest amount";
  }

  if (
    sortBy === "amount" &&
    sortOrder === "asc"
  ) {
    return "Lowest amount";
  }

  if (
    sortBy === "title" &&
    sortOrder === "asc"
  ) {
    return "Title A–Z";
  }

  if (
    sortBy === "title" &&
    sortOrder === "desc"
  ) {
    return "Title Z–A";
  }

  return "Newest first";
}

/*
 * ===========================================================
 * DATE -> QUERY FORMAT
 *
 * YYYY-MM-DD
 * ===========================================================
 */

function formatDateForQuery(
  date: Date,
) {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/*
 * ===========================================================
 * QUERY STRING -> DATE
 * ===========================================================
 */

function parseDateString(
  value?: string,
) {
  if (!value) {
    return undefined;
  }

  const parts =
    value.split("-");

  if (parts.length !== 3) {
    return undefined;
  }

  const year = Number(
    parts[0],
  );

  const month = Number(
    parts[1],
  );

  const day = Number(
    parts[2],
  );

  if (
    !year ||
    !month ||
    !day
  ) {
    return undefined;
  }

  return new Date(
    year,
    month - 1,
    day,
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
     * MODAL
     * =======================================================
     */

    modalContainer: {
      flex: 1,

      justifyContent:
        "flex-end",
    },

    backdrop: {
      ...StyleSheet.absoluteFill,
    },

    /*
     * =======================================================
     * SHEET
     * =======================================================
     */

    sheet: {
      width: "100%",

      maxHeight: "88%",

      borderTopLeftRadius: 24,

      borderTopRightRadius: 24,

      overflow: "hidden",
    },

    handle: {
      alignSelf: "center",

      width: 38,

      height: 4,

      marginTop: 9,

      marginBottom: 5,

      borderRadius: 2,
    },

    /*
     * =======================================================
     * HEADER
     * =======================================================
     */

    header: {
      minHeight: 64,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      paddingHorizontal: 18,

      borderBottomWidth: 1,
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
      width: 40,

      height: 40,

      alignItems: "center",

      justifyContent:
        "center",

      borderRadius: 12,
    },

    /*
     * =======================================================
     * SCROLL
     * =======================================================
     */

    scrollContent: {
      paddingHorizontal: 18,

      paddingTop: 16,

      paddingBottom: 24,
    },

    /*
     * =======================================================
     * SECTIONS
     * =======================================================
     */

    section: {
      marginBottom: 20,
    },

    sectionTitle: {
      marginBottom: 8,

      fontSize: 11,

      fontWeight: "800",
    },

    /*
     * =======================================================
     * TYPE
     * =======================================================
     */

    segmentRow: {
      flexDirection: "row",

      padding: 3,

      borderRadius: 11,
    },

    segmentButton: {
      flex: 1,

      minHeight: 38,

      alignItems: "center",

      justifyContent:
        "center",

      borderRadius: 9,
    },

    segmentText: {
      fontSize: 10,

      fontWeight: "600",
    },

    /*
     * =======================================================
     * SOURCE
     * =======================================================
     */

    inlineOptions: {
      flexDirection: "row",

      gap: 7,
    },

    miniOption: {
      minHeight: 36,

      alignItems: "center",

      justifyContent:
        "center",

      paddingHorizontal: 14,

      borderWidth: 1,

      borderRadius: 10,
    },

    miniOptionText: {
      fontSize: 10,

      fontWeight: "600",
    },

    /*
     * =======================================================
     * SELECT
     * =======================================================
     */

    selectField: {
      minHeight: 44,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      paddingHorizontal: 13,

      borderWidth: 1,

      borderRadius: 11,
    },

    selectFieldText: {
      flex: 1,

      marginRight: 8,

      fontSize: 11,

      fontWeight: "600",
    },

    dropdownList: {
      marginTop: 6,

      gap: 5,

      padding: 5,

      borderWidth: 1,

      borderRadius: 12,
    },

    /*
     * =======================================================
     * CHOICE
     * =======================================================
     */

    choiceRow: {
      minHeight: 40,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      paddingHorizontal: 12,

      borderWidth: 1,

      borderRadius: 9,
    },

    choiceText: {
      flex: 1,

      fontSize: 11,

      fontWeight: "500",
    },

    helperText: {
      paddingVertical: 8,

      fontSize: 10,

      fontWeight: "500",
    },

    /*
     * =======================================================
     * PAYMENT
     * =======================================================
     */

    optionGrid: {
      flexDirection: "row",

      flexWrap: "wrap",

      gap: 7,
    },

    paymentOption: {
      minWidth: "30%",

      minHeight: 38,

      alignItems: "center",

      justifyContent:
        "center",

      paddingHorizontal: 10,

      borderWidth: 1,

      borderRadius: 10,
    },

    paymentOptionText: {
      fontSize: 9,

      fontWeight: "600",
    },

    /*
     * =======================================================
     * INPUTS
     * =======================================================
     */

    twoColumn: {
      flexDirection: "row",

      gap: 9,
    },

    inputGroup: {
      flex: 1,
    },

    inputLabel: {
      marginBottom: 5,

      fontSize: 9,

      fontWeight: "600",
    },

    inputContainer: {
      height: 42,

      flexDirection: "row",

      alignItems: "center",

      paddingHorizontal: 11,

      borderWidth: 1,

      borderRadius: 10,
    },

    textInput: {
      flex: 1,

      height: "100%",

      marginLeft: 7,

      paddingVertical: 0,

      fontSize: 10,

      fontWeight: "500",
    },

    dateValue: {
      flex: 1,

      marginLeft: 7,

      fontSize: 10,

      fontWeight: "600",
    },

    rupee: {
      fontSize: 12,

      fontWeight: "700",
    },

    validationText: {
      marginTop: 6,

      fontSize: 9,

      fontWeight: "600",
    },

    /*
     * =======================================================
     * FOOTER
     * =======================================================
     */

    footer: {
      minHeight: 72,

      flexDirection: "row",

      alignItems: "center",

      gap: 9,

      paddingHorizontal: 18,

      borderTopWidth: 1,
    },

    resetFooterButton: {
      height: 44,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",

      gap: 6,

      paddingHorizontal: 15,

      borderWidth: 1,

      borderRadius: 11,
    },

    resetFooterText: {
      fontSize: 10,

      fontWeight: "700",
    },

    applyButton: {
      flex: 1,

      height: 44,

      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "center",

      gap: 6,

      borderRadius: 11,
    },

    applyButtonText: {
      fontSize: 10,

      fontWeight: "800",
    },
  });