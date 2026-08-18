
import {
  CalendarDays,
  MoreHorizontal,
  Pencil,
  Repeat,
  Trash2,
  Wallet,
  X,
} from "lucide-react-native";

import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { useState } from "react";

import type { Budget, BudgetCategory } from "../../../types/budget.types";

import { EditBudgetSheet } from "./Edit-budget-sheet";
import { EditBudgetRecurrenceSheet } from "./Edit-budget-recurrence-sheet";
import { DeleteBudgetSheet } from "./Delete-budget-sheet";
import { useTheme } from "../../../providers/ThemeProvider";

/*
 * =========================================================
 * PROPS
 * =========================================================
 */

interface BudgetCardProps {
  budget: Budget;
}

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function getCategory(
  value: string | BudgetCategory | null | undefined,
): BudgetCategory | null {
  if (!value || typeof value === "string") {
    return null;
  }

  return value;
}

function formatCurrency(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/*
 * =========================================================
 * COMPONENT
 * =========================================================
 */

export function BudgetCard({ budget }: BudgetCardProps) {
  const { theme } = useTheme();

  /*
   * =======================================================
   * SHEET STATE
   * =======================================================
   */

  const [actionSheetOpen, setActionSheetOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [recurrenceEditOpen, setRecurrenceEditOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);

  /*
   * =======================================================
   * CATEGORY
   * =======================================================
   */

  const category = getCategory(budget.categoryId);

  const subcategory = getCategory(budget.subcategoryId);

  /*
   * =======================================================
   * UTILIZATION
   * =======================================================
   */

  const utilization = Math.min(Math.max(budget.utilization, 0), 100);

  const isExceeded = budget.spentAmount > budget.budgetAmount;

  /*
   * =======================================================
   * RECURRING BUDGET LOGIC
   * =======================================================
   */

  const isRecurringBudget = Boolean(
    budget.recurrence?.enabled || budget.recurrence?.rootBudgetId,
  );

  const isRecurrenceRoot = Boolean(
    budget.recurrence?.enabled && budget.recurrence.rootBudgetId === budget._id,
  );

  /*
   * =======================================================
   * ACTION HANDLERS
   * =======================================================
   */

  const handleOpenActions = () => {
    setActionSheetOpen(true);
  };

  const handleEditBudget = () => {
    setActionSheetOpen(false);

    setTimeout(() => {
      setEditOpen(true);
    }, 150);
  };

  const handleEditRecurrence = () => {
    setActionSheetOpen(false);

    setTimeout(() => {
      setRecurrenceEditOpen(true);
    }, 150);
  };

  const handleDeleteBudget = () => {
    setActionSheetOpen(false);

    setTimeout(() => {
      setDeleteOpen(true);
    }, 150);
  };

  /*
   * =======================================================
   * RENDER
   * =======================================================
   */

  return (
    <>
      {/* ===================================================
          BUDGET CARD
      =================================================== */}

      <View
        style={[
          styles.card,
          {
            borderColor: theme.border,
            backgroundColor: theme.surface,
          },
        ]}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Wallet Icon */}

            <View
              style={[
                styles.walletIcon,
                {
                  backgroundColor: theme.surfaceSecondary,
                },
              ]}
            >
              <Wallet size={17} color={theme.text} strokeWidth={2.2} />
            </View>

            {/* Budget Name */}

            <View style={styles.nameContainer}>
              <Text
                numberOfLines={1}
                style={[
                  styles.budgetName,
                  {
                    color: theme.text,
                  },
                ]}
              >
                {budget.scope === "OVERALL"
                  ? "Overall Budget"
                  : (category?.name ?? "Category Budget")}
              </Text>

              {subcategory && (
                <Text
                  numberOfLines={1}
                  style={[
                    styles.subcategory,
                    {
                      color: theme.textSecondary,
                    },
                  ]}
                >
                  {subcategory.name}
                </Text>
              )}
            </View>
          </View>

          {/* Actions */}

          <Pressable
            onPress={handleOpenActions}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Budget actions"
            style={({ pressed }) => [
              styles.moreButton,
              pressed && {
                backgroundColor: theme.surfaceSecondary,
              },
              pressed && styles.moreButtonPressed,
            ]}
          >
            <MoreHorizontal
              size={19}
              color={theme.textSecondary}
              strokeWidth={2}
            />
          </Pressable>
        </View>

        {/* =================================================
            AMOUNTS
        ================================================= */}

        <View style={styles.amountSection}>
          {/* Spent */}

          <View>
            <Text
              style={[
                styles.amountLabel,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              Spent
            </Text>

            <Text
              style={[
                styles.spentAmount,
                {
                  color: theme.text,
                },
                isExceeded && styles.exceededAmount,
              ]}
            >
              {formatCurrency(budget.spentAmount)}
            </Text>
          </View>

          {/* Budget */}

          <View style={styles.budgetAmountContainer}>
            <Text
              style={[
                styles.amountLabel,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              Budget
            </Text>

            <Text
              style={[
                styles.budgetAmount,
                {
                  color: theme.text,
                },
              ]}
            >
              {formatCurrency(budget.budgetAmount)}
            </Text>
          </View>
        </View>

        {/* =================================================
            PROGRESS
        ================================================= */}

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text
              style={[
                styles.progressPercentage,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              {budget.utilization.toFixed(1)}% used
            </Text>

            <Text
              style={[
                styles.remainingText,
                {
                  color: theme.textSecondary,
                },
                isExceeded && styles.remainingExceeded,
              ]}
            >
              {formatCurrency(budget.remainingAmount)} left
            </Text>
          </View>

          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor: theme.surfaceSecondary,
              },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${utilization}%`,
                  backgroundColor: theme.primary,
                },
                isExceeded && styles.progressExceeded,
              ]}
            />
          </View>
        </View>

        {/* =================================================
            FOOTER
        ================================================= */}

        <View
          style={[
            styles.footer,
            {
              borderTopColor: theme.border,
            },
          ]}
        >
          {/* Dates */}

          <View style={styles.dateContainer}>
            <CalendarDays
              size={13}
              color={theme.textSecondary}
              strokeWidth={2}
            />

            <Text
              numberOfLines={1}
              style={[
                styles.dateText,
                {
                  color: theme.textSecondary,
                },
              ]}
            >
              {formatDate(budget.startDate)} – {formatDate(budget.endDate)}
            </Text>
          </View>

          {/* Badges */}

          <View style={styles.badges}>
            {/* Period */}

            <View
              style={[
                styles.periodBadge,
                {
                  backgroundColor: theme.surfaceSecondary,
                },
              ]}
            >
              <Text
                style={[
                  styles.periodBadgeText,
                  {
                    color: theme.textSecondary,
                  },
                ]}
              >
                {formatEnum(budget.period)}
              </Text>
            </View>

            {/* Recurring */}

            {isRecurringBudget && (
              <View
                style={[
                  styles.recurringBadge,
                  {
                    backgroundColor: theme.surfaceSecondary,
                  },
                ]}
              >
                <Repeat size={11} color={theme.text} strokeWidth={2} />

                <Text
                  style={[
                    styles.recurringBadgeText,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  Recurring
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* =================================================
            RECURRENCE INFORMATION
        ================================================= */}

        {isRecurrenceRoot && budget.recurrence && (
          <View
            style={[
              styles.recurrenceInfo,
              {
                borderColor: theme.border,
                backgroundColor: theme.surfaceSecondary,
              },
            ]}
          >
            <View style={styles.recurrenceHeader}>
              <View style={styles.recurrenceTitleRow}>
                <Repeat size={14} color={theme.text} strokeWidth={2} />

                <Text
                  style={[
                    styles.recurrenceTitle,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  Recurring budget
                </Text>
              </View>

              <Text
                style={[
                  styles.recurrenceStatus,
                  {
                    color: theme.textSecondary,
                  },
                ]}
              >
                {budget.recurrence.status === "ACTIVE" ? "Active" : "Stopped"}
              </Text>
            </View>

            <View style={styles.recurrenceDetails}>
              <Text
                style={[
                  styles.recurrenceDetailText,
                  {
                    color: theme.textSecondary,
                  },
                ]}
              >
                Future amount: {formatCurrency(budget.recurrence.budgetAmount)}
              </Text>

              {budget.recurrence.nextGenerationDate && (
                <Text
                  style={[
                    styles.recurrenceDetailText,
                    {
                      color: theme.textSecondary,
                    },
                  ]}
                >
                  Next: {formatDate(budget.recurrence.nextGenerationDate)}
                </Text>
              )}

              {budget.recurrence.endDate && (
                <Text
                  style={[
                    styles.recurrenceDetailText,
                    {
                      color: theme.textSecondary,
                    },
                  ]}
                >
                  Until: {formatDate(budget.recurrence.endDate)}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>

      {/* =====================================================
          ACTION BOTTOM SHEET
      ===================================================== */}

      <BudgetActionSheet
        visible={actionSheetOpen}
        budget={budget}
        isRecurrenceRoot={isRecurrenceRoot}
        onClose={() => setActionSheetOpen(false)}
        onEdit={handleEditBudget}
        onEditRecurrence={handleEditRecurrence}
        onDelete={handleDeleteBudget}
      />

      {/* =====================================================
          EDIT BUDGET SHEET
      ===================================================== */}

      <EditBudgetSheet
        budget={budget}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* =====================================================
          EDIT RECURRENCE SHEET
      ===================================================== */}

      {isRecurrenceRoot && (
        <EditBudgetRecurrenceSheet
          budget={budget}
          open={recurrenceEditOpen}
          onOpenChange={setRecurrenceEditOpen}
        />
      )}

      {/* =====================================================
          DELETE BUDGET SHEET
      ===================================================== */}

      <DeleteBudgetSheet
        budget={budget}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}

/*
 * ===========================================================
 * ACTION SHEET
 * ===========================================================
 */

interface BudgetActionSheetProps {
  visible: boolean;

  budget: Budget;

  isRecurrenceRoot: boolean;

  onClose: () => void;

  onEdit: () => void;

  onEditRecurrence: () => void;

  onDelete: () => void;
}

function BudgetActionSheet({
  visible,
  budget,
  isRecurrenceRoot,
  onClose,
  onEdit,
  onEditRecurrence,
  onDelete,
}: BudgetActionSheetProps) {
  const { theme } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.actionModal}>
        {/* Backdrop */}

        <Pressable
          style={[
            styles.actionBackdrop,
            {
              backgroundColor: "rgba(0,0,0,0.45)",
            },
          ]}
          onPress={onClose}
        />

        {/* Sheet */}

        <View
          style={[
            styles.actionSheet,
            {
              backgroundColor: theme.surface,
            },
          ]}
        >
          {/* Handle */}

          <View
            style={[
              styles.sheetHandle,
              {
                backgroundColor: theme.border,
              },
            ]}
          />

          {/* Header */}

          <View
            style={[
              styles.actionHeader,
              {
                borderBottomColor: theme.border,
              },
            ]}
          >
            <View style={styles.actionHeaderText}>
              <Text
                style={[
                  styles.actionTitle,
                  {
                    color: theme.text,
                  },
                ]}
              >
                Budget Actions
              </Text>

              <Text
                numberOfLines={1}
                style={[
                  styles.actionSubtitle,
                  {
                    color: theme.textSecondary,
                  },
                ]}
              >
                {budget.scope === "OVERALL"
                  ? "Overall Budget"
                  : (getCategory(budget.categoryId)?.name ?? "Category Budget")}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={[
                styles.actionClose,
                {
                  backgroundColor: theme.surfaceSecondary,
                },
              ]}
            >
              <X size={18} color={theme.text} />
            </Pressable>
          </View>

          {/* Actions */}

          <View style={styles.actionList}>
            {/* Edit */}

            <Pressable
              onPress={onEdit}
              style={({ pressed }) => [
                styles.actionItem,
                pressed && {
                  backgroundColor: theme.surfaceSecondary,
                },
              ]}
            >
              <View
                style={[
                  styles.actionIcon,
                  {
                    backgroundColor: theme.surfaceSecondary,
                  },
                ]}
              >
                <Pencil size={17} color={theme.text} />
              </View>

              <View style={styles.actionItemContent}>
                <Text
                  style={[
                    styles.actionItemTitle,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  Edit budget
                </Text>

                <Text
                  style={[
                    styles.actionItemDescription,
                    {
                      color: theme.textSecondary,
                    },
                  ]}
                >
                  Change budget details
                </Text>
              </View>
            </Pressable>

            {/* Edit recurrence */}

            {isRecurrenceRoot && (
              <Pressable
                onPress={onEditRecurrence}
                style={({ pressed }) => [
                  styles.actionItem,
                  pressed && {
                    backgroundColor: theme.surfaceSecondary,
                  },
                ]}
              >
                <View
                  style={[
                    styles.actionIcon,
                    {
                      backgroundColor: theme.surfaceSecondary,
                    },
                  ]}
                >
                  <Repeat size={17} color={theme.text} />
                </View>

                <View style={styles.actionItemContent}>
                  <Text
                    style={[
                      styles.actionItemTitle,
                      {
                        color: theme.text,
                      },
                    ]}
                  >
                    Edit recurrence
                  </Text>

                  <Text
                    style={[
                      styles.actionItemDescription,
                      {
                        color: theme.textSecondary,
                      },
                    ]}
                  >
                    Change future budget generation
                  </Text>
                </View>
              </Pressable>
            )}

            {/* Delete */}

            <Pressable
              onPress={onDelete}
              style={({ pressed }) => [
                styles.actionItem,
                styles.deleteActionItem,
                pressed && {
                  backgroundColor: theme.surfaceSecondary,
                },
              ]}
            >
              <View style={[styles.actionIcon, styles.deleteActionIcon]}>
                <Trash2 size={17} color="#DC2626" />
              </View>

              <View style={styles.actionItemContent}>
                <Text
                  style={[styles.actionItemTitle, styles.deleteActionTitle]}
                >
                  Delete budget
                </Text>

                <Text
                  style={[
                    styles.actionItemDescription,
                    {
                      color: theme.textSecondary,
                    },
                  ]}
                >
                  Permanently remove this budget
                </Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.actionBottomSpace} />
        </View>
      </View>
    </Modal>
  );
}

/*
 * ===========================================================
 * STYLES
 * ===========================================================
 */

const styles = StyleSheet.create({
  /*
   * CARD
   */

  card: {
    width: "100%",

    padding: 18,

    borderWidth: 1,

    borderRadius: 16,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 6,

    elevation: 1,
  },

  /*
   * HEADER
   */

  header: {
    flexDirection: "row",

    alignItems: "flex-start",

    justifyContent: "space-between",

    gap: 12,
  },

  headerLeft: {
    flex: 1,

    minWidth: 0,

    flexDirection: "row",

    alignItems: "center",

    gap: 10,
  },

  walletIcon: {
    width: 38,
    height: 38,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 11,
  },

  nameContainer: {
    flex: 1,

    minWidth: 0,
  },

  budgetName: {
    fontSize: 13,

    fontWeight: "700",
  },

  subcategory: {
    marginTop: 2,

    fontSize: 10,

    fontWeight: "500",
  },

  moreButton: {
    width: 34,
    height: 34,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 10,
  },

  moreButtonPressed: {
    opacity: 0.7,
  },

  /*
   * AMOUNTS
   */

  amountSection: {
    flexDirection: "row",

    alignItems: "flex-end",

    justifyContent: "space-between",

    marginTop: 18,
  },

  amountLabel: {
    fontSize: 10,

    fontWeight: "500",
  },

  spentAmount: {
    marginTop: 2,

    fontSize: 19,

    fontWeight: "800",
  },

  exceededAmount: {
    color: "#DC2626",
  },

  budgetAmountContainer: {
    alignItems: "flex-end",
  },

  budgetAmount: {
    marginTop: 2,

    fontSize: 13,

    fontWeight: "700",
  },

  /*
   * PROGRESS
   */

  progressSection: {
    marginTop: 15,
  },

  progressHeader: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    marginBottom: 6,
  },

  progressPercentage: {
    fontSize: 10,

    fontWeight: "500",
  },

  remainingText: {
    fontSize: 10,

    fontWeight: "600",
  },

  remainingExceeded: {
    color: "#DC2626",
  },

  progressTrack: {
    width: "100%",

    height: 7,

    overflow: "hidden",

    borderRadius: 999,
  },

  progressFill: {
    height: "100%",

    borderRadius: 999,
  },

  progressExceeded: {
    backgroundColor: "#DC2626",
  },

  /*
   * FOOTER
   */

  footer: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    flexWrap: "wrap",

    gap: 8,

    marginTop: 15,

    paddingTop: 12,

    borderTopWidth: 1,
  },

  dateContainer: {
    flexDirection: "row",

    alignItems: "center",

    gap: 5,

    flexShrink: 1,
  },

  dateText: {
    flexShrink: 1,

    fontSize: 9,

    fontWeight: "500",
  },

  badges: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "flex-end",

    flexWrap: "wrap",

    gap: 5,
  },

  periodBadge: {
    paddingHorizontal: 8,

    paddingVertical: 5,

    borderRadius: 999,
  },

  periodBadgeText: {
    fontSize: 8,

    fontWeight: "700",
  },

  recurringBadge: {
    flexDirection: "row",

    alignItems: "center",

    gap: 4,

    paddingHorizontal: 8,

    paddingVertical: 5,

    borderRadius: 999,
  },

  recurringBadgeText: {
    fontSize: 8,

    fontWeight: "700",
  },

  /*
   * RECURRENCE INFO
   */

  recurrenceInfo: {
    marginTop: 12,

    paddingHorizontal: 12,
    paddingVertical: 10,

    borderWidth: 1,

    borderRadius: 12,
  },

  recurrenceHeader: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    gap: 8,
  },

  recurrenceTitleRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 6,
  },

  recurrenceTitle: {
    fontSize: 10,

    fontWeight: "700",
  },

  recurrenceStatus: {
    fontSize: 9,

    fontWeight: "600",
  },

  recurrenceDetails: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: 8,

    marginTop: 5,
  },

  recurrenceDetailText: {
    fontSize: 9,

    fontWeight: "500",
  },

  /*
   * ACTION MODAL
   */

  actionModal: {
    flex: 1,

    justifyContent: "flex-end",
  },

  actionBackdrop: {
    ...StyleSheet.absoluteFill,
  },

  actionSheet: {
    width: "100%",

    borderTopLeftRadius: 24,

    borderTopRightRadius: 24,

    overflow: "hidden",

    paddingTop: 9,
  },

  sheetHandle: {
    alignSelf: "center",

    width: 38,
    height: 4,

    borderRadius: 2,

    marginBottom: 5,
  },

  actionHeader: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 18,

    paddingVertical: 14,

    borderBottomWidth: 1,
  },

  actionHeaderText: {
    flex: 1,

    minWidth: 0,
  },

  actionTitle: {
    fontSize: 16,

    fontWeight: "800",
  },

  actionSubtitle: {
    marginTop: 2,

    fontSize: 10,

    fontWeight: "500",
  },

  actionClose: {
    width: 38,
    height: 38,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 11,
  },

  actionList: {
    paddingHorizontal: 12,

    paddingTop: 10,
  },

  actionItem: {
    minHeight: 62,

    flexDirection: "row",

    alignItems: "center",

    gap: 12,

    paddingHorizontal: 8,

    borderRadius: 13,
  },

  deleteActionItem: {
    marginTop: 3,
  },

  actionIcon: {
    width: 40,
    height: 40,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 11,
  },

  deleteActionIcon: {
    backgroundColor: "#FEF2F2",
  },

  actionItemContent: {
    flex: 1,

    minWidth: 0,
  },

  actionItemTitle: {
    fontSize: 12,

    fontWeight: "700",
  },

  deleteActionTitle: {
    color: "#DC2626",
  },

  actionItemDescription: {
    marginTop: 2,

    fontSize: 9,

    fontWeight: "500",
  },

  actionBottomSpace: {
    height: 18,
  },
});
