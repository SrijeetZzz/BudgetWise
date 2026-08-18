
import {
  ArrowDownRight,
  ArrowUpRight,
  Scale,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react-native";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  DashboardSummary,
} from "../../../types/dashboard.types";

import { useTheme } from "../../../providers/ThemeProvider";

/* =========================================================
   TYPES
========================================================= */

interface DashboardSummaryCardsProps {
  summary: DashboardSummary;
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
   COMPONENT
========================================================= */

export default function DashboardSummaryCards({
  summary,
}: DashboardSummaryCardsProps) {
  const { theme } = useTheme();

  const isPositiveBalance =
    summary.balance >= 0;

  // Determine if theme is dark by checking background color brightness
  const isDark = theme.background.toLowerCase() < "#808080";

  /*
   * =======================================================
   * SEMANTIC COLORS
   *
   * These colors intentionally remain meaningful in both
   * themes. The surrounding surfaces/borders/text use the
   * application theme.
   * =======================================================
   */

  const incomeColors = {
    iconBackground: isDark
      ? "#123326"
      : "#ECFDF5",

    iconColor: "#059669",

    badgeBackground: isDark
      ? "#123326"
      : "#ECFDF5",

    badgeBorder: isDark
      ? "#245A45"
      : "#A7F3D0",

    badgeColor: isDark
      ? "#6EE7B7"
      : "#047857",

    valueColor: isDark
      ? "#6EE7B7"
      : "#059669",
  };

  const expenseColors = {
    iconBackground: isDark
      ? "#351B1B"
      : "#FEF2F2",

    iconColor: "#DC2626",

    badgeBackground: isDark
      ? "#351B1B"
      : "#FEF2F2",

    badgeBorder: isDark
      ? "#633131"
      : "#FECACA",

    badgeColor: isDark
      ? "#FCA5A5"
      : "#B91C1C",

    valueColor: isDark
      ? "#F87171"
      : "#DC2626",
  };

  const balanceColors = isPositiveBalance
    ? {
        iconBackground: theme.muted,

        iconColor: theme.text,

        valueColor: theme.text,

        badgeBackground:
          theme.muted,

        badgeBorder:
          theme.border,

        badgeColor:
          theme.text,
      }
    : {
        iconBackground: isDark
          ? "#351B1B"
          : "#FEF2F2",

        iconColor: "#DC2626",

        valueColor: isDark
          ? "#F87171"
          : "#DC2626",

        badgeBackground:
          isDark
            ? "#351B1B"
            : "#FEF2F2",

        badgeBorder:
          isDark
            ? "#633131"
            : "#FECACA",

        badgeColor:
          isDark
            ? "#FCA5A5"
            : "#B91C1C",
      };

  /* =======================================================
     CARDS
  ======================================================= */

  const cards = [
    {
      title: "Income",

      value: summary.totalIncome,

      icon: ArrowUpRight,

      badgeIcon: TrendingUp,

      ...incomeColors,

      badgeText: "Inflow",
    },

    {
      title: "Expense",

      value: summary.totalExpense,

      icon: ArrowDownRight,

      badgeIcon: TrendingDown,

      ...expenseColors,

      badgeText: "Outflow",
    },

    {
      title: "Balance",

      value: summary.balance,

      icon: Wallet,

      badgeIcon: Scale,

      ...balanceColors,

      badgeText: isPositiveBalance
        ? "Surplus"
        : "Deficit",
    },
  ];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <View style={styles.container}>
      {cards.map((card) => {
        const Icon = card.icon;
        const BadgeIcon =
          card.badgeIcon;

        return (
          <View
            key={card.title}
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
                ICON
            ================================================= */}

            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor:
                    card.iconBackground,

                  borderColor:
                    card.iconColor + "33",
                },
              ]}
            >
              <Icon
                size={18}
                color={card.iconColor}
                strokeWidth={2.4}
              />
            </View>

            {/* =================================================
                TITLE
            ================================================= */}

            <Text
              numberOfLines={1}
              style={[
                styles.title,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              {card.title}
            </Text>

            {/* =================================================
                AMOUNT
            ================================================= */}

            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.65}
              style={[
                styles.value,
                {
                  color:
                    card.valueColor,
                },
              ]}
            >
              {formatCurrency(
                card.value,
              )}
            </Text>

            {/* =================================================
                BADGE
            ================================================= */}

            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    card.badgeBackground,

                  borderColor:
                    card.badgeBorder,
                },
              ]}
            >
              <BadgeIcon
                size={10}
                color={card.badgeColor}
                strokeWidth={2.5}
              />

              <Text
                numberOfLines={1}
                style={[
                  styles.badgeText,
                  {
                    color:
                      card.badgeColor,
                  },
                ]}
              >
                {card.badgeText}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  /* =======================================================
     CONTAINER
  ======================================================= */

  container: {
    width: "100%",

    flexDirection: "row",

    gap: 8,
  },

  /* =======================================================
     CARD
  ======================================================= */

  card: {
    flex: 1,

    minWidth: 0,

    paddingHorizontal: 10,

    paddingVertical: 12,

    borderRadius: 16,

    borderWidth: 1,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,

      height: 2,
    },

    shadowOpacity: 0.05,

    shadowRadius: 5,

    elevation: 2,
  },

  /* =======================================================
     ICON
  ======================================================= */

  iconContainer: {
    width: 32,

    height: 32,

    borderRadius: 10,

    alignItems: "center",

    justifyContent: "center",

    borderWidth: 1,

    marginBottom: 9,
  },

  /* =======================================================
     TITLE
  ======================================================= */

  title: {
    fontSize: 9,

    fontWeight: "700",

    letterSpacing: 0.7,

    textTransform: "uppercase",
  },

  /* =======================================================
     VALUE
  ======================================================= */

  value: {
    marginTop: 4,

    fontSize: 17,

    fontWeight: "800",

    letterSpacing: -0.4,
  },

  /* =======================================================
     BADGE
  ======================================================= */

  badge: {
    alignSelf: "flex-start",

    flexDirection: "row",

    alignItems: "center",

    gap: 3,

    marginTop: 8,

    paddingHorizontal: 6,

    paddingVertical: 3,

    borderRadius: 999,

    borderWidth: 1,
  },

  badgeText: {
    fontSize: 8,

    fontWeight: "700",
  },
});