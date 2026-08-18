
import { Check, ChevronDown, FolderTree } from "lucide-react-native";

import { useMemo, useState } from "react";

import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import Svg, { Circle, Path } from "react-native-svg";

import type { DashboardSubcategorySpending } from "../../../types/dashboard.types";

import { useTheme } from "../../../providers/ThemeProvider";

import { CategoryIcon } from "../../categories/components/category-icon";

interface SpendingDonutChartProps {
  data: DashboardSubcategorySpending[];

  title?: string;

  description?: string;
}

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
   GEOMETRY
========================================================= */

function polarToCartesian(center: number, radius: number, angle: number) {
  const angleInRadians = ((angle - 90) * Math.PI) / 180;

  return {
    x: center + radius * Math.cos(angleInRadians),

    y: center + radius * Math.sin(angleInRadians),
  };
}

function createDonutPath(
  center: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number,
) {
  const outerStart = polarToCartesian(center, outerRadius, startAngle);

  const outerEnd = polarToCartesian(center, outerRadius, endAngle);

  const innerStart = polarToCartesian(center, innerRadius, startAngle);

  const innerEnd = polarToCartesian(center, innerRadius, endAngle);

  const angle = endAngle - startAngle;

  const largeArcFlag = angle > 180 ? 1 : 0;

  return `
    M ${outerStart.x} ${outerStart.y}

    A ${outerRadius} ${outerRadius}
      0 ${largeArcFlag} 1
      ${outerEnd.x} ${outerEnd.y}

    L ${innerEnd.x} ${innerEnd.y}

    A ${innerRadius} ${innerRadius}
      0 ${largeArcFlag} 0
      ${innerStart.x} ${innerStart.y}

    Z
  `;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function SpendingDonutChart({
  data,
  title = "Subcategory Breakdown",
  description = "Detailed breakdown of spending by subcategory",
}: SpendingDonutChartProps) {
  const { theme } = useTheme();

  /* =======================================================
     STATE
  ======================================================= */

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    string | null
  >(null);

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  /* =======================================================
     CATEGORY LIST

     Build categories directly from the API response.

     API example:

     {
       categoryId: "...",
       categoryName: "Housing",
       icon: "house",
       color: "#10B981"
     }

     We keep the icon and color so the dropdown can
     display the actual category icon returned by backend.
  ======================================================= */

  const categories = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        icon?: string;
        color?: string;
      }
    >();

    data.forEach((item) => {
      if (!item.categoryId) {
        return;
      }

      if (!map.has(item.categoryId)) {
        map.set(item.categoryId, {
          id: item.categoryId,

          name: item.categoryName ?? "Unknown Category",

          icon: item.icon,

          color: item.color,
        });
      }
    });

    return Array.from(map.values());
  }, [data]);

  /* =======================================================
     DEFAULT CATEGORY
  ======================================================= */

  const activeCategoryId = selectedCategoryId ?? categories[0]?.id ?? null;

  /* =======================================================
     SELECTED CATEGORY
  ======================================================= */

  const selectedCategory = categories.find(
    (category) => category.id === activeCategoryId,
  );

  /* =======================================================
     FILTER SUBCATEGORIES
  ======================================================= */

  const filteredData = useMemo(() => {
    if (!activeCategoryId) {
      return [];
    }

    return data.filter((item) => item.categoryId === activeCategoryId);
  }, [data, activeCategoryId]);

  /* =======================================================
     TOTAL FOR SELECTED CATEGORY
  ======================================================= */

  const totalExpense = useMemo(
    () => filteredData.reduce((sum, item) => sum + item.amount, 0),
    [filteredData],
  );

  /* =======================================================
     SEGMENTS
  ======================================================= */

  const chartSize = 250;

  const center = chartSize / 2;

  const outerRadius = 96;

  const innerRadius = 62;

  const segmentGap = 1.5;

  const segments = useMemo(() => {
    if (!totalExpense) {
      return [];
    }

    let accumulatedAngle = 0;

    return filteredData.map((item) => {
      const percentage =
        totalExpense === 0 ? 0 : (item.amount / totalExpense) * 100;

      const angle = (percentage / 100) * 360;

      const startAngle = accumulatedAngle + segmentGap;

      const endAngle = accumulatedAngle + angle - segmentGap;

      accumulatedAngle += angle;

      return {
        ...item,

        percentage,

        startAngle,

        endAngle,
      };
    });
  }, [filteredData, totalExpense]);

  /* =======================================================
     SELECTED SUBCATEGORY
  ======================================================= */

  const selectedSubcategory = segments.find(
    (item) => item.subcategoryId === selectedSubcategoryId,
  );

  /* =======================================================
     CATEGORY CHANGE
  ======================================================= */

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);

    setSelectedSubcategoryId(null);

    setIsCategoryDropdownOpen(false);
  };

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!data.length) {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.surface,

            borderColor: theme.border,
          },
        ]}
      >
        <Header title={title} description={description} theme={theme} />

        <View style={styles.emptyState}>
          <FolderTree size={32} color={theme.textSecondary} strokeWidth={1.8} />

          <Text
            style={[
              styles.emptyTitle,
              {
                color: theme.text,
              },
            ]}
          >
            No spending data
          </Text>

          <Text
            style={[
              styles.emptyText,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            Subcategory data for this period will appear here.
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
          backgroundColor: theme.surface,

          borderColor: theme.border,
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
            borderBottomColor: theme.border,
          },
        ]}
      >
        <Header title={title} description={description} theme={theme} />

        {/* Total */}

        <View style={styles.totalSection}>
          <Text
            style={[
              styles.totalLabel,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            CATEGORY TOTAL
          </Text>

          <Text
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

      {/* =================================================
          CATEGORY DROPDOWN
      ================================================= */}

      <View style={styles.dropdownWrapper}>
        <Text
          style={[
            styles.dropdownLabel,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          CATEGORY
        </Text>

        <Pressable
          onPress={() => setIsCategoryDropdownOpen((previous) => !previous)}
          style={({ pressed }) => [
            styles.dropdownTrigger,

            {
              backgroundColor: theme.surfaceSecondary,

              borderColor: theme.border,
            },

            pressed && styles.dropdownPressed,
          ]}
        >
          <View style={styles.dropdownLeft}>
            {/* =========================================
                SELECTED CATEGORY ICON
            ========================================= */}

            <View
              style={[
                styles.dropdownIcon,
                {
                  backgroundColor: selectedCategory?.color
                    ? `${selectedCategory.color}18`
                    : theme.surface,
                },
              ]}
            >
              {selectedCategory?.icon ? (
                <CategoryIcon
                  name={selectedCategory.icon}
                  size={16}
                  color={selectedCategory.color ?? theme.text}
                />
              ) : (
                <FolderTree size={15} color={theme.text} strokeWidth={2} />
              )}
            </View>

            <Text
              numberOfLines={1}
              style={[
                styles.dropdownText,
                {
                  color: theme.text,
                },
              ]}
            >
              {selectedCategory?.name ?? "Select category"}
            </Text>
          </View>

          <ChevronDown size={17} color={theme.textSecondary} strokeWidth={2} />
        </Pressable>

        {/* =================================================
            DROPDOWN OPTIONS
        ================================================= */}

        {isCategoryDropdownOpen && (
          <View
            style={[
              styles.dropdownMenu,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                height: Math.min(categories.length * 48 + 8, 360),
              },
            ]}
          >
            <ScrollView
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
              bounces={false}
              keyboardShouldPersistTaps="handled"
              style={styles.dropdownScroll}
              contentContainerStyle={styles.dropdownScrollContent}
            >
              {categories.map((category) => {
                const isSelected = category.id === activeCategoryId;

                return (
                  <Pressable
                    key={category.id}
                    onPress={() => handleCategoryChange(category.id)}
                    style={({ pressed }) => [
                      styles.categoryOption,

                      isSelected && {
                        backgroundColor: theme.surfaceSecondary,
                      },

                      pressed && {
                        opacity: 0.7,
                      },
                    ]}
                  >
                    <View style={styles.categoryOptionLeft}>
                      <View
                        style={[
                          styles.categoryOptionIcon,
                          {
                            backgroundColor: category.color
                              ? `${category.color}18`
                              : theme.surfaceSecondary,
                          },
                        ]}
                      >
                        {category.icon ? (
                          <CategoryIcon
                            name={category.icon}
                            size={17}
                            color={category.color ?? theme.text}
                          />
                        ) : (
                          <FolderTree
                            size={16}
                            color={theme.text}
                            strokeWidth={2}
                          />
                        )}
                      </View>

                      <Text
                        numberOfLines={1}
                        style={[
                          styles.categoryOptionText,
                          {
                            color: theme.text,
                          },
                          isSelected && {
                            fontWeight: "800",
                          },
                        ]}
                      >
                        {category.name}
                      </Text>
                    </View>

                    {isSelected && (
                      <Check
                        size={16}
                        color={category.color ?? theme.text}
                        strokeWidth={2.5}
                      />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        )}
      </View>

      {/* =================================================
          CHART
      ================================================= */}

      {filteredData.length === 0 || totalExpense === 0 ? (
        <View style={styles.categoryEmptyState}>
          <FolderTree size={28} color={theme.textSecondary} strokeWidth={1.8} />

          <Text
            style={[
              styles.categoryEmptyTitle,
              {
                color: theme.text,
              },
            ]}
          >
            No subcategory spending
          </Text>

          <Text
            style={[
              styles.categoryEmptyText,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            There is no recorded spending for {selectedCategory?.name} during
            this period.
          </Text>
        </View>
      ) : (
        <>
          {/* =============================================
              DONUT
          ============================================= */}

          <Pressable
            style={styles.chartSection}
            onPress={() => setSelectedSubcategoryId(null)}
          >
            <View
              style={[
                styles.chartContainer,
                {
                  width: chartSize,

                  height: chartSize,
                },
              ]}
            >
              <Svg
                width={chartSize}
                height={chartSize}
                viewBox={`0 0 ${chartSize} ${chartSize}`}
              >
                {/* Background */}

                <Circle
                  cx={center}
                  cy={center}
                  r={(outerRadius + innerRadius) / 2}
                  stroke={theme.border}
                  strokeWidth={outerRadius - innerRadius}
                  fill="none"
                />

                {/* Segments */}

                {segments.map((segment) => {
                  const isSelected =
                    selectedSubcategoryId === segment.subcategoryId;

                  return (
                    <Path
                      key={segment.subcategoryId}
                      d={createDonutPath(
                        center,

                        isSelected ? outerRadius + 3 : outerRadius,

                        isSelected ? innerRadius - 3 : innerRadius,

                        segment.startAngle,

                        segment.endAngle,
                      )}
                      fill={segment.color || "#64748B"}
                      onPress={(event) => {
                        event.stopPropagation();

                        setSelectedSubcategoryId(segment.subcategoryId);
                      }}
                    />
                  );
                })}
              </Svg>

              {/* =========================================
                  CENTER
              ========================================= */}

              <View style={styles.donutCenter} pointerEvents="none">
                <Text
                  style={[
                    styles.centerLabel,
                    {
                      color: theme.textSecondary,
                    },
                  ]}
                >
                  SUBCATEGORIES
                </Text>

                <Text
                  style={[
                    styles.centerValue,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  {filteredData.length}
                </Text>
              </View>

              {/* =========================================
                  TOOLTIP
              ========================================= */}

              {selectedSubcategory && (
                <View
                  style={[
                    styles.tooltip,
                    {
                      backgroundColor: theme.surface,

                      borderColor: theme.border,
                    },
                  ]}
                  pointerEvents="none"
                >
                  <View style={styles.tooltipCategoryRow}>
                    <View
                      style={[
                        styles.tooltipDot,
                        {
                          backgroundColor:
                            selectedSubcategory.color || "#64748B",
                        },
                      ]}
                    />

                    <Text
                      numberOfLines={1}
                      style={[
                        styles.tooltipCategory,
                        {
                          color: theme.text,
                        },
                      ]}
                    >
                      {selectedSubcategory.subcategoryName}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.tooltipAmount,
                      {
                        color: theme.textSecondary,
                      },
                    ]}
                  >
                    {formatCurrency(selectedSubcategory.amount)}

                    <Text
                      style={[
                        styles.tooltipPercentage,
                        {
                          color: theme.textSecondary,
                        },
                      ]}
                    >
                      {" "}
                      ({selectedSubcategory.percentage.toFixed(1)}
                      %)
                    </Text>
                  </Text>
                </View>
              )}
            </View>
          </Pressable>

          {/* =============================================
              SCROLLABLE LEGEND
          ============================================= */}

          <View style={styles.legendContainer}>
            <Text
              style={[
                styles.legendTitle,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              SUBCATEGORIES
            </Text>

            <ScrollView
              style={styles.legendScroll}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.legendContent}
            >
              {segments.map((item) => {
                const isSelected = selectedSubcategoryId === item.subcategoryId;

                return (
                  <Pressable
                    key={item.subcategoryId}
                    onPress={() =>
                      setSelectedSubcategoryId(
                        isSelected ? null : item.subcategoryId,
                      )
                    }
                    style={[
                      styles.legendItem,

                      {
                        backgroundColor: theme.surfaceSecondary,

                        borderColor: theme.border,
                      },

                      isSelected && {
                        borderColor: item.color || theme.text,

                        backgroundColor: theme.surface,
                      },
                    ]}
                  >
                    {/* Left */}

                    <View style={styles.legendLeft}>
                      <View
                        style={[
                          styles.legendDot,
                          {
                            backgroundColor: item.color || "#64748B",
                          },
                        ]}
                      />

                      <Text
                        numberOfLines={1}
                        style={[
                          styles.legendName,
                          {
                            color: theme.text,
                          },
                        ]}
                      >
                        {item.subcategoryName}
                      </Text>
                    </View>

                    {/* Right */}

                    <View style={styles.legendRight}>
                      <Text
                        style={[
                          styles.percentage,
                          {
                            backgroundColor: theme.surface,

                            color: theme.textSecondary,
                          },
                        ]}
                      >
                        {item.percentage.toFixed(1)}%
                      </Text>

                      <Text
                        style={[
                          styles.amount,
                          {
                            color: theme.text,
                          },
                        ]}
                      >
                        {formatCurrency(item.amount)}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </>
      )}
    </View>
  );
}

/* =========================================================
   HEADER
========================================================= */

function Header({
  title,
  description,
  theme,
}: {
  title: string;

  description: string;

  theme: any;
}) {
  return (
    <View style={styles.headerLeft}>
      <View
        style={[
          styles.headerIcon,
          {
            backgroundColor: theme.surfaceSecondary,
          },
        ]}
      >
        <FolderTree size={21} color={theme.text} strokeWidth={2} />
      </View>

      <View style={styles.headerContent}>
        <Text
          style={[
            styles.title,
            {
              color: theme.text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          {description}
        </Text>
      </View>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
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

  header: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingBottom: 14,

    borderBottomWidth: 1,
  },

  headerLeft: {
    flex: 1,

    flexDirection: "row",

    alignItems: "center",

    marginRight: 10,

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

    marginLeft: 10,

    minWidth: 0,
  },

  title: {
    fontSize: 16,

    fontWeight: "800",

    lineHeight: 21,

    letterSpacing: -0.3,
  },

  description: {
    marginTop: 2,

    fontSize: 11,

    fontWeight: "500",

    lineHeight: 15,
  },

  totalSection: {
    minWidth: 82,

    alignItems: "flex-end",

    justifyContent: "center",
  },

  totalLabel: {
    fontSize: 8,

    fontWeight: "700",

    letterSpacing: 0.6,

    textAlign: "right",
  },

  totalAmount: {
    marginTop: 3,

    fontSize: 15,

    fontWeight: "800",
  },

  /* =====================================================
       DROPDOWN
    ===================================================== */
  dropdownWrapper: {
    position: "relative",

    zIndex: 100,

    marginTop: 14,

    /*
     * Do NOT use overflow: "hidden" here.
     *
     * Otherwise the absolute dropdown can get
     * clipped by the wrapper.
     */
  },

  dropdownLabel: {
    marginBottom: 5,

    fontSize: 9,

    fontWeight: "700",

    letterSpacing: 0.7,
  },

  dropdownTrigger: {
    height: 42,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 10,

    borderWidth: 1,

    borderRadius: 12,
  },

  dropdownPressed: {
    opacity: 0.75,
  },

  dropdownLeft: {
    flex: 1,

    flexDirection: "row",

    alignItems: "center",

    minWidth: 0,
  },

  dropdownIcon: {
    width: 28,

    height: 28,

    borderRadius: 8,

    alignItems: "center",

    justifyContent: "center",

    marginRight: 8,
  },

  dropdownText: {
    flex: 1,

    fontSize: 12,

    fontWeight: "700",
  },

  /* =====================================================
   DROPDOWN MENU
===================================================== */

  dropdownMenu: {
    position: "absolute",

    top: 67,

    left: 0,

    right: 0,

    /*
     * IMPORTANT:
     *
     * Height is supplied dynamically from JSX.
     *
     * Example:
     *
     * 7 categories:
     * 7 × 48 + 8 = 344px
     *
     * 10 categories:
     * 10 × 48 + 8 = 408px
     * but capped at 360px.
     */

    borderWidth: 1,

    borderRadius: 14,

    overflow: "hidden",

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,

      height: 8,
    },

    shadowOpacity: 0.18,

    shadowRadius: 14,

    elevation: 15,

    zIndex: 1000,
  },

  dropdownScroll: {
    flex: 1,

    width: "100%",
  },

  dropdownScrollContent: {
    paddingVertical: 4,
  },

  /* =====================================================
   CATEGORY OPTION
===================================================== */

  categoryOption: {
    minHeight: 48,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 12,

    paddingVertical: 8,
  },

  categoryOptionLeft: {
    flex: 1,

    flexDirection: "row",

    alignItems: "center",

    minWidth: 0,

    marginRight: 10,
  },

  categoryOptionIcon: {
    width: 32,

    height: 32,

    borderRadius: 9,

    alignItems: "center",

    justifyContent: "center",

    marginRight: 9,
  },

  categoryOptionText: {
    flex: 1,

    fontSize: 12,

    fontWeight: "600",
  },
  /* =====================================================
       CHART
    ===================================================== */

  chartSection: {
    width: "100%",

    alignItems: "center",

    justifyContent: "center",

    paddingTop: 18,
  },

  chartContainer: {
    position: "relative",

    alignItems: "center",

    justifyContent: "center",
  },

  donutCenter: {
    position: "absolute",

    alignItems: "center",

    justifyContent: "center",
  },

  centerLabel: {
    fontSize: 9,

    fontWeight: "700",

    letterSpacing: 0.8,
  },

  centerValue: {
    marginTop: 2,

    fontSize: 23,

    fontWeight: "800",
  },

  tooltip: {
    position: "absolute",

    left: 10,

    top: 42,

    minWidth: 145,

    maxWidth: 175,

    paddingHorizontal: 12,

    paddingVertical: 10,

    borderRadius: 14,

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

  tooltipCategoryRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 7,
  },

  tooltipDot: {
    width: 9,

    height: 9,

    borderRadius: 5,
  },

  tooltipCategory: {
    flexShrink: 1,

    fontSize: 12,

    fontWeight: "800",
  },

  tooltipAmount: {
    marginTop: 6,

    fontSize: 11,

    fontWeight: "600",
  },

  tooltipPercentage: {
    fontSize: 10,

    fontWeight: "500",
  },

  /* =====================================================
       LEGEND
    ===================================================== */

  legendContainer: {
    marginTop: 12,
  },

  legendTitle: {
    marginBottom: 6,

    fontSize: 9,

    fontWeight: "700",

    letterSpacing: 0.7,
  },

  legendScroll: {
    maxHeight: 210,
  },

  legendContent: {
    gap: 8,

    paddingBottom: 2,
  },

  legendItem: {
    minHeight: 42,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 10,

    paddingVertical: 8,

    borderRadius: 12,

    borderWidth: 1,
  },

  legendLeft: {
    flex: 1,

    flexDirection: "row",

    alignItems: "center",

    marginRight: 10,

    minWidth: 0,
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

    fontSize: 9,

    fontWeight: "700",
  },

  amount: {
    fontSize: 12,

    fontWeight: "800",
  },

  /* =====================================================
       EMPTY
    ===================================================== */

  categoryEmptyState: {
    minHeight: 250,

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 20,

    paddingTop: 18,
  },

  categoryEmptyTitle: {
    marginTop: 10,

    fontSize: 13,

    fontWeight: "700",

    textAlign: "center",
  },

  categoryEmptyText: {
    marginTop: 4,

    fontSize: 11,

    fontWeight: "500",

    lineHeight: 16,

    textAlign: "center",
  },

  emptyState: {
    minHeight: 300,

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 20,
  },

  emptyTitle: {
    marginTop: 10,

    fontSize: 13,

    fontWeight: "700",
  },

  emptyText: {
    marginTop: 3,

    fontSize: 11,

    fontWeight: "500",

    lineHeight: 16,

    textAlign: "center",
  },
});
