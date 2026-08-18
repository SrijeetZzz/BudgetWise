
import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  router
} from "expo-router";

import {
  CalendarDays,
  ChevronDown,
  Plus,
  Repeat,
  Upload,
  X,
} from "lucide-react-native";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import DateTimePicker from "@react-native-community/datetimepicker";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  Controller,
  useForm,
} from "react-hook-form";

import {
  PaymentMethod,
} from "../../../types/transaction.types";

import {
  RecurrenceFrequency,
} from "../../../types/dashboard.types";

import {
  useCategories,
} from "../../../features/categories/hooks/use-categories";

import {
  useCreateTransaction,
} from "../../../features/transactions/hooks/use-create-transaction";

import {
  CreateTransactionFormValues,
  createTransactionSchema,
} from "../../../features/transactions/schemas/create-transaction.schema";

import {
  CategoryIcon,
} from "../../../features/categories/components/category-icon";

import AppHeader from "../../../features/app/components/AppHeader";
import { useThemeStore } from "../../../store/theme.store";
import { AppTheme, darkTheme, lightTheme } from "../../../constants/theme";




/*
 * ===========================================================
 * CONSTANTS
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

const RECURRENCE_FREQUENCIES: RecurrenceFrequency[] = [
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "HALF_YEARLY",
  "YEARLY",
];

/*
 * ===========================================================
 * DATE
 * ===========================================================
 */

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function parseDate(value?: string) {
  if (!value) return new Date();

  const parts = value.split("-").map(Number);

  if (
    parts.length !== 3 ||
    !parts[0] ||
    !parts[1] ||
    !parts[2]
  ) {
    return new Date();
  }

  return new Date(
    parts[0],
    parts[1] - 1,
    parts[2],
  );
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/*
 * ===========================================================
 * SCREEN
 * ===========================================================
 */

export default function CreateTransactionScreen() {
  const { theme: themeMode } = useThemeStore();

  const theme: AppTheme =
    themeMode === "DARK"
      ? darkTheme
      : lightTheme;

  const {
    data,
    isLoading: categoriesLoading,
  } = useCategories();

  const createTransaction =
    useCreateTransaction();

  const categories = data?.data ?? [];

  const form =
    useForm<CreateTransactionFormValues>({
      resolver: zodResolver(
        createTransactionSchema,
      ),

      defaultValues: {
        type: "EXPENSE",
        categoryId: "",
        subcategoryId: "",
        amount: undefined,
        currency: "INR",
        title: "",
        description: "",
        paymentMethod: undefined,
        transactionDate: getToday(),
        isRecurring: false,
        recurrenceFrequency: undefined,
        recurrenceStartDate: "",
        recurrenceEndDate: "",
      },

      mode: "onChange",
    });

  const type = form.watch("type");
  const categoryId = form.watch("categoryId");
  const subcategoryId =
    form.watch("subcategoryId");
  const isRecurring =
    form.watch("isRecurring");
  const paymentMethod =
    form.watch("paymentMethod");
  const recurrenceFrequency =
    form.watch("recurrenceFrequency");

  const [
    selector,
    setSelector,
  ] = useState<
    | "category"
    | "subcategory"
    | "payment"
    | "frequency"
    | null
  >(null);

  const [
    datePicker,
    setDatePicker,
  ] = useState<
    | "transaction"
    | "recurrenceStart"
    | "recurrenceEnd"
    | null
  >(null);

  const parentCategories =
    useMemo(
      () =>
        categories.filter(
          (category) =>
            category.level === 0 &&
            category.type === type,
        ),
      [categories, type],
    );

  const subcategories =
    useMemo(
      () =>
        categories.filter(
          (category) =>
            category.level === 1 &&
            category.parentCategoryId ===
              categoryId &&
            category.type === type,
        ),
      [categories, categoryId, type],
    );

  const selectedCategory =
    categories.find(
      (category) =>
        category._id === categoryId,
    );

  const selectedSubcategory =
    categories.find(
      (category) =>
        category._id === subcategoryId,
    );

  useEffect(() => {
    form.setValue("categoryId", "", {
      shouldValidate: true,
    });

    form.setValue("subcategoryId", "", {
      shouldValidate: true,
    });
  }, [type]);

  useEffect(() => {
    if (!categoryId) {
      form.setValue(
        "subcategoryId",
        "",
        {
          shouldValidate: true,
        },
      );
      return;
    }

    const valid =
      subcategories.some(
        (category) =>
          category._id ===
          subcategoryId,
      );

    if (
      subcategoryId &&
      !valid
    ) {
      form.setValue(
        "subcategoryId",
        "",
        {
          shouldValidate: true,
        },
      );
    }
  }, [
    categoryId,
    subcategories,
    subcategoryId,
    form,
  ]);

  const handleSubmit =
    async (
      values: CreateTransactionFormValues,
    ) => {
      try {
        await createTransaction.mutateAsync(
          {
            categoryId:
              values.categoryId,

            subcategoryId:
              values.subcategoryId ||
              undefined,

            type: values.type,

            amount: values.amount,

            currency: "INR",

            title:
              values.title.trim(),

            description:
              values.description?.trim() ||
              undefined,

            paymentMethod:
              values.paymentMethod,

            transactionDate:
              values.transactionDate,

            isRecurring:
              values.isRecurring,

            recurrenceFrequency:
              values.isRecurring
                ? values.recurrenceFrequency
                : undefined,

            recurrenceStartDate:
              values.isRecurring
                ? values.recurrenceStartDate ||
                  undefined
                : undefined,

            recurrenceEndDate:
              values.isRecurring
                ? values.recurrenceEndDate ||
                  undefined
                : undefined,
          },
        );

        router.back();
      } catch {
        // Existing mutation/API toast layer handles the error.
      }
    };

  const inputStyle = {
    borderColor: theme.text,
    backgroundColor: theme.surface,
    color: theme.text,
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.screen,
        {
          backgroundColor:
            theme.background,
        },
      ]}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          styles.content
        }
      >
        <View
          style={styles.pageIntro}
        >
          <Text
            style={[
              styles.pageTitle,
              {
                color: theme.text,
              },
            ]}
          >
            Add Transaction
          </Text>

          <Text
            style={[
              styles.pageSubtitle,
              {
                color:
                  theme.textSecondary,
              },
            ]}
          >
            Record an income or expense
          </Text>
        </View>

        {/* TRANSACTION TYPE */}

        <View style={styles.field}>
          <FieldLabel
            theme={theme}
            required
          >
            Transaction Type
          </FieldLabel>

          <TransactionTypeSlider
            value={type}
            theme={theme}
            onChange={(value) => {
              form.setValue(
                "type",
                value,
                {
                  shouldValidate: true,
                  shouldDirty: true,
                },
              );
            }}
          />

          <FieldError
            theme={theme}
            message={
              form.formState.errors
                .type?.message
            }
          />
        </View>

        {/* CATEGORY / SUBCATEGORY */}

        <View style={styles.row}>
          <View style={styles.flexField}>
            <FieldLabel
              theme={theme}
              required
            >
              Category
            </FieldLabel>

            <SelectorButton
              theme={theme}
              label={
                selectedCategory?.name ??
                (categoriesLoading
                  ? "Loading..."
                  : "Select category")
              }
              icon={
                selectedCategory
                  ? selectedCategory.icon
                  : undefined
              }
              onPress={() =>
                setSelector("category")
              }
              disabled={
                categoriesLoading
              }
            />

            <FieldError
              theme={theme}
              message={
                form.formState.errors
                  .categoryId?.message
              }
            />
          </View>

          <View style={styles.flexField}>
            <FieldLabel theme={theme}>
              Subcategory
            </FieldLabel>

            <SelectorButton
              theme={theme}
              label={
                !categoryId
                  ? "Select category"
                  : selectedSubcategory
                    ? selectedSubcategory.name
                    : subcategories.length
                      ? "Select subcategory"
                      : "No subcategories"
              }
              icon={
                selectedSubcategory
                  ? selectedSubcategory.icon
                  : undefined
              }
              onPress={() =>
                setSelector(
                  "subcategory",
                )
              }
              disabled={
                !categoryId ||
                !subcategories.length
              }
            />

            <FieldError
              theme={theme}
              message={
                form.formState.errors
                  .subcategoryId?.message
              }
            />
          </View>
        </View>

        {/* AMOUNT / CURRENCY */}

        <View style={styles.row}>
          <View style={styles.flexField}>
            <FieldLabel
              theme={theme}
              required
            >
              Amount
            </FieldLabel>

            <Controller
              control={form.control}
              name="amount"
              render={({ field }) => (
                <TextInput
                  value={
                    field.value ===
                    undefined
                      ? ""
                      : String(
                          field.value,
                        )
                  }
                  onChangeText={(value) => {
                    const cleaned =
                      value.replace(
                        /[^0-9.]/g,
                        "",
                      );

                    field.onChange(
                      cleaned
                        ? Number(
                            cleaned,
                          )
                        : undefined,
                    );
                  }}
                  onBlur={field.onBlur}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={
                    theme.textSecondary
                  }
                  style={[
                    styles.input,
                    inputStyle,
                    form.formState.errors
                      .amount &&
                      {
                        borderColor:
                          theme.destructive,
                        backgroundColor:
                          theme.surfaceSecondary,
                      },
                  ]}
                />
              )}
            />

            <FieldError
              theme={theme}
              message={
                form.formState.errors
                  .amount?.message
              }
            />
          </View>

          <View
            style={styles.currencyField}
          >
            <FieldLabel
              theme={theme}
              required
            >
              Currency
            </FieldLabel>

            <View
              style={[
                styles.readOnlyInput,
                {
                  borderColor:
                    theme.border,
                  backgroundColor:
                    theme.surfaceSecondary,
                },
              ]}
            >
              <Text
                style={[
                  styles.readOnlyCurrency,
                  {
                    color: theme.text,
                  },
                ]}
              >
                INR
              </Text>

              <Text
                style={[
                  styles.readOnlyLabel,
                  {
                    color: theme.textSecondary,
                  },
                ]}
              >
                Fixed
              </Text>
            </View>
          </View>
        </View>

        {/* TITLE */}

        <View style={styles.field}>
          <FieldLabel
            theme={theme}
            required
          >
            Title
          </FieldLabel>

          <Controller
            control={form.control}
            name="title"
            render={({ field }) => (
              <TextInput
                value={field.value}
                onChangeText={
                  field.onChange
                }
                onBlur={field.onBlur}
                placeholder="e.g. Grocery Shopping"
                placeholderTextColor={
                  theme.textSecondary
                }
                maxLength={100}
                style={[
                  styles.input,
                  inputStyle,
                  form.formState.errors
                    .title &&
                    {
                      borderColor:
                        theme.destructive,
                      backgroundColor:
                        theme.surfaceSecondary,
                    },
                ]}
              />
            )}
          />

          <FieldError
            theme={theme}
            message={
              form.formState.errors
                .title?.message
            }
          />
        </View>

        {/* DESCRIPTION */}

        <View style={styles.field}>
          <FieldLabel theme={theme}>
            Description
          </FieldLabel>

          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <TextInput
                value={field.value}
                onChangeText={
                  field.onChange
                }
                onBlur={field.onBlur}
                placeholder="Optional notes or merchant details..."
                placeholderTextColor={
                  theme.textSecondary
                }
                maxLength={500}
                multiline
                textAlignVertical="top"
                style={[
                  styles.input,
                  styles.textarea,
                  inputStyle,
                ]}
              />
            )}
          />

          <Text
            style={[
              styles.characterHint,
              {
                color: theme.textSecondary,
              },
            ]}
          >
            Optional
          </Text>
        </View>

        {/* PAYMENT / DATE */}

        <View style={styles.row}>
          <View style={styles.flexField}>
            <FieldLabel
              theme={theme}
              required
            >
              Payment Method
            </FieldLabel>

            <SelectorButton
              theme={theme}
              label={
                paymentMethod
                  ? formatPaymentMethod(
                      paymentMethod,
                    )
                  : "Select payment method"
              }
              onPress={() =>
                setSelector("payment")
              }
            />

            <FieldError
              theme={theme}
              message={
                form.formState.errors
                  .paymentMethod?.message
              }
            />
          </View>

          <View style={styles.flexField}>
            <FieldLabel
              theme={theme}
              required
            >
              Transaction Date
            </FieldLabel>

            <Controller
              control={form.control}
              name="transactionDate"
              render={({ field }) => (
                <CalendarField
                  theme={theme}
                  value={field.value}
                  placeholder="Select date"
                  hasError={
                    !!form.formState.errors
                      .transactionDate
                  }
                  onPress={() =>
                    setDatePicker(
                      "transaction",
                    )
                  }
                />
              )}
            />

            <FieldError
              theme={theme}
              message={
                form.formState.errors
                  .transactionDate?.message
              }
            />
          </View>
        </View>

        {/* RECURRING */}

        <View
          style={[
            styles.recurringContainer,
            {
              borderColor:
                theme.border,
              backgroundColor:
                theme.surfaceSecondary,
            },
          ]}
        >
          <View
            style={styles.recurringHeader}
          >
            <View
              style={styles.recurringLeft}
            >
              <View
                style={[
                  styles.recurringIcon,
                  {
                    backgroundColor:
                      theme.surface,
                  },
                ]}
              >
                <Repeat
                  size={17}
                  color={
                    theme.textSecondary
                  }
                />
              </View>

              <View
                style={
                  styles.recurringDetails
                }
              >
                <Text
                  style={[
                    styles.recurringTitle,
                    {
                      color: theme.text,
                    },
                  ]}
                >
                  Recurring Transaction
                </Text>

                <Text
                  style={[
                    styles.recurringSubtitle,
                    {
                      color:
                        theme.textSecondary,
                    },
                  ]}
                >
                  Automatically record this transaction
                </Text>
              </View>
            </View>

            <Controller
              control={form.control}
              name="isRecurring"
              render={({ field }) => (
                <Switch
                  value={field.value}
                  onValueChange={
                    field.onChange
                  }
                  trackColor={{
                    false:
                      theme.border,
                    true:
                      theme.primary,
                  }}
                  thumbColor={
                    theme.primaryText
                  }
                />
              )}
            />
          </View>

          {isRecurring && (
            <View
              style={[
                styles.recurringFields,
                {
                  borderTopColor:
                    theme.border,
                },
              ]}
            >
              <FieldLabel
                theme={theme}
                required
              >
                Frequency
              </FieldLabel>

              <SelectorButton
                theme={theme}
                label={
                  recurrenceFrequency
                    ? formatFrequency(
                        recurrenceFrequency,
                      )
                    : "Select frequency"
                }
                onPress={() =>
                  setSelector(
                    "frequency",
                  )
                }
              />

              <FieldError
                theme={theme}
                message={
                  form.formState.errors
                    .recurrenceFrequency
                    ?.message
                }
              />

              <View
                style={
                  styles.recurringField
                }
              >
                <FieldLabel
                  theme={theme}
                  required
                >
                  Start Date
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="recurrenceStartDate"
                  render={({ field }) => (
                    <CalendarField
                      theme={theme}
                      value={field.value}
                      placeholder="Select start date"
                      hasError={
                        !!form.formState
                          .errors
                          .recurrenceStartDate
                      }
                      onPress={() =>
                        setDatePicker(
                          "recurrenceStart",
                        )
                      }
                    />
                  )}
                />

                <FieldError
                  theme={theme}
                  message={
                    form.formState.errors
                      .recurrenceStartDate
                      ?.message
                  }
                />
              </View>

              <View
                style={
                  styles.recurringField
                }
              >
                <FieldLabel theme={theme}>
                  End Date
                </FieldLabel>

                <Controller
                  control={form.control}
                  name="recurrenceEndDate"
                  render={({ field }) => (
                    <CalendarField
                      theme={theme}
                      value={field.value}
                      placeholder="Select end date"
                      hasError={
                        !!form.formState
                          .errors
                          .recurrenceEndDate
                      }
                      onPress={() =>
                        setDatePicker(
                          "recurrenceEnd",
                        )
                      }
                    />
                  )}
                />

                <FieldError
                  theme={theme}
                  message={
                    form.formState.errors
                      .recurrenceEndDate
                      ?.message
                  }
                />

                <Text
                  style={[
                    styles.helperText,
                    {
                      color: theme.textSecondary,
                    },
                  ]}
                >
                  Leave blank for an ongoing recurring transaction.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* RECEIPT */}

        <View
          style={
            styles.attachmentSection
          }
        >
          <FieldLabel theme={theme}>
            Receipt Attachment
          </FieldLabel>

          <Pressable
            style={[
              styles.attachmentButton,
              {
                borderColor:
                  theme.border,
                backgroundColor:
                  theme.surfaceSecondary,
              },
            ]}
          >
            <View
              style={[
                styles.attachmentIcon,
                {
                  backgroundColor:
                    theme.surface,
                },
              ]}
            >
              <Upload
                size={17}
                color={
                  theme.textSecondary
                }
              />
            </View>

            <View
              style={
                styles.attachmentDetails
              }
            >
              <Text
                style={[
                  styles.attachmentTitle,
                  {
                    color: theme.text,
                  },
                ]}
              >
                Upload receipt
              </Text>

              <Text
                style={[
                  styles.attachmentSubtitle,
                  {
                    color: theme.textSecondary,
                  },
                ]}
              >
                Optional receipt or document
              </Text>
            </View>
          </Pressable>
        </View>

        {/* ACTIONS */}

        <View style={styles.actions}>
          <Pressable
            onPress={() =>
              router.back()
            }
            disabled={
              createTransaction.isPending
            }
            style={[
              styles.cancelButton,
              {
                borderColor:
                  theme.border,
                backgroundColor:
                  theme.surface,
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
            onPress={form.handleSubmit(
              handleSubmit,
            )}
            disabled={
              createTransaction.isPending
            }
            style={[
              styles.createButton,
              {
                backgroundColor:
                  theme.primary,
              },
              createTransaction.isPending &&
                styles.disabledButton,
            ]}
          >
            {createTransaction.isPending ? (
              <ActivityIndicator
                size="small"
                color={
                  theme.primaryText
                }
              />
            ) : (
              <>
                <Plus
                  size={16}
                  color={
                    theme.primaryText
                  }
                />

                <Text
                  style={[
                    styles.createText,
                    {
                      color:
                        theme.primaryText,
                    },
                  ]}
                >
                  Create Transaction
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {datePicker && (
        <TransactionDatePicker
          picker={datePicker}
          value={
            datePicker ===
            "transaction"
              ? form.watch(
                  "transactionDate",
                )
              : datePicker ===
                  "recurrenceStart"
                ? form.watch(
                    "recurrenceStartDate",
                  )
                : form.watch(
                    "recurrenceEndDate",
                  )
          }
          theme={theme}
          onChange={(date) => {
            const fieldName =
              datePicker ===
              "transaction"
                ? "transactionDate"
                : datePicker ===
                    "recurrenceStart"
                  ? "recurrenceStartDate"
                  : "recurrenceEndDate";

            form.setValue(
              fieldName,
              date,
              {
                shouldValidate: true,
                shouldDirty: true,
              },
            );
          }}
          onClose={() =>
            setDatePicker(null)
          }
        />
      )}

      <SelectorModal
        visible={selector !== null}
        title={getSelectorTitle(
          selector,
        )}
        theme={theme}
        onClose={() =>
          setSelector(null)
        }
      >
        {selector ===
          "category" &&
          parentCategories.map(
            (category) => (
              <SelectorOption
                key={category._id}
                theme={theme}
                label={category.name}
                selected={
                  category._id ===
                  categoryId
                }
                icon={category.icon}
                onPress={() => {
                  form.setValue(
                    "categoryId",
                    category._id,
                    {
                      shouldValidate:
                        true,
                    },
                  );

                  form.setValue(
                    "subcategoryId",
                    "",
                    {
                      shouldValidate:
                        true,
                    },
                  );

                  setSelector(null);
                }}
              />
            ),
          )}

        {selector ===
          "subcategory" &&
          subcategories.map(
            (category) => (
              <SelectorOption
                key={category._id}
                theme={theme}
                label={category.name}
                selected={
                  category._id ===
                  subcategoryId
                }
                icon={category.icon}
                onPress={() => {
                  form.setValue(
                    "subcategoryId",
                    category._id,
                    {
                      shouldValidate:
                        true,
                    },
                  );

                  setSelector(null);
                }}
              />
            ),
          )}

        {selector ===
          "payment" &&
          PAYMENT_METHODS.map(
            (method) => (
              <SelectorOption
                key={method}
                theme={theme}
                label={formatPaymentMethod(
                  method,
                )}
                selected={
                  paymentMethod ===
                  method
                }
                onPress={() => {
                  form.setValue(
                    "paymentMethod",
                    method,
                    {
                      shouldValidate:
                        true,
                    },
                  );

                  setSelector(null);
                }}
              />
            ),
          )}

        {selector ===
          "frequency" &&
          RECURRENCE_FREQUENCIES.map(
            (frequency) => (
              <SelectorOption
                key={frequency}
                theme={theme}
                label={formatFrequency(
                  frequency,
                )}
                selected={
                  recurrenceFrequency ===
                  frequency
                }
                onPress={() => {
                  form.setValue(
                    "recurrenceFrequency",
                    frequency,
                    {
                      shouldValidate:
                        true,
                    },
                  );

                  setSelector(null);
                }}
              />
            ),
          )}
      </SelectorModal>
    </KeyboardAvoidingView>
  );
}

/*
 * ===========================================================
 * TRANSACTION TYPE SLIDER
 * ===========================================================
 */

function TransactionTypeSlider({
  value,
  onChange,
  theme,
}: {
  value: "EXPENSE" | "INCOME";
  onChange: (
    value:
      | "EXPENSE"
      | "INCOME",
  ) => void;
  theme: AppTheme;
}) {
  return (
    <View
      style={[
        styles.typeSlider,
        {
          backgroundColor:
            theme.surfaceSecondary,
        },
      ]}
    >
      <Pressable
        onPress={() =>
          onChange("EXPENSE")
        }
        style={({ pressed }) => [
          styles.typeOption,
          value === "EXPENSE" && {
            backgroundColor:
              theme.surface,
          },
          pressed &&
            styles.typeOptionPressed,
        ]}
      >
        <Text
          style={[
            styles.typeOptionText,
            {
              color:
                theme.textSecondary,
            },
            value === "EXPENSE" && {
              color: theme.text,
              fontWeight: "800",
            },
          ]}
        >
          Expense
        </Text>
      </Pressable>

      <Pressable
        onPress={() =>
          onChange("INCOME")
        }
        style={({ pressed }) => [
          styles.typeOption,
          value === "INCOME" && {
            backgroundColor:
              theme.surface,
          },
          pressed &&
            styles.typeOptionPressed,
        ]}
      >
        <Text
          style={[
            styles.typeOptionText,
            {
              color:
                theme.textSecondary,
            },
            value === "INCOME" && {
              color: theme.text,
              fontWeight: "800",
            },
          ]}
        >
          Income
        </Text>
      </Pressable>
    </View>
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
  theme: AppTheme;
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
              color:
                theme.destructive,
            },
          ]}
        >
          {" "}*
        </Text>
      )}
    </Text>
  );
}

/*
 * ===========================================================
 * FIELD ERROR
 * ===========================================================
 */

function FieldError({
  message,
  theme,
}: {
  message?: string;
  theme: AppTheme;
}) {
  if (!message) return null;

  return (
    <Text
      style={[
        styles.errorText,
        {
          color:
            theme.destructive,
        },
      ]}
    >
      {message}
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
  theme: AppTheme;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.selectorButton,
        {
          borderColor: theme.border,
          backgroundColor:
            theme.surface,
        },
        disabled &&
          styles.selectorDisabled,
        pressed &&
          !disabled && {
            backgroundColor:
              theme.surfaceSecondary,
          },
      ]}
    >
      <View
        style={styles.selectorContent}
      >
        {icon ? (
          <View
            style={[
              styles.selectorIcon,
              {
                backgroundColor:
                  theme.surfaceSecondary,
              },
            ]}
          >
            <CategoryIcon
              name={icon}
              size={16}
              color={theme.textSecondary}
            />
          </View>
        ) : null}

        <Text
          numberOfLines={1}
          style={[
            styles.selectorText,
            {
              color: theme.text,
            },
            !icon && {
              color: theme.textSecondary,
              fontWeight: "500",
            },
          ]}
        >
          {label}
        </Text>
      </View>

      <ChevronDown
        size={16}
        color={theme.textSecondary}
      />
    </Pressable>
  );
}

/*
 * ===========================================================
 * CALENDAR FIELD
 * ===========================================================
 */

function CalendarField({
  value,
  placeholder,
  hasError = false,
  onPress,
  theme,
}: {
  value?: string;
  placeholder: string;
  hasError?: boolean;
  onPress: () => void;
  theme: AppTheme;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.calendarField,
        {
          borderColor: theme.border,
          backgroundColor:
            theme.surface,
        },
        hasError && {
          borderColor:
            theme.destructive,
          backgroundColor:
            theme.surfaceSecondary,
        },
      ]}
    >
      <CalendarDays
        size={16}
        color={theme.textSecondary}
      />

      <Text
        numberOfLines={1}
        style={[
          styles.calendarFieldText,
          {
            color: value
              ? theme.text
              : theme.textSecondary,
          },
        ]}
      >
        {value || placeholder}
      </Text>

      <ChevronDown
        size={15}
        color={theme.textSecondary}
      />
    </Pressable>
  );
}

/*
 * ===========================================================
 * DATE PICKER
 * ===========================================================
 */

function TransactionDatePicker({
  picker,
  value,
  onChange,
  onClose,
  theme,
}: {
  picker:
    | "transaction"
    | "recurrenceStart"
    | "recurrenceEnd";
  value?: string;
  onChange: (date: string) => void;
  onClose: () => void;
  theme: AppTheme;
}) {
  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={styles.datePickerBackdrop}
      >
        <Pressable
          style={styles.modalDismiss}
          onPress={onClose}
        />

        <View
          style={[
            styles.datePickerContainer,
            {
              backgroundColor:
                theme.surface,
            },
          ]}
        >
          <View
            style={[
              styles.datePickerHeader,
              {
                borderBottomColor:
                  theme.border,
              },
            ]}
          >
            <View>
              <Text
                style={[
                  styles.datePickerTitle,
                  {
                    color: theme.text,
                  },
                ]}
              >
                Select Date
              </Text>

              <Text
                style={[
                  styles.datePickerSubtitle,
                  {
                    color: theme.textSecondary,
                  },
                ]}
              >
                {value || "Choose a date"}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={[
                styles.modalClose,
                {
                  backgroundColor:
                    theme.surfaceSecondary,
                },
              ]}
            >
              <X
                size={17}
                color={
                  theme.textSecondary
                }
              />
            </Pressable>
          </View>

          <DateTimePicker
            value={parseDate(value)}
            mode="date"
            display={
              Platform.OS === "ios"
                ? "inline"
                : "calendar"
            }
            onChange={(
              event,
              selectedDate,
            ) => {
              if (
                Platform.OS ===
                  "android" &&
                event.type ===
                  "dismissed"
              ) {
                onClose();
                return;
              }

              if (selectedDate) {
                onChange(
                  formatDate(
                    selectedDate,
                  ),
                );
              }

              if (
                Platform.OS ===
                "android"
              ) {
                onClose();
              }
            }}
            style={styles.datePicker}
          />

          {picker ===
            "recurrenceEnd" &&
            value && (
              <Pressable
                onPress={() => {
                  onChange("");
                  onClose();
                }}
                style={[
                  styles.clearDateButton,
                  {
                    backgroundColor:
                      theme.surfaceSecondary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.clearDateText,
                    {
                      color:
                        theme.textSecondary,
                    },
                  ]}
                >
                  Clear End Date
                </Text>
              </Pressable>
            )}

          {Platform.OS === "ios" && (
            <Pressable
              onPress={onClose}
              style={[
                styles.doneDateButton,
                {
                  backgroundColor:
                    theme.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.doneDateText,
                  {
                    color:
                      theme.primaryText,
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
  theme: AppTheme;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={styles.modalBackdrop}
      >
        <Pressable
          style={styles.modalDismiss}
          onPress={onClose}
        />

        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor:
                theme.surface,
            },
          ]}
        >
          <View
            style={[
              styles.modalHeader,
              {
                borderBottomColor:
                  theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                {
                  color: theme.text,
                },
              ]}
            >
              {title}
            </Text>

            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={[
                styles.modalClose,
                {
                  backgroundColor:
                    theme.surfaceSecondary,
                },
              ]}
            >
              <X
                size={17}
                color={
                  theme.textSecondary
                }
              />
            </Pressable>
          </View>

          <ScrollView
            style={styles.modalList}
            contentContainerStyle={
              styles.modalListContent
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={
              false
            }
          >
            {children}
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
  selected,
  icon,
  onPress,
  theme,
}: {
  label: string;
  selected: boolean;
  icon?: string;
  onPress: () => void;
  theme: AppTheme;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={2}
      style={({ pressed }) => [
        styles.option,
        {
          borderColor:
            selected
              ? theme.text
              : theme.border,
          backgroundColor:
            selected
              ? theme.surfaceSecondary
              : theme.surface,
        },
        pressed && {
          opacity: 0.8,
        },
      ]}
    >
      <View
        style={styles.optionLeft}
      >
        {icon && (
          <View
            style={[
              styles.optionIcon,
              {
                backgroundColor:
                  theme.surfaceSecondary,
              },
            ]}
          >
            <CategoryIcon
              name={icon}
              size={16}
              color={
                theme.textSecondary
              }
            />
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

      {selected && (
        <View
          style={[
            styles.selectedDot,
            {
              backgroundColor:
                theme.primary,
            },
          ]}
        />
      )}
    </Pressable>
  );
}

/*
 * ===========================================================
 * FORMATTERS
 * ===========================================================
 */

function formatPaymentMethod(
  value: PaymentMethod,
) {
  switch (value) {
    case "CASH":
      return "Cash";
    case "CARD":
      return "Card";
    case "UPI":
      return "UPI";
    case "BANK_TRANSFER":
      return "Bank Transfer";
    case "WALLET":
      return "Wallet";
    case "CHEQUE":
      return "Cheque";
    case "OTHER":
      return "Other";
    default:
      return value;
  }
}

function formatFrequency(
  value: RecurrenceFrequency,
) {
  switch (value) {
    case "DAILY":
      return "Daily";
    case "WEEKLY":
      return "Weekly";
    case "MONTHLY":
      return "Monthly";
    case "QUARTERLY":
      return "Quarterly";
    case "HALF_YEARLY":
      return "Half Yearly";
    case "YEARLY":
      return "Yearly";
    default:
      return value;
  }
}

function getSelectorTitle(
  selector:
    | "category"
    | "subcategory"
    | "payment"
    | "frequency"
    | null,
) {
  switch (selector) {
    case "category":
      return "Select Category";
    case "subcategory":
      return "Select Subcategory";
    case "payment":
      return "Payment Method";
    case "frequency":
      return "Recurrence Frequency";
    default:
      return "";
  }
}

/*
 * ===========================================================
 * STATIC STYLES
 * ===========================================================
 */

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
    },

    content: {
      paddingHorizontal: 16,
      paddingTop: 18,
      paddingBottom: 140,
    },

    pageIntro: {
      marginBottom: 20,
    },

    pageTitle: {
      fontSize: 23,
      fontWeight: "800",
      letterSpacing: -0.4,
    },

    pageSubtitle: {
      marginTop: 4,
      fontSize: 11,
      fontWeight: "500",
    },

    field: {
      marginBottom: 16,
    },

    row: {
      flexDirection: "row",
      gap: 10,
      marginBottom: 16,
    },

    flexField: {
      flex: 1,
      minWidth: 0,
    },

    currencyField: {
      width: 82,
    },

    label: {
      marginBottom: 7,
      fontSize: 11,
      fontWeight: "700",
    },

    required: {},

    typeSlider: {
      width: "100%",
      flexDirection: "row",
      padding: 3,
      borderRadius: 13,
    },

    typeOption: {
      flex: 1,
      height: 42,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
    },

    typeOptionPressed: {
      opacity: 0.7,
    },

    typeOptionText: {
      fontSize: 11,
      fontWeight: "600",
    },

    input: {
      height: 46,
      paddingHorizontal: 13,
      borderWidth: 1,
      borderRadius: 11,
      fontSize: 12,
      fontWeight: "500",
    },

    textarea: {
      height: 88,
      paddingTop: 12,
      textAlignVertical: "top",
    },

    characterHint: {
      marginTop: 4,
      fontSize: 9,
    },

    errorText: {
      marginTop: 5,
      fontSize: 10,
      fontWeight: "500",
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

    selectorContent: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },

    selectorIcon: {
      width: 25,
      height: 25,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 7,
    },

    selectorText: {
      flex: 1,
      fontSize: 11,
      fontWeight: "600",
    },

    readOnlyInput: {
      height: 46,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 13,
      borderWidth: 1,
      borderRadius: 11,
    },

    readOnlyCurrency: {
      fontSize: 12,
      fontWeight: "800",
    },

    readOnlyLabel: {
      fontSize: 8,
      fontWeight: "700",
    },

    calendarField: {
      height: 46,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 11,
      borderWidth: 1,
      borderRadius: 11,
    },

    calendarFieldText: {
      flex: 1,
      marginLeft: 7,
      marginRight: 6,
      fontSize: 11,
      fontWeight: "600",
    },

    recurringContainer: {
      marginBottom: 18,
      padding: 14,
      borderWidth: 1,
      borderRadius: 14,
    },

    recurringHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    recurringLeft: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
    },

    recurringIcon: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
      borderRadius: 10,
    },

    recurringDetails: {
      flex: 1,
    },

    recurringTitle: {
      fontSize: 12,
      fontWeight: "700",
    },

    recurringSubtitle: {
      marginTop: 2,
      fontSize: 9,
    },

    recurringFields: {
      marginTop: 14,
      paddingTop: 14,
      borderTopWidth: 1,
    },

    recurringField: {
      marginTop: 14,
    },

    helperText: {
      marginTop: 5,
      fontSize: 9,
    },

    attachmentSection: {
      marginBottom: 20,
    },

    attachmentButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderWidth: 1,
      borderStyle: "dashed",
      borderRadius: 12,
    },

    attachmentIcon: {
      width: 36,
      height: 36,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 9,
    },

    attachmentDetails: {
      flex: 1,
      marginLeft: 10,
    },

    attachmentTitle: {
      fontSize: 11,
      fontWeight: "700",
    },

    attachmentSubtitle: {
      marginTop: 2,
      fontSize: 9,
    },

    actions: {
      flexDirection: "row",
      gap: 10,
      marginTop: 4,
      marginBottom: 12,
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

    createButton: {
      flex: 1,
      height: 46,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      borderRadius: 11,
    },

    createText: {
      fontSize: 11,
      fontWeight: "700",
    },

    disabledButton: {
      opacity: 0.55,
    },

    datePickerBackdrop: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      backgroundColor:
        "rgba(0,0,0,0.55)",
    },

    datePickerContainer: {
      width: "100%",
      borderRadius: 20,
      paddingBottom: 14,
      overflow: "hidden",
    },

    datePickerHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 18,
      paddingVertical: 14,
      borderBottomWidth: 1,
    },

    datePickerTitle: {
      fontSize: 14,
      fontWeight: "800",
    },

    datePickerSubtitle: {
      marginTop: 2,
      fontSize: 10,
      fontWeight: "500",
    },

    datePicker: {
      alignSelf: "center",
      marginVertical: 8,
    },

    clearDateButton: {
      alignSelf: "center",
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 9,
    },

    clearDateText: {
      fontSize: 10,
      fontWeight: "700",
    },

    doneDateButton: {
      alignSelf: "center",
      minWidth: 100,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 4,
      paddingHorizontal: 18,
      borderRadius: 10,
    },

    doneDateText: {
      fontSize: 10,
      fontWeight: "800",
    },

    modalBackdrop: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor:
        "rgba(0,0,0,0.55)",
    },

    modalDismiss: {
      ...StyleSheet.absoluteFill,
    },

    modalContainer: {
      maxHeight: "70%",
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      overflow: "hidden",
    },

    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 18,
      paddingVertical: 14,
      borderBottomWidth: 1,
    },

    modalTitle: {
      fontSize: 14,
      fontWeight: "800",
    },

    modalClose: {
      width: 32,
      height: 32,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 9,
    },

    modalList: {
      paddingHorizontal: 14,
    },

    modalListContent: {
      paddingTop: 14,
      paddingBottom: 24,
    },

    option: {
      minHeight: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 12,
      marginBottom: 7,
      borderWidth: 1,
      borderRadius: 11,
    },

    optionLeft: {
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

    selectedDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
  });