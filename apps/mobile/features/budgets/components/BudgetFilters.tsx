
import {
  ChevronDown,
  RotateCcw,
  Search,
  SlidersHorizontal,
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

import { useMemo, useState } from "react";



import type {
  BudgetPeriod,
  BudgetQuery,
  BudgetScope,
  BudgetStatus,
} from "../../../types/budget.types";
import { useTheme } from "../../../providers/ThemeProvider";

interface BudgetFiltersProps {
  filters: BudgetQuery;
  onFiltersChange: (
    filters: BudgetQuery,
  ) => void;
}

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

type SortOption = {
  key: string;
  label: string;
  sortBy: NonNullable<
    BudgetQuery["sortBy"]
  >;
  sortOrder: "asc" | "desc";
};

type Option<T> = {
  value: T;
  label: string;
};

/*
 * =========================================================
 * OPTIONS
 * =========================================================
 */

const SORT_OPTIONS: SortOption[] = [
  {
    key: "createdAt-desc",
    label: "Newest first",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  {
    key: "createdAt-asc",
    label: "Oldest first",
    sortBy: "createdAt",
    sortOrder: "asc",
  },
  {
    key: "budgetAmount-desc",
    label: "Highest budget",
    sortBy: "budgetAmount",
    sortOrder: "desc",
  },
  {
    key: "budgetAmount-asc",
    label: "Lowest budget",
    sortBy: "budgetAmount",
    sortOrder: "asc",
  },
  {
    key: "spentAmount-desc",
    label: "Highest spending",
    sortBy: "spentAmount",
    sortOrder: "desc",
  },
  {
    key: "spentAmount-asc",
    label: "Lowest spending",
    sortBy: "spentAmount",
    sortOrder: "asc",
  },
  {
    key: "remainingAmount-desc",
    label: "Most remaining",
    sortBy: "remainingAmount",
    sortOrder: "desc",
  },
  {
    key: "remainingAmount-asc",
    label: "Least remaining",
    sortBy: "remainingAmount",
    sortOrder: "asc",
  },
  {
    key: "utilization-desc",
    label: "Highest utilization",
    sortBy: "utilization",
    sortOrder: "desc",
  },
  {
    key: "utilization-asc",
    label: "Lowest utilization",
    sortBy: "utilization",
    sortOrder: "asc",
  },
];

const SCOPE_OPTIONS: Option<
  BudgetScope | undefined
>[] = [
  {
    value: undefined,
    label: "All Scopes",
  },
  {
    value: "OVERALL",
    label: "Overall",
  },
  {
    value: "CATEGORY",
    label: "Category",
  },
  {
    value: "SUBCATEGORY",
    label: "Subcategory",
  },
];

const PERIOD_OPTIONS: Option<
  BudgetPeriod | undefined
>[] = [
  {
    value: undefined,
    label: "All Periods",
  },
  {
    value: "WEEKLY",
    label: "Weekly",
  },
  {
    value: "MONTHLY",
    label: "Monthly",
  },
  {
    value: "YEARLY",
    label: "Yearly",
  },
  {
    value: "CUSTOM",
    label: "Custom",
  },
];

const STATUS_OPTIONS: Option<
  BudgetStatus | undefined
>[] = [
  {
    value: undefined,
    label: "All Statuses",
  },
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
  {
    value: "EXPIRED",
    label: "Expired",
  },
];

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function getSortKey(
  filters: BudgetQuery,
) {
  return `${filters.sortBy ?? "createdAt"}-${
    filters.sortOrder ?? "desc"
  }`;
}

function getSortLabel(
  filters: BudgetQuery,
) {
  const key = getSortKey(filters);

  return (
    SORT_OPTIONS.find(
      (option) =>
        option.key === key,
    )?.label ?? "Newest first"
  );
}

function getLabel<T>(
  options: Option<T>[],
  value: T | undefined,
  fallback: string,
) {
  return (
    options.find(
      (option) =>
        option.value === value,
    )?.label ?? fallback
  );
}

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export function BudgetFilters({
  filters,
  onFiltersChange,
}: BudgetFiltersProps) {
  const { theme } = useTheme();

  const [
    sheetOpen,
    setSheetOpen,
  ] = useState(false);

  const [
    activeSection,
    setActiveSection,
  ] = useState<
    "sort" |
    "scope" |
    "period" |
    "status" |
    null
  >(null);

  /*
   * Draft filters are kept separate from
   * the actual query.
   *
   * Nothing reaches the API until
   * "Apply Filters" is pressed.
   */

  const [
    draftFilters,
    setDraftFilters,
  ] = useState<BudgetQuery>(filters);

  /*
   * =======================================================
   * ACTIVE FILTER COUNT
   * =======================================================
   */

  const activeFilterCount =
    useMemo(() => {
      let count = 0;

      if (filters.scope) {
        count += 1;
      }

      if (filters.period) {
        count += 1;
      }

      if (filters.status) {
        count += 1;
      }

      if (
        getSortKey(filters) !==
        "createdAt-desc"
      ) {
        count += 1;
      }

      return count;
    }, [filters]);

  /*
   * =======================================================
   * SEARCH
   * =======================================================
   */

  const handleSearch = (
    value: string,
  ) => {
    onFiltersChange({
      ...filters,
      search:
        value.trim().length > 0
          ? value
          : undefined,
      page: 1,
    });
  };

  /*
   * =======================================================
   * OPEN FILTER SHEET
   * =======================================================
   */

  const openSheet = () => {
    setDraftFilters(filters);
    setActiveSection(null);
    setSheetOpen(true);
  };

  /*
   * =======================================================
   * CLOSE FILTER SHEET
   * =======================================================
   */

  const closeSheet = () => {
    setActiveSection(null);
    setSheetOpen(false);
  };

  /*
   * =======================================================
   * APPLY FILTERS
   * =======================================================
   */

  const applyFilters = () => {
    onFiltersChange({
      ...draftFilters,
      page: 1,
    });

    closeSheet();
  };

  /*
   * =======================================================
   * RESET FILTERS
   * =======================================================
   */

  const resetFilters = () => {
    const resetQuery: BudgetQuery = {
      page: 1,
      limit: filters.limit ?? 10,

      period: "MONTHLY",
      status: "ACTIVE",

      sortBy: "createdAt",
      sortOrder: "desc",

      search: undefined,
      scope: undefined,
    };

    setDraftFilters(resetQuery);

    onFiltersChange(resetQuery);

    closeSheet();
  };

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <>
      {/* ===================================================
          SEARCH + FILTER BUTTON
      =================================================== */}

      <View style={styles.container}>
        <View style={styles.topRow}>
          {/* Search */}

          <View
            style={[
              styles.searchBox,
              {
                borderColor:
                  theme.border,
                backgroundColor:
                  theme.surface,
              },
            ]}
          >
            <Search
              size={17}
              color={theme.textSecondary}
              strokeWidth={2}
            />

            <TextInput
              value={
                filters.search ?? ""
              }
              onChangeText={
                handleSearch
              }
              placeholder="Search budgets..."
              placeholderTextColor={
                theme.textSecondary
              }
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              style={[
                styles.searchInput,
                {
                  color: theme.text,
                },
              ]}
            />

            {Boolean(
              filters.search,
            ) && (
              <Pressable
                onPress={() =>
                  handleSearch("")
                }
                hitSlop={8}
                style={[
                  styles.clearSearch,
                  {
                    backgroundColor:
                      theme.surfaceSecondary,
                  },
                ]}
              >
                <X
                  size={14}
                  color={
                    theme.textSecondary
                  }
                />
              </Pressable>
            )}
          </View>

          {/* Filter */}

          <Pressable
            onPress={openSheet}
            style={({
              pressed,
            }) => [
              styles.filterButton,
              {
                borderColor:
                  activeFilterCount > 0
                    ? theme.text
                    : theme.border,
                backgroundColor:
                  activeFilterCount > 0
                    ? theme.primary
                    : theme.surface,
              },
              pressed &&
                styles.pressed,
            ]}
          >
            <SlidersHorizontal
              size={17}
              color={
                activeFilterCount > 0
                  ? theme.primaryText
                  : theme.text
              }
              strokeWidth={2}
            />

            {activeFilterCount >
              0 && (
              <View
                style={[
                  styles.filterBadge,
                  {
                    backgroundColor:
                      theme.surface,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    {
                      color:
                        theme.text,
                    },
                  ]}
                >
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* ===================================================
          FILTER SHEET
      =================================================== */}

      <Modal
        visible={sheetOpen}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={
          closeSheet
        }
      >
        <View style={styles.modal}>
          {/* Backdrop */}

          <Pressable
            style={[
              styles.backdrop,
              {
                backgroundColor:
                  "rgba(0, 0, 0, 0.45)",
              },
            ]}
            onPress={
              closeSheet
            }
          />

          {/* Sheet */}

          <View
            style={[
              styles.sheet,
              {
                backgroundColor:
                  theme.surface,
              },
            ]}
          >
            {/* Handle */}

            <View
              style={[
                styles.sheetHandle,
                {
                  backgroundColor:
                    theme.border,
                },
              ]}
            />

            {/* Header */}

            <View
              style={[
                styles.sheetHeader,
                {
                  borderBottomColor:
                    theme.border,
                },
              ]}
            >
              <View>
                <Text
                  style={[
                    styles.sheetTitle,
                    {
                      color:
                        theme.text,
                    },
                  ]}
                >
                  Filter Budgets
                </Text>

                <Text
                  style={[
                    styles.sheetSubtitle,
                    {
                      color:
                        theme.textSecondary,
                    },
                  ]}
                >
                  Refine your budget list
                </Text>
              </View>

              <Pressable
                onPress={
                  closeSheet
                }
                hitSlop={8}
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
                  color={theme.text}
                />
              </Pressable>
            </View>

            {/* =================================================
                FILTER LIST
            ================================================= */}

            <ScrollView
              showsVerticalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.sheetContent
              }
            >
              {/* SORT */}

              <FilterRow
                label="Sort by"
                value={getSortLabel(
                  draftFilters,
                )}
                expanded={
                  activeSection ===
                  "sort"
                }
                onPress={() =>
                  setActiveSection(
                    activeSection ===
                      "sort"
                      ? null
                      : "sort",
                  )
                }
              />

              {activeSection ===
                "sort" && (
                <View
                  style={[
                    styles.optionsContainer,
                    {
                      borderColor:
                        theme.border,
                      backgroundColor:
                        theme.surfaceSecondary,
                    },
                  ]}
                >
                  {SORT_OPTIONS.map(
                    (
                      option,
                    ) => {
                      const selected =
                        getSortKey(
                          draftFilters,
                        ) ===
                        option.key;

                      return (
                        <OptionRow
                          key={
                            option.key
                          }
                          label={
                            option.label
                          }
                          selected={
                            selected
                          }
                          onPress={() => {
                            setDraftFilters(
                              (
                                previous,
                              ) => ({
                                ...previous,
                                sortBy:
                                  option.sortBy,
                                sortOrder:
                                  option.sortOrder,
                              }),
                            );

                            setActiveSection(
                              null,
                            );
                          }}
                        />
                      );
                    },
                  )}
                </View>
              )}

              {/* SCOPE */}

              <FilterRow
                label="Scope"
                value={getLabel(
                  SCOPE_OPTIONS,
                  draftFilters.scope,
                  "All Scopes",
                )}
                expanded={
                  activeSection ===
                  "scope"
                }
                onPress={() =>
                  setActiveSection(
                    activeSection ===
                      "scope"
                      ? null
                      : "scope",
                  )
                }
              />

              {activeSection ===
                "scope" && (
                <View
                  style={[
                    styles.optionsContainer,
                    {
                      borderColor:
                        theme.border,
                      backgroundColor:
                        theme.surfaceSecondary,
                    },
                  ]}
                >
                  {SCOPE_OPTIONS.map(
                    (
                      option,
                    ) => {
                      const selected =
                        draftFilters.scope ===
                        option.value;

                      return (
                        <OptionRow
                          key={
                            option.label
                          }
                          label={
                            option.label
                          }
                          selected={
                            selected
                          }
                          onPress={() => {
                            setDraftFilters(
                              (
                                previous,
                              ) => ({
                                ...previous,
                                scope:
                                  option.value,
                              }),
                            );

                            setActiveSection(
                              null,
                            );
                          }}
                        />
                      );
                    },
                  )}
                </View>
              )}

              {/* PERIOD */}

              <FilterRow
                label="Period"
                value={getLabel(
                  PERIOD_OPTIONS,
                  draftFilters.period,
                  "All Periods",
                )}
                expanded={
                  activeSection ===
                  "period"
                }
                onPress={() =>
                  setActiveSection(
                    activeSection ===
                      "period"
                      ? null
                      : "period",
                  )
                }
              />

              {activeSection ===
                "period" && (
                <View
                  style={[
                    styles.optionsContainer,
                    {
                      borderColor:
                        theme.border,
                      backgroundColor:
                        theme.surfaceSecondary,
                    },
                  ]}
                >
                  {PERIOD_OPTIONS.map(
                    (
                      option,
                    ) => {
                      const selected =
                        draftFilters.period ===
                        option.value;

                      return (
                        <OptionRow
                          key={
                            option.label
                          }
                          label={
                            option.label
                          }
                          selected={
                            selected
                          }
                          onPress={() => {
                            setDraftFilters(
                              (
                                previous,
                              ) => ({
                                ...previous,
                                period:
                                  option.value,
                              }),
                            );

                            setActiveSection(
                              null,
                            );
                          }}
                        />
                      );
                    },
                  )}
                </View>
              )}

              {/* STATUS */}

              <FilterRow
                label="Status"
                value={getLabel(
                  STATUS_OPTIONS,
                  draftFilters.status,
                  "All Statuses",
                )}
                expanded={
                  activeSection ===
                  "status"
                }
                onPress={() =>
                  setActiveSection(
                    activeSection ===
                      "status"
                      ? null
                      : "status",
                  )
                }
              />

              {activeSection ===
                "status" && (
                <View
                  style={[
                    styles.optionsContainer,
                    {
                      borderColor:
                        theme.border,
                      backgroundColor:
                        theme.surfaceSecondary,
                    },
                  ]}
                >
                  {STATUS_OPTIONS.map(
                    (
                      option,
                    ) => {
                      const selected =
                        draftFilters.status ===
                        option.value;

                      return (
                        <OptionRow
                          key={
                            option.label
                          }
                          label={
                            option.label
                          }
                          selected={
                            selected
                          }
                          onPress={() => {
                            setDraftFilters(
                              (
                                previous,
                              ) => ({
                                ...previous,
                                status:
                                  option.value,
                              }),
                            );

                            setActiveSection(
                              null,
                            );
                          }}
                        />
                      );
                    },
                  )}
                </View>
              )}
            </ScrollView>

            {/* =================================================
                FOOTER
            ================================================= */}

            <View
              style={[
                styles.sheetFooter,
                {
                  borderTopColor:
                    theme.border,
                  backgroundColor:
                    theme.surface,
                },
              ]}
            >
              <Pressable
                onPress={
                  resetFilters
                }
                style={({
                  pressed,
                }) => [
                  styles.resetButton,
                  {
                    borderColor:
                      "#FECACA",
                    backgroundColor:
                      theme.surface,
                  },
                  pressed &&
                    styles.pressed,
                ]}
              >
                <RotateCcw
                  size={15}
                  color="#DC2626"
                />

                <Text
                  style={
                    styles.resetText
                  }
                >
                  Reset
                </Text>
              </Pressable>

              <Pressable
                onPress={
                  applyFilters
                }
                style={({
                  pressed,
                }) => [
                  styles.applyButton,
                  {
                    backgroundColor:
                      theme.primary,
                  },
                  pressed &&
                    styles.pressed,
                ]}
              >
                <Text
                  style={[
                    styles.applyText,
                    {
                      color:
                        theme.primaryText,
                    },
                  ]}
                >
                  Apply Filters
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

/*
 * ===========================================================
 * FILTER ROW
 * ===========================================================
 */

interface FilterRowProps {
  label: string;
  value: string;
  expanded: boolean;
  onPress: () => void;
}

function FilterRow({
  label,
  value,
  expanded,
  onPress,
}: FilterRowProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.filterRow,
        {
          borderColor:
            expanded
              ? theme.border
              : theme.border,
          backgroundColor:
            expanded
              ? theme.surfaceSecondary
              : theme.surface,
        },
        pressed &&
          styles.rowPressed,
      ]}
    >
      <View
        style={
          styles.filterRowText
        }
      >
        <Text
          style={[
            styles.filterLabel,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.filterValue,
            {
              color: theme.text,
            },
          ]}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>

      <ChevronDown
        size={18}
        color={theme.textSecondary}
        style={
          expanded
            ? styles.chevronUp
            : undefined
        }
      />
    </Pressable>
  );
}

/*
 * ===========================================================
 * OPTION ROW
 * ===========================================================
 */

interface OptionRowProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function OptionRow({
  label,
  selected,
  onPress,
}: OptionRowProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionRow,
        {
          backgroundColor:
            selected
              ? theme.surfaceSecondary
              : "transparent",
        },
        pressed &&
          styles.rowPressed,
      ]}
    >
      <Text
        style={[
          styles.optionText,
          {
            color: selected
              ? theme.text
              : theme.textSecondary,
          },
          selected &&
            styles.optionTextSelected,
        ]}
      >
        {label}
      </Text>

      {selected && (
        <View
          style={[
            styles.optionCheck,
            {
              backgroundColor:
                theme.primary,
            },
          ]}
        >
          <View
            style={[
              styles.optionCheckDot,
              {
                backgroundColor:
                  theme.primaryText,
              },
            ]}
          />
        </View>
      )}
    </Pressable>
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
     * MAIN
     */

    container: {
      width: "100%",
    },

    topRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    /*
     * SEARCH
     */

    searchBox: {
      flex: 1,

      height: 44,

      flexDirection: "row",
      alignItems: "center",

      gap: 8,

      paddingHorizontal: 13,

      borderWidth: 1,

      borderRadius: 13,
    },

    searchInput: {
      flex: 1,

      minWidth: 0,

      height: "100%",

      padding: 0,

      fontSize: 12,

      fontWeight: "500",
    },

    clearSearch: {
      width: 25,
      height: 25,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 8,
    },

    /*
     * FILTER BUTTON
     */

    filterButton: {
      width: 44,
      height: 44,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      gap: 3,

      borderWidth: 1,

      borderRadius: 13,
    },

    filterBadge: {
      minWidth: 15,
      height: 15,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 3,

      borderRadius: 999,
    },

    filterBadgeText: {
      fontSize: 8,

      fontWeight: "800",
    },

    /*
     * MODAL
     */

    modal: {
      flex: 1,

      justifyContent: "flex-end",
    },

    backdrop: {
      ...StyleSheet.absoluteFill,
    },

    sheet: {
      width: "100%",

      maxHeight: "82%",

      overflow: "hidden",

      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,

      paddingTop: 8,
    },

    sheetHandle: {
      alignSelf: "center",

      width: 38,
      height: 4,

      marginBottom: 4,

      borderRadius: 999,
    },

    /*
     * HEADER
     */

    sheetHeader: {
      flexDirection: "row",

      alignItems: "center",
      justifyContent:
        "space-between",

      paddingHorizontal: 18,
      paddingVertical: 14,

      borderBottomWidth: 1,
    },

    sheetTitle: {
      fontSize: 17,

      fontWeight: "800",
    },

    sheetSubtitle: {
      marginTop: 2,

      fontSize: 10,

      fontWeight: "500",
    },

    closeButton: {
      width: 36,
      height: 36,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 10,
    },

    /*
     * CONTENT
     */

    sheetContent: {
      paddingHorizontal: 16,

      paddingTop: 10,

      paddingBottom: 18,
    },

    /*
     * FILTER ROW
     */

    filterRow: {
      minHeight: 62,

      flexDirection: "row",

      alignItems: "center",
      justifyContent:
        "space-between",

      paddingHorizontal: 13,

      marginBottom: 8,

      borderWidth: 1,

      borderRadius: 13,
    },

    filterRowText: {
      flex: 1,

      minWidth: 0,

      paddingRight: 10,
    },

    filterLabel: {
      fontSize: 10,

      fontWeight: "600",
    },

    filterValue: {
      marginTop: 3,

      fontSize: 13,

      fontWeight: "700",
    },

    chevronUp: {
      transform: [
        {
          rotate: "180deg",
        },
      ],
    },

    /*
     * OPTIONS
     */

    optionsContainer: {
      marginTop: -2,

      marginBottom: 8,

      padding: 7,

      borderWidth: 1,

      borderRadius: 12,
    },

    optionRow: {
      minHeight: 42,

      flexDirection: "row",

      alignItems: "center",
      justifyContent:
        "space-between",

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

    optionCheck: {
      width: 16,
      height: 16,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 999,
    },

    optionCheckDot: {
      width: 5,
      height: 5,

      borderRadius: 999,
    },

    /*
     * FOOTER
     */

    sheetFooter: {
      flexDirection: "row",

      alignItems: "center",

      gap: 9,

      paddingHorizontal: 16,

      paddingTop: 11,

      paddingBottom: 18,

      borderTopWidth: 1,
    },

    resetButton: {
      height: 46,

      paddingHorizontal: 18,

      flexDirection: "row",

      alignItems: "center",
      justifyContent: "center",

      gap: 6,

      borderWidth: 1,

      borderRadius: 12,
    },

    resetText: {
      fontSize: 11,

      fontWeight: "700",

      color: "#DC2626",
    },

    applyButton: {
      flex: 1,

      height: 46,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 12,
    },

    applyText: {
      fontSize: 11,

      fontWeight: "700",
    },

    /*
     * PRESS STATES
     */

    pressed: {
      opacity: 0.65,
    },

    rowPressed: {
      opacity: 0.7,
    },
  });