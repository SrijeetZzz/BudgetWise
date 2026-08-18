
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Wallet,
} from "lucide-react-native";

import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  DashboardBudgetAlert,
  DashboardCategory,
} from "../../../types/dashboard.types";

import { useTheme } from "../../../providers/ThemeProvider";

interface BudgetAlertsProps {
  alerts: DashboardBudgetAlert[];
}

/* =========================================================
   HELPERS
========================================================= */

function getCategory(
  value:
    | string
    | DashboardCategory
    | null
    | undefined,
) {
  if (
    !value ||
    typeof value === "string"
  ) {
    return null;
  }

  return value;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getBudgetName(
  alert: DashboardBudgetAlert,
) {
  const category = getCategory(
    alert.categoryId,
  );

  const subcategory = getCategory(
    alert.subcategoryId,
  );

  if (alert.scope === "OVERALL") {
    return "Overall Budget";
  }

  if (
    alert.scope === "SUBCATEGORY" &&
    subcategory
  ) {
    return subcategory.name;
  }

  return (
    category?.name ??
    "Category Budget"
  );
}

function getAlertMessage(
  threshold: number,
) {
  if (threshold >= 100) {
    return "Budget exceeded";
  }

  if (threshold >= 90) {
    return "Budget almost exhausted";
  }

  if (threshold >= 75) {
    return "Budget usage is high";
  }

  return "Threshold reached";
}

/* =========================================================
   COMPONENT
========================================================= */

export default function BudgetAlerts({
  alerts,
}: BudgetAlertsProps) {
  const { theme, isDark } = useTheme();

  /* =======================================================
     SEMANTIC COLORS
  ======================================================= */

  const warningColor = isDark
    ? "#FBBF24"
    : "#D97706";

  const warningTextColor = isDark
    ? "#FCD34D"
    : "#B45309";

  const warningBackground = isDark
    ? "#29220F"
    : "#FFFBEB";

  const warningBorder = isDark
    ? "#5C4710"
    : "#FDE68A";

  const dangerColor = isDark
    ? "#F87171"
    : "#DC2626";

  const dangerBackground = isDark
    ? "#2A1515"
    : "#FEF2F2";

  const dangerBorder = isDark
    ? "#5F2020"
    : "#FECACA";

  const successColor = isDark
    ? "#34D399"
    : "#059669";

  const successBackground = isDark
    ? "#102A20"
    : "#ECFDF5";

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  if (!alerts.length) {
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
          <View style={styles.headerLeft}>
            <View
              style={[
                styles.headerIcon,
                {
                  backgroundColor:
                    warningBackground,
                },
              ]}
            >
              <Bell
                size={20}
                color={warningColor}
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
                Budget Alerts
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
                Budgets approaching or
                exceeding limits
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            EMPTY
        ================================================= */}

        <View style={styles.emptyState}>
          <View
            style={[
              styles.successIcon,
              {
                backgroundColor:
                  successBackground,
              },
            ]}
          >
            <CheckCircle2
              size={28}
              color={successColor}
              strokeWidth={2}
            />
          </View>

          <Text
            style={[
              styles.emptyTitle,
              {
                color: theme.text,
              },
            ]}
          >
            All budgets on track
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
            No budget alerts triggered
            for this period.
          </Text>
        </View>
      </View>
    );
  }

  /* =======================================================
     ALERT CARD
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
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor:
                  warningBackground,
              },
            ]}
          >
            <Bell
              size={21}
              color={warningColor}
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
              Budget Alerts
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
              Budgets approaching or
              exceeding limits
            </Text>
          </View>
        </View>

        {/* =================================================
            ACTIVE COUNT
        ================================================= */}

        <View
          style={[
            styles.activeBadge,
            {
              backgroundColor:
                warningBackground,

              borderColor:
                warningBorder,
            },
          ]}
        >
          <AlertTriangle
            size={11}
            color={warningTextColor}
            strokeWidth={2.5}
          />

          <Text
            style={[
              styles.activeBadgeText,
              {
                color:
                  warningTextColor,
              },
            ]}
          >
            {alerts.length} Active
          </Text>
        </View>
      </View>

      {/* =================================================
          ALERT LIST

          IMPORTANT:
          Normal View instead of ScrollView.
          Height is now determined entirely
          by the number of alerts.
      ================================================= */}

      <View style={styles.alertList}>
        {alerts.map((alert) => {
          const threshold =
            alert.lastAlertThreshold;

          const exceeded =
            threshold >= 100 ||
            alert.spentAmount >
              alert.budgetAmount;

          const utilization = Math.min(
            Math.max(
              alert.utilization,
              0,
            ),
            100,
          );

          return (
            <View
              key={alert._id}
              style={[
                styles.alertItem,
                {
                  borderBottomColor:
                    theme.border,
                },
              ]}
            >
              {/* =================================================
                  ALERT TOP
              ================================================= */}

              <View
                style={styles.alertTop}
              >
                <View
                  style={styles.alertInfo}
                >
                  {/* =========================================
                      ICON
                  ========================================= */}

                  <View
                    style={[
                      styles.alertIcon,
                      exceeded
                        ? {
                            backgroundColor:
                              dangerBackground,

                            borderColor:
                              dangerBorder,
                          }
                        : {
                            backgroundColor:
                              warningBackground,

                            borderColor:
                              warningBorder,
                          },
                    ]}
                  >
                    {exceeded ? (
                      <AlertTriangle
                        size={19}
                        color={
                          dangerColor
                        }
                        strokeWidth={2}
                      />
                    ) : (
                      <Wallet
                        size={19}
                        color={
                          warningColor
                        }
                        strokeWidth={2}
                      />
                    )}
                  </View>

                  {/* =========================================
                      DETAILS
                  ========================================= */}

                  <View
                    style={
                      styles.alertDetails
                    }
                  >
                    <View
                      style={
                        styles.nameRow
                      }
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.budgetName,
                          {
                            color:
                              theme.text,
                          },
                        ]}
                      >
                        {getBudgetName(
                          alert,
                        )}
                      </Text>

                      <View
                        style={[
                          styles.messageBadge,
                          exceeded
                            ? {
                                backgroundColor:
                                  dangerBackground,
                              }
                            : {
                                backgroundColor:
                                  warningBackground,
                              },
                        ]}
                      >
                        <Text
                          style={[
                            styles.messageText,
                            {
                              color:
                                exceeded
                                  ? dangerColor
                                  : warningTextColor,
                            },
                          ]}
                        >
                          {getAlertMessage(
                            threshold,
                          )}
                        </Text>
                      </View>
                    </View>

                    {/* =======================================
                        SPENT / BUDGET
                    ======================================= */}

                    <View
                      style={
                        styles.amountRow
                      }
                    >
                      <Text
                        style={[
                          styles.amountInfo,
                          {
                            color:
                              theme.textSecondary,
                          },
                        ]}
                      >
                        Spent:{" "}
                        <Text
                          style={[
                            styles.amountStrong,
                            {
                              color:
                                theme.text,
                            },
                          ]}
                        >
                          {formatCurrency(
                            alert.spentAmount,
                          )}
                        </Text>
                      </Text>

                      <Text
                        style={[
                          styles.separator,
                          {
                            color:
                              theme.textSecondary,
                          },
                        ]}
                      >
                        •
                      </Text>

                      <Text
                        style={[
                          styles.amountInfo,
                          {
                            color:
                              theme.textSecondary,
                          },
                        ]}
                      >
                        Budget:{" "}
                        <Text
                          style={[
                            styles.amountStrong,
                            {
                              color:
                                theme.text,
                            },
                          ]}
                        >
                          {formatCurrency(
                            alert.budgetAmount,
                          )}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>

                {/* =================================================
                    UTILIZATION
                ================================================= */}

                <View
                  style={
                    styles.utilizationSection
                  }
                >
                  <Text
                    style={[
                      styles.utilization,
                      {
                        color: exceeded
                          ? dangerColor
                          : theme.text,
                      },
                    ]}
                  >
                    {alert.utilization.toFixed(
                      1,
                    )}
                    %
                  </Text>

                  <Text
                    style={[
                      styles.usedLabel,
                      {
                        color:
                          theme.textSecondary,
                      },
                    ]}
                  >
                    USED
                  </Text>
                </View>
              </View>

              {/* =================================================
                  PROGRESS BAR
              ================================================= */}

              <View
                style={[
                  styles.progressTrack,
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
                      width: `${utilization}%`,
                      backgroundColor:
                        exceeded
                          ? dangerColor
                          : warningColor,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  /* =======================================================
     CARD

     NO FIXED HEIGHT.
     The card grows according to its content.
  ======================================================= */

  card: {
    width: "100%",

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

    overflow: "hidden",
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent:
      "space-between",

    padding: 18,

    borderBottomWidth: 1,
  },

  headerLeft: {
    flex: 1,

    flexDirection: "row",

    alignItems: "center",

    marginRight: 10,
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

  /* =======================================================
     ACTIVE BADGE
  ======================================================= */

  activeBadge: {
    flexDirection: "row",

    alignItems: "center",

    gap: 4,

    paddingHorizontal: 9,

    paddingVertical: 5,

    borderRadius: 999,

    borderWidth: 1,
  },

  activeBadgeText: {
    fontSize: 10,

    fontWeight: "800",
  },

  /* =======================================================
     ALERT LIST

     NO flex: 1.
     NO fixed height.
  ======================================================= */

  alertList: {
    width: "100%",
  },

  /* =======================================================
     ALERT ITEM
  ======================================================= */

  alertItem: {
    padding: 16,

    borderBottomWidth: 1,
  },

  alertTop: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    gap: 10,
  },

  alertInfo: {
    flex: 1,

    flexDirection: "row",

    minWidth: 0,
  },

  /* =======================================================
     ALERT ICON
  ======================================================= */

  alertIcon: {
    width: 40,

    height: 40,

    borderRadius: 12,

    alignItems: "center",

    justifyContent: "center",

    marginRight: 10,

    borderWidth: 1,
  },

  /* =======================================================
     ALERT DETAILS
  ======================================================= */

  alertDetails: {
    flex: 1,

    minWidth: 0,

    justifyContent: "center",
  },

  nameRow: {
    flexDirection: "row",

    alignItems: "center",

    flexWrap: "wrap",

    gap: 6,
  },

  budgetName: {
    maxWidth: 120,

    fontSize: 12,

    fontWeight: "800",
  },

  messageBadge: {
    paddingHorizontal: 6,

    paddingVertical: 3,

    borderRadius: 6,
  },

  messageText: {
    fontSize: 8,

    fontWeight: "800",
  },

  /* =======================================================
     AMOUNT
  ======================================================= */

  amountRow: {
    flexDirection: "row",

    alignItems: "center",

    flexWrap: "wrap",

    marginTop: 5,

    gap: 5,
  },

  amountInfo: {
    fontSize: 10,

    fontWeight: "500",
  },

  amountStrong: {
    fontWeight: "800",
  },

  separator: {
    fontSize: 10,
  },

  /* =======================================================
     UTILIZATION
  ======================================================= */

  utilizationSection: {
    minWidth: 48,

    alignItems: "flex-end",
  },

  utilization: {
    fontSize: 14,

    fontWeight: "900",
  },

  usedLabel: {
    marginTop: 1,

    fontSize: 8,

    fontWeight: "700",

    letterSpacing: 0.7,
  },

  /* =======================================================
     PROGRESS
  ======================================================= */

  progressTrack: {
    width: "100%",

    height: 6,

    marginTop: 12,

    overflow: "hidden",

    borderRadius: 999,
  },

  progressBar: {
    height: "100%",

    borderRadius: 999,
  },

  /* =======================================================
     EMPTY STATE

     No flex: 1.
     No minHeight.
     It now sizes naturally based on its content.
  ======================================================= */

  emptyState: {
    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 30,

    paddingVertical: 42,
  },

  successIcon: {
    width: 56,

    height: 56,

    borderRadius: 28,

    alignItems: "center",

    justifyContent: "center",
  },

  emptyTitle: {
    marginTop: 12,

    fontSize: 14,

    fontWeight: "800",
  },

  emptyText: {
    marginTop: 4,

    fontSize: 11,

    fontWeight: "500",

    textAlign: "center",
  },
});