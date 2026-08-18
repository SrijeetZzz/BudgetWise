
import {
  CalendarDays,
  CreditCard,
  ExternalLink,
  FileText,
  Paperclip,
  Repeat,
  Trash2,
  Upload,
  X,
} from "lucide-react-native";

import {
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import * as DocumentPicker from "expo-document-picker";

import type { Transaction } from "../../../types/transaction.types";

import { CategoryIcon } from "../../categories/components/category-icon";

import { API_URL } from "../../../lib/env";

import { useUploadAttachment } from "../hooks/use-upload-attachment";
import { useDeleteAttachment } from "../hooks/use-delete-attachment";
import { useTheme } from "../../../providers/ThemeProvider";

/*
 * ===========================================================
 * TYPES
 * ===========================================================
 */

interface TransactionDetailsSheetProps {
  transaction: Transaction;
  visible: boolean;
  onClose: () => void;
}

/*
 * ===========================================================
 * COMPONENT
 * ===========================================================
 */

export default function TransactionDetailsSheet({
  transaction,
  visible,
  onClose,
}: TransactionDetailsSheetProps) {
  /*
   * =========================================================
   * THEME
   * =========================================================
   */

  const { theme } = useTheme();

  /*
   * =========================================================
   * MUTATIONS
   * =========================================================
   */

  const uploadAttachment = useUploadAttachment();

  const deleteAttachment = useDeleteAttachment();

  /*
   * =========================================================
   * CATEGORY
   * =========================================================
   */

  const category =
    typeof transaction.categoryId === "string" ? null : transaction.categoryId;

  const subcategory =
    typeof transaction.subcategoryId === "string" ||
    transaction.subcategoryId === null
      ? null
      : transaction.subcategoryId;

  /*
   * =========================================================
   * TRANSACTION
   * =========================================================
   */

  const isExpense = transaction.type === "EXPENSE";

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: transaction.currency,
    maximumFractionDigits: 2,
  }).format(transaction.amount);

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(transaction.transactionDate));

  /*
   * =========================================================
   * RECEIPT UPLOAD
   * =========================================================
   */

  const handleAttachmentUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const file = result.assets[0];

      await uploadAttachment.mutateAsync({
        transactionId: transaction._id,

        file: {
          uri: file.uri,
          name: file.name ?? "receipt",
          type: file.mimeType ?? "application/octet-stream",
          size: file.size,
        } as any,
      });
    } catch {
      Alert.alert(
        "Upload failed",
        "Unable to upload receipt. Please try again.",
      );
    }
  };

  /*
   * =========================================================
   * RECEIPT DELETE
   * =========================================================
   */

  const handleAttachmentDelete = () => {
    Alert.alert(
      "Delete receipt?",
      "This receipt will be permanently removed.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAttachment.mutateAsync(transaction._id);
            } catch {
              Alert.alert(
                "Delete failed",
                "Unable to delete receipt. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  /*
   * =========================================================
   * OPEN RECEIPT
   * =========================================================
   */

  const handleOpenAttachment = async (fileUrl: string) => {
    try {
      const baseUrl = API_URL.replace("/api/v1", "");

      const url = `${baseUrl}${fileUrl}`;

      const supported = await Linking.canOpenURL(url);

      if (!supported) {
        Alert.alert(
          "Unable to open receipt",
          "This receipt cannot be opened on your device.",
        );

        return;
      }

      await Linking.openURL(url);
    } catch {
      Alert.alert("Unable to open receipt", "Please try again.");
    }
  };

  /*
   * =========================================================
   * MODAL
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
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* BACKDROP */}

        <Pressable
          style={[
            styles.backdrop,
            {
              backgroundColor: "rgba(0,0,0,0.55)",
            },
          ]}
          onPress={onClose}
        />

        {/* SHEET */}

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.surface,
            },
          ]}
        >
          {/* HANDLE */}

          <View
            style={[
              styles.handle,
              {
                backgroundColor: theme.border,
              },
            ]}
          />

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
            <View style={styles.headerLeft}>
              <View
                style={[
                  styles.categoryIcon,
                  {
                    backgroundColor: `${category?.color ?? "#64748B"}18`,
                  },
                ]}
              >
                <CategoryIcon
                  name={category?.icon ?? "receipt"}
                  color={category?.color ?? "#64748B"}
                  size={20}
                />
              </View>

              <View style={styles.headerText}>
                <Text
                  numberOfLines={1}
                  style={[
                    styles.title,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  {transaction.title}
                </Text>

                <Text
                  numberOfLines={1}
                  style={[
                    styles.categoryText,
                    {
                      color: theme.textSecondary,
                    },
                  ]}
                >
                  {category?.name ?? "Unknown category"}

                  {subcategory && (
                    <Text
                      style={{
                        color: theme.textSecondary,
                      }}
                    >
                      {" "}
                      / {subcategory.name}
                    </Text>
                  )}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              style={[
                styles.closeButton,
                {
                  backgroundColor: theme.surfaceSecondary,
                },
              ]}
            >
              <X size={18} color={theme.textSecondary} />
            </Pressable>
          </View>

          {/* =================================================
              SCROLL CONTENT
          ================================================= */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* =================================================
                AMOUNT HERO
            ================================================= */}

            <View
              style={[
                styles.amountHero,
                {
                  borderBottomColor: theme.border,
                  backgroundColor: theme.surfaceSecondary,
                },
              ]}
            >
              <View
                style={[
                  styles.typeBadge,
                  {
                    backgroundColor: theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.typeBadgeText,
                    {
                      color: theme.textSecondary,
                    },
                  ]}
                >
                  {transaction.type}
                </Text>
              </View>

              <Text
                style={[
                  styles.amount,
                  {
                    color: isExpense ? theme.destructive : "#059669",
                  },
                ]}
              >
                {isExpense ? "-" : "+"}
                {formattedAmount}
              </Text>
            </View>

            {/* =================================================
                PRIMARY DETAILS
            ================================================= */}

            <View style={styles.detailsSection}>
              <DetailRow
                icon={<CalendarDays size={16} color={theme.textSecondary} />}
                label="Transaction Date"
                value={formattedDate}
                theme={theme}
              />

              {transaction.paymentMethod && (
                <DetailRow
                  icon={<CreditCard size={16} color={theme.textSecondary} />}
                  label="Payment Method"
                  value={formatPaymentMethod(transaction.paymentMethod)}
                  theme={theme}
                />
              )}

              {transaction.description && (
                <DetailRow
                  icon={<FileText size={16} color={theme.textSecondary} />}
                  label="Description"
                  value={transaction.description}
                  theme={theme}
                />
              )}

              {transaction.transactionSource === "RECURRING" && (
                <DetailRow
                  icon={<Repeat size={16} color={theme.textSecondary} />}
                  label="Transaction Source"
                  value="Recurring"
                  theme={theme}
                />
              )}
            </View>

            {/* =================================================
                RECURRING BREAKDOWN
            ================================================= */}

            {transaction.transactionSource === "RECURRING" && (
              <View
                style={[
                  styles.recurrenceCard,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.surfaceSecondary,
                  },
                ]}
              >
                <View style={styles.recurrenceHeader}>
                  <Repeat size={15} color={theme.textSecondary} />

                  <Text
                    style={[
                      styles.recurrenceHeaderText,
                      {
                        color: theme.textSecondary,
                      },
                    ]}
                  >
                    RECURRENCE SCHEDULE
                  </Text>
                </View>

                <View style={styles.recurrenceGrid}>
                  <View style={styles.recurrenceItem}>
                    <Text
                      style={[
                        styles.smallLabel,
                        {
                          color: theme.textSecondary,
                        },
                      ]}
                    >
                      Frequency
                    </Text>

                    <Text
                      style={[
                        styles.recurrenceValue,
                        {
                          color: theme.text,
                        },
                      ]}
                    >
                      {formatRecurrence(transaction.recurrenceFrequency)}
                    </Text>
                  </View>

                  <View style={styles.recurrenceItem}>
                    <Text
                      style={[
                        styles.smallLabel,
                        {
                          color: theme.textSecondary,
                        },
                      ]}
                    >
                      Status
                    </Text>

                    <Text
                      style={[
                        styles.recurrenceValue,
                        {
                          color: theme.text,
                        },
                      ]}
                    >
                      {formatRecurrence(transaction.recurrenceStatus)}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* =================================================
                RECEIPT
            ================================================= */}

            <View
              style={[
                styles.receiptSection,
                {
                  borderTopColor: theme.border,
                },
              ]}
            >
              <View style={styles.receiptHeader}>
                <View style={styles.receiptHeaderText}>
                  <View style={styles.receiptTitleRow}>
                    <Paperclip size={14} color={theme.textSecondary} />

                    <Text
                      style={[
                        styles.receiptTitle,
                        {
                          color: theme.textSecondary,
                        },
                      ]}
                    >
                      RECEIPT
                      {transaction.attachments.length > 0 &&
                        ` (${transaction.attachments.length})`}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.receiptSubtitle,
                      {
                        color: theme.textSecondary,
                      },
                    ]}
                  >
                    Attach a receipt to this transaction.
                  </Text>
                </View>

                {transaction.attachments.length === 0 && (
                  <Pressable
                    onPress={handleAttachmentUpload}
                    disabled={uploadAttachment.isPending}
                    style={[
                      styles.uploadButton,
                      {
                        borderColor: theme.border,
                        backgroundColor: theme.surface,
                      },
                      uploadAttachment.isPending && styles.disabledButton,
                    ]}
                  >
                    {uploadAttachment.isPending ? (
                      <ActivityIndicator size="small" color={theme.text} />
                    ) : (
                      <Upload size={14} color={theme.text} />
                    )}

                    <Text
                      style={[
                        styles.uploadText,
                        {
                          color: theme.text,
                        },
                      ]}
                    >
                      {uploadAttachment.isPending ? "Uploading..." : "Upload"}
                    </Text>
                  </Pressable>
                )}
              </View>

              {/* EXISTING RECEIPTS */}

              {transaction.attachments.length > 0 ? (
                <View style={styles.attachmentsList}>
                  {transaction.attachments.map((attachment) => (
                    <View
                      key={attachment.fileName}
                      style={[
                        styles.attachmentCard,
                        {
                          borderColor: theme.border,
                          backgroundColor: theme.surfaceSecondary,
                        },
                      ]}
                    >
                      <View style={styles.attachmentLeft}>
                        <View
                          style={[
                            styles.fileIcon,
                            {
                              backgroundColor: theme.surface,
                            },
                          ]}
                        >
                          <FileText size={16} color={theme.textSecondary} />
                        </View>

                        <View style={styles.fileInfo}>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.fileName,
                              {
                                color: theme.text,
                              },
                            ]}
                          >
                            {attachment.fileName}
                          </Text>

                          <Text
                            style={[
                              styles.fileSize,
                              {
                                color: theme.textSecondary,
                              },
                            ]}
                          >
                            {formatFileSize(attachment.fileSize)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.attachmentActions}>
                        {/* VIEW */}

                        <Pressable
                          onPress={() =>
                            handleOpenAttachment(attachment.fileUrl)
                          }
                          style={[
                            styles.iconButton,
                            {
                              backgroundColor: theme.surface,
                            },
                          ]}
                        >
                          <ExternalLink size={16} color={theme.textSecondary} />
                        </Pressable>

                        {/* DELETE */}

                        <Pressable
                          onPress={handleAttachmentDelete}
                          disabled={deleteAttachment.isPending}
                          style={[
                            styles.iconButton,
                            styles.deleteIconButton,
                            {
                              backgroundColor: theme.surfaceSecondary,
                            },
                            deleteAttachment.isPending && styles.disabledButton,
                          ]}
                        >
                          {deleteAttachment.isPending ? (
                            <ActivityIndicator
                              size="small"
                              color={theme.destructive}
                            />
                          ) : (
                            <Trash2 size={16} color={theme.destructive} />
                          )}
                        </Pressable>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View
                  style={[
                    styles.emptyReceipt,
                    {
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <FileText size={27} color={theme.muted} />

                  <Text
                    style={[
                      styles.emptyTitle,
                      {
                        color: theme.text,
                      },
                    ]}
                  >
                    No receipt attached
                  </Text>

                  <Text
                    style={[
                      styles.emptySubtitle,
                      {
                        color: theme.textSecondary,
                      },
                    ]}
                  >
                    Upload an image or PDF receipt.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* =================================================
              FOOTER
          ================================================= */}

          <View
            style={[
              styles.footer,
              {
                borderTopColor: theme.border,
                backgroundColor: theme.surface,
              },
            ]}
          >
            <Pressable
              onPress={onClose}
              style={[
                styles.closeFooterButton,
                {
                  borderColor: theme.border,
                  backgroundColor: theme.surface,
                },
              ]}
            >
              <Text
                style={[
                  styles.closeFooterText,
                  {
                    color: theme.text,
                  },
                ]}
              >
                Close
              </Text>
            </Pressable>
          </View>

          {/* BOTTOM NAVIGATION CLEARANCE */}
        </View>
      </View>
    </Modal>
  );
}

/*
 * ===========================================================
 * DETAIL ROW
 * ===========================================================
 */

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  theme: {
    text: string;
    textSecondary: string;
  };
}

function DetailRow({ icon, label, value, theme }: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>{icon}</View>

      <View style={styles.detailContent}>
        <Text
          style={[
            styles.detailLabel,
            {
              color: theme.textSecondary,
            },
          ]}
        >
          {label}
        </Text>

        <Text
          style={[
            styles.detailValue,
            {
              color: theme.text,
            },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

/*
 * ===========================================================
 * FORMAT PAYMENT
 * ===========================================================
 */

function formatPaymentMethod(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/*
 * ===========================================================
 * FORMAT RECURRENCE
 * ===========================================================
 */

function formatRecurrence(value: string | null | undefined) {
  if (!value) {
    return "—";
  }

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/*
 * ===========================================================
 * FORMAT FILE SIZE
 * ===========================================================
 */

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/*
 * ===========================================================
 * STYLES
 * ===========================================================
 */

const styles = StyleSheet.create({
  /*
   * =======================================================
   * MODAL
   * =======================================================
   */

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
  },

  sheet: {
    width: "100%",
    maxHeight: "92%",
    paddingTop: 9,
    paddingBottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },

  handle: {
    alignSelf: "center",
    width: 38,
    height: 4,
    marginBottom: 7,
    borderRadius: 2,
  },

  /*
   * =======================================================
   * HEADER
   * =======================================================
   */

  header: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 17,
    borderBottomWidth: 1,
  },

  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },

  categoryIcon: {
    width: 43,
    height: 43,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
    borderRadius: 12,
  },

  headerText: {
    flex: 1,
    minWidth: 0,
  },

  title: {
    fontSize: 15,
    fontWeight: "800",
  },

  categoryText: {
    marginTop: 3,
    fontSize: 9,
    fontWeight: "500",
  },

  closeButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    borderRadius: 10,
  },

  /*
   * =======================================================
   * SCROLL
   * =======================================================
   */

  scrollContent: {
    paddingBottom: 10,
  },

  /*
   * =======================================================
   * AMOUNT
   * =======================================================
   */

  amountHero: {
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 22,
    borderBottomWidth: 1,
  },

  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  typeBadgeText: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  amount: {
    marginTop: 8,
    fontSize: 31,
    fontWeight: "900",
    letterSpacing: -0.7,
  },

  /*
   * =======================================================
   * DETAILS
   * =======================================================
   */

  detailsSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 11,
  },

  detailIcon: {
    width: 25,
    alignItems: "center",
    marginTop: 1,
    marginRight: 8,
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 9,
    fontWeight: "500",
  },

  detailValue: {
    marginTop: 2,
    fontSize: 11,
    lineHeight: 17,
    fontWeight: "700",
  },

  /*
   * =======================================================
   * RECURRENCE
   * =======================================================
   */

  recurrenceCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 14,
    borderWidth: 1,
    borderRadius: 13,
  },

  recurrenceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 12,
  },

  recurrenceHeaderText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  recurrenceGrid: {
    flexDirection: "row",
    gap: 20,
  },

  recurrenceItem: {
    flex: 1,
  },

  smallLabel: {
    fontSize: 9,
  },

  recurrenceValue: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: "700",
  },

  /*
   * =======================================================
   * RECEIPT
   * =======================================================
   */

  receiptSection: {
    paddingHorizontal: 16,
    paddingTop: 7,
    paddingBottom: 8,
    borderTopWidth: 1,
  },

  receiptHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 12,
  },

  receiptHeaderText: {
    flex: 1,
  },

  receiptTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  receiptTitle: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  receiptSubtitle: {
    marginTop: 4,
    fontSize: 9,
  },

  uploadButton: {
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 10,
  },

  uploadText: {
    fontSize: 10,
    fontWeight: "700",
  },

  /*
   * =======================================================
   * ATTACHMENTS
   * =======================================================
   */

  attachmentsList: {
    gap: 8,
  },

  attachmentCard: {
    minHeight: 57,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderRadius: 12,
  },

  attachmentLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },

  fileIcon: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
    borderRadius: 9,
  },

  fileInfo: {
    flex: 1,
    minWidth: 0,
  },

  fileName: {
    fontSize: 10,
    fontWeight: "700",
  },

  fileSize: {
    marginTop: 3,
    fontSize: 8,
  },

  attachmentActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: 8,
  },

  iconButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
  },

  deleteIconButton: {},

  disabledButton: {
    opacity: 0.5,
  },

  /*
   * =======================================================
   * EMPTY RECEIPT
   * =======================================================
   */

  emptyReceipt: {
    alignItems: "center",
    paddingVertical: 21,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 12,
  },

  emptyTitle: {
    marginTop: 7,
    fontSize: 11,
    fontWeight: "700",
  },

  emptySubtitle: {
    marginTop: 3,
    fontSize: 9,
  },

  /*
   * =======================================================
   * FOOTER
   * =======================================================
   */

  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
  },

  closeFooterButton: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 11,
  },

  closeFooterText: {
    fontSize: 11,
    fontWeight: "800",
  },

  /*
   * =======================================================
   * BOTTOM NAV CLEARANCE
   * =======================================================
   */
});
