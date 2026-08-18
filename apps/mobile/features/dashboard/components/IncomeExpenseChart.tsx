
import {
  TrendingUp,
} from "lucide-react-native";

import React, {
  useMemo,
  useState,
} from "react";

import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";

import type {
  DashboardIncomeExpenseTrend,
} from "../../../types/dashboard.types";

import { useTheme } from "../../../providers/ThemeProvider";

/* =========================================================
   TYPES
========================================================= */

interface IncomeExpenseChartProps {
  data: DashboardIncomeExpenseTrend[];
}

/* =========================================================
   CONSTANTS
========================================================= */

const CHART_HEIGHT = 220;

const PADDING_LEFT = 48;
const PADDING_RIGHT = 12;
const PADDING_TOP = 20;
const PADDING_BOTTOM = 35;

const HORIZONTAL_LINES = 4;

/* =========================================================
   SEMANTIC COLORS
========================================================= */

const INCOME_COLOR = "#10B981";
const INCOME_TEXT_COLOR = "#059669";

const EXPENSE_COLOR = "#EF4444";
const EXPENSE_TEXT_COLOR = "#DC2626";

/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatAxisCurrency(value: number) {
  if (value >= 1000) {
    return `₹${Math.round(
      value / 1000,
    )}k`;
  }

  return `₹${Math.round(value)}`;
}

/* =========================================================
   DATE FORMATTER
========================================================= */

function formatDateLabel(
  value: string,
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
      },
    );
  }

  return value;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function IncomeExpenseChart({
  data,
}: IncomeExpenseChartProps) {
  const {
    theme,
    isDark,
  } = useTheme();

  const [
    selectedIndex,
    setSelectedIndex,
  ] = useState<number | null>(null);

  /* =======================================================
     MEASURE ACTUAL WIDTH
  ======================================================= */

  const [
    containerWidth,
    setContainerWidth,
  ] = useState(0);

  const handleLayout = (
    event: LayoutChangeEvent,
  ) => {
    const width =
      event.nativeEvent.layout.width;

    if (width !== containerWidth) {
      setContainerWidth(width);
    }
  };

  /*
   * Do not use Dimensions.get("window").width.
   *
   * The chart must use its actual parent width.
   */

  const chartWidth =
    containerWidth > 0
      ? containerWidth
      : 300;

  /* =======================================================
     GRAPH DIMENSIONS
  ======================================================= */

  const graphWidth = Math.max(
    chartWidth -
      PADDING_LEFT -
      PADDING_RIGHT,
    1,
  );

  const graphHeight =
    CHART_HEIGHT -
    PADDING_TOP -
    PADDING_BOTTOM;

  /* =======================================================
     MAX VALUE
  ======================================================= */

  const maxValue = useMemo(() => {
    const values = data.flatMap(
      (item) => [
        item.income,
        item.expense,
      ],
    );

    const max = Math.max(
      ...values,
      0,
    );

    if (max === 0) {
      return 100;
    }

    return Math.ceil(
      max * 1.15,
    );
  }, [data]);

  /* =======================================================
     X POSITION
  ======================================================= */

  const getX = (index: number) => {
    if (data.length <= 1) {
      return (
        PADDING_LEFT +
        graphWidth / 2
      );
    }

    return (
      PADDING_LEFT +
      (index /
        (data.length - 1)) *
        graphWidth
    );
  };

  /* =======================================================
     Y POSITION
  ======================================================= */

  const getY = (value: number) => {
    return (
      PADDING_TOP +
      graphHeight -
      (value / maxValue) *
        graphHeight
    );
  };

  /* =======================================================
     LINE PATH
  ======================================================= */

  const createLinePath = (
    key: "income" | "expense",
  ) => {
    if (!data.length) {
      return "";
    }

    return data
      .map((item, index) => {
        const x = getX(index);
        const y = getY(item[key]);

        return `${
          index === 0
            ? "M"
            : "L"
        } ${x} ${y}`;
      })
      .join(" ");
  };

  /* =======================================================
     AREA PATH
  ======================================================= */

  const createAreaPath = (
    key: "income" | "expense",
  ) => {
    if (!data.length) {
      return "";
    }

    const firstX = getX(0);

    const lastX = getX(
      data.length - 1,
    );

    const baseline =
      PADDING_TOP +
      graphHeight;

    const linePoints = data
      .map((item, index) => {
        const x = getX(index);
        const y = getY(item[key]);

        return `L ${x} ${y}`;
      })
      .join(" ");

    return [
      `M ${firstX} ${baseline}`,
      linePoints,
      `L ${lastX} ${baseline}`,
      "Z",
    ].join(" ");
  };

  /* =======================================================
     PATHS
  ======================================================= */

  const incomeLinePath = useMemo(
    () =>
      createLinePath("income"),
    [data, graphWidth, maxValue],
  );

  const expenseLinePath = useMemo(
    () =>
      createLinePath("expense"),
    [data, graphWidth, maxValue],
  );

  const incomeAreaPath = useMemo(
    () =>
      createAreaPath("income"),
    [data, graphWidth, maxValue],
  );

  const expenseAreaPath = useMemo(
    () =>
      createAreaPath("expense"),
    [data, graphWidth, maxValue],
  );

  /* =======================================================
     SELECTED DATA
  ======================================================= */

  const selectedData =
    selectedIndex !== null
      ? data[selectedIndex]
      : null;

  /* =======================================================
     DATE INDEXES
  ======================================================= */

  const visibleDateIndexes =
    useMemo(() => {
      if (!data.length) {
        return [];
      }

      if (data.length <= 5) {
        return data.map(
          (_, index) => index,
        );
      }

      const indexes =
        new Set<number>();

      indexes.add(0);

      const step =
        (data.length - 1) / 4;

      for (
        let i = 1;
        i < 4;
        i++
      ) {
        indexes.add(
          Math.round(
            i * step,
          ),
        );
      }

      indexes.add(
        data.length - 1,
      );

      return Array.from(
        indexes,
      ).sort(
        (a, b) => a - b,
      );
    }, [data]);

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!data.length) {
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
        <Header
          theme={theme}
        />

        <View
          style={styles.emptyState}
        >
          <Text
            style={[
              styles.emptyText,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            No transaction data
            available for this
            period.
          </Text>
        </View>
      </View>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

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
        <Header
          theme={theme}
        />

        {/* =================================================
            LEGEND
        ================================================= */}

        <View
          style={styles.legend}
        >
          <View
            style={
              styles.legendItem
            }
          >
            <View
              style={[
                styles.legendDot,
                {
                  backgroundColor:
                    INCOME_COLOR,
                },
              ]}
            />

            <Text
              style={[
                styles.legendText,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              Income
            </Text>
          </View>

          <View
            style={
              styles.legendItem
            }
          >
            <View
              style={[
                styles.legendDot,
                {
                  backgroundColor:
                    EXPENSE_COLOR,
                },
              ]}
            />

            <Text
              style={[
                styles.legendText,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              Expense
            </Text>
          </View>
        </View>
      </View>

      {/* =================================================
          CHART
      ================================================= */}

      <View
        style={styles.chartOuter}
        onLayout={handleLayout}
      >
        <Svg
          width={chartWidth}
          height={CHART_HEIGHT}
        >
          {/* =================================================
              GRADIENTS
          ================================================= */}

          <Defs>
            {/* Income gradient */}

            <LinearGradient
              id="incomeGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <Stop
                offset="0"
                stopColor={INCOME_COLOR}
                stopOpacity={
                  isDark ? 0.22 : 0.18
                }
              />

              <Stop
                offset="0.65"
                stopColor={INCOME_COLOR}
                stopOpacity={
                  isDark ? 0.08 : 0.07
                }
              />

              <Stop
                offset="1"
                stopColor={INCOME_COLOR}
                stopOpacity={0}
              />
            </LinearGradient>

            {/* Expense gradient */}

            <LinearGradient
              id="expenseGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <Stop
                offset="0"
                stopColor={EXPENSE_COLOR}
                stopOpacity={
                  isDark ? 0.20 : 0.16
                }
              />

              <Stop
                offset="0.65"
                stopColor={EXPENSE_COLOR}
                stopOpacity={
                  isDark ? 0.07 : 0.06
                }
              />

              <Stop
                offset="1"
                stopColor={EXPENSE_COLOR}
                stopOpacity={0}
              />
            </LinearGradient>
          </Defs>

          {/* =================================================
              HORIZONTAL GRID
          ================================================= */}

          {Array.from({
            length:
              HORIZONTAL_LINES + 1,
          }).map((_, index) => {
            const y =
              PADDING_TOP +
              (index /
                HORIZONTAL_LINES) *
                graphHeight;

            const value =
              maxValue -
              (index /
                HORIZONTAL_LINES) *
                maxValue;

            return (
              <React.Fragment
                key={`grid-${index}`}
              >
                <Line
                  x1={PADDING_LEFT}
                  y1={y}
                  x2={
                    chartWidth -
                    PADDING_RIGHT
                  }
                  y2={y}
                  stroke={
                    theme.border
                  }
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  opacity={
                    isDark
                      ? 0.75
                      : 1
                  }
                />

                <SvgText
                  x={3}
                  y={y + 4}
                  fontSize="9"
                  fill={
                    theme.textSecondary
                  }
                >
                  {formatAxisCurrency(
                    value,
                  )}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* =================================================
              INCOME AREA
          ================================================= */}

          <Path
            d={incomeAreaPath}
            fill="url(#incomeGradient)"
            stroke="none"
          />

          {/* =================================================
              EXPENSE AREA
          ================================================= */}

          <Path
            d={expenseAreaPath}
            fill="url(#expenseGradient)"
            stroke="none"
          />

          {/* =================================================
              INCOME LINE
          ================================================= */}

          <Path
            d={incomeLinePath}
            fill="none"
            stroke={INCOME_COLOR}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* =================================================
              EXPENSE LINE
          ================================================= */}

          <Path
            d={expenseLinePath}
            fill="none"
            stroke={EXPENSE_COLOR}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* =================================================
              TOUCH TARGETS
          ================================================= */}

          {data.map(
            (_, index) => {
              const x = getX(index);

              const touchWidth =
                Math.min(
                  40,
                  Math.max(
                    graphWidth /
                      Math.max(
                        data.length,
                        1,
                      ),
                    20,
                  ),
                );

              const touchLeft =
                Math.max(
                  PADDING_LEFT,
                  x -
                    touchWidth / 2,
                );

              const availableWidth =
                chartWidth -
                PADDING_RIGHT -
                touchLeft;

              return (
                <Rect
                  key={`touch-${index}`}
                  x={touchLeft}
                  y={PADDING_TOP}
                  width={Math.min(
                    touchWidth,
                    availableWidth,
                  )}
                  height={
                    graphHeight
                  }
                  fill="transparent"
                  onPress={() =>
                    setSelectedIndex(
                      index,
                    )
                  }
                />
              );
            },
          )}

          {/* =================================================
              SELECTED VERTICAL GUIDE
          ================================================= */}

          {selectedData &&
            selectedIndex !== null && (
              <>
                <Line
                  x1={getX(
                    selectedIndex,
                  )}
                  y1={PADDING_TOP}
                  x2={getX(
                    selectedIndex,
                  )}
                  y2={
                    PADDING_TOP +
                    graphHeight
                  }
                  stroke={
                    theme.textSecondary
                  }
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  opacity={
                    isDark
                      ? 0.45
                      : 0.4
                  }
                />

                {/* Income point */}

                <Circle
                  cx={getX(
                    selectedIndex,
                  )}
                  cy={getY(
                    selectedData.income,
                  )}
                  r={6}
                  fill={
                    theme.surface
                  }
                  stroke={
                    INCOME_COLOR
                  }
                  strokeWidth={3}
                />

                {/* Expense point */}

                <Circle
                  cx={getX(
                    selectedIndex,
                  )}
                  cy={getY(
                    selectedData.expense,
                  )}
                  r={6}
                  fill={
                    theme.surface
                  }
                  stroke={
                    EXPENSE_COLOR
                  }
                  strokeWidth={3}
                />
              </>
            )}
        </Svg>

        {/* =================================================
            X AXIS
        ================================================= */}

        <View
          pointerEvents="none"
          style={[
            styles.xAxis,
            {
              left:
                PADDING_LEFT,

              width:
                graphWidth,
            },
          ]}
        >
          {visibleDateIndexes.map(
            (index) => {
              const item =
                data[index];

              const position =
                data.length <= 1
                  ? graphWidth / 2
                  : (index /
                      (data.length -
                        1)) *
                    graphWidth;

              const isFirst =
                index === 0;

              const isLast =
                index ===
                data.length - 1;

              return (
                <View
                  key={`date-${index}`}
                  style={[
                    styles.xLabel,
                    {
                      left: position,

                      transform: [
                        {
                          translateX:
                            isFirst
                              ? 0
                              : isLast
                                ? -40
                                : -20,
                        },
                      ],
                    },
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.axisLabel,
                      {
                        color:
                          theme.textSecondary,
                      },
                    ]}
                  >
                    {formatDateLabel(
                      item.label,
                    )}
                  </Text>
                </View>
              );
            },
          )}
        </View>

        {/* =================================================
            TOOLTIP
        ================================================= */}

        {selectedData &&
          selectedIndex !== null && (
            <View
              pointerEvents="none"
              style={[
                styles.tooltip,
                {
                  left: Math.min(
                    Math.max(
                      getX(
                        selectedIndex,
                      ) - 70,
                      PADDING_LEFT,
                    ),
                    chartWidth -
                      PADDING_RIGHT -
                      140,
                  ),

                  backgroundColor:
                    theme.surface,

                  borderColor:
                    theme.border,
                },
              ]}
            >
              {/* Date */}

              <Text
                style={[
                  styles.tooltipPeriod,
                  {
                    color:
                      theme.text,
                  },
                ]}
              >
                {formatDateLabel(
                  selectedData.label,
                )}
              </Text>

              {/* Income */}

              <View
                style={
                  styles.tooltipRow
                }
              >
                <View
                  style={[
                    styles.tooltipDot,
                    {
                      backgroundColor:
                        INCOME_COLOR,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.tooltipLabel,
                    {
                      color:
                        theme.textSecondary,
                    },
                  ]}
                >
                  Income
                </Text>

                <Text
                  style={[
                    styles.tooltipValue,
                    {
                      color:
                        INCOME_TEXT_COLOR,
                    },
                  ]}
                >
                  {formatCurrency(
                    selectedData.income,
                  )}
                </Text>
              </View>

              {/* Expense */}

              <View
                style={
                  styles.tooltipRow
                }
              >
                <View
                  style={[
                    styles.tooltipDot,
                    {
                      backgroundColor:
                        EXPENSE_COLOR,
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.tooltipLabel,
                    {
                      color:
                        theme.textSecondary,
                    },
                  ]}
                >
                  Expense
                </Text>

                <Text
                  style={[
                    styles.tooltipValue,
                    {
                      color:
                        EXPENSE_TEXT_COLOR,
                    },
                  ]}
                >
                  {formatCurrency(
                    selectedData.expense,
                  )}
                </Text>
              </View>
            </View>
          )}
      </View>
    </View>
  );
}

/* =========================================================
   HEADER
========================================================= */

function Header({
  theme,
}: {
  theme: {
    background: string;
    surface: string;
    surfaceSecondary: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    primaryText: string;
    muted: string;
    destructive: string;
  };
}) {
  return (
    <View
      style={styles.headerLeft}
    >
      <View
        style={[
          styles.headerIcon,
          {
            backgroundColor:
              "#ECFDF5",
          },
        ]}
      >
        <TrendingUp
          size={20}
          color={INCOME_TEXT_COLOR}
          strokeWidth={2.2}
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
          Income vs Expense
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
          Cash inflow and outflow
          trend over time
        </Text>
      </View>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({
    /* =====================================================
       CARD
    ===================================================== */

    card: {
      width: "100%",

      padding: 18,

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

    /* =====================================================
       HEADER
    ===================================================== */

    header: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      paddingBottom: 14,

      borderBottomWidth: 1,
    },

    headerLeft: {
      flex: 1,

      flexDirection: "row",

      alignItems: "center",

      minWidth: 0,
    },

    headerIcon: {
      width: 40,

      height: 40,

      borderRadius: 12,

      alignItems: "center",

      justifyContent: "center",
    },

    headerContent: {
      flex: 1,

      minWidth: 0,

      marginLeft: 10,
    },

    title: {
      fontSize: 16,

      fontWeight: "800",
    },

    description: {
      marginTop: 2,

      fontSize: 11,

      fontWeight: "500",
    },

    /* =====================================================
       LEGEND
    ===================================================== */

    legend: {
      flexDirection: "column",

      alignItems:
        "flex-start",

      gap: 5,

      marginLeft: 8,
    },

    legendItem: {
      flexDirection: "row",

      alignItems: "center",

      gap: 5,
    },

    legendDot: {
      width: 7,

      height: 7,

      borderRadius: 4,
    },

    legendText: {
      fontSize: 9,

      fontWeight: "700",
    },

    /* =====================================================
       CHART
    ===================================================== */

    chartOuter: {
      position: "relative",

      width: "100%",

      height: CHART_HEIGHT,

      marginTop: 14,

      overflow: "hidden",
    },

    /* =====================================================
       X AXIS
    ===================================================== */

    xAxis: {
      position: "absolute",

      bottom: 0,

      height: 20,
    },

    xLabel: {
      position: "absolute",

      width: 40,

      alignItems: "center",
    },

    axisLabel: {
      fontSize: 9,

      fontWeight: "500",

      textAlign: "center",
    },

    /* =====================================================
       TOOLTIP
    ===================================================== */

    tooltip: {
      position: "absolute",

      top: 8,

      minWidth: 140,

      paddingHorizontal: 11,

      paddingVertical: 9,

      borderRadius: 12,

      borderWidth: 1,

      shadowColor:
        "#000000",

      shadowOffset: {
        width: 0,
        height: 4,
      },

      shadowOpacity: 0.12,

      shadowRadius: 8,

      elevation: 6,
    },

    tooltipPeriod: {
      marginBottom: 6,

      fontSize: 10,

      fontWeight: "800",
    },

    tooltipRow: {
      flexDirection: "row",

      alignItems: "center",

      marginTop: 4,
    },

    tooltipDot: {
      width: 7,

      height: 7,

      borderRadius: 4,

      marginRight: 5,
    },

    tooltipLabel: {
      flex: 1,

      fontSize: 10,

      fontWeight: "500",
    },

    tooltipValue: {
      fontSize: 10,

      fontWeight: "800",
    },

    /* =====================================================
       EMPTY
    ===================================================== */

    emptyState: {
      minHeight: 220,

      alignItems: "center",

      justifyContent:
        "center",

      paddingHorizontal: 20,
    },

    emptyText: {
      fontSize: 12,

      fontWeight: "600",

      textAlign: "center",
    },
  });