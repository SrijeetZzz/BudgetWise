

import { CreditCard } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Svg, {
  Circle,
  G,
} from "react-native-svg";



import type {
  DashboardPaymentMethodBreakdown,
} from "../../../types/dashboard.types";
import { useTheme } from "../../../providers/ThemeProvider";

interface PaymentMethodBreakdownChartProps {
  data: DashboardPaymentMethodBreakdown[];
}

/* =========================================================
   PAYMENT METHOD COLORS
   These remain fixed because they represent
   semantic categories in the chart.
========================================================= */

const METHOD_COLORS: Record<string, string> = {
  UPI: "#3B82F6",
  CARD: "#8B5CF6",
  CASH: "#10B981",
  BANK_TRANSFER: "#F59E0B",
  WALLET: "#EC4899",
  CHEQUE: "#64748B",
  OTHER: "#06B6D4",
};

const DEFAULT_COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EC4899",
  "#06B6D4",
];

/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/* =========================================================
   PAYMENT METHOD FORMATTER
========================================================= */

function formatPaymentMethod(
  value: string | null,
) {
  if (!value) {
    return "Unknown";
  }

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

/* =========================================================
   COMPONENT
========================================================= */

export default function PaymentMethodBreakdownChart({
  data,
}: PaymentMethodBreakdownChartProps) {
  const [selectedMethod, setSelectedMethod] =
    useState<string | null>(null);

  /*
   * =======================================================
   * THEME
   * =======================================================
   */

  const { theme } = useTheme();

  /*
   * =======================================================
   * DYNAMIC STYLES
   * =======================================================
   *
   * Neutral UI colors come from the theme.
   *
   * Payment-method chart colors remain fixed because
   * they represent semantic categories.
   * =======================================================
   */

  const styles = useMemo(
    () =>
      StyleSheet.create({
        /* =================================================
           CARD
        ================================================= */

        card: {
          width: "100%",

          padding: 18,

          borderRadius: 18,

          backgroundColor: theme.surface,

          borderWidth: 1,
          borderColor: theme.border,

          shadowColor: "#000000",

          shadowOffset: {
            width: 0,
            height: 2,
          },

          shadowOpacity: 0.05,

          shadowRadius: 6,

          elevation: 2,
        },

        /* =================================================
           HEADER
        ================================================= */

        header: {
          flexDirection: "row",

          alignItems: "center",

          justifyContent: "space-between",

          paddingBottom: 14,

          borderBottomWidth: 1,

          borderBottomColor: theme.border,
        },

        headerLeft: {
          flex: 1,

          flexDirection: "row",

          alignItems: "center",

          marginRight: 12,
        },

        headerIcon: {
          width: 40,
          height: 40,

          borderRadius: 12,

          alignItems: "center",

          justifyContent: "center",

          backgroundColor:
            theme.surfaceSecondary,
        },

        headerContent: {
          flex: 1,

          marginLeft: 10,
        },

        title: {
          fontSize: 16,

          fontWeight: "800",

          lineHeight: 21,

          letterSpacing: -0.3,

          color: theme.text,
        },

        description: {
          marginTop: 2,

          fontSize: 11,

          fontWeight: "500",

          lineHeight: 15,

          color: theme.textSecondary,
        },

        /* =================================================
           TOTAL
        ================================================= */

        totalSection: {
          minWidth: 75,

          alignItems: "flex-end",

          justifyContent: "center",
        },

        totalLabel: {
          fontSize: 9,

          fontWeight: "700",

          letterSpacing: 0.7,

          color: theme.textSecondary,
        },

        totalAmount: {
          marginTop: 2,

          fontSize: 15,

          fontWeight: "800",

          color: theme.text,
        },

        /* =================================================
           CHART
        ================================================= */

        chartSection: {
          width: "100%",

          alignItems: "center",

          justifyContent: "center",

          paddingTop: 16,
        },

        chartContainer: {
          position: "relative",

          alignItems: "center",

          justifyContent: "center",
        },

        /* =================================================
           TOUCH LAYER
        ================================================= */

        touchLayer: {
          position: "absolute",

          left: 0,
          top: 0,

          width: "100%",
          height: "100%",

          borderRadius: 999,

          backgroundColor: "transparent",
        },

        /* =================================================
           DONUT CENTER
        ================================================= */

        donutCenter: {
          position: "absolute",

          alignItems: "center",

          justifyContent: "center",
        },

        centerLabel: {
          fontSize: 10,

          fontWeight: "700",

          letterSpacing: 0.8,

          color: theme.textSecondary,
        },

        centerValue: {
          marginTop: 1,

          fontSize: 22,

          fontWeight: "800",

          color: theme.text,
        },

        /* =================================================
           TOOLTIP
        ================================================= */

        tooltip: {
          position: "absolute",

          left: 5,

          top: 45,

          minWidth: 128,

          paddingHorizontal: 12,

          paddingVertical: 10,

          borderRadius: 14,

          backgroundColor: theme.surface,

          borderWidth: 1,

          borderColor: theme.border,

          shadowColor: "#000000",

          shadowOffset: {
            width: 0,
            height: 4,
          },

          shadowOpacity: 0.12,

          shadowRadius: 8,

          elevation: 6,
        },

        tooltipCategoryRow: {
          flexDirection: "row",

          alignItems: "center",

          gap: 7,
        },

        tooltipDot: {
          width: 10,
          height: 10,

          borderRadius: 5,
        },

        tooltipCategory: {
          maxWidth: 100,

          fontSize: 12,

          fontWeight: "800",

          color: theme.text,
        },

        tooltipAmount: {
          marginTop: 6,

          fontSize: 11,

          fontWeight: "600",

          color: theme.textSecondary,
        },

        tooltipPercentage: {
          fontSize: 10,

          fontWeight: "500",

          color: theme.textSecondary,
        },

        /* =================================================
           LEGEND
        ================================================= */

        legend: {
          marginTop: 8,

          gap: 8,
        },

        legendItem: {
          minHeight: 42,

          flexDirection: "row",

          alignItems: "center",

          justifyContent: "space-between",

          paddingHorizontal: 10,

          paddingVertical: 8,

          borderRadius: 12,

          backgroundColor:
            theme.surfaceSecondary,

          borderWidth: 1,

          borderColor: theme.border,
        },

        legendItemSelected: {
          borderColor: theme.border,

          backgroundColor: theme.textSecondary,
        },

        legendLeft: {
          flex: 1,

          flexDirection: "row",

          alignItems: "center",

          marginRight: 10,
        },

        legendDot: {
          width: 10,
          height: 10,

          borderRadius: 5,

          marginRight: 8,
        },

        legendName: {
          flex: 1,

          fontSize: 12,

          fontWeight: "700",

          color: theme.text,
        },

        legendRight: {
          flexDirection: "row",

          alignItems: "center",

          gap: 8,
        },

        percentage: {
          paddingHorizontal: 7,

          paddingVertical: 3,

          borderRadius: 6,

          backgroundColor: theme.textSecondary,

          fontSize: 9,

          fontWeight: "700",

          color: theme.textSecondary,
        },

        amount: {
          fontSize: 12,

          fontWeight: "800",

          color: theme.text,
        },

        /* =================================================
           EMPTY STATE
        ================================================= */

        emptyState: {
          minHeight: 250,

          alignItems: "center",

          justifyContent: "center",
        },

        emptyTitle: {
          marginTop: 10,

          fontSize: 14,

          fontWeight: "700",

          color: theme.text,
        },

        emptyText: {
          marginTop: 3,

          fontSize: 11,

          fontWeight: "500",

          textAlign: "center",

          color: theme.textSecondary,
        },
      }),
    [theme],
  );

  /*
   * =========================================================
   * CHART DATA
   * =========================================================
   */

  const chartData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,

      name: formatPaymentMethod(
        item.paymentMethod,
      ),

      color:
        METHOD_COLORS[
          item.paymentMethod ?? "OTHER"
        ] ??
        DEFAULT_COLORS[
          index % DEFAULT_COLORS.length
        ],
    }));
  }, [data]);

  /*
   * =========================================================
   * TOTAL
   * =========================================================
   */

  const total = useMemo(
    () =>
      chartData.reduce(
        (sum, item) =>
          sum + item.amount,
        0,
      ),
    [chartData],
  );

  /*
   * =========================================================
   * SELECTED ITEM
   * =========================================================
   */

  const selectedItem = chartData.find(
    (item) =>
      item.name === selectedMethod,
  );

  /*
   * =========================================================
   * EMPTY STATE
   * =========================================================
   */

  if (!chartData.length || total === 0) {
    return (
      <View style={styles.card}>
        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <CreditCard
                size={20}
                color={theme.text}
                strokeWidth={2}
              />
            </View>

            <View style={styles.headerContent}>
              <Text style={styles.title}>
                Payment Method Breakdown
              </Text>

              <Text style={styles.description}>
                Expenses distributed across
                payment methods
              </Text>
            </View>
          </View>
        </View>

        {/* EMPTY */}

        <View style={styles.emptyState}>
          <CreditCard
            size={32}
            color={theme.textSecondary}
            strokeWidth={1.7}
          />

          <Text style={styles.emptyTitle}>
            No payment data
          </Text>

          <Text style={styles.emptyText}>
            No payment data available for
            this period.
          </Text>
        </View>
      </View>
    );
  }

  /*
   * =========================================================
   * DONUT CONFIG
   * =========================================================
   */

  const chartSize = 250;

  const strokeWidth = 38;

  const center = chartSize / 2;

  const radius =
    (chartSize - strokeWidth) / 2;

  const circumference =
    2 * Math.PI * radius;

  /*
   * =========================================================
   * BUILD SEGMENTS
   * =========================================================
   */

  let accumulatedPercentage = 0;

  const segments = chartData.map(
    (item) => {
      const percentage =
        total === 0
          ? 0
          : (item.amount / total) * 100;

      const startPercentage =
        accumulatedPercentage;

      const endPercentage =
        accumulatedPercentage +
        percentage;

      const segmentLength =
        (percentage / 100) *
        circumference;

      const rotation =
        -90 +
        (startPercentage / 100) * 360;

      accumulatedPercentage =
        endPercentage;

      return {
        ...item,

        percentage,

        startPercentage,

        endPercentage,

        segmentLength,

        rotation,
      };
    },
  );

  /*
   * =========================================================
   * HANDLE DONUT PRESS
   * =========================================================
   */

  const handleChartPress = (
    event: any,
  ) => {
    const {
      locationX,
      locationY,
    } = event.nativeEvent;

    const dx =
      locationX - center;

    const dy =
      locationY - center;

    const distance = Math.sqrt(
      dx * dx + dy * dy,
    );

    /*
     * Ignore taps outside donut ring.
     */

    const innerRadius =
      radius - strokeWidth / 2;

    const outerRadius =
      radius + strokeWidth / 2;

    if (
      distance < innerRadius ||
      distance > outerRadius
    ) {
      setSelectedMethod(null);
      return;
    }

    /*
     * Calculate angle.
     */

    let angle =
      Math.atan2(dy, dx) *
      (180 / Math.PI);

    /*
     * Donut starts at -90 degrees.
     */

    angle += 90;

    if (angle < 0) {
      angle += 360;
    }

    /*
     * Convert angle to percentage.
     */

    const tappedPercentage =
      (angle / 360) * 100;

    /*
     * Find selected segment.
     */

    const tappedSegment =
      segments.find(
        (segment) =>
          tappedPercentage >=
            segment.startPercentage &&
          tappedPercentage <
            segment.endPercentage,
      );

    if (tappedSegment) {
      setSelectedMethod(
        tappedSegment.name,
      );
    }
  };

  /*
   * =========================================================
   * MAIN
   * =========================================================
   */

  return (
    <View style={styles.card}>
      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIcon}>
            <CreditCard
              size={21}
              color={theme.text}
              strokeWidth={2}
            />
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.title}>
              Payment Method Breakdown
            </Text>

            <Text style={styles.description}>
              Expenses distributed across
              payment methods
            </Text>
          </View>
        </View>

        {/* =================================================
            TOTAL PAID
        ================================================= */}

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>
            TOTAL PAID
          </Text>

          <Text style={styles.totalAmount}>
            {formatCurrency(total)}
          </Text>
        </View>
      </View>

      {/* =================================================
          DONUT
      ================================================= */}

      <View style={styles.chartSection}>
        <View
          style={[
            styles.chartContainer,
            {
              width: chartSize,
              height: chartSize,
            },
          ]}
        >
          {/* =================================================
              SVG
          ================================================= */}

          <Svg
            width={chartSize}
            height={chartSize}
            viewBox={`0 0 ${chartSize} ${chartSize}`}
            pointerEvents="none"
          >
            {/* =================================================
                BACKGROUND RING
            ================================================= */}

            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={theme.border}
              strokeWidth={strokeWidth}
              fill="none"
            />

            {/* =================================================
                SEGMENTS
            ================================================= */}

            <G pointerEvents="none">
              {segments.map(
                (segment) => {
                  const isSelected =
                    selectedMethod ===
                    segment.name;

                  return (
                    <Circle
                      key={segment.name}
                      cx={center}
                      cy={center}
                      r={radius}
                      stroke={
                        segment.color
                      }
                      strokeWidth={
                        isSelected
                          ? strokeWidth + 5
                          : strokeWidth
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
                  );
                },
              )}
            </G>
          </Svg>

          {/* =================================================
              SINGLE TOUCH TARGET
          ================================================= */}

          <Pressable
            style={styles.touchLayer}
            onPress={
              handleChartPress
            }
          />

          {/* =================================================
              CENTER LABEL
          ================================================= */}

          <View
            style={styles.donutCenter}
            pointerEvents="none"
          >
            <Text style={styles.centerLabel}>
              METHODS
            </Text>

            <Text style={styles.centerValue}>
              {chartData.length}
            </Text>
          </View>

          {/* =================================================
              TOOLTIP
          ================================================= */}

          {selectedItem && (
            <View
              style={styles.tooltip}
              pointerEvents="none"
            >
              <View
                style={
                  styles.tooltipCategoryRow
                }
              >
                <View
                  style={[
                    styles.tooltipDot,
                    {
                      backgroundColor:
                        selectedItem.color,
                    },
                  ]}
                />

                <Text
                  numberOfLines={1}
                  style={
                    styles.tooltipCategory
                  }
                >
                  {selectedItem.name}
                </Text>
              </View>

              <Text
                style={styles.tooltipAmount}
              >
                {formatCurrency(
                  selectedItem.amount,
                )}{" "}
                <Text
                  style={
                    styles.tooltipPercentage
                  }
                >
                  (
                  {(
                    total === 0
                      ? 0
                      : (selectedItem.amount /
                          total) *
                        100
                  ).toFixed(1)}
                  %)
                </Text>
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* =================================================
          LEGEND
      ================================================= */}

      <View style={styles.legend}>
        {chartData.map((item) => {
          const percentage =
            total === 0
              ? 0
              : (item.amount / total) *
                100;

          const isSelected =
            selectedMethod ===
            item.name;

          return (
            <Pressable
              key={item.name}
              onPress={() =>
                setSelectedMethod(
                  isSelected
                    ? null
                    : item.name,
                )
              }
              style={[
                styles.legendItem,
                isSelected &&
                  styles.legendItemSelected,
              ]}
            >
              {/* LEFT */}

              <View
                style={styles.legendLeft}
              >
                <View
                  style={[
                    styles.legendDot,
                    {
                      backgroundColor:
                        item.color,
                    },
                  ]}
                />

                <Text
                  numberOfLines={1}
                  style={styles.legendName}
                >
                  {item.name}
                </Text>
              </View>

              {/* RIGHT */}

              <View
                style={styles.legendRight}
              >
                <Text
                  style={styles.percentage}
                >
                  {percentage.toFixed(1)}%
                </Text>

                <Text
                  style={styles.amount}
                >
                  {formatCurrency(
                    item.amount,
                  )}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}