

import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react-native";

import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type { Transaction } from "../../../types/transaction.types";

import { useDeleteTransaction } from "../hooks/use-delete-transaction";
import { useTheme } from "../../../providers/ThemeProvider";



interface DeleteTransactionSheetProps {
  transaction: Transaction;
  visible: boolean;
  onClose: () => void;
}

export default function DeleteTransactionSheet({
  transaction,
  visible,
  onClose,
}: DeleteTransactionSheetProps) {
  /*
   * =========================================================
   * THEME
   * =========================================================
   */

  const { theme } = useTheme();

  /*
   * =========================================================
   * DELETE MUTATION
   * =========================================================
   */

  const deleteTransaction =
    useDeleteTransaction();

  /*
   * =========================================================
   * DELETE HANDLER
   * =========================================================
   */

  const handleDelete = async () => {
    try {
      await deleteTransaction.mutateAsync(
        transaction._id,
      );

      onClose();
    } catch {
      /*
       * Keep the sheet open so the user
       * can retry.
       */
    }
  };

  /*
   * =========================================================
   * HIDDEN
   * =========================================================
   */

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* =================================================
            BACKDROP
        ================================================= */}

        <Pressable
          style={[
            StyleSheet.absoluteFill,
            styles.backdrop,
          ]}
          onPress={
            deleteTransaction.isPending
              ? undefined
              : onClose
          }
        />

        {/* =================================================
            SHEET
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

          <View style={styles.header}>
            <View style={styles.titleRow}>
              {/* =============================================
                  WARNING ICON
              ============================================= */}

              <View
                style={[
                  styles.warningIcon,
                  {
                    backgroundColor:
                      theme.surfaceSecondary,
                  },
                ]}
              >
                <AlertTriangle
                  size={19}
                  color={theme.destructive}
                  strokeWidth={2}
                />
              </View>

              {/* =============================================
                  TITLE
              ============================================= */}

              <View
                style={
                  styles.titleContent
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
                  Delete transaction?
                </Text>

                <Text
                  style={[
                    styles.subtitle,
                    {
                      color:
                        theme.textSecondary,
                    },
                  ]}
                >
                  This action cannot be
                  undone.
                </Text>
              </View>
            </View>

            {/* =============================================
                CLOSE
            ============================================= */}

            <Pressable
              disabled={
                deleteTransaction.isPending
              }
              onPress={onClose}
              hitSlop={6}
              style={({ pressed }) => [
                styles.closeButton,
                {
                  backgroundColor:
                    theme.surfaceSecondary,
                },
                pressed &&
                  !deleteTransaction.isPending &&
                  styles.closeButtonPressed,
              ]}
            >
              <X
                size={17}
                color={
                  theme.textSecondary
                }
                strokeWidth={2}
              />
            </Pressable>
          </View>

          {/* =================================================
              TRANSACTION PREVIEW
          ================================================= */}

          <View
            style={[
              styles.transactionCard,
              {
                borderColor:
                  theme.border,
                backgroundColor:
                  theme.surfaceSecondary,
              },
            ]}
          >
            {/* =============================================
                ICON
            ============================================= */}

            <View
              style={[
                styles.transactionIcon,
                {
                  backgroundColor:
                    theme.border,
                },
              ]}
            >
              <Trash2
                size={16}
                color={
                  theme.textSecondary
                }
                strokeWidth={2}
              />
            </View>

            {/* =============================================
                INFO
            ============================================= */}

            <View
              style={
                styles.transactionInfo
              }
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.transactionTitle,
                  {
                    color:
                      theme.text,
                  },
                ]}
              >
                {transaction.title}
              </Text>

              <Text
                style={[
                  styles.transactionAmount,
                  {
                    color:
                      theme.textSecondary,
                  },
                ]}
              >
                {transaction.currency}{" "}
                {transaction.amount.toLocaleString(
                  "en-IN",
                )}
              </Text>
            </View>
          </View>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <Text
            style={[
              styles.description,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            Are you sure you want to delete
            this transaction? It will no
            longer appear in your transaction
            history.
          </Text>

          {/* =================================================
              ERROR
          ================================================= */}

          {deleteTransaction.isError && (
            <View
              style={[
                styles.errorBox,
                {
                  borderColor:
                    theme.destructive,
                  backgroundColor:
                    theme.surfaceSecondary,
                },
              ]}
            >
              <Text
                style={[
                  styles.errorText,
                  {
                    color:
                      theme.destructive,
                  },
                ]}
              >
                Unable to delete the
                transaction. Please try
                again.
              </Text>
            </View>
          )}

          {/* =================================================
              ACTIONS
          ================================================= */}

          <View style={styles.actions}>
            {/* =============================================
                CANCEL
            ============================================= */}

            <Pressable
              disabled={
                deleteTransaction.isPending
              }
              onPress={onClose}
              style={({ pressed }) => [
                styles.cancelButton,
                {
                  borderColor:
                    theme.border,
                  backgroundColor:
                    theme.surface,
                },
                pressed &&
                  !deleteTransaction.isPending &&
                  styles.buttonPressed,
              ]}
            >
              <Text
                style={[
                  styles.cancelText,
                  {
                    color:
                      theme.text,
                  },
                ]}
              >
                Cancel
              </Text>
            </Pressable>

            {/* =============================================
                DELETE
            ============================================= */}

            <Pressable
              disabled={
                deleteTransaction.isPending
              }
              onPress={handleDelete}
              style={({ pressed }) => [
                styles.deleteButton,
                {
                  backgroundColor:
                    theme.destructive,
                },
                deleteTransaction.isPending &&
                  styles.disabledButton,
                pressed &&
                  !deleteTransaction.isPending &&
                  styles.deleteButtonPressed,
              ]}
            >
              {deleteTransaction.isPending ? (
                <ActivityIndicator
                  size="small"
                  color={
                    theme.primaryText
                  }
                />
              ) : (
                <>
                  <Trash2
                    size={16}
                    color={
                      theme.primaryText
                    }
                    strokeWidth={2}
                  />

                  <Text
                    style={[
                      styles.deleteText,
                      {
                        color:
                          theme.primaryText,
                      },
                    ]}
                  >
                    Delete Transaction
                  </Text>
                </>
              )}
            </Pressable>
          </View>

          {/* =================================================
              BOTTOM NAVIGATION CLEARANCE
          ================================================= */}

          <View
            style={
              styles.bottomSpace
            }
          />
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
   * =========================================================
   * OVERLAY
   * =========================================================
   */

  overlay: {
    flex: 1,

    justifyContent: "flex-end",
  },

  /*
   * =========================================================
   * BACKDROP
   * =========================================================
   */

  backdrop: {
    backgroundColor:
      "rgba(0, 0, 0, 0.55)",
  },

  /*
   * =========================================================
   * SHEET
   * =========================================================
   */

  sheet: {
    width: "100%",

    paddingTop: 9,

    paddingHorizontal: 16,

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    overflow: "hidden",
  },

  /*
   * =========================================================
   * HANDLE
   * =========================================================
   */

  handle: {
    alignSelf: "center",

    width: 38,
    height: 4,

    marginBottom: 14,

    borderRadius: 2,
  },

  /*
   * =========================================================
   * HEADER
   * =========================================================
   */

  header: {
    flexDirection: "row",

    alignItems: "flex-start",

    justifyContent:
      "space-between",
  },

  titleRow: {
    flex: 1,

    flexDirection: "row",

    alignItems: "center",

    marginRight: 12,
  },

  warningIcon: {
    width: 42,
    height: 42,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,

    borderRadius: 11,
  },

  titleContent: {
    flex: 1,
  },

  title: {
    fontSize: 15,

    fontWeight: "800",
  },

  subtitle: {
    marginTop: 3,

    fontSize: 9,

    fontWeight: "500",
  },

  closeButton: {
    width: 36,
    height: 36,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: 10,
  },

  closeButtonPressed: {
    opacity: 0.65,

    transform: [
      {
        scale: 0.95,
      },
    ],
  },

  /*
   * =========================================================
   * TRANSACTION CARD
   * =========================================================
   */

  transactionCard: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 18,

    padding: 13,

    borderWidth: 1,

    borderRadius: 13,
  },

  transactionIcon: {
    width: 34,
    height: 34,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,

    borderRadius: 9,
  },

  transactionInfo: {
    flex: 1,
  },

  transactionTitle: {
    fontSize: 12,

    fontWeight: "800",
  },

  transactionAmount: {
    marginTop: 3,

    fontSize: 10,

    fontWeight: "600",
  },

  /*
   * =========================================================
   * DESCRIPTION
   * =========================================================
   */

  description: {
    marginTop: 15,

    fontSize: 11,

    lineHeight: 18,

    fontWeight: "500",
  },

  /*
   * =========================================================
   * ERROR
   * =========================================================
   */

  errorBox: {
    marginTop: 14,

    padding: 11,

    borderWidth: 1,

    borderRadius: 10,
  },

  errorText: {
    fontSize: 10,

    lineHeight: 15,

    fontWeight: "600",
  },

  /*
   * =========================================================
   * ACTIONS
   * =========================================================
   */

  actions: {
    flexDirection: "row",

    gap: 10,

    marginTop: 20,
  },

  cancelButton: {
    flex: 1,

    height: 46,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,

    borderRadius: 11,
  },

  cancelText: {
    fontSize: 11,

    fontWeight: "700",
  },

  deleteButton: {
    flex: 1,

    height: 46,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 7,

    borderRadius: 11,
  },

  deleteText: {
    fontSize: 11,

    fontWeight: "800",
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonPressed: {
    opacity: 0.65,
  },

  deleteButtonPressed: {
    opacity: 0.75,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  /*
   * =========================================================
   * BOTTOM SPACE
   * =========================================================
   */

  bottomSpace: {
    height: 28,
  },
});