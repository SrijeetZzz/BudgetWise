
import {
  ChevronRight,
  PieChart,
} from "lucide-react-native";

import { useMemo } from "react";

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Svg, {
  Circle,
  G,
} from "react-native-svg";

import type {
  DashboardCategorySpending,
} from "../../../types/dashboard.types";

import { useTheme } from "../../../providers/ThemeProvider";

interface DashboardCategorySpendingProps {
  categories: DashboardCategorySpending[];

  onViewMore?: () => void;
}

const DEFAULT_COLORS = [
  "#3B82F6",
  "#F97316",
  "#10B981",
  "#EC4899",
  "#8B5CF6",
  "#EAB308",
  "#64748B",
  "#06B6D4",
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function DashboardCategorySpending({
  categories,
  onViewMore,
}: DashboardCategorySpendingProps) {
  const { theme } = useTheme();

  /*
   * =========================================================
   * CHART CONFIG
   * =========================================================
   */

  const chartSize = 155;
  const strokeWidth = 25;

  const center = chartSize / 2;

  const radius =
    (chartSize - strokeWidth) / 2;

  const circumference =
    2 * Math.PI * radius;

  /*
   * =========================================================
   * TOTAL EXPENSE
   * =========================================================
   */

  const totalExpense = useMemo(
    () =>
      categories.reduce(
        (total, category) =>
          total + category.amount,
        0,
      ),
    [categories],
  );

  /*
   * =========================================================
   * CHART DATA
   * =========================================================
   */

  const chartData = useMemo(
    () =>
      categories.map(
        (category, index) => ({
          ...category,

          color:
            category.color ||
            DEFAULT_COLORS[
              index %
                DEFAULT_COLORS.length
            ],
        }),
      ),
    [categories],
  );

  /*
   * =========================================================
   * DONUT SEGMENTS
   * =========================================================
   */

  const segments = useMemo(() => {
    let accumulatedPercentage = 0;

    return chartData.map((category) => {
      const percentage = Math.min(
        Math.max(category.percentage, 0),
        100,
      );

      const startPercentage =
        accumulatedPercentage;

      const segmentLength =
        (percentage / 100) *
        circumference;

      const rotation =
        -90 +
        (startPercentage / 100) * 360;

      accumulatedPercentage +=
        percentage;

      return {
        ...category,
        percentage,
        startPercentage,
        segmentLength,
        rotation,
      };
    });
  }, [
    chartData,
    circumference,
  ]);

  /*
   * =========================================================
   * EMPTY STATE
   * =========================================================
   */

  if (!categories.length) {
    return (
      <View
        style={[
          styles.card,
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
            styles.header,
            {
              borderBottomColor:
                theme.border,
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.headerIcon,
                {
                  backgroundColor:
                    theme.muted,
                },
              ]}
            >
              <PieChart
                size={18}
                color={theme.text}
                strokeWidth={2}
              />
            </View>

            <View
              style={styles.headerContent}
            >
              <Text
                style={[
                  styles.title,
                  {
                    color: theme.text,
                  },
                ]}
              >
                Spending by Category
              </Text>

              <Text
                style={[
                  styles.description,
                  {
                    color:
                      theme.textSecondary,
                  },
                ]}
              >
                Expense distribution across
                categories
              </Text>
            </View>
          </View>

          {onViewMore && (
            <Pressable
              onPress={onViewMore}
              style={({ pressed }) => [
                styles.viewMoreButtonEmpty,
                {
                  backgroundColor:
                    theme.muted,

                  borderColor:
                    theme.border,
                },

                pressed &&
                  styles.viewMorePressed,
              ]}
            >
              <Text
                style={[
                  styles.viewMoreText,
                  {
                    color: theme.text,
                  },
                ]}
              >
                View More
              </Text>

              <ChevronRight
                size={15}
                color={theme.text}
                strokeWidth={2.2}
              />
            </Pressable>
          )}
        </View>

        <View style={styles.emptyState}>
          <PieChart
            size={30}
            color={theme.textSecondary}
            strokeWidth={1.7}
          />

          <Text
            style={[
              styles.emptyText,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            No expense data recorded for
            this period.
          </Text>
        </View>
      </View>
    );
  }

  /*
   * =========================================================
   * MAIN
   * =========================================================
   */

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor:
            theme.surface,

          borderColor:
            theme.border,
        },
      ]}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <View
        style={[
          styles.header,
          {
            borderBottomColor:
              theme.border,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor:
                  theme.muted,
              },
            ]}
          >
            <PieChart
              size={18}
              color={theme.text}
              strokeWidth={2}
            />
          </View>

          <View
            style={styles.headerContent}
          >
            <Text
              style={[
                styles.title,
                {
                  color: theme.text,
                },
              ]}
            >
              Spending by Category
            </Text>

            <Text
              style={[
                styles.description,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              Expense distribution across
              categories
            </Text>
          </View>
        </View>

        {/* Total */}

        <View style={styles.totalSection}>
          <Text
            style={[
              styles.totalLabel,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            TOTAL
          </Text>

          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            style={[
              styles.totalAmount,
              {
                color: theme.text,
              },
            ]}
          >
            {formatCurrency(totalExpense)}
          </Text>
        </View>
      </View>

      {/* =====================================================
          CHART + LEGEND
      ===================================================== */}

      <View style={styles.contentRow}>
        {/* Donut */}

        <View style={styles.chartWrapper}>
          <Svg
            width={chartSize}
            height={chartSize}
            viewBox={`0 0 ${chartSize} ${chartSize}`}
          >
            {/* Background */}

            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={theme.textSecondary}
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* Segments */}

            <G>
              {segments.map(
                (segment) => (
                  <Circle
                    key={
                      segment.categoryId
                    }
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={
                      segment.color
                    }
                    strokeWidth={
                      strokeWidth
                    }
                    fill="none"
                    strokeLinecap="butt"
                    strokeDasharray={`${segment.segmentLength} ${
                      circumference -
                      segment.segmentLength
                    }`}
                    strokeDashoffset={0}
                    rotation={
                      segment.rotation
                    }
                    origin={`${center}, ${center}`}
                  />
                ),
              )}
            </G>
          </Svg>

          {/* Center */}

          <View
            style={styles.donutCenter}
          >
            <Text
              style={[
                styles.centerLabel,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              CATEGORIES
            </Text>

            <Text
              style={[
                styles.centerValue,
                {
                  color: theme.text,
                },
              ]}
            >
              {categories.length}
            </Text>
          </View>
        </View>

        {/* =================================================
            LEGEND
        ================================================= */}

        <View style={styles.legendWrapper}>
          <ScrollView
            showsVerticalScrollIndicator
            nestedScrollEnabled
            style={styles.legendScroll}
            contentContainerStyle={
              styles.legendContent
            }
          >
            {chartData.map(
              (category) => (
                <View
                  key={
                    category.categoryId
                  }
                  style={[
                    styles.legendItem,
                    {
                      borderBottomColor:
                        theme.border,
                    },
                  ]}
                >
                  {/* Left */}

                  <View
                    style={
                      styles.legendLeft
                    }
                  >
                    <View
                      style={[
                        styles.legendDot,
                        {
                          backgroundColor:
                            category.color,
                        },
                      ]}
                    />

                    <View
                      style={
                        styles.legendTextContainer
                      }
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.categoryName,
                          {
                            color:
                              theme.text,
                          },
                        ]}
                      >
                        {category.name}
                      </Text>

                      <Text
                        style={[
                          styles.categoryPercentage,
                          {
                            color:
                              theme.textSecondary,
                          },
                        ]}
                      >
                        {category.percentage.toFixed(
                          1,
                        )}
                        %
                      </Text>
                    </View>
                  </View>

                  {/* Amount */}

                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.65}
                    style={[
                      styles.categoryAmount,
                      {
                        color:
                          theme.text,
                      },
                    ]}
                  >
                    {formatCurrency(
                      category.amount,
                    )}
                  </Text>
                </View>
              ),
            )}
          </ScrollView>
        </View>
      </View>

      {/* =====================================================
          VIEW MORE
      ===================================================== */}

      {onViewMore && (
        <Pressable
          onPress={onViewMore}
          style={({ pressed }) => [
            styles.viewMoreButton,
            {
              borderTopColor:
                theme.border,
            },
            pressed &&
              styles.viewMorePressed,
          ]}
        >
          <Text
            style={[
              styles.viewMoreText,
              {
                color: theme.text,
              },
            ]}
          >
            View More
          </Text>

          <ChevronRight
            size={16}
            color={theme.text}
            strokeWidth={2.2}
          />
        </Pressable>
      )}
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  card: {
    width: "100%",

    padding: 16,

    borderRadius: 18,

    borderWidth: 1,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.05,

    shadowRadius: 6,

    elevation: 2,
  },

  header: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingBottom: 12,

    borderBottomWidth: 1,
  },

  headerLeft: {
    flex: 1,

    flexDirection: "row",

    alignItems: "center",

    minWidth: 0,

    marginRight: 10,
  },

  headerIcon: {
    width: 36,

    height: 36,

    borderRadius: 11,

    alignItems: "center",

    justifyContent: "center",
  },

  headerContent: {
    flex: 1,

    minWidth: 0,

    marginLeft: 9,
  },

  title: {
    fontSize: 15,

    fontWeight: "800",
  },

  description: {
    marginTop: 2,

    fontSize: 10,

    fontWeight: "500",
  },

  totalSection: {
    alignItems: "flex-end",

    maxWidth: 100,
  },

  totalLabel: {
    fontSize: 8,

    fontWeight: "700",

    letterSpacing: 0.7,
  },

  totalAmount: {
    marginTop: 2,

    fontSize: 14,

    fontWeight: "800",
  },

  contentRow: {
    flexDirection: "row",

    alignItems: "center",

    paddingTop: 14,

    paddingBottom: 12,
  },

  chartWrapper: {
    width: 155,

    height: 155,

    alignItems: "center",

    justifyContent: "center",
  },

  donutCenter: {
    position: "absolute",

    alignItems: "center",

    justifyContent: "center",
  },

  centerLabel: {
    fontSize: 8,

    fontWeight: "700",

    letterSpacing: 0.7,
  },

  centerValue: {
    marginTop: 2,

    fontSize: 21,

    fontWeight: "800",
  },

  legendWrapper: {
    flex: 1,

    minWidth: 0,

    height: 155,

    marginLeft: 10,
  },

  legendScroll: {
    flex: 1,
  },

  legendContent: {
    paddingRight: 2,
  },

  legendItem: {
    minHeight: 42,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingVertical: 6,

    borderBottomWidth: 1,
  },

  legendLeft: {
    flex: 1,

    minWidth: 0,

    flexDirection: "row",

    alignItems: "center",

    marginRight: 6,
  },

  legendDot: {
    width: 9,

    height: 9,

    borderRadius: 5,

    marginRight: 7,
  },

  legendTextContainer: {
    flex: 1,

    minWidth: 0,
  },

  categoryName: {
    fontSize: 10,

    fontWeight: "700",
  },

  categoryPercentage: {
    marginTop: 1,

    fontSize: 8,

    fontWeight: "500",
  },

  categoryAmount: {
    maxWidth: 70,

    fontSize: 9,

    fontWeight: "800",

    textAlign: "right",
  },

  viewMoreButton: {
    height: 38,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 4,

    borderTopWidth: 1,
  },

  viewMoreButtonEmpty: {
    flexDirection: "row",

    alignItems: "center",

    gap: 3,

    paddingHorizontal: 8,

    paddingVertical: 5,

    borderRadius: 999,

    borderWidth: 1,
  },

  viewMorePressed: {
    opacity: 0.55,
  },

  viewMoreText: {
    fontSize: 11,

    fontWeight: "800",
  },

  emptyState: {
    minHeight: 220,

    alignItems: "center",

    justifyContent: "center",
  },

  emptyText: {
    marginTop: 8,

    fontSize: 11,

    fontWeight: "600",

    textAlign: "center",
  },
});