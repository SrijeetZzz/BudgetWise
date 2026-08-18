

import { Loader2, Wallet } from "lucide-react-native";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";



import type { Budget } from "../../../types/budget.types";
import { BudgetCard } from "./BudgetCard";
import { useTheme } from "../../../providers/ThemeProvider";

interface BudgetListProps {
  budgets: Budget[];
  isLoading?: boolean;
  isError?: boolean;

  onBudgetPress?: (budget: Budget) => void;

  onBudgetActions?: (budget: Budget) => void;
}

export function BudgetList({
  budgets,
  isLoading,
  isError,
  onBudgetPress,
  onBudgetActions,
}: BudgetListProps) {
  const { theme } = useTheme();

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (isLoading) {
    return (
      <View
        style={[
          styles.loading,
          {
            borderColor:
              theme.border,
            backgroundColor:
              theme.surface,
          },
        ]}
      >
        <Loader2
          size={18}
          color={theme.textSecondary}
          strokeWidth={2}
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
          Loading budgets...
        </Text>
      </View>
    );
  }

  /*
   * =========================================================
   * ERROR
   * =========================================================
   */

  if (isError) {
    return (
      <View
        style={[
          styles.error,
          {
            borderColor:
              "#FECACA",
            backgroundColor:
              "#FEF2F2",
          },
        ]}
      >
        <View
          style={[
            styles.errorIcon,
            {
              backgroundColor:
                "#FEE2E2",
            },
          ]}
        >
          <Wallet
            size={20}
            color={theme.destructive}
          />
        </View>

        <Text
          style={[
            styles.errorTitle,
            {
              color: theme.destructive,
            },
          ]}
        >
          Unable to load budgets
        </Text>

        <Text
          style={[
            styles.errorText,
            {
              color:
                "#B91C1C",
            },
          ]}
        >
          Please try again later.
        </Text>
      </View>
    );
  }

  /*
   * =========================================================
   * EMPTY
   * =========================================================
   */

  if (!budgets.length) {
    return (
      <View
        style={[
          styles.empty,
          {
            borderColor:
              theme.border,
            backgroundColor:
              theme.surface,
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
          <Wallet
            size={23}
            color={theme.textSecondary}
            strokeWidth={1.8}
          />
        </View>

        <Text
          style={[
            styles.emptyTitle,
            {
              color:
                theme.text,
            },
          ]}
        >
          No budgets found
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
          Create your first budget to
          start tracking your spending.
        </Text>
      </View>
    );
  }

  /*
   * =========================================================
   * LIST
   * =========================================================
   */

  return (
    <View
      style={[
        styles.list,
        {
          borderColor:
            theme.border,
          backgroundColor:
            theme.surface,
        },
      ]}
    >
      {budgets.map(
        (budget, index) => {
          const isLast =
            index ===
            budgets.length - 1;

          return (
            <View
              key={budget._id}
              style={[
                styles.cardWrapper,
                !isLast && {
                  borderBottomWidth: 1,
                  borderBottomColor:
                    theme.border,
                },
              ]}
            >
              <BudgetCard
                budget={budget}
              />
            </View>
          );
        },
      )}
    </View>
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
     * =========================================================
     * LIST
     * =========================================================
     */

    list: {
      width: "100%",

      overflow: "hidden",

      borderWidth: 1,

      borderRadius: 16,
    },

    cardWrapper: {
      width: "100%",
    },

    /*
     * =========================================================
     * LOADING
     * =========================================================
     */

    loading: {
      minHeight: 180,

      alignItems: "center",
      justifyContent: "center",

      gap: 8,

      borderWidth: 1,

      borderRadius: 16,
    },

    loadingText: {
      fontSize: 12,
      fontWeight: "500",
    },

    /*
     * =========================================================
     * ERROR
     * =========================================================
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

      textAlign: "center",
    },

    /*
     * =========================================================
     * EMPTY
     * =========================================================
     */

    empty: {
      minHeight: 220,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 24,
      paddingVertical: 30,

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
      maxWidth: 280,

      marginTop: 4,

      fontSize: 11,
      fontWeight: "500",

      lineHeight: 16,

      textAlign: "center",
    },
  });