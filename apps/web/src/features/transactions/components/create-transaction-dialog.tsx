"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Plus, Upload, X, Receipt, Repeat } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCategories } from "@/features/categories/hooks/use-categories";
import { CategoryIcon } from "@/features/categories/components/category-icon";

import { useCreateTransaction } from "../hooks/use-create-transaction";

import {
  createTransactionSchema,
  type CreateTransactionFormValues,
} from "../schemas/create-transaction.schema";
import { formatEnum } from "@/features/budgets/components/create-budget-dialog";

export function CreateTransactionDialog() {
  const [open, setOpen] = useState(false);
  const [receipt, setReceipt] = useState<File | undefined>();

  const { data, isLoading: categoriesLoading } = useCategories();
  const createTransaction = useCreateTransaction();

  const categories = data?.data ?? [];

  const form = useForm<CreateTransactionFormValues>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      categoryId: "",
      subcategoryId: "",
      type: "EXPENSE",
      amount: 0,
      currency: "INR",
      title: "",
      description: "",
      paymentMethod: undefined,
      transactionDate: new Date().toISOString().slice(0, 10),
      isRecurring: false,
      recurrenceFrequency: undefined,
      recurrenceStartDate: "",
      recurrenceEndDate: "",
    },
  });

  const type = form.watch("type");
  const categoryId = form.watch("categoryId");
  const subcategoryId = form.watch("subcategoryId");
  const isRecurring = form.watch("isRecurring");
  const paymentMethod = form.watch("paymentMethod");
  const recurrenceFrequency = form.watch("recurrenceFrequency");

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

  useEffect(() => {
    const currentCategory = form.getValues("categoryId");
    const categoryStillValid = parentCategories.some(
      (category) => category._id === currentCategory,
    );

    if (currentCategory && !categoryStillValid) {
      form.setValue("categoryId", "");
      form.setValue("subcategoryId", "");
    }
  }, [type, parentCategories, form]);

  useEffect(() => {
    const currentSubcategory = form.getValues("subcategoryId");
    const subcategoryStillValid = subcategories.some(
      (category) => category._id === currentSubcategory,
    );

    if (currentSubcategory && !subcategoryStillValid) {
      form.setValue("subcategoryId", "");
    }
  }, [categoryId, subcategories, form]);

  useEffect(() => {
    if (!open) return;

    form.reset({
      categoryId: "",
      subcategoryId: "",
      type: "EXPENSE",
      amount: 0,
      currency: "INR",
      title: "",
      description: "",
      paymentMethod: undefined,
      transactionDate: new Date().toISOString().slice(0, 10),
      isRecurring: false,
      recurrenceFrequency: undefined,
      recurrenceStartDate: "",
      recurrenceEndDate: "",
    });

    setReceipt(undefined);
  }, [open, form]);

  const handleSubmit = async (values: CreateTransactionFormValues) => {
    try {
      await createTransaction.mutateAsync({
        ...values,
        subcategoryId: values.subcategoryId || undefined,
        description: values.description || undefined,
        receipt,
      });

      setOpen(false);
    } catch {
      // Error is handled upstream via toast hooks
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-full flex-row! items-center justify-center gap-2 whitespace-nowrap px-4 text-xs font-semibold transition-all active:scale-95 sm:w-auto sm:text-sm"
      >
        <div className="flex flex-row items-center gap-2 whitespace-nowrap">
          <Plus className="size-4 shrink-0" />
          <span>Add Transaction</span>
        </div>
      </Button>

      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-0">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border/60 bg-card p-6 shadow-2xl transition-all sm:p-7 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Receipt className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                    Add Transaction
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Record a new income or expense item
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              {/* Type Selection */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground sm:text-sm">
                  Transaction Type
                </Label>
                <Select
                  value={type}
                  onValueChange={(value) => {
                    form.setValue("type", value as "INCOME" | "EXPENSE", {
                      shouldValidate: true,
                    });
                    form.setValue("categoryId", "");
                    form.setValue("subcategoryId", "");
                  }}
                >
                  <SelectTrigger className="h-11 px-3.5 text-sm sm:h-10">
                    <SelectValue>
                      {(value) => formatEnum(value as string)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category & Subcategory Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Category */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground sm:text-sm">
                    Category
                  </Label>
                  <Select
                    value={categoryId || ""}
                    onValueChange={(value) => {
                      form.setValue("categoryId", value ?? "", {
                        shouldValidate: true,
                      });
                      form.setValue("subcategoryId", "");
                    }}
                  >
                    <SelectTrigger className="h-11 px-3.5 text-sm sm:h-10">
                      <SelectValue
                        placeholder={
                          categoriesLoading
                            ? "Loading categories..."
                            : "Select category"
                        }
                      >
                        {selectedCategory ? (
                          <div className="flex items-center gap-2">
                            <CategoryIcon
                              name={selectedCategory.icon}
                              className="size-4"
                            />
                            <span>{selectedCategory.name}</span>
                          </div>
                        ) : null}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {parentCategories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          <div className="flex items-center gap-2">
                            <CategoryIcon
                              name={category.icon}
                              className="size-4"
                            />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.categoryId && (
                    <p className="text-xs font-medium text-destructive">
                      {form.formState.errors.categoryId.message}
                    </p>
                  )}
                </div>

                {/* Subcategory */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground sm:text-sm">
                    Subcategory
                  </Label>
                  <Select
                    value={subcategoryId || ""}
                    onValueChange={(value) => {
                      form.setValue("subcategoryId", value ?? "");
                    }}
                    disabled={!categoryId || !subcategories.length}
                  >
                    <SelectTrigger className="h-11 px-3.5 text-sm sm:h-10">
                      <SelectValue
                        placeholder={
                          !categoryId
                            ? "Select category first"
                            : subcategories.length
                              ? "Select subcategory"
                              : "No subcategories"
                        }
                      >
                        {selectedSubcategory ? (
                          <div className="flex items-center gap-2">
                            <CategoryIcon
                              name={selectedSubcategory.icon}
                              className="size-4"
                            />
                            <span>{selectedSubcategory.name}</span>
                          </div>
                        ) : null}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          <div className="flex items-center gap-2">
                            <CategoryIcon
                              name={category.icon}
                              className="size-4"
                            />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Amount + Currency */}
              <div className="grid gap-4 sm:grid-cols-[1fr_130px]">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="amount"
                    className="text-xs font-medium text-foreground sm:text-sm"
                  >
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    {...form.register("amount", { valueAsNumber: true })}
                    placeholder="0.00"
                    className="h-11 px-3.5 text-sm sm:h-10 placeholder:text-muted-foreground/60"
                  />
                  {form.formState.errors.amount && (
                    <p className="text-xs font-medium text-destructive">
                      {form.formState.errors.amount.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground sm:text-sm">
                    Currency
                  </Label>
                  <Input
                    maxLength={3}
                    {...form.register("currency")}
                    className="h-11 px-3.5 text-sm uppercase font-mono sm:h-10"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="title"
                  className="text-xs font-medium text-foreground sm:text-sm"
                >
                  Title
                </Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="e.g. Weekly Grocery Shopping"
                  maxLength={100}
                  className="h-11 px-3.5 text-sm sm:h-10 placeholder:text-muted-foreground/60"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="description"
                  className="text-xs font-medium text-foreground sm:text-sm"
                >
                  Description
                </Label>
                <textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Optional notes or merchant details..."
                  maxLength={500}
                  className="min-h-20 w-full rounded-xl border border-border/60 bg-background p-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/60 resize-none"
                />
              </div>

              {/* Payment Method & Date */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground sm:text-sm">
                    Payment Method
                  </Label>
                  <Select
                    value={paymentMethod ?? ""}
                    onValueChange={(value) =>
                      form.setValue(
                        "paymentMethod",
                        value as
                          | "CASH"
                          | "CARD"
                          | "UPI"
                          | "BANK_TRANSFER"
                          | "WALLET"
                          | "CHEQUE"
                          | "OTHER",
                      )
                    }
                  >
                    <SelectTrigger className="h-11 px-3.5 text-sm sm:h-10">
                      <SelectValue placeholder="Select payment method">
                        {(value) => formatEnum(value as string)}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="CARD">Card</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="BANK_TRANSFER">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="WALLET">Wallet</SelectItem>
                      <SelectItem value="CHEQUE">Cheque</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="transactionDate"
                    className="text-xs font-medium text-foreground sm:text-sm"
                  >
                    Transaction Date
                  </Label>
                  <div className="relative flex items-center">
                    <CalendarDays className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
                    <Input
                      id="transactionDate"
                      type="date"
                      {...form.register("transactionDate")}
                      className="h-11 pl-9 pr-3 text-sm sm:h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Recurring Toggle Container */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-card text-muted-foreground shadow-xs">
                      <Repeat className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground sm:text-sm">
                        Recurring Transaction
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Automatically log this entry on schedule
                      </p>
                    </div>
                  </div>

                  <Switch
                    checked={isRecurring}
                    onCheckedChange={(checked) =>
                      form.setValue("isRecurring", checked)
                    }
                  />
                </div>

                {isRecurring && (
                  <div className="mt-4 grid gap-4 border-t border-border/60 pt-4 sm:grid-cols-2 animate-in fade-in-0">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground sm:text-sm">
                        Frequency
                      </Label>
                      <Select
                        value={recurrenceFrequency ?? ""}
                        onValueChange={(value) =>
                          form.setValue(
                            "recurrenceFrequency",
                            value as
                              | "DAILY"
                              | "WEEKLY"
                              | "MONTHLY"
                              | "QUARTERLY"
                              | "HALF_YEARLY"
                              | "YEARLY",
                          )
                        }
                      >
                        <SelectTrigger className="h-11 px-3.5 text-sm sm:h-10">
                          <SelectValue placeholder="Select frequency">
                            {(value) => formatEnum(value as string)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DAILY">Daily</SelectItem>
                          <SelectItem value="WEEKLY">Weekly</SelectItem>
                          <SelectItem value="MONTHLY">Monthly</SelectItem>
                          <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                          <SelectItem value="HALF_YEARLY">
                            Half Yearly
                          </SelectItem>
                          <SelectItem value="YEARLY">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground sm:text-sm">
                        Start Date
                      </Label>
                      <Input
                        type="date"
                        {...form.register("recurrenceStartDate")}
                        className="h-11 px-3.5 text-sm sm:h-10"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs font-medium text-foreground sm:text-sm">
                        End Date
                      </Label>
                      <Input
                        type="date"
                        {...form.register("recurrenceEndDate")}
                        className="h-11 px-3.5 text-sm sm:h-10"
                      />
                      <p className="text-[11px] text-muted-foreground">
                        Leave blank for an ongoing recurring transaction
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Receipt Upload Dropzone */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground sm:text-sm">
                  Receipt Attachment
                </Label>

                <label className="flex cursor-pointer items-center gap-3.5 rounded-xl border border-dashed border-border/80 bg-muted/20 p-3.5 transition-colors hover:bg-muted/40">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-muted-foreground shadow-xs">
                    <Upload className="size-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground truncate sm:text-sm">
                      {receipt ? receipt.name : "Upload receipt or document"}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      PNG, JPG or PDF up to 5 MB (Optional)
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(event) => setReceipt(event.target.files?.[0])}
                  />
                </label>
              </div>

              {/* Form Action Controls */}
              <div className="flex flex-col-reverse justify-end gap-2 border-t border-border/60 pt-4 sm:flex-row sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={createTransaction.isPending}
                  className="h-11 text-xs font-medium sm:h-10 sm:text-sm"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  loading={createTransaction.isPending}
                  className="h-11 text-xs font-semibold sm:h-10 sm:text-sm"
                >
                  Create Transaction
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
