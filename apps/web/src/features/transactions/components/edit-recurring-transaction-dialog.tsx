"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Pencil,
  X,
  Repeat,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCategories } from "@/features/categories/hooks/use-categories";
import { CategoryIcon } from "@/features/categories/components/category-icon";

import { useUpdateRecurringTransaction } from "../hooks/use-update-recurring-transaction";

import type { Category } from "@/types/category.types";

import type {
  PaymentMethod,
  RecurrenceFrequency,
  RecurrenceStatus,
  Transaction,
  TransactionType,
  UpdateRecurringTransactionInput,
} from "@/types/transaction.types";

interface EditRecurringTransactionDialogProps {
  transaction: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getId(
  value: string | Category | null | undefined,
): string {
  if (!value) return "";

  return typeof value === "string"
    ? value
    : value._id;
}

function toDateInputValue(date: string | null) {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

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

const RECURRENCE_STATUSES: RecurrenceStatus[] = [
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
];

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}

export function EditRecurringTransactionDialog({
  transaction,
  open,
  onOpenChange,
}: EditRecurringTransactionDialogProps) {
  const updateRecurringTransaction =
    useUpdateRecurringTransaction();

  const {
    data: categoryResponse,
    isLoading: categoriesLoading,
  } = useCategories();

  const categories = categoryResponse?.data ?? [];

  const parentCategories = useMemo(
    () =>
      categories.filter(
        (category) => category.level === 0,
      ),
    [categories],
  );

  const [type, setType] =
    useState<TransactionType>(transaction.type);

  const [categoryId, setCategoryId] =
    useState("");

  const [subcategoryId, setSubcategoryId] =
    useState("");

  const [title, setTitle] =
    useState(transaction.title);

  const [amount, setAmount] =
    useState(String(transaction.amount));

  const [currency, setCurrency] =
    useState(transaction.currency);

  const [description, setDescription] =
    useState(transaction.description ?? "");

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod | "">(
      transaction.paymentMethod ?? "",
    );

  const [transactionDate, setTransactionDate] =
    useState(
      toDateInputValue(
        transaction.transactionDate,
      ),
    );

  const [recurrenceFrequency, setRecurrenceFrequency] =
    useState<RecurrenceFrequency | "">(
      transaction.recurrenceFrequency ?? "",
    );

  const [recurrenceStartDate, setRecurrenceStartDate] =
    useState(
      toDateInputValue(
        transaction.recurrenceStartDate,
      ),
    );

  const [recurrenceEndDate, setRecurrenceEndDate] =
    useState(
      toDateInputValue(
        transaction.recurrenceEndDate,
      ),
    );

  const [recurrenceStatus, setRecurrenceStatus] =
    useState<RecurrenceStatus | "">(
      transaction.recurrenceStatus ?? "ACTIVE",
    );

  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setType(transaction.type);

    setCategoryId(
      getId(transaction.categoryId),
    );

    setSubcategoryId(
      getId(transaction.subcategoryId),
    );

    setTitle(transaction.title);

    setAmount(
      String(transaction.amount),
    );

    setCurrency(transaction.currency);

    setDescription(
      transaction.description ?? "",
    );

    setPaymentMethod(
      transaction.paymentMethod ?? "",
    );

    setTransactionDate(
      toDateInputValue(
        transaction.transactionDate,
      ),
    );

    setRecurrenceFrequency(
      transaction.recurrenceFrequency ?? "",
    );

    setRecurrenceStartDate(
      toDateInputValue(
        transaction.recurrenceStartDate,
      ),
    );

    setRecurrenceEndDate(
      toDateInputValue(
        transaction.recurrenceEndDate,
      ),
    );

    setRecurrenceStatus(
      transaction.recurrenceStatus ?? "ACTIVE",
    );

    setError("");
  }, [open, transaction]);

  const availableCategories =
    parentCategories.filter(
      (category) =>
        category.type === type,
    );

  const subcategories = useMemo(
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

  const isDirty = useMemo(() => {
    const initialCategoryId =
      getId(transaction.categoryId);

    const initialSubcategoryId =
      getId(transaction.subcategoryId);

    return (
      type !== transaction.type ||
      categoryId !== initialCategoryId ||
      subcategoryId !==
        initialSubcategoryId ||
      title.trim() !== transaction.title ||
      Number(amount) !== transaction.amount ||
      currency.trim().toUpperCase() !==
        transaction.currency ||
      description.trim() !==
        (transaction.description ?? "") ||
      paymentMethod !==
        (transaction.paymentMethod ?? "") ||
      transactionDate !==
        toDateInputValue(
          transaction.transactionDate,
        ) ||
      recurrenceFrequency !==
        (transaction.recurrenceFrequency ?? "") ||
      recurrenceStartDate !==
        toDateInputValue(
          transaction.recurrenceStartDate,
        ) ||
      recurrenceEndDate !==
        toDateInputValue(
          transaction.recurrenceEndDate,
        ) ||
      recurrenceStatus !==
        (transaction.recurrenceStatus ?? "ACTIVE")
    );
  }, [
    type,
    categoryId,
    subcategoryId,
    title,
    amount,
    currency,
    description,
    paymentMethod,
    transactionDate,
    recurrenceFrequency,
    recurrenceStartDate,
    recurrenceEndDate,
    recurrenceStatus,
    transaction,
  ]);

  const handleTypeChange = (
    nextType: TransactionType,
  ) => {
    setType(nextType);

    const currentCategory =
      categories.find(
        (category) =>
          category._id === categoryId,
      );

    if (
      currentCategory &&
      currentCategory.type !== nextType
    ) {
      setCategoryId("");
      setSubcategoryId("");
    }
  };

  const handleCategoryChange = (
    nextCategoryId: string | null,
  ) => {
    setCategoryId(nextCategoryId ?? "");
    setSubcategoryId("");
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (!categoryId) {
      setError(
        "Please select a category.",
      );
      return;
    }

    if (!title.trim()) {
      setError(
        "Transaction title is required.",
      );
      return;
    }

    const numericAmount =
      Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError(
        "Amount must be greater than 0.",
      );
      return;
    }

    if (!currency.trim()) {
      setError(
        "Currency is required.",
      );
      return;
    }

    if (!transactionDate) {
      setError(
        "Transaction date is required.",
      );
      return;
    }

    if (!recurrenceFrequency) {
      setError(
        "Recurrence frequency is required.",
      );
      return;
    }

    if (!recurrenceStartDate) {
      setError(
        "Recurrence start date is required.",
      );
      return;
    }

    if (
      recurrenceEndDate &&
      recurrenceEndDate <
        recurrenceStartDate
    ) {
      setError(
        "Recurrence end date must be after the start date.",
      );
      return;
    }

    if (!recurrenceStatus) {
      setError(
        "Recurrence status is required.",
      );
      return;
    }

    const payload: UpdateRecurringTransactionInput =
      {
        categoryId,
        type,
        amount: numericAmount,
        currency:
          currency.trim().toUpperCase(),
        title: title.trim(),
        description:
          description.trim() || undefined,
        paymentMethod:
          paymentMethod || undefined,
        transactionDate:
          new Date(
            `${transactionDate}T00:00:00`,
          ).toISOString(),

        recurrenceFrequency,
        recurrenceStartDate:
          new Date(
            `${recurrenceStartDate}T00:00:00`,
          ).toISOString(),

        recurrenceEndDate:
          recurrenceEndDate
            ? new Date(
                `${recurrenceEndDate}T00:00:00`,
              ).toISOString()
            : undefined,

        recurrenceStatus,
      };

    if (subcategoryId) {
      payload.subcategoryId =
        subcategoryId;
    }

    try {
      await updateRecurringTransaction.mutateAsync(
        {
          transactionId:
            transaction._id,
          payload,
        },
      );

      onOpenChange(false);
    } catch {
      setError(
        "Unable to update recurring transaction. Please try again.",
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-0">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border/60 bg-card shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Repeat className="size-5" />
            </div>

            <div>
              <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                Edit Recurring Transaction
              </h2>

              <p className="text-xs text-muted-foreground">
                Update transaction and recurrence settings
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onOpenChange(false)
            }
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-5 sm:p-6"
        >
          {/* Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium sm:text-sm">
              Transaction Type
            </Label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleTypeChange(
                    "EXPENSE",
                  )
                }
                className={`h-10 rounded-xl border text-xs font-semibold transition-all ${
                  type === "EXPENSE"
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border/60 text-muted-foreground hover:bg-muted/50"
                }`}
              >
                Expense
              </button>

              <button
                type="button"
                onClick={() =>
                  handleTypeChange(
                    "INCOME",
                  )
                }
                className={`h-10 rounded-xl border text-xs font-semibold transition-all ${
                  type === "INCOME"
                    ? "border-emerald-500/80 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-border/60 text-muted-foreground hover:bg-muted/50"
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium sm:text-sm">
              Category
            </Label>

            <Select
              value={categoryId || undefined}
              onValueChange={
                handleCategoryChange
              }
              disabled={
                categoriesLoading
              }
            >
              <SelectTrigger className="h-11 text-sm sm:h-10">
                <SelectValue placeholder="Select category">
                  {selectedCategory && (
                    <div className="flex items-center gap-2">
                      <CategoryIcon
                        name={
                          selectedCategory.icon
                        }
                        className="size-4"
                      />

                      <span>
                        {
                          selectedCategory.name
                        }
                      </span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {availableCategories.map(
                  (category) => (
                    <SelectItem
                      key={category._id}
                      value={category._id}
                    >
                      <div className="flex items-center gap-2">
                        <CategoryIcon
                          name={
                            category.icon
                          }
                          className="size-4"
                        />

                        <span>
                          {category.name}
                        </span>
                      </div>
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium sm:text-sm">
              Subcategory{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>

            <Select
              value={
                subcategoryId ||
                undefined
              }
              onValueChange={(value) =>
                setSubcategoryId(
                  value ?? "",
                )
              }
              disabled={
                !categoryId ||
                subcategories.length ===
                  0
              }
            >
              <SelectTrigger className="h-11 text-sm sm:h-10">
                <SelectValue placeholder="Select subcategory">
                  {selectedSubcategory && (
                    <div className="flex items-center gap-2">
                      <CategoryIcon
                        name={
                          selectedSubcategory.icon
                        }
                        className="size-4"
                      />

                      <span>
                        {
                          selectedSubcategory.name
                        }
                      </span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {subcategories.map(
                  (subcategory) => (
                    <SelectItem
                      key={
                        subcategory._id
                      }
                      value={
                        subcategory._id
                      }
                    >
                      <div className="flex items-center gap-2">
                        <CategoryIcon
                          name={
                            subcategory.icon
                          }
                          className="size-4"
                        />

                        <span>
                          {
                            subcategory.name
                          }
                        </span>
                      </div>
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label
              htmlFor="edit-recurring-title"
              className="text-xs font-medium sm:text-sm"
            >
              Title
            </Label>

            <Input
              id="edit-recurring-title"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value,
                )
              }
              maxLength={100}
              className="h-11 text-sm sm:h-10"
            />
          </div>

          {/* Amount + Currency */}
          <div className="grid grid-cols-[1fr_120px] gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium sm:text-sm">
                Amount
              </Label>

              <Input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) =>
                  setAmount(
                    event.target.value,
                  )
                }
                className="h-11 text-sm sm:h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium sm:text-sm">
                Currency
              </Label>

              <Input
                value={currency}
                maxLength={3}
                onChange={(event) =>
                  setCurrency(
                    event.target.value.toUpperCase(),
                  )
                }
                className="h-11 font-mono text-sm uppercase sm:h-10"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium sm:text-sm">
              Payment Method
            </Label>

            <Select
              value={
                paymentMethod ||
                undefined
              }
              onValueChange={(value) =>
                setPaymentMethod(
                  value as PaymentMethod,
                )
              }
            >
              <SelectTrigger className="h-11 text-sm sm:h-10">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>

              <SelectContent>
                {PAYMENT_METHODS.map(
                  (method) => (
                    <SelectItem
                      key={method}
                      value={method}
                    >
                      {formatEnum(method)}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Date */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium sm:text-sm">
              Transaction Date
            </Label>

            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                type="date"
                value={
                  transactionDate
                }
                onChange={(event) =>
                  setTransactionDate(
                    event.target.value,
                  )
                }
                className="h-11 pl-10 text-sm sm:h-10"
              />
            </div>
          </div>

          {/* Recurrence */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="mb-4 flex items-center gap-2">
              <Repeat className="size-4 text-primary" />

              <div>
                <p className="text-sm font-semibold">
                  Recurrence Settings
                </p>

                <p className="text-[11px] text-muted-foreground">
                  Configure when this transaction repeats
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Frequency */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium sm:text-sm">
                  Frequency
                </Label>

                <Select
                  value={
                    recurrenceFrequency ||
                    undefined
                  }
                  onValueChange={(value) =>
                    setRecurrenceFrequency(
                      value as RecurrenceFrequency,
                    )
                  }
                >
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>

                  <SelectContent>
                    {RECURRENCE_FREQUENCIES.map(
                      (frequency) => (
                        <SelectItem
                          key={frequency}
                          value={frequency}
                        >
                          {formatEnum(
                            frequency,
                          )}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Start + End */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium sm:text-sm">
                    Start Date
                  </Label>

                  <Input
                    type="date"
                    value={
                      recurrenceStartDate
                    }
                    onChange={(event) =>
                      setRecurrenceStartDate(
                        event.target.value,
                      )
                    }
                    className="h-10 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium sm:text-sm">
                    End Date{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </Label>

                  <Input
                    type="date"
                    value={
                      recurrenceEndDate
                    }
                    min={
                      recurrenceStartDate ||
                      undefined
                    }
                    onChange={(event) =>
                      setRecurrenceEndDate(
                        event.target.value,
                      )
                    }
                    className="h-10 text-sm"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium sm:text-sm">
                  Status
                </Label>

                <Select
                  value={
                    recurrenceStatus ||
                    undefined
                  }
                  onValueChange={(value) =>
                    setRecurrenceStatus(
                      value as RecurrenceStatus,
                    )
                  }
                >
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent>
                    {RECURRENCE_STATUSES.map(
                      (status) => (
                        <SelectItem
                          key={status}
                          value={status}
                        >
                          {formatEnum(
                            status,
                          )}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="edit-recurring-description"
              className="text-xs font-medium sm:text-sm"
            >
              Description
            </Label>

            <textarea
              id="edit-recurring-description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              maxLength={500}
              rows={3}
              className="min-h-20 w-full resize-none rounded-xl border border-border/60 bg-background p-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse justify-end gap-2 border-t border-border/60 pt-4 sm:flex-row sm:gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={
                updateRecurringTransaction.isPending
              }
              onClick={() =>
                onOpenChange(false)
              }
              className="h-11 text-xs font-medium sm:h-10 sm:text-sm"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                !isDirty ||
                updateRecurringTransaction.isPending ||
                !categoryId ||
                !title.trim() ||
                !amount ||
                !transactionDate ||
                !recurrenceFrequency ||
                !recurrenceStartDate
              }
              className="h-11 text-xs font-semibold sm:h-10 sm:text-sm"
            >
              {updateRecurringTransaction.isPending
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}