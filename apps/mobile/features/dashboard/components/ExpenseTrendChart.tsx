

import {
  TrendingDown,
} from "lucide-react-native";

import {
  useMemo,
  useState,
} from "react";
import React from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Line,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";

import type {
  DashboardExpenseTrend,
} from "../../../types/dashboard.types";

import { useTheme } from "../../../providers/ThemeProvider";

/* =========================================================
   TYPES
========================================================= */

interface ExpenseTrendChartProps {
  data: DashboardExpenseTrend[];
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
    return `₹${Math.round(value / 1000)}k`;
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

  /*
   * Try ISO / normal date strings first.
   *
   * Examples:
   * 2026-08-15
   * 2026-08-15T00:00:00.000Z
   */

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

  /*
   * Fallback for labels already formatted
   * by the backend.
   */

  return value;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function ExpenseTrendChart({
  data,
}: ExpenseTrendChartProps) {
  const {
    theme,
    isDark,
  } = useTheme();

  const [
    selectedIndex,
    setSelectedIndex,
  ] = useState<number | null>(null);

  /*
   * -------------------------------------------------------
   * IMPORTANT
   *
   * Don't use Dimensions.get("window").width here.
   *
   * The chart sits INSIDE a card with padding, so the
   * screen width is larger than the actual chart width.
   *
   * We measure the real available width instead.
   * -------------------------------------------------------
   */

  const [containerWidth, setContainerWidth] =
    useState(0);

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
   * -------------------------------------------------------
   * CHART WIDTH
   * -------------------------------------------------------
   */

  const chartWidth =
    containerWidth > 0
      ? containerWidth
      : 300;

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

  /*
   * =======================================================
   * MAX VALUE
   * =======================================================
   */

  const maxValue = useMemo(() => {
    const max = Math.max(
      ...data.map(
        (item) => item.value,
      ),
      0,
    );

    if (max === 0) {
      return 100;
    }

    /*
     * Add some headroom so the area does not
     * touch the top of the chart.
     */

    return Math.ceil(max * 1.15);
  }, [data]);

  /*
   * =======================================================
   * X POSITION
   * =======================================================
   */

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

  /*
   * =======================================================
   * Y POSITION
   * =======================================================
   */

  const getY = (value: number) => {
    return (
      PADDING_TOP +
      graphHeight -
      (value / maxValue) *
        graphHeight
    );
  };

  /*
   * =======================================================
   * LINE PATH
   * =======================================================
   */

  const linePath = useMemo(() => {
    if (!data.length) {
      return "";
    }

    return data
      .map((item, index) => {
        const x = getX(index);
        const y = getY(item.value);

        return `${
          index === 0 ? "M" : "L"
        } ${x} ${y}`;
      })
      .join(" ");
  }, [
    data,
    graphWidth,
    maxValue,
  ]);

  /*
   * =======================================================
   * AREA PATH
   * =======================================================
   *
   * The area starts from the first point,
   * follows the expense line,
   * then comes down to the baseline,
   * and closes back to the first point.
   * =======================================================
   */

  const areaPath = useMemo(() => {
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

    return [
      `M ${firstX} ${baseline}`,

      data
        .map((item, index) => {
          const x = getX(index);
          const y = getY(item.value);

          return `L ${x} ${y}`;
        })
        .join(" "),

      `L ${lastX} ${baseline}`,

      "Z",
    ].join(" ");
  }, [
    data,
    graphWidth,
    maxValue,
  ]);

  /*
   * =======================================================
   * SELECTED DATA
   * =======================================================
   */

  const selectedData =
    selectedIndex !== null
      ? data[selectedIndex]
      : null;

  /*
   * =======================================================
   * DATE LABELS
   * =======================================================
   *
   * Show a maximum of 5 labels.
   *
   * This prevents:
   *
   * 01 Aug  02 Aug  03 Aug  04 Aug...
   *
   * from becoming unreadable.
   * =======================================================
   */

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

      const indexes = new Set<number>();

      indexes.add(0);

      const step =
        (data.length - 1) / 4;

      for (
        let i = 1;
        i < 4;
        i++
      ) {
        indexes.add(
          Math.round(i * step),
        );
      }

      indexes.add(
        data.length - 1,
      );

      return Array.from(
        indexes,
      ).sort((a, b) => a - b);
    }, [data]);

  /*
   * =======================================================
   * EMPTY STATE
   * =======================================================
   */

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
        <Header />

        <View style={styles.emptyState}>
          <Text
            style={[
              styles.emptyText,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            No expense data available
            for this period.
          </Text>
        </View>
      </View>
    );
  }

  /*
   * =======================================================
   * MAIN
   * =======================================================
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
        <Header />

        <View style={styles.legend}>
          <View
            style={[
              styles.legendDot,
              {
                backgroundColor:
                  "#EF4444",
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
            Outflow
          </Text>
        </View>
      </View>

      {/* =================================================
          CHART CONTAINER
      ================================================= */}

      <View
        style={styles.chartOuter}
        onLayout={handleLayout}
      >
        <Svg
          width={chartWidth}
          height={CHART_HEIGHT}
        >
          <Defs>
            {/* =================================================
                AREA GRADIENT
            ================================================= */}

            <LinearGradient
              id="expenseAreaGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <Stop
                offset="0"
                stopColor="#EF4444"
                stopOpacity={
                  isDark
                    ? 0.32
                    : 0.20
                }
              />

              <Stop
                offset="0.65"
                stopColor="#EF4444"
                stopOpacity={
                  isDark
                    ? 0.14
                    : 0.08
                }
              />

              <Stop
                offset="1"
                stopColor="#EF4444"
                stopOpacity={0}
              />
            </LinearGradient>
          </Defs>

          {/* =================================================
              GRID
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
                  stroke={theme.border}
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  opacity={
                    isDark
                      ? 0.7
                      : 1
                  }
                />

                <SvgText
                  x={4}
                  y={y + 4}
                  fontSize="9"
                  fill={
                    theme.textSecondary
                  }
                  opacity={0.75}
                >
                  {formatAxisCurrency(
                    value,
                  )}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* =================================================
              AREA
          ================================================= */}

          <Path
            d={areaPath}
            fill="url(#expenseAreaGradient)"
            stroke="none"
          />

          {/* =================================================
              EXPENSE LINE
          ================================================= */}

          <Path
            d={linePath}
            fill="none"
            stroke="#EF4444"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* =================================================
              TOUCH TARGETS
          ================================================= */}

          {data.map(
            (item, index) => {
              const x = getX(index);

              /*
               * Keep touch target inside chart boundaries.
               */

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

              return (
                <Rect
                  key={`touch-${index}`}
                  x={Math.max(
                    PADDING_LEFT,
                    x -
                      touchWidth / 2,
                  )}
                  y={PADDING_TOP}
                  width={
                    Math.min(
                      touchWidth,
                      chartWidth -
                        PADDING_RIGHT -
                        Math.max(
                          PADDING_LEFT,
                          x -
                            touchWidth /
                              2,
                        ),
                    )
                  }
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
              SELECTED POINT
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
                  stroke="#EF4444"
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  opacity={0.4}
                />

                <Circle
                  cx={getX(
                    selectedIndex,
                  )}
                  cy={getY(
                    selectedData.value,
                  )}
                  r={6}
                  fill={
                    theme.surface
                  }
                  stroke="#EF4444"
                  strokeWidth={3}
                />
              </>
            )}
        </Svg>

        {/* =================================================
            X AXIS DATES
        ================================================= */}

        <View
          pointerEvents="none"
          style={[
            styles.xAxis,
            {
              left: PADDING_LEFT,
              width: graphWidth,
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
                  backgroundColor:
                    theme.surface,

                  borderColor:
                    theme.border,

                  left: Math.min(
                    Math.max(
                      getX(
                        selectedIndex,
                      ) - 67,
                      PADDING_LEFT,
                    ),
                    chartWidth -
                      PADDING_RIGHT -
                      135,
                  ),
                },
              ]}
            >
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
                        "#EF4444",
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
                        "#DC2626",
                    },
                  ]}
                >
                  {formatCurrency(
                    selectedData.value,
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

function Header() {
  const {
    theme,
  } = useTheme();

  return (
    <View
      style={styles.headerLeft}
    >
      <View
        style={[
          styles.headerIcon,
          {
            backgroundColor:
              "#FEF2F2",
          },
        ]}
      >
        <TrendingDown
          size={20}
          color="#DC2626"
          strokeWidth={2.2}
        />
      </View>

      <View
        style={
          styles.headerContent
        }
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
          Expense Trend
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
          Expense fluctuation over
          time
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
      flexDirection: "row",

      alignItems: "center",

      gap: 5,

      marginLeft: 8,
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

      minWidth: 135,

      paddingHorizontal: 11,

      paddingVertical: 9,

      borderRadius: 12,

      borderWidth: 1,

      shadowColor: "#000000",

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

      justifyContent: "center",
    },

    emptyText: {
      fontSize: 12,

      fontWeight: "600",

      textAlign: "center",
    },
  });