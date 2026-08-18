
import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  DashboardMonthlyComparison,
} from "../../../types/dashboard.types";

import { useTheme } from "../../../providers/ThemeProvider";

interface MonthlyComparisonProps {
  data: DashboardMonthlyComparison;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function MonthlyComparison({
  data,
}: MonthlyComparisonProps) {
  const {
    theme,
    isDark,
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);

  const isIncrease =
    data.trend === "INCREASE";

  const isDecrease =
    data.trend === "DECREASE";

  const percentage = `${
    data.percentage >= 0 ? "+" : ""
  }${data.percentage.toFixed(1)}%`;

  const ArrowIcon = isIncrease
    ? ArrowUp
    : isDecrease
      ? ArrowDown
      : Minus;

  const TrendIcon = isIncrease
    ? TrendingUp
    : isDecrease
      ? TrendingDown
      : Minus;

  /*
   * =========================================================
   * TREND COLORS
   *
   * These remain semantic in both themes.
   * =========================================================
   */

  const trendColor = isIncrease
    ? "#EF4444"
    : isDecrease
      ? "#059669"
      : theme.textSecondary;

  /*
   * =========================================================
   * TRIGGER COLORS
   * =========================================================
   */

  const triggerBackground =
    isIncrease
      ? isDark
        ? "#3A171B"
        : "#FFF1F2"
      : isDecrease
        ? isDark
          ? "#123127"
          : "#ECFDF5"
        : theme.surface;

  const triggerBorder =
    isIncrease
      ? isDark
        ? "#7F1D1D"
        : "#FDA4AF"
      : isDecrease
        ? isDark
          ? "#166534"
          : "#A7F3D0"
        : theme.border;

  /*
   * =========================================================
   * BADGE COLORS
   * =========================================================
   */

  const changeBadgeBackground =
    isIncrease
      ? isDark
        ? "#4A1B20"
        : "#FEE2E2"
      : isDecrease
        ? isDark
          ? "#123C2D"
          : "#D1FAE5"
        : theme.surfaceSecondary;

  /*
   * =========================================================
   * SUB-CARD COLORS
   * =========================================================
   */

  const amountBoxBackground =
    isDark
      ? theme.surfaceSecondary
      : "#FAFAFA";

  const amountBoxBorder =
    isDark
      ? theme.border
      : "#EEEEEE";

  return (
    <View style={styles.wrapper}>
      {/* =====================================================
          TRIGGER
      ===================================================== */}

      <Pressable
        onPress={() =>
          setIsOpen(
            (previous) => !previous,
          )
        }
        style={({ pressed }) => [
          styles.trigger,

          {
            backgroundColor:
              triggerBackground,

            borderColor:
              triggerBorder,
          },

          pressed &&
            styles.triggerPressed,
        ]}
      >
        <TrendIcon
          size={14}
          color={trendColor}
          strokeWidth={2.2}
        />

        <View
          style={
            styles.triggerTextWrapper
          }
        >
          <Text
            style={[
              styles.percentage,
              {
                color: trendColor,
              },
            ]}
          >
            {percentage}
          </Text>

          <Text
            style={[
              styles.vsText,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            vs last month
          </Text>
        </View>

        {isOpen ? (
          <ChevronUp
            size={15}
            color={trendColor}
            strokeWidth={2}
          />
        ) : (
          <ChevronDown
            size={15}
            color={trendColor}
            strokeWidth={2}
          />
        )}
      </Pressable>

      {/* =====================================================
          ABSOLUTE POPOVER
      ===================================================== */}

      {isOpen && (
        <View
          style={[
            styles.popover,
            {
              backgroundColor:
                theme.surface,

              borderColor:
                theme.border,
            },
          ]}
        >
          {/* =================================================
              POPOVER HEADER
          ================================================= */}

          <View
            style={[
              styles.popoverHeader,
              {
                borderBottomColor:
                  theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.popoverTitle,
                {
                  color: theme.text,
                },
              ]}
            >
              Monthly Comparison
            </Text>

            <View
              style={[
                styles.changeBadge,
                {
                  backgroundColor:
                    changeBadgeBackground,
                },
              ]}
            >
              <ArrowIcon
                size={12}
                color={trendColor}
                strokeWidth={2.3}
              />

              <Text
                style={[
                  styles.changeBadgeText,
                  {
                    color: trendColor,
                  },
                ]}
              >
                {percentage}
              </Text>
            </View>
          </View>

          {/* =================================================
              CURRENT / PREVIOUS
          ================================================= */}

          <View
            style={styles.amountRow}
          >
            {/* Current */}

            <View
              style={[
                styles.amountBox,
                {
                  backgroundColor:
                    amountBoxBackground,

                  borderColor:
                    amountBoxBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.amountLabel,
                  {
                    color:
                      theme.textSecondary,
                  },
                ]}
              >
                CURRENT
              </Text>

              <Text
                style={[
                  styles.amount,
                  {
                    color: theme.text,
                  },
                ]}
              >
                {formatCurrency(
                  data.currentExpense,
                )}
              </Text>
            </View>

            {/* Previous */}

            <View
              style={[
                styles.amountBox,
                {
                  backgroundColor:
                    amountBoxBackground,

                  borderColor:
                    amountBoxBorder,
                },
              ]}
            >
              <Text
                style={[
                  styles.amountLabel,
                  {
                    color:
                      theme.textSecondary,
                  },
                ]}
              >
                PREVIOUS
              </Text>

              <Text
                style={[
                  styles.amount,
                  {
                    color: theme.text,
                  },
                ]}
              >
                {formatCurrency(
                  data.previousExpense,
                )}
              </Text>
            </View>
          </View>

          {/* =================================================
              DIFFERENCE
          ================================================= */}

          <View
            style={[
              styles.differenceBox,
              {
                backgroundColor:
                  amountBoxBackground,

                borderColor:
                  amountBoxBorder,
              },
            ]}
          >
            <Text
              style={[
                styles.differenceLabel,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              Difference
            </Text>

            <Text
              style={[
                styles.differenceValue,
                {
                  color: trendColor,
                },
              ]}
            >
              {data.difference >= 0
                ? "+"
                : ""}
              {formatCurrency(
                data.difference,
              )}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({
    /* =====================================================
       WRAPPER
    ===================================================== */

    wrapper: {
      position: "relative",

      flex: 1,
      minWidth: 0,

      zIndex: 100,
    },

    /* =====================================================
       TRIGGER
    ===================================================== */

    trigger: {
      height: 38,
      width: "100%",

      flexDirection: "row",
      alignItems: "center",

      paddingHorizontal: 10,

      gap: 5,

      borderRadius: 20,

      borderWidth: 1,
    },

    triggerPressed: {
      opacity: 0.75,
    },

    /* =====================================================
       TRIGGER TEXT
    ===================================================== */

    triggerTextWrapper: {
      flex: 1,
      minWidth: 0,

      flexDirection: "row",
      alignItems: "center",

      gap: 3,
    },

    percentage: {
      fontSize: 12,
      fontWeight: "800",
    },

    vsText: {
      flexShrink: 1,

      fontSize: 10,
      fontWeight: "500",
    },

    /* =====================================================
       POPOVER
    ===================================================== */

    popover: {
      position: "absolute",

      top: 46,
      right: 0,

      width: 285,

      padding: 14,

      borderRadius: 18,

      borderWidth: 1,

      shadowColor: "#000000",

      shadowOffset: {
        width: 0,
        height: 8,
      },

      shadowOpacity: 0.14,
      shadowRadius: 18,

      elevation: 15,

      zIndex: 1000,
    },

    /* =====================================================
       POPOVER HEADER
    ===================================================== */

    popoverHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

      paddingBottom: 11,

      borderBottomWidth: 1,
    },

    popoverTitle: {
      flexShrink: 1,

      fontSize: 13,
      fontWeight: "800",
    },

    /* =====================================================
       CHANGE BADGE
    ===================================================== */

    changeBadge: {
      flexDirection: "row",
      alignItems: "center",

      gap: 3,

      marginLeft: 8,

      paddingHorizontal: 7,
      paddingVertical: 4,

      borderRadius: 8,
    },

    changeBadgeText: {
      fontSize: 10,
      fontWeight: "800",
    },

    /* =====================================================
       CURRENT / PREVIOUS
    ===================================================== */

    amountRow: {
      flexDirection: "row",

      gap: 9,

      marginTop: 12,
    },

    amountBox: {
      flex: 1,
      minWidth: 0,

      padding: 11,

      borderWidth: 1,

      borderRadius: 14,
    },

    amountLabel: {
      fontSize: 10,
      fontWeight: "600",

      letterSpacing: 0.4,
    },

    amount: {
      marginTop: 3,

      fontSize: 13,
      fontWeight: "800",
    },

    /* =====================================================
       DIFFERENCE
    ===================================================== */

    differenceBox: {
      marginTop: 9,

      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",

      paddingHorizontal: 12,
      paddingVertical: 11,

      borderWidth: 1,

      borderRadius: 14,
    },

    differenceLabel: {
      fontSize: 11,
      fontWeight: "600",
    },

    differenceValue: {
      fontSize: 13,
      fontWeight: "900",
    },
  });