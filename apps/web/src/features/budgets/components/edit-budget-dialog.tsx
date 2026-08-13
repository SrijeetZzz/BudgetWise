"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Pencil, X } from "lucide-react";

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

import { useUpdateBudget } from "../hooks/use-update-budget";

import type { Category } from "@/types/category.types";
import type {
  Budget,
  BudgetPeriod,
  BudgetScope,
  UpdateBudgetInput,
} from "@/types/budget.types";

interface EditBudgetDialogProps {
  budget: Budget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getId(value: string | { _id: string } | null | undefined) {
  if (!value) return "";
  return typeof value === "string" ? value : value._id;
}

function toDateInputValue(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

const SCOPES: BudgetScope[] = ["OVERALL", "CATEGORY", "SUBCATEGORY"];

const PERIODS: BudgetPeriod[] = ["WEEKLY", "MONTHLY", "YEARLY", "CUSTOM"];

export function EditBudgetDialog({
  budget,
  open,
  onOpenChange,
}: EditBudgetDialogProps) {
  const updateBudget = useUpdateBudget();

  const { data: categoryResponse, isLoading: categoriesLoading } =
    useCategories();

  const categories = categoryResponse?.data ?? [];

  const parentCategories = useMemo(
    () => categories.filter((category) => category.level === 0),
    [categories],
  );

  const [scope, setScope] = useState<BudgetScope>(budget.scope);

  const [categoryId, setCategoryId] = useState("");

  const [subcategoryId, setSubcategoryId] = useState("");

  const [period, setPeriod] = useState<BudgetPeriod>(budget.period);

  const [startDate, setStartDate] = useState(
    toDateInputValue(budget.startDate),
  );

  const [endDate, setEndDate] = useState(toDateInputValue(budget.endDate));

  const [budgetAmount, setBudgetAmount] = useState(String(budget.budgetAmount));

  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setScope(budget.scope);
    setCategoryId(getId(budget.categoryId));
    setSubcategoryId(getId(budget.subcategoryId));
    setPeriod(budget.period);
    setStartDate(toDateInputValue(budget.startDate));
    setEndDate(toDateInputValue(budget.endDate));
    setBudgetAmount(String(budget.budgetAmount));
    setError("");
  }, [open, budget]);

  const subcategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.level === 1 && category.parentCategoryId === categoryId,
      ),
    [categories, categoryId],
  );

  const selectedCategory = categories.find(
    (category) => category._id === categoryId,
  );

  const selectedSubcategory = categories.find(
    (category) => category._id === subcategoryId,
  );

  const isDirty =
    scope !== budget.scope ||
    categoryId !== getId(budget.categoryId) ||
    subcategoryId !== getId(budget.subcategoryId) ||
    period !== budget.period ||
    startDate !== toDateInputValue(budget.startDate) ||
    endDate !== toDateInputValue(budget.endDate) ||
    Number(budgetAmount) !== budget.budgetAmount;

  const handleScopeChange = (nextScope: BudgetScope) => {
    setScope(nextScope);

    if (nextScope === "OVERALL") {
      setCategoryId("");
      setSubcategoryId("");
    } else if (nextScope === "CATEGORY") {
      setSubcategoryId("");
    }
  };

  const handleCategoryChange = (value: string | null) => {
    setCategoryId(value ?? "");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (scope !== "OVERALL" && !categoryId) {
      setError("Please select a category.");
      return;
    }

    if (scope === "SUBCATEGORY" && !subcategoryId) {
      setError("Please select a subcategory.");
      return;
    }

    if (!startDate || !endDate) {
      setError("Start and end dates are required.");
      return;
    }

    if (endDate < startDate) {
      setError("End date must be after the start date.");
      return;
    }

    const amount = Number(budgetAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Budget amount must be greater than 0.");
      return;
    }

    const payload: UpdateBudgetInput = {
      scope,
      period,
      startDate: new Date(`${startDate}T00:00:00`).toISOString(),
      endDate: new Date(`${endDate}T23:59:59`).toISOString(),
      budgetAmount: amount,
    };

    if (scope !== "OVERALL") {
      payload.categoryId = categoryId;
    }

    if (scope === "SUBCATEGORY") {
      payload.subcategoryId = subcategoryId;
    }

    try {
      await updateBudget.mutateAsync({
        budgetId: budget._id,
        payload,
      });

      onOpenChange(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Unable to update budget. Please try again.",
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-0">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border/60 bg-card shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Pencil className="size-5" />
            </div>

            <div>
              <h2 className="text-base font-bold sm:text-lg">Edit Budget</h2>

              <p className="text-xs text-muted-foreground">
                Update your budget settings.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
          {/* Scope */}
          <div className="space-y-1.5">
            <Label>Budget Scope</Label>

            <Select
              value={scope}
              onValueChange={(value) => handleScopeChange(value as BudgetScope)}
            >
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue>
                  {(value) => formatEnum(value as string)}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {SCOPES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {formatEnum(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          {scope !== "OVERALL" && (
            <div className="space-y-1.5">
              <Label>Category</Label>

              <Select
                value={categoryId}
                onValueChange={handleCategoryChange}
                disabled={categoriesLoading}
              >
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Select category">
                    {selectedCategory && (
                      <div className="flex items-center gap-2">
                        <CategoryIcon
                          name={selectedCategory.icon}
                          className="size-4"
                        />

                        <span>{selectedCategory.name}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {parentCategories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      <div className="flex items-center gap-2">
                        <CategoryIcon name={category.icon} className="size-4" />

                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Subcategory */}
          {scope === "SUBCATEGORY" && (
            <div className="space-y-1.5">
              <Label>Subcategory</Label>

              <Select
                value={subcategoryId}
                onValueChange={(value) => {
                  setSubcategoryId(value || "");
                }}
                disabled={!categoryId || subcategories.length === 0}
              >
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Select subcategory">
                    {selectedSubcategory && (
                      <div className="flex items-center gap-2">
                        <CategoryIcon
                          name={selectedSubcategory.icon}
                          className="size-4"
                        />

                        <span>{selectedSubcategory.name}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {subcategories.map((subcategory) => (
                    <SelectItem key={subcategory._id} value={subcategory._id}>
                      <div className="flex items-center gap-2">
                        <CategoryIcon
                          name={subcategory.icon}
                          className="size-4"
                        />

                        <span>{subcategory.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {/* Period */}
          <div className="space-y-1.5">
            <Label>Budget Period</Label>

            <Select
              value={period}
              onValueChange={(value) => setPeriod(value as BudgetPeriod)}
            >
              <SelectTrigger className="h-10 rounded-xl">
                <SelectValue>
                  {(value) => formatEnum(value as string)}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                {PERIODS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {formatEnum(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dates */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Start Date</Label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="h-10 rounded-xl pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>End Date</Label>

              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  type="date"
                  min={startDate || undefined}
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="h-10 rounded-xl pl-9"
                />
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label>Budget Amount</Label>

            <Input
              type="number"
              min="0"
              step="0.01"
              value={budgetAmount}
              onChange={(event) => setBudgetAmount(event.target.value)}
              className="h-10 rounded-xl"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs font-medium text-destructive">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 border-t border-border/60 pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={updateBudget.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={!isDirty || updateBudget.isPending}>
              {updateBudget.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
