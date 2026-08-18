
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Repeat,
  Trash2,
  X,
} from "lucide-react-native";

import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useState } from "react";



import type { Transaction } from "../../../types/transaction.types";

import EditTransactionSheet from "./EditTransactionSheet";
import EditRecurringTransactionSheet from "./EditRecurringTransactionSheet";
import DeleteTransactionSheet from "./DeleteTransactionSheet";
import TransactionDetailsSheet from "./Transaction-details-sheet";
import { useTheme } from "../../../providers/ThemeProvider";

/*
 * ===========================================================
 * PROPS
 * ===========================================================
 */

interface TransactionActionsProps {
  transaction: Transaction;
}

/*
 * ===========================================================
 * COMPONENT
 * ===========================================================
 */

export default function TransactionActions({
  transaction,
}: TransactionActionsProps) {
  /*
   * =========================================================
   * THEME
   * =========================================================
   */

  const { theme } = useTheme();

  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const [
    menuVisible,
    setMenuVisible,
  ] = useState(false);

  const [
    detailsVisible,
    setDetailsVisible,
  ] = useState(false);

  const [
    editVisible,
    setEditVisible,
  ] = useState(false);

  const [
    recurringEditVisible,
    setRecurringEditVisible,
  ] = useState(false);

  const [
    deleteVisible,
    setDeleteVisible,
  ] = useState(false);

  /*
   * =========================================================
   * RECURRING CHECK
   * =========================================================
   */

  const isRecurring =
    transaction.transactionSource ===
    "RECURRING";

  /*
   * =========================================================
   * OPEN DETAILS
   *
   * Small delay is intentional because the action menu
   * modal needs to finish closing before another sheet opens.
   * =========================================================
   */

  const openDetails = () => {
    setMenuVisible(false);

    setTimeout(() => {
      setDetailsVisible(true);
    }, 150);
  };

  /*
   * =========================================================
   * OPEN EDIT
   * =========================================================
   */

  const openEdit = () => {
    setMenuVisible(false);

    setTimeout(() => {
      if (isRecurring) {
        setRecurringEditVisible(true);
      } else {
        setEditVisible(true);
      }
    }, 150);
  };

  /*
   * =========================================================
   * OPEN DELETE
   * =========================================================
   */

  const openDelete = () => {
    setMenuVisible(false);

    setTimeout(() => {
      setDeleteVisible(true);
    }, 150);
  };

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <>
      {/* =====================================================
          ACTION BUTTON
      ===================================================== */}

      <Pressable
        onPress={() =>
          setMenuVisible(true)
        }
        hitSlop={8}
        style={({ pressed }) => [
          styles.actionButton,
          {
            backgroundColor:
              theme.surfaceSecondary,
          },
          pressed && {
            opacity: 0.65,
            transform: [
              {
                scale: 0.95,
              },
            ],
          },
        ]}
      >
        <MoreHorizontal
          size={19}
          color={theme.textSecondary}
          strokeWidth={2}
        />
      </Pressable>

      {/* =====================================================
          ACTION MENU
      ===================================================== */}

      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() =>
          setMenuVisible(false)
        }
      >
        <View style={styles.overlay}>
          {/* =================================================
              BACKDROP
          ================================================= */}

          <Pressable
            style={[
              styles.backdrop,
              {
                backgroundColor:
                  "rgba(0,0,0,0.55)",
              },
            ]}
            onPress={() =>
              setMenuVisible(false)
            }
          />

          {/* =================================================
              BOTTOM SHEET
          ================================================= */}

          <View
            style={[
              styles.sheet,
              {
                backgroundColor:
                  theme.surface,
              },
            ]}
            onStartShouldSetResponder={() =>
              true
            }
          >
            {/* =================================================
                HANDLE
            ================================================= */}

            <View
              style={[
                styles.handle,
                {
                  backgroundColor:
                    theme.border,
                },
              ]}
            />

            {/* =================================================
                HEADER
            ================================================= */}

            <View
              style={styles.header}
            >
              <View
                style={
                  styles.headerText
                }
              >
                <Text
                  style={[
                    styles.headerTitle,
                    {
                      color:
                        theme.text,
                    },
                  ]}
                >
                  Transaction Actions
                </Text>

                <Text
                  numberOfLines={1}
                  style={[
                    styles.headerSubtitle,
                    {
                      color:
                        theme.textSecondary,
                    },
                  ]}
                >
                  {transaction.title}
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  setMenuVisible(
                    false,
                  )
                }
                hitSlop={6}
                style={({ pressed }) => [
                  styles.closeButton,
                  {
                    backgroundColor:
                      theme.surfaceSecondary,
                  },
                  pressed && {
                    opacity: 0.65,
                    transform: [
                      {
                        scale: 0.95,
                      },
                    ],
                  },
                ]}
              >
                <X
                  size={17}
                  color={theme.textSecondary}
                  strokeWidth={2}
                />
              </Pressable>
            </View>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <View
              style={styles.actionList}
            >
              {/* =================================================
                  VIEW
              ================================================= */}

              <ActionItem
                icon={
                  <Eye
                    size={19}
                    color={theme.text}
                    strokeWidth={2}
                  />
                }
                title="View transaction"
                description="See complete transaction details"
                onPress={openDetails}
                theme={theme}
              />

              {/* =================================================
                  EDIT
              ================================================= */}

              <ActionItem
                icon={
                  isRecurring ? (
                    <Repeat
                      size={19}
                      color={theme.text}
                      strokeWidth={2}
                    />
                  ) : (
                    <Pencil
                      size={19}
                      color={theme.text}
                      strokeWidth={2}
                    />
                  )
                }
                title={
                  isRecurring
                    ? "Edit recurring transaction"
                    : "Edit transaction"
                }
                description={
                  isRecurring
                    ? "Update transaction and recurrence settings"
                    : "Update transaction details"
                }
                onPress={openEdit}
                theme={theme}
              />

              {/* =================================================
                  DELETE
              ================================================= */}

              <ActionItem
                destructive
                icon={
                  <Trash2
                    size={19}
                    color={
                      theme.destructive ??
                      "#DC2626"
                    }
                    strokeWidth={2}
                  />
                }
                title="Delete transaction"
                description="Permanently remove this transaction"
                onPress={openDelete}
                theme={theme}
              />
            </View>

            {/* =================================================
                BOTTOM CLEARANCE
            ================================================= */}

            <View
              style={
                styles.bottomSpace
              }
            />
          </View>
        </View>
      </Modal>

      {/* =====================================================
          TRANSACTION DETAILS
      ===================================================== */}

      <TransactionDetailsSheet
        transaction={transaction}
        visible={detailsVisible}
        onClose={() =>
          setDetailsVisible(
            false,
          )
        }
      />

      {/* =====================================================
          NORMAL EDIT
      ===================================================== */}

      {!isRecurring && (
        <EditTransactionSheet
          transaction={transaction}
          visible={editVisible}
          onClose={() =>
            setEditVisible(
              false,
            )
          }
        />
      )}

      {/* =====================================================
          RECURRING EDIT
      ===================================================== */}

      {isRecurring && (
        <EditRecurringTransactionSheet
          transaction={transaction}
          visible={
            recurringEditVisible
          }
          onClose={() =>
            setRecurringEditVisible(
              false,
            )
          }
        />
      )}

      {/* =====================================================
          DELETE
      ===================================================== */}

      <DeleteTransactionSheet
        transaction={transaction}
        visible={deleteVisible}
        onClose={() =>
          setDeleteVisible(
            false,
          )
        }
      />
    </>
  );
}

/*
 * ===========================================================
 * ACTION ITEM
 * ===========================================================
 */

interface ActionItemProps {
  icon: React.ReactNode;

  title: string;

  description: string;

  onPress: () => void;

  theme: ThemeLike;

  destructive?: boolean;
}

function ActionItem({
  icon,
  title,
  description,
  onPress,
  theme,
  destructive = false,
}: ActionItemProps) {
  const dangerColor =
    theme.danger ?? "#DC2626";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionItem,

        {
          borderColor:
            destructive
              ? theme.dangerBorder ??
                "#FECACA"
              : theme.border,

          backgroundColor:
            destructive
              ? theme.dangerSurface ??
                "#FFF8F8"
              : theme.surface,
        },

        pressed && {
          opacity: 0.65,
          transform: [
            {
              scale: 0.99,
            },
          ],
        },
      ]}
    >
      {/* =====================================================
          ICON
      ===================================================== */}

      <View
        style={[
          styles.actionIcon,
          {
            marginRight: 11,

            backgroundColor:
              destructive
                ? theme.dangerIconSurface ??
                  "#FEE2E2"
                : theme.surfaceSecondary,
          },
        ]}
      >
        {icon}
      </View>

      {/* =====================================================
          TEXT
      ===================================================== */}

      <View
        style={styles.actionText}
      >
        <Text
          style={[
            styles.actionTitle,
            {
              color: destructive
                ? dangerColor
                : theme.text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.actionDescription,
            {
              color:
                theme.textSecondary,
            },
          ]}
        >
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

/*
 * ===========================================================
 * THEME TYPE
 *
 * Keeps this component independent from the concrete theme
 * implementation while still using the existing useTheme()
 * hook.
 * ===========================================================
 */

interface ThemeLike {
  background: string;

  surface: string;

  surfaceSecondary: string;

  border: string;

  text: string;

  textSecondary: string;

  muted?: string;

  primary: string;

  primaryText?: string;

  danger?: string;

  dangerBorder?: string;

  dangerSurface?: string;

  dangerIconSurface?: string;
}

/*
 * ===========================================================
 * STYLES
 * ===========================================================
 */

const styles =
  StyleSheet.create({
    /*
     * =======================================================
     * ACTION BUTTON
     * =======================================================
     */

    actionButton: {
      width: 34,

      height: 34,

      alignItems: "center",

      justifyContent: "center",

      borderRadius: 9,
    },

    /*
     * =======================================================
     * MODAL
     * =======================================================
     */

    overlay: {
      flex: 1,

      justifyContent:
        "flex-end",
    },

    backdrop: {
      ...StyleSheet.absoluteFill,
    },

    /*
     * =======================================================
     * SHEET
     * =======================================================
     */

    sheet: {
      width: "100%",

      paddingTop: 9,

      paddingHorizontal: 16,

      borderTopLeftRadius: 24,

      borderTopRightRadius: 24,

      overflow: "hidden",
    },

    handle: {
      alignSelf: "center",

      width: 38,

      height: 4,

      marginBottom: 14,

      borderRadius: 2,
    },

    /*
     * =======================================================
     * HEADER
     * =======================================================
     */

    header: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      marginBottom: 16,
    },

    headerText: {
      flex: 1,

      marginRight: 12,
    },

    headerTitle: {
      fontSize: 15,

      fontWeight: "800",
    },

    headerSubtitle: {
      maxWidth: 260,

      marginTop: 3,

      fontSize: 9,

      fontWeight: "500",
    },

    closeButton: {
      width: 36,

      height: 36,

      alignItems: "center",

      justifyContent:
        "center",

      borderRadius: 10,
    },

    /*
     * =======================================================
     * ACTION LIST
     * =======================================================
     */

    actionList: {
      gap: 8,
    },

    actionItem: {
      minHeight: 62,

      flexDirection: "row",

      alignItems: "center",

      paddingHorizontal: 12,

      borderWidth: 1,

      borderRadius: 13,
    },

    /*
     * =======================================================
     * ACTION ICON
     * =======================================================
     */

    actionIcon: {
      width: 38,

      height: 38,

      alignItems: "center",

      justifyContent:
        "center",

      borderRadius: 10,
    },

    /*
     * =======================================================
     * ACTION TEXT
     * =======================================================
     */

    actionText: {
      flex: 1,
    },

    actionTitle: {
      fontSize: 11,

      fontWeight: "800",
    },

    actionDescription: {
      marginTop: 3,

      fontSize: 9,

      fontWeight: "500",
    },

    /*
     * =======================================================
     * BOTTOM SPACE
     * =======================================================
     */

    bottomSpace: {
      height: 28,
    },
  });