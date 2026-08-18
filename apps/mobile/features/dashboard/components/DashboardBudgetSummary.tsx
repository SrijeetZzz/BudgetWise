
import {
  AlertTriangle,
  CheckCircle2,
  FolderTree,
  Layers,
  PieChart,
} from "lucide-react-native";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  DashboardBudgetSummary,
  DashboardBudgetSummaryItem,
} from "../../../types/dashboard.types";

import { useTheme } from "../../../providers/ThemeProvider";

interface DashboardBudgetSummaryProps {
  budgetSummary: DashboardBudgetSummary;
}

interface BudgetSummaryCardProps {
  title: string;
  data: DashboardBudgetSummaryItem;
  icon: typeof PieChart;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function BudgetSummaryCard({
  title,
  data,
  icon: Icon,
}: BudgetSummaryCardProps) {
  const { theme, isDark } = useTheme();

  const isOverBudget =
    data.overBudgetCount > 0;

  const percentUsed =
    data.totalBudgetAmount > 0
      ? Math.min(
          Math.round(
            (data.totalSpent /
              data.totalBudgetAmount) *
              100,
          ),
          100,
        )
      : 0;

  /*
   * =========================================================
   * SEMANTIC COLORS
   * =========================================================
   */

  const dangerColor = isDark
    ? "#F87171"
    : "#DC2626";

  const dangerBackground = isDark
    ? "#2A1515"
    : "#FEF2F2";

  const dangerBorder = isDark
    ? "#5F2020"
    : "#FECACA";

  const warningColor = isDark
    ? "#FBBF24"
    : "#F59E0B";

  const successColor = isDark
    ? "#34D399"
    : "#10B981";

  /*
   * =========================================================
   * PROGRESS COLOR
   * =========================================================
   */

  const getProgressColor = () => {
    if (
      isOverBudget ||
      percentUsed >= 100
    ) {
      return dangerColor;
    }

    if (percentUsed >= 85) {
      return warningColor;
    }

    return successColor;
  };

  const progressColor =
    getProgressColor();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor:
            isOverBudget
              ? dangerBackground
              : theme.surface,

          borderColor:
            isOverBudget
              ? dangerBorder
              : theme.border,
        },
      ]}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <View style={styles.cardHeader}>
        <View style={styles.titleSection}>
          <Text
            style={[
              styles.cardTitle,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            {title}
          </Text>

          <Text
            style={[
              styles.totalAmount,
              {
                color: theme.text,
              },
            ]}
          >
            {formatCurrency(
              data.totalBudgetAmount,
            )}
          </Text>

          <Text
            style={[
              styles.allocatedText,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            Total Allocated
          </Text>
        </View>

        {/* Icon */}

        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor:
                isOverBudget
                  ? dangerBackground
                  : theme.textSecondary,

              borderColor:
                isOverBudget
                  ? dangerBorder
                  : theme.border,
            },
          ]}
        >
          <Icon
            size={20}
            color={
              isOverBudget
                ? dangerColor
                : theme.text
            }
            strokeWidth={2.2}
          />
        </View>
      </View>

      {/* =================================================
          USAGE
      ================================================= */}

      <View style={styles.usageSection}>
        <View style={styles.usageHeader}>
          <Text
            style={[
              styles.usageLabel,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            Usage
          </Text>

          <Text
            style={[
              styles.usagePercentage,
              {
                color: isOverBudget
                  ? dangerColor
                  : theme.text,
              },
            ]}
          >
            {percentUsed}%
          </Text>
        </View>

        {/* Progress background */}

        <View
          style={[
            styles.progressBackground,
            {
              backgroundColor:
                theme.textSecondary,
            },
          ]}
        >
          <View
            style={[
              styles.progressBar,
              {
                width: `${percentUsed}%`,
                backgroundColor:
                  progressColor,
              },
            ]}
          />
        </View>
      </View>

      {/* =================================================
          METRICS
      ================================================= */}

      <View style={styles.metricsGrid}>
        {/* Spent */}

        <View
          style={[
            styles.metricCard,
            {
              backgroundColor:
                theme.surfaceSecondary,

              borderColor:
                theme.border,
            },
          ]}
        >
          <Text
            style={[
              styles.metricLabel,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            Spent
          </Text>

          <Text
            style={[
              styles.metricValue,
              {
                color: theme.text,
              },
            ]}
          >
            {formatCurrency(
              data.totalSpent,
            )}
          </Text>
        </View>

        {/* Remaining */}

        <View
          style={[
            styles.metricCard,
            {
              backgroundColor:
                theme.surfaceSecondary,

              borderColor:
                theme.border,
            },
          ]}
        >
          <Text
            style={[
              styles.metricLabel,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            Remaining
          </Text>

          <Text
            style={[
              styles.metricValue,
              {
                color:
                  data.totalRemaining < 0
                    ? dangerColor
                    : successColor,
              },
            ]}
          >
            {formatCurrency(
              data.totalRemaining,
            )}
          </Text>
        </View>
      </View>

      {/* =================================================
          FOOTER
      ================================================= */}

      <View
        style={[
          styles.footer,
          {
            borderTopColor:
              theme.border,
          },
        ]}
      >
        <View style={styles.activeSection}>
          <CheckCircle2
            size={14}
            color={successColor}
            strokeWidth={2.3}
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
            {data.activeBudgets} Active
          </Text>
        </View>

        {isOverBudget ? (
          <View
            style={styles.overLimitSection}
          >
            <AlertTriangle
              size={14}
              color={dangerColor}
              strokeWidth={2.3}
            />

            <Text
              style={[
                styles.overLimitText,
                {
                  color: dangerColor,
                },
              ]}
            >
              {data.overBudgetCount} Over
              Limit
            </Text>
          </View>
        ) : (
          <Text
            style={[
              styles.onTrackText,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            On Track
          </Text>
        )}
      </View>
    </View>
  );
}

export default function DashboardBudgetSummary({
  budgetSummary,
}: DashboardBudgetSummaryProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* =================================================
          SECTION HEADER
      ================================================= */}

      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.text,
            },
          ]}
        >
          Budget Overview
        </Text>

        <Text
          style={[
            styles.sectionDescription,
            {
              color:
                theme.textSecondary,
            },
          ]}
        >
          Current budget allocation and
          spending status across tiers
        </Text>
      </View>

      {/* =================================================
          BUDGET CARDS
      ================================================= */}

      <View style={styles.cardsContainer}>
        <BudgetSummaryCard
          title="Overall"
          data={budgetSummary.overall}
          icon={PieChart}
        />

        <BudgetSummaryCard
          title="Categories"
          data={budgetSummary.category}
          icon={Layers}
        />

        <BudgetSummaryCard
          title="Subcategories"
          data={
            budgetSummary.subcategory
          }
          icon={FolderTree}
        />
      </View>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  sectionHeader: {
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 17,

    fontWeight: "800",

    letterSpacing: -0.3,
  },

  sectionDescription: {
    marginTop: 3,

    fontSize: 11,

    fontWeight: "500",
  },

  cardsContainer: {
    gap: 12,
  },

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

  cardHeader: {
    flexDirection: "row",

    alignItems: "flex-start",

    justifyContent: "space-between",
  },

  titleSection: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 11,

    fontWeight: "700",

    letterSpacing: 1,

    textTransform: "uppercase",
  },

  totalAmount: {
    marginTop: 5,

    fontSize: 24,

    fontWeight: "800",

    letterSpacing: -0.5,
  },

  allocatedText: {
    marginTop: 2,

    fontSize: 10,

    fontWeight: "500",
  },

  iconContainer: {
    width: 42,

    height: 42,

    borderRadius: 13,

    alignItems: "center",

    justifyContent: "center",

    borderWidth: 1,
  },

  usageSection: {
    marginTop: 16,
  },

  usageHeader: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 6,
  },

  usageLabel: {
    fontSize: 11,

    fontWeight: "600",
  },

  usagePercentage: {
    fontSize: 11,

    fontWeight: "800",
  },

  progressBackground: {
    width: "100%",

    height: 8,

    overflow: "hidden",

    borderRadius: 999,
  },

  progressBar: {
    height: "100%",

    borderRadius: 999,
  },

  metricsGrid: {
    flexDirection: "row",

    gap: 10,

    marginTop: 15,
  },

  metricCard: {
    flex: 1,

    padding: 11,

    borderRadius: 12,

    borderWidth: 1,
  },

  metricLabel: {
    fontSize: 10,

    fontWeight: "700",

    textTransform: "uppercase",

    letterSpacing: 0.8,
  },

  metricValue: {
    marginTop: 3,

    fontSize: 13,

    fontWeight: "800",
  },

  footer: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginTop: 15,

    paddingTop: 12,

    borderTopWidth: 1,
  },

  activeSection: {
    flexDirection: "row",

    alignItems: "center",

    gap: 5,
  },

  activeText: {
    fontSize: 11,

    fontWeight: "600",
  },

  overLimitSection: {
    flexDirection: "row",

    alignItems: "center",

    gap: 5,
  },

  overLimitText: {
    fontSize: 11,

    fontWeight: "700",
  },

  onTrackText: {
    fontSize: 10,

    fontWeight: "600",
  },
});