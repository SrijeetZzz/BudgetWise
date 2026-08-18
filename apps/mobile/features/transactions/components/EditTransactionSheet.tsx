
import {
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  Pencil,
  X,
} from "lucide-react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import { useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type {
  PaymentMethod,
  Transaction,
  TransactionType,
  UpdateTransactionInput,
} from "../../../types/transaction.types";

import type { Category } from "../../../types/category.types";

import { useCategories } from "../../../features/categories/hooks/use-categories";

import { CategoryIcon } from "../../../features/categories/components/category-icon";

import { useUpdateTransaction } from "../hooks/use-update-transaction";
import { useTheme } from "../../../providers/ThemeProvider";

/*
 * ===========================================================
 * TYPES
 * ===========================================================
 */

interface EditTransactionSheetProps {
  transaction: Transaction;
  visible: boolean;
  onClose: () => void;
}

/*
 * ===========================================================
 * PAYMENT METHODS
 * ===========================================================
 */

const PAYMENT_METHODS: PaymentMethod[] = [
  "CASH",
  "CARD",
  "UPI",
  "BANK_TRANSFER",
  "WALLET",
  "CHEQUE",
  "OTHER",
];

/*
 * ===========================================================
 * HELPERS
 * ===========================================================
 */

function getId(value: string | Category | null | undefined): string {
  if (!value) {
    return "";
  }

  return typeof value === "string" ? value : value._id;
}

function parseDate(value?: string | null): Date {
  if (!value) {
    return new Date();
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatPaymentMethod(value: PaymentMethod): string {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/*
 * ===========================================================
 * COMPONENT
 * ===========================================================
 */

export default function EditTransactionSheet({
  transaction,
  visible,
  onClose,
}: EditTransactionSheetProps) {
  /*
   * =========================================================
   * THEME
   * =========================================================
   */

  const { theme } = useTheme();

  /*
   * =========================================================
   * DATA
   * =========================================================
   */

  const updateTransaction = useUpdateTransaction();

  const { data: categoryResponse, isLoading: categoriesLoading } =
    useCategories();

  const categories = categoryResponse?.data ?? [];

  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const [type, setType] = useState<TransactionType>(transaction.type);

  const [categoryId, setCategoryId] = useState(getId(transaction.categoryId));

  const [subcategoryId, setSubcategoryId] = useState(
    getId(transaction.subcategoryId),
  );

  const [title, setTitle] = useState(transaction.title);

  const [amount, setAmount] = useState(String(transaction.amount));

  const [description, setDescription] = useState(transaction.description ?? "");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">(
    transaction.paymentMethod ?? "",
  );

  const [transactionDate, setTransactionDate] = useState<Date>(
    parseDate(transaction.transactionDate),
  );

  const [selector, setSelector] = useState<
    "category" | "subcategory" | "payment" | null
  >(null);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [error, setError] = useState("");

  /*
   * =========================================================
   * RESET WHEN OPEN
   * =========================================================
   */

  useEffect(() => {
    if (!visible) {
      return;
    }

    setType(transaction.type);

    setCategoryId(getId(transaction.categoryId));

    setSubcategoryId(getId(transaction.subcategoryId));

    setTitle(transaction.title);

    setAmount(String(transaction.amount));

    setDescription(transaction.description ?? "");

    setPaymentMethod(transaction.paymentMethod ?? "");

    setTransactionDate(parseDate(transaction.transactionDate));

    setSelector(null);

    setShowDatePicker(false);

    setError("");
  }, [visible, transaction]);

  /*
   * =========================================================
   * CATEGORY DATA
   * =========================================================
   */

  const parentCategories = useMemo(
    () =>
      categories.filter(
        (category) => category.level === 0 && category.type === type,
      ),
    [categories, type],
  );

  const subcategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.level === 1 &&
          category.parentCategoryId === categoryId &&
          category.type === type,
      ),
    [categories, categoryId, type],
  );

  const selectedCategory = categories.find(
    (category) => category._id === categoryId,
  );

  const selectedSubcategory = categories.find(
    (category) => category._id === subcategoryId,
  );

  /*
   * =========================================================
   * DIRTY
   * =========================================================
   */

  const isDirty = useMemo(() => {
    return (
      type !== transaction.type ||
      categoryId !== getId(transaction.categoryId) ||
      subcategoryId !== getId(transaction.subcategoryId) ||
      title.trim() !== transaction.title ||
      Number(amount) !== transaction.amount ||
      description.trim() !== (transaction.description ?? "") ||
      paymentMethod !== (transaction.paymentMethod ?? "") ||
      formatDate(transactionDate) !==
        formatDate(parseDate(transaction.transactionDate))
    );
  }, [
    type,
    categoryId,
    subcategoryId,
    title,
    amount,
    description,
    paymentMethod,
    transactionDate,
    transaction,
  ]);

  /*
   * =========================================================
   * TYPE
   * =========================================================
   */

  const handleTypeChange = (nextType: TransactionType) => {
    setType(nextType);

    const currentCategory = categories.find(
      (category) => category._id === categoryId,
    );

    if (currentCategory && currentCategory.type !== nextType) {
      setCategoryId("");
      setSubcategoryId("");
    }
  };

  /*
   * =========================================================
   * CATEGORY
   * =========================================================
   */

  const handleCategoryChange = (id: string) => {
    setCategoryId(id);
    setSubcategoryId("");
    setSelector(null);
  };

  /*
   * =========================================================
   * SUBMIT
   * =========================================================
   */

  const handleSubmit = async () => {
    setError("");

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!title.trim()) {
      setError("Transaction title is required.");
      return;
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    const payload: UpdateTransactionInput = {
      categoryId,

      type,

      amount: numericAmount,

      currency: "INR",

      title: title.trim(),

      description: description.trim() || undefined,

      paymentMethod: paymentMethod || undefined,

      transactionDate: new Date(
        `${formatDate(transactionDate)}T00:00:00`,
      ).toISOString(),
    };

    if (subcategoryId) {
      payload.subcategoryId = subcategoryId;
    }

    try {
      await updateTransaction.mutateAsync({
        transactionId: transaction._id,

        payload,
      });

      onClose();
    } catch {
      setError("Unable to update transaction. Please try again.");
    }
  };

  /*
   * =========================================================
   * RENDER
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
      <KeyboardAvoidingView
        style={styles.modalRoot}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
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

        {/* MAIN SHEET */}

        <View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.surface,
            },
          ]}
        >
          {/* HEADER */}

          <View
            style={[
              styles.header,
              {
                borderBottomColor: theme.border,
              },
            ]}
          >
            <Pressable
              onPress={onClose}
              style={[
                styles.backButton,
                {
                  backgroundColor: theme.surfaceSecondary,
                },
              ]}
            >
              <ChevronLeft size={21} color={theme.text} />
            </Pressable>

            <View
              style={[
                styles.headerIcon,
                {
                  backgroundColor: theme.surfaceSecondary,
                },
              ]}
            >
              <Pencil size={18} color={theme.text} />
            </View>

            <View style={styles.headerText}>
              <Text
                style={[
                  styles.headerTitle,
                  {
                    color: theme.text,
                  },
                ]}
              >
                Edit Transaction
              </Text>

              <Text
                style={[
                  styles.headerSubtitle,
                  {
                    color: theme.textSecondary,
                  },
                ]}
              >
                Update transaction details
              </Text>
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
              <X size={17} color={theme.textSecondary} />
            </Pressable>
          </View>

          {/* CONTENT */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
          >
            {/* TYPE */}

            <View style={styles.field}>
              <FieldLabel theme={theme}>Transaction Type</FieldLabel>

              <View
                style={[
                  styles.typeSlider,
                  {
                    backgroundColor: theme.surfaceSecondary,
                  },
                ]}
              >
                <Pressable
                  onPress={() => handleTypeChange("EXPENSE")}
                  style={[
                    styles.typeButton,
                    type === "EXPENSE" && {
                      backgroundColor: theme.surface,
                      borderWidth: 1,
                      borderColor: "#FCA5A5",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      {
                        color: theme.textSecondary,
                      },
                      type === "EXPENSE" && {
                        color: theme.text,
                        fontWeight: "800",
                      },
                    ]}
                  >
                    Expense
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleTypeChange("INCOME")}
                  style={[
                    styles.typeButton,
                    type === "INCOME" && {
                      backgroundColor: theme.surface,
                      borderWidth: 1,
                      borderColor: "#86EFAC",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      {
                        color: theme.textSecondary,
                      },
                      type === "INCOME" && {
                        color: theme.text,
                        fontWeight: "800",
                      },
                    ]}
                  >
                    Income
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* CATEGORY */}

            <View style={styles.field}>
              <FieldLabel required theme={theme}>
                Category
              </FieldLabel>

              <SelectorButton
                label={
                  selectedCategory?.name ??
                  (categoriesLoading ? "Loading..." : "Select category")
                }
                icon={selectedCategory?.icon}
                onPress={() => setSelector("category")}
                disabled={categoriesLoading}
                theme={theme}
              />
            </View>

            {/* SUBCATEGORY */}

            <View style={styles.field}>
              <FieldLabel theme={theme}>Subcategory</FieldLabel>

              <SelectorButton
                label={
                  !categoryId
                    ? "Select category first"
                    : selectedSubcategory
                      ? selectedSubcategory.name
                      : subcategories.length
                        ? "Select subcategory"
                        : "No subcategories"
                }
                icon={selectedSubcategory?.icon}
                onPress={() => setSelector("subcategory")}
                disabled={!categoryId || !subcategories.length}
                theme={theme}
              />
            </View>

            {/* AMOUNT */}

            <View style={styles.field}>
              <FieldLabel required theme={theme}>
                Amount
              </FieldLabel>

              <View
                style={[
                  styles.amountInput,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.surface,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.currencyPrefix,
                    {
                      color: theme.textSecondary,
                    },
                  ]}
                >
                  ₹
                </Text>

                <TextInput
                  value={amount}
                  onChangeText={(value) =>
                    setAmount(value.replace(/[^0-9.]/g, ""))
                  }
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={theme.muted}
                  style={[
                    styles.amountText,
                    {
                      color: theme.text,
                    },
                  ]}
                />
              </View>
            </View>

            {/* CURRENCY */}

            <View style={styles.field}>
              <FieldLabel required theme={theme}>
                Currency
              </FieldLabel>

              <View
                style={[
                  styles.readOnlyField,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.surfaceSecondary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.readOnlyValue,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  INR
                </Text>

                <Text
                  style={[
                    styles.fixedText,
                    {
                      color: theme.muted,
                    },
                  ]}
                >
                  Fixed
                </Text>
              </View>
            </View>

            {/* TITLE */}

            <View style={styles.field}>
              <FieldLabel required theme={theme}>
                Title
              </FieldLabel>

              <TextInput
                value={title}
                onChangeText={setTitle}
                maxLength={100}
                placeholder="e.g. Grocery shopping"
                placeholderTextColor={theme.muted}
                style={[
                  styles.input,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.surface,
                    color: theme.text,
                  },
                ]}
              />
            </View>

            {/* DESCRIPTION */}

            <View style={styles.field}>
              <FieldLabel theme={theme}>Description</FieldLabel>

              <TextInput
                value={description}
                onChangeText={setDescription}
                multiline
                maxLength={500}
                placeholder="Optional notes or merchant details..."
                placeholderTextColor={theme.muted}
                textAlignVertical="top"
                style={[
                  styles.input,
                  styles.textarea,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.surface,
                    color: theme.text,
                  },
                ]}
              />
            </View>

            {/* PAYMENT */}

            <View style={styles.field}>
              <FieldLabel theme={theme}>Payment Method</FieldLabel>

              <SelectorButton
                label={
                  paymentMethod
                    ? formatPaymentMethod(paymentMethod)
                    : "Select payment method"
                }
                onPress={() => setSelector("payment")}
                theme={theme}
              />
            </View>

            {/* DATE */}

            <View style={styles.field}>
              <FieldLabel required theme={theme}>
                Transaction Date
              </FieldLabel>

              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={[
                  styles.dateField,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.surface,
                  },
                ]}
              >
                <CalendarDays size={17} color={theme.textSecondary} />

                <Text
                  style={[
                    styles.dateValue,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  {formatDate(transactionDate)}
                </Text>

                <ChevronDown size={15} color={theme.textSecondary} />
              </Pressable>
            </View>

            {/* ERROR */}

            {error ? (
              <View
                style={[
                  styles.errorBox,
                  {
                    borderColor: theme.destructive,
                    backgroundColor: theme.surfaceSecondary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.errorText,
                    {
                      color: theme.destructive,
                    },
                  ]}
                >
                  {error}
                </Text>
              </View>
            ) : null}

            {/* ACTIONS */}

            <View style={styles.actions}>
              <Pressable
                onPress={onClose}
                disabled={updateTransaction.isPending}
                style={[
                  styles.cancelButton,
                  {
                    borderColor: theme.border,
                    backgroundColor: theme.surface,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cancelText,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                disabled={!isDirty || updateTransaction.isPending}
                style={[
                  styles.saveButton,
                  {
                    backgroundColor: theme.primary,
                  },
                  (!isDirty || updateTransaction.isPending) &&
                    styles.disabledButton,
                ]}
              >
                {updateTransaction.isPending ? (
                  <ActivityIndicator size="small" color={theme.primaryText} />
                ) : (
                  <>
                    <Check size={16} color={theme.primaryText} />

                    <Text
                      style={[
                        styles.saveText,
                        {
                          color: theme.primaryText,
                        },
                      ]}
                    >
                      Save Changes
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>

        {/* =====================================================
            DATE PICKER
        ===================================================== */}

        {showDatePicker && (
          <Modal
            transparent
            animationType="fade"
            visible
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View
              style={[
                styles.dateModal,
                {
                  backgroundColor: "rgba(0,0,0,0.55)",
                },
              ]}
            >
              <View
                style={[
                  styles.datePickerCard,
                  {
                    backgroundColor: theme.surface,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.datePickerTitle,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  Select Transaction Date
                </Text>

                <DateTimePicker
                  value={transactionDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "calendar"}
                  textColor={theme.text}
                  accentColor={theme.primary}
                  onChange={(event, date) => {
                    if (Platform.OS === "android") {
                      setShowDatePicker(false);
                    }

                    if (date) {
                      setTransactionDate(date);
                    }
                  }}
                />

                {Platform.OS === "ios" && (
                  <Pressable
                    onPress={() => setShowDatePicker(false)}
                    style={[
                      styles.dateDoneButton,
                      {
                        backgroundColor: theme.primary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateDoneText,
                        {
                          color: theme.primaryText,
                        },
                      ]}
                    >
                      Done
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          </Modal>
        )}
      </KeyboardAvoidingView>

      {/* =======================================================
          SELECTOR
      ======================================================= */}

      <SelectorModal
        visible={selector !== null}
        title={
          selector === "category"
            ? "Select Category"
            : selector === "subcategory"
              ? "Select Subcategory"
              : "Payment Method"
        }
        onClose={() => setSelector(null)}
        theme={theme}
      >
        {selector === "category" &&
          parentCategories.map((category) => (
            <SelectorOption
              key={category._id}
              label={category.name}
              icon={category.icon}
              selected={category._id === categoryId}
              onPress={() => handleCategoryChange(category._id)}
              theme={theme}
            />
          ))}

        {selector === "subcategory" &&
          subcategories.map((category) => (
            <SelectorOption
              key={category._id}
              label={category.name}
              icon={category.icon}
              selected={category._id === subcategoryId}
              onPress={() => {
                setSubcategoryId(category._id);
                setSelector(null);
              }}
              theme={theme}
            />
          ))}

        {selector === "payment" &&
          PAYMENT_METHODS.map((method) => (
            <SelectorOption
              key={method}
              label={formatPaymentMethod(method)}
              selected={paymentMethod === method}
              onPress={() => {
                setPaymentMethod(method);
                setSelector(null);
              }}
              theme={theme}
            />
          ))}
      </SelectorModal>
    </Modal>
  );
}

/*
 * ===========================================================
 * FIELD LABEL
 * ===========================================================
 */

function FieldLabel({
  children,
  required = false,
  theme,
}: {
  children: React.ReactNode;
  required?: boolean;
  theme: {
    text: string;
    destructive: string;
  };
}) {
  return (
    <Text
      style={[
        styles.label,
        {
          color: theme.text,
        },
      ]}
    >
      {children}

      {required && (
        <Text
          style={[
            styles.required,
            {
              color: theme.destructive,
            },
          ]}
        >
          {" "}
          *
        </Text>
      )}
    </Text>
  );
}

/*
 * ===========================================================
 * SELECTOR BUTTON
 * ===========================================================
 */

function SelectorButton({
  label,
  icon,
  onPress,
  disabled = false,
  theme,
}: {
  label: string;
  icon?: string;
  onPress: () => void;
  disabled?: boolean;
  theme: {
    surface: string;
    surfaceSecondary: string;
    border: string;
    text: string;
    textSecondary: string;
    muted: string;
  };
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.selectorButton,
        {
          borderColor: theme.border,
          backgroundColor: theme.surface,
        },
        disabled && styles.selectorDisabled,
      ]}
    >
      <View style={styles.selectorLeft}>
        {icon && (
          <View
            style={[
              styles.selectorIcon,
              {
                backgroundColor: theme.surfaceSecondary,
              },
            ]}
          >
            <CategoryIcon name={icon} size={16} color={theme.textSecondary} />
          </View>
        )}

        <Text
          numberOfLines={1}
          style={[
            styles.selectorText,
            {
              color: theme.text,
            },
          ]}
        >
          {label}
        </Text>
      </View>

      <ChevronDown size={16} color={theme.textSecondary} />
    </Pressable>
  );
}

/*
 * ===========================================================
 * SELECTOR MODAL
 * ===========================================================
 */

function SelectorModal({
  visible,
  title,
  onClose,
  children,
  theme,
}: {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  theme: {
    surface: string;
    surfaceSecondary: string;
    border: string;
    text: string;
    textSecondary: string;
  };
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.selectorBackdrop,
          {
            backgroundColor: "rgba(0,0,0,0.55)",
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View
          style={[
            styles.selectorSheet,
            {
              backgroundColor: theme.surface,
            },
          ]}
        >
          <View
            style={[
              styles.sheetHandle,
              {
                backgroundColor: theme.border,
              },
            ]}
          />

          <View
            style={[
              styles.selectorHeader,
              {
                borderBottomColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.selectorTitle,
                {
                  color: theme.text,
                },
              ]}
            >
              {title}
            </Text>

            <Pressable
              onPress={onClose}
              style={[
                styles.modalCloseButton,
                {
                  backgroundColor: theme.surfaceSecondary,
                },
              ]}
            >
              <X size={17} color={theme.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.selectorContent}
          >
            {children}

            <View style={styles.selectorBottomSpace} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/*
 * ===========================================================
 * SELECTOR OPTION
 * ===========================================================
 */

function SelectorOption({
  label,
  icon,
  selected,
  onPress,
  theme,
}: {
  label: string;
  icon?: string;
  selected: boolean;
  onPress: () => void;
  theme: {
    surface: string;
    surfaceSecondary: string;
    border: string;
    text: string;
    textSecondary: string;
    primary: string;
    primaryText: string;
  };
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.selectorOption,
        {
          borderColor: theme.border,
          backgroundColor: theme.surface,
        },
        selected && {
          backgroundColor: theme.surfaceSecondary,
          borderColor: theme.primary,
        },
      ]}
    >
      <View style={styles.selectorOptionLeft}>
        {icon && (
          <View
            style={[
              styles.optionIcon,
              {
                backgroundColor: theme.surfaceSecondary,
              },
            ]}
          >
            <CategoryIcon name={icon} size={16} color={theme.textSecondary} />
          </View>
        )}

        <Text
          style={[
            styles.optionText,
            {
              color: theme.text,
            },
            selected && {
              fontWeight: "800",
            },
          ]}
        >
          {label}
        </Text>
      </View>

      {selected && <Check size={16} color={theme.primary} />}
    </Pressable>
  );
}

/*
 * ===========================================================
 * STYLES
 * ===========================================================
 */

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
  },

  sheet: {
    width: "100%",
    maxHeight: "94%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },

  header: {
    height: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },

  backButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginRight: 8,
  },

  headerIcon: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginRight: 10,
  },

  headerText: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 15,
    fontWeight: "800",
  },

  headerSubtitle: {
    marginTop: 2,
    fontSize: 9,
  },

  closeButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },

  content: {
    padding: 16,
    paddingBottom: 16,
  },

  field: {
    marginBottom: 15,
  },

  label: {
    marginBottom: 7,
    fontSize: 11,
    fontWeight: "700",
  },

  required: {},

  typeSlider: {
    flexDirection: "row",
    padding: 3,
    borderRadius: 12,
  },

  typeButton: {
    flex: 1,
    height: 39,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
  },

  typeText: {
    fontSize: 11,
    fontWeight: "600",
  },

  selectorButton: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 11,
  },

  selectorDisabled: {
    opacity: 0.45,
  },

  selectorLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  selectorIcon: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
  },

  selectorText: {
    flex: 1,
    fontSize: 11,
    fontWeight: "600",
  },

  amountInput: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 11,
  },

  currencyPrefix: {
    fontSize: 15,
    fontWeight: "800",
    marginRight: 7,
  },

  amountText: {
    flex: 1,
    padding: 0,
    fontSize: 13,
  },

  readOnlyField: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    borderWidth: 1,
    borderRadius: 11,
  },

  readOnlyValue: {
    fontSize: 12,
    fontWeight: "800",
  },

  fixedText: {
    fontSize: 8,
    fontWeight: "700",
  },

  input: {
    minHeight: 46,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderRadius: 11,
    fontSize: 12,
  },

  textarea: {
    height: 90,
    paddingTop: 12,
    textAlignVertical: "top",
  },

  dateField: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 11,
  },

  dateValue: {
    flex: 1,
    marginLeft: 8,
    fontSize: 11,
    fontWeight: "600",
  },

  errorBox: {
    marginBottom: 14,
    padding: 11,
    borderWidth: 1,
    borderRadius: 10,
  },

  errorText: {
    fontSize: 10,
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
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

  saveButton: {
    flex: 1,
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 11,
  },

  saveText: {
    fontSize: 11,
    fontWeight: "700",
  },

  disabledButton: {
    opacity: 0.45,
  },

  /*
   * SELECTOR SHEET
   */

  selectorBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },

  selectorSheet: {
    width: "100%",
    maxHeight: "72%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },

  sheetHandle: {
    alignSelf: "center",
    width: 38,
    height: 4,
    marginTop: 9,
    marginBottom: 5,
    borderRadius: 2,
  },

  selectorHeader: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },

  selectorTitle: {
    fontSize: 14,
    fontWeight: "800",
  },

  modalCloseButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
  },

  selectorContent: {
    padding: 14,
  },

  selectorOption: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginBottom: 7,
    borderWidth: 1,
    borderRadius: 11,
  },

  selectorOptionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  optionIcon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },

  optionText: {
    fontSize: 11,
    fontWeight: "600",
  },

  selectorBottomSpace: {
    height: 30,
  },

  /*
   * DATE MODAL
   */

  dateModal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  datePickerCard: {
    width: "100%",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
  },

  datePickerTitle: {
    marginBottom: 12,
    fontSize: 14,
    fontWeight: "800",
  },

  dateDoneButton: {
    width: "100%",
    height: 44,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
  },

  dateDoneText: {
    fontSize: 11,
    fontWeight: "800",
  },
});
