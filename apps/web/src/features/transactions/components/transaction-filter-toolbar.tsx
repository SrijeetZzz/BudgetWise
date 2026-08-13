"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCategories } from "@/features/categories/hooks/use-categories";

import type {
  PaymentMethod,
  TransactionQuery,
  TransactionType,
  TransactionSource,
} from "@/types/transaction.types";

interface TransactionFilterToolbarProps {
  filters: TransactionQuery;
  onFiltersChange: (filters: TransactionQuery) => void;
}

const SORT_LABELS: Record<string, string> = {
  "transactionDate-desc": "Newest first",
  "transactionDate-asc": "Oldest first",
  "amount-desc": "Highest amount",
  "amount-asc": "Lowest amount",
  "title-asc": "Title A–Z",
  "title-desc": "Title Z–A",
};

export function TransactionFilterToolbar({
  filters,
  onFiltersChange,
}: TransactionFilterToolbarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { data, isLoading: categoriesLoading } = useCategories();

  const categories = data?.data ?? [];

  /* ---------------------------------------------
   * Parent Categories
   * --------------------------------------------- */

  const parentCategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.level === 0 &&
          (!filters.type || category.type === filters.type),
      ),
    [categories, filters.type],
  );

  /* ---------------------------------------------
   * Subcategories
   * --------------------------------------------- */

  const subcategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.level === 1 &&
          category.parentCategoryId === filters.categoryId &&
          (!filters.type || category.type === filters.type),
      ),
    [categories, filters.categoryId, filters.type],
  );

  /* ---------------------------------------------
   * Selected Category Name
   * --------------------------------------------- */

  const selectedCategoryName = useMemo(() => {
    if (!filters.categoryId || filters.categoryId === "ALL") {
      return null;
    }

    return categories.find((category) => category._id === filters.categoryId)
      ?.name;
  }, [categories, filters.categoryId]);

  /* ---------------------------------------------
   * Selected Subcategory Name
   * --------------------------------------------- */

  const selectedSubcategoryName = useMemo(() => {
    if (!filters.subcategoryId || filters.subcategoryId === "ALL") {
      return null;
    }

    return categories.find((category) => category._id === filters.subcategoryId)
      ?.name;
  }, [categories, filters.subcategoryId]);

  /* ---------------------------------------------
   * Current Sort
   * --------------------------------------------- */

  const currentSortKey = filters.sortBy
    ? `${filters.sortBy}-${filters.sortOrder ?? "desc"}`
    : "transactionDate-desc";

  /* ---------------------------------------------
   * Generic Filter Update
   * --------------------------------------------- */

  const updateFilter = <K extends keyof TransactionQuery>(
    key: K,
    value: TransactionQuery[K],
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1,
    });
  };

  /* ---------------------------------------------
   * Reset
   * --------------------------------------------- */

  const clearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: filters.limit ?? 10,
    });
  };

  /* ---------------------------------------------
   * Active Filters
   * --------------------------------------------- */

  const hasFilters =
    !!filters.search ||
    !!filters.type ||
    !!filters.transactionSource ||
    !!filters.categoryId ||
    !!filters.subcategoryId ||
    !!filters.paymentMethod ||
    !!filters.startDate ||
    !!filters.endDate ||
    filters.minAmount !== undefined ||
    filters.maxAmount !== undefined ||
    !!filters.sortBy ||
    !!filters.sortOrder;

  /* ---------------------------------------------
   * Advanced Filter Count
   * --------------------------------------------- */

  const activeAdvancedCount = [
    filters.subcategoryId,
    filters.paymentMethod,
    filters.startDate,
    filters.endDate,
    filters.minAmount,
    filters.maxAmount,
  ].filter(
    (value) => value !== undefined && value !== "" && value !== "ALL",
  ).length;

  return (
    <div className="w-full space-y-4 px-4 sm:px-0">
      <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5">
        {/* =====================================================
            Search & Sort
        ===================================================== */}

        <div className="grid gap-3 sm:grid-cols-12">
          {/* Search */}

          <div className="relative sm:col-span-8 lg:col-span-9">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={filters.search ?? ""}
              onChange={(event) =>
                updateFilter("search", event.target.value || undefined)
              }
              placeholder="Search transactions by title..."
              className="h-10 rounded-xl border-border/60 pl-10 pr-3.5 text-sm focus-visible:ring-1 placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Sort */}

          <div className="sm:col-span-4 lg:col-span-3">
            <Select
              value={currentSortKey}
              onValueChange={(value) => {
                if (!value) {
                  return;
                }

                const [sortBy, sortOrder] = value.split("-");

                onFiltersChange({
                  ...filters,
                  sortBy: sortBy as TransactionQuery["sortBy"],
                  sortOrder: sortOrder as "asc" | "desc",
                  page: 1,
                });
              }}
            >
              <SelectTrigger className="h-10 w-full rounded-xl border-border/60 text-sm">
                <SelectValue placeholder="Sort order">
                  {SORT_LABELS[currentSortKey] ?? "Newest first"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="transactionDate-desc">
                  Newest first
                </SelectItem>

                <SelectItem value="transactionDate-asc">
                  Oldest first
                </SelectItem>

                <SelectItem value="amount-desc">Highest amount</SelectItem>

                <SelectItem value="amount-asc">Lowest amount</SelectItem>

                <SelectItem value="title-asc">Title A–Z</SelectItem>

                <SelectItem value="title-desc">Title Z–A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* =====================================================
            Primary Filters
        ===================================================== */}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Transaction Type */}

          <Select
            value={filters.type ?? "ALL"}
            onValueChange={(value) => {
              const type =
                value === "ALL" ? undefined : (value as TransactionType);

              onFiltersChange({
                ...filters,
                type,
                categoryId: undefined,
                subcategoryId: undefined,
                page: 1,
              });
            }}
          >
            <SelectTrigger className="h-10 rounded-xl border-border/60 text-sm">
              <SelectValue placeholder="All Transaction Types" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>

              <SelectItem value="EXPENSE">Expense Only</SelectItem>

              <SelectItem value="INCOME">Income Only</SelectItem>
            </SelectContent>
          </Select>

          {/* =================================================
              Transaction Source
          ================================================= */}

          <Select
            value={filters.transactionSource ?? "ALL"}
            onValueChange={(value) => {
              const transactionSource =
                value === "ALL" ? undefined : (value as TransactionSource);

              onFiltersChange({
                ...filters,
                transactionSource,
                page: 1,
              });
            }}
          >
            <SelectTrigger className="h-10 rounded-xl border-border/60 text-sm">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All Sources</SelectItem>

              <SelectItem value="MANUAL">Manual</SelectItem>

              <SelectItem value="RECURRING">Recurring</SelectItem>
            </SelectContent>
          </Select>

          {/* =================================================
              Parent Category
          ================================================= */}

          <Select
            value={filters.categoryId ?? "ALL"}
            onValueChange={(value) => {
              onFiltersChange({
                ...filters,
                categoryId:
                  value === "ALL" || value === undefined || value === null
                    ? undefined
                    : value,
                subcategoryId: undefined,
                page: 1,
              });
            }}
            disabled={categoriesLoading}
          >
            <SelectTrigger className="h-10 rounded-xl border-border/60 text-sm">
              <SelectValue placeholder="All Categories">
                {selectedCategoryName ||
                  (filters.categoryId === "ALL" || !filters.categoryId
                    ? "All Categories"
                    : "Category")}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All Categories</SelectItem>

              {parentCategories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* =====================================================
            Advanced Toggle
        ===================================================== */}

        <div className="flex items-center justify-between border-t border-border/60 pt-3">
          <button
            type="button"
            onClick={() => setShowAdvanced((previous) => !previous)}
            className="flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <SlidersHorizontal className="size-3.5" />

            <span>More Filters</span>

            {activeAdvancedCount > 0 && (
              <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeAdvancedCount}
              </span>
            )}

            {showAdvanced ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
          </button>

          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 gap-1 px-2.5 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Reset
            </Button>
          )}
        </div>

        {/* =====================================================
            Advanced Filters
        ===================================================== */}

        {showAdvanced && (
          <div className="space-y-3 border-t border-border/60 pt-3 animate-in fade-in-0">
            {/* Subcategory + Payment Method */}

            <div className="grid gap-3 sm:grid-cols-2">
              {/* Subcategory */}

              <Select
                value={filters.subcategoryId ?? "ALL"}
                onValueChange={(value) => {
                  updateFilter(
                    "subcategoryId",
                    value === "ALL" ? undefined : (value ?? undefined),
                  );
                }}
                disabled={!filters.categoryId || !subcategories.length}
              >
                <SelectTrigger className="h-10 rounded-xl border-border/60 text-sm">
                  <SelectValue placeholder="All Subcategories">
                    {selectedSubcategoryName ||
                      (filters.subcategoryId === "ALL" || !filters.subcategoryId
                        ? "All Subcategories"
                        : "Subcategory")}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ALL">All Subcategories</SelectItem>

                  {subcategories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Payment Method */}

              <Select
                value={filters.paymentMethod ?? "ALL"}
                onValueChange={(value) => {
                  updateFilter(
                    "paymentMethod",
                    value === "ALL" ? undefined : (value as PaymentMethod),
                  );
                }}
              >
                <SelectTrigger className="h-10 rounded-xl border-border/60 text-sm">
                  <SelectValue placeholder="All Payment Methods" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="ALL">All Payment Methods</SelectItem>

                  <SelectItem value="CASH">Cash</SelectItem>

                  <SelectItem value="CARD">Card</SelectItem>

                  <SelectItem value="UPI">UPI</SelectItem>

                  <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>

                  <SelectItem value="WALLET">Wallet</SelectItem>

                  <SelectItem value="CHEQUE">Cheque</SelectItem>

                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* =================================================
                Date & Amount Filters
            ================================================= */}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Start Date */}

              <Input
                type="date"
                value={filters.startDate ?? ""}
                onChange={(event) =>
                  updateFilter("startDate", event.target.value || undefined)
                }
                className="h-10 rounded-xl border-border/60 px-3.5 text-xs sm:text-sm"
              />

              {/* End Date */}

              <Input
                type="date"
                value={filters.endDate ?? ""}
                onChange={(event) =>
                  updateFilter("endDate", event.target.value || undefined)
                }
                className="h-10 rounded-xl border-border/60 px-3.5 text-xs sm:text-sm"
              />

              {/* Minimum Amount */}

              <Input
                type="number"
                min="0"
                placeholder="Min Amount"
                value={filters.minAmount ?? ""}
                onChange={(event) =>
                  updateFilter(
                    "minAmount",
                    event.target.value ? Number(event.target.value) : undefined,
                  )
                }
                className="h-10 rounded-xl border-border/60 px-3.5 text-xs placeholder:text-muted-foreground/60 sm:text-sm"
              />

              {/* Maximum Amount */}

              <Input
                type="number"
                min="0"
                placeholder="Max Amount"
                value={filters.maxAmount ?? ""}
                onChange={(event) =>
                  updateFilter(
                    "maxAmount",
                    event.target.value ? Number(event.target.value) : undefined,
                  )
                }
                className="h-10 rounded-xl border-border/60 px-3.5 text-xs placeholder:text-muted-foreground/60 sm:text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
