
import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react-native";

import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type { TransactionQuery } from "../../../types/transaction.types";
import { useTheme } from "../../../providers/ThemeProvider";



interface TransactionFilterToolbarProps {
  filters: TransactionQuery;

  onFiltersChange: (
    filters: TransactionQuery,
  ) => void;

  onOpenFilters: () => void;
}

export function TransactionFilterToolbar({
  filters,
  onFiltersChange,
  onOpenFilters,
}: TransactionFilterToolbarProps) {
  /*
   * =========================================================
   * THEME
   * =========================================================
   */

  const { theme } = useTheme();

  const activeFilterCount =
    getActiveFilterCount(filters);

  /*
   * =========================================================
   * SEARCH
   * =========================================================
   */

  const handleSearchChange = (
    value: string,
  ) => {
    onFiltersChange({
      ...filters,
      search:
        value.trim() || undefined,
      page: 1,
    });
  };

  /*
   * =========================================================
   * RESET
   * =========================================================
   */

  const handleReset = () => {
    onFiltersChange({
      page: 1,
      limit: filters.limit ?? 10,
      sortBy: "transactionDate",
      sortOrder: "desc",
    });
  };

  return (
    <View style={styles.container}>
      {/* =====================================================
          SEARCH + FILTER BUTTON
      ===================================================== */}

      <View style={styles.searchRow}>
        {/* =================================================
            SEARCH
        ================================================= */}

        <View
          style={[
            styles.searchContainer,
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
              handleSearchChange
            }
            placeholder="Search transactions..."
            placeholderTextColor={
              theme.textSecondary
            }
            style={[
              styles.searchInput,
              {
                color: theme.text,
              },
            ]}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {!!filters.search && (
            <Pressable
              hitSlop={8}
              onPress={() =>
                onFiltersChange({
                  ...filters,
                  search: undefined,
                  page: 1,
                })
              }
              style={
                styles.clearSearchButton
              }
            >
              <X
                size={15}
                color={
                  theme.textSecondary
                }
                strokeWidth={2}
              />
            </Pressable>
          )}
        </View>

        {/* =================================================
            FILTER BUTTON
        ================================================= */}

        <Pressable
          onPress={onOpenFilters}
          hitSlop={4}
          style={({ pressed }) => [
            styles.filterButton,
            {
              borderColor:
                theme.border,
              backgroundColor:
                theme.surface,
            },
            pressed && {
              backgroundColor:
                theme.surfaceSecondary,
              transform: [
                {
                  scale: 0.96,
                },
              ],
            },
          ]}
        >
          <SlidersHorizontal
            size={17}
            color={theme.text}
            strokeWidth={2}
          />

          {activeFilterCount > 0 && (
            <View
              style={[
                styles.filterBadge,
                {
                  backgroundColor:
                    theme.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterBadgeText,
                  {
                    color:
                      theme.primaryText,
                  },
                ]}
              >
                {activeFilterCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* =====================================================
          ACTIVE FILTER SUMMARY
      ===================================================== */}

      {activeFilterCount > 0 && (
        <View
          style={styles.activeRow}
        >
          <View
            style={[
              styles.activeIndicator,
              {
                backgroundColor:
                  theme.primary,
              },
            ]}
          />

          <Text
            style={[
              styles.activeText,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            {activeFilterCount}{" "}
            {activeFilterCount === 1
              ? "filter"
              : "filters"}{" "}
            applied
          </Text>

          <Pressable
            onPress={handleReset}
            hitSlop={8}
            style={styles.resetButton}
          >
            <Text
              style={[
                styles.resetText,
                {
                  color:
                    theme.text,
                },
              ]}
            >
              Reset
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

/*
 * =========================================================
 * ACTIVE FILTER COUNT
 * =========================================================
 */

function getActiveFilterCount(
  filters: TransactionQuery,
): number {
  let count = 0;

  if (filters.type) {
    count += 1;
  }

  if (filters.transactionSource) {
    count += 1;
  }

  if (filters.categoryId) {
    count += 1;
  }

  if (filters.subcategoryId) {
    count += 1;
  }

  if (filters.paymentMethod) {
    count += 1;
  }

  if (filters.startDate) {
    count += 1;
  }

  if (filters.endDate) {
    count += 1;
  }

  if (
    filters.minAmount !==
    undefined
  ) {
    count += 1;
  }

  if (
    filters.maxAmount !==
    undefined
  ) {
    count += 1;
  }

  return count;
}

/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles =
  StyleSheet.create({
    container: {
      width: "100%",
    },

    /*
     * =======================================================
     * SEARCH
     * =======================================================
     */

    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    searchContainer: {
      flex: 1,

      height: 44,

      flexDirection: "row",
      alignItems: "center",

      paddingHorizontal: 12,

      borderWidth: 1,
      borderRadius: 12,
    },

    searchInput: {
      flex: 1,

      height: "100%",

      marginLeft: 8,

      paddingVertical: 0,

      fontSize: 12,
      fontWeight: "500",
    },

    clearSearchButton: {
      width: 28,
      height: 32,

      alignItems: "center",
      justifyContent: "center",
    },

    /*
     * =======================================================
     * FILTER BUTTON
     * =======================================================
     */

    filterButton: {
      width: 44,
      height: 44,

      alignItems: "center",
      justifyContent: "center",

      borderWidth: 1,
      borderRadius: 12,
    },

    filterBadge: {
      position: "absolute",

      top: -4,
      right: -4,

      minWidth: 17,
      height: 17,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 4,

      borderRadius: 9,
    },

    filterBadgeText: {
      fontSize: 8,
      fontWeight: "800",
    },

    /*
     * =======================================================
     * ACTIVE FILTERS
     * =======================================================
     */

    activeRow: {
      flexDirection: "row",
      alignItems: "center",

      marginTop: 8,

      paddingHorizontal: 2,
    },

    activeIndicator: {
      width: 5,
      height: 5,

      marginRight: 6,

      borderRadius: 3,
    },

    activeText: {
      flex: 1,

      fontSize: 10,
      fontWeight: "500",
    },

    resetButton: {
      minHeight: 28,

      justifyContent: "center",

      paddingHorizontal: 5,
    },

    resetText: {
      fontSize: 10,
      fontWeight: "700",
    },
  });