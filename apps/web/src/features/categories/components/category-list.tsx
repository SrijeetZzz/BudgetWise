

"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { useCategories } from "../hooks/use-categories";
import { EditCategoryDialog } from "./edit-category-dialog";
import { EditSubcategoryDialog } from "./edit-subcategory-dialog";
import { CategoryIcon } from "./category-icon";

import type { Category } from "@/types/category.types";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { DeleteSubcategoryDialog } from "./delete-subcategory-dialog";

export function CategoryList() {
  const { data, isLoading, isError } = useCategories();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const categories = data?.data ?? [];

  const parentCategories = useMemo(
    () => categories.filter((category) => category.level === 0),
    [categories],
  );

  const getChildren = (parentId: string) =>
    categories.filter(
      (category) =>
        category.level === 1 && category.parentCategoryId === parentId,
    );

  const toggleCategory = (categoryId: string) => {
    setExpanded((previous) => ({
      ...previous,
      [categoryId]: !previous[categoryId],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading categories...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center text-sm text-destructive">
        Unable to load categories.
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="font-medium">No categories found</p>

        <p className="mt-1 text-sm text-muted-foreground">
          Get started by creating your first category.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Expense Categories */}
      <CategorySection
        title="Expense Categories"
        type="EXPENSE"
        categories={parentCategories.filter(
          (category) => category.type === "EXPENSE",
        )}
        getChildren={getChildren}
        expanded={expanded}
        onToggle={toggleCategory}
      />

      {/* Income Categories */}
      <CategorySection
        title="Income Categories"
        type="INCOME"
        categories={parentCategories.filter(
          (category) => category.type === "INCOME",
        )}
        getChildren={getChildren}
        expanded={expanded}
        onToggle={toggleCategory}
      />
    </div>
  );
}

interface CategorySectionProps {
  title: string;
  type: "INCOME" | "EXPENSE";
  categories: Category[];
  getChildren: (parentId: string) => Category[];
  expanded: Record<string, boolean>;
  onToggle: (categoryId: string) => void;
}

function CategorySection({
  title,
  type,
  categories,
  getChildren,
  expanded,
  onToggle,
}: CategorySectionProps) {
  if (!categories.length) {
    return null;
  }

  return (
    <section className="space-y-3">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>

          <p className="text-sm text-muted-foreground">
            Manage and organize your {type.toLowerCase()} structures
          </p>
        </div>

        <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
          {categories.length}
        </span>
      </div>

      {/* List Wrapper */}
      <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60">
        {categories.map((category) => {
          const children = getChildren(category._id);

          const isExpanded = expanded[category._id] ?? false;

          return (
            <div key={category._id} className="transition-colors">
              {/* Parent Category Row */}
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => onToggle(category._id)}
                  className="flex min-w-0 flex-1 items-center gap-3 p-3.5 text-left transition-colors hover:bg-muted/40 sm:p-4"
                >
                  {/* Expand / Collapse */}
                  <div className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
                    {children.length > 0 ? (
                      isExpanded ? (
                        <ChevronDown className="size-4" />
                      ) : (
                        <ChevronRight className="size-4" />
                      )
                    ) : (
                      <span className="size-4" />
                    )}
                  </div>

                  {/* Icon Badge */}
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-xl transition-transform active:scale-95 sm:size-10"
                    style={{
                      backgroundColor: `${category.color}15`,
                      color: category.color,
                    }}
                  >
                    <CategoryIcon
                      name={category.icon}
                      className="size-4 sm:size-5"
                    />
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
                      {category.name}
                    </p>

                    <span className="inline-block text-[11px] font-normal text-muted-foreground">
                      {category.isSystem ? "System Default" : "Custom"}
                    </span>
                  </div>

                  {/* Subcategory Pill */}
                  {children.length > 0 && (
                    <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {children.length} {children.length === 1 ? "sub" : "subs"}
                    </span>
                  )}
                </button>

                {/* Parent Actions */}
                {!category.isSystem && (
                  <div
                    className="shrink-0 pr-3 sm:pr-4"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <EditCategoryDialog category={category} />
                    <DeleteCategoryDialog category={category} />
                  </div>
                )}
              </div>

              {/* Subcategories */}
              {isExpanded && children.length > 0 && (
                <div className="border-t border-border/60 bg-muted/20">
                  {children.map((child) => (
                    <div
                      key={child._id}
                      className="flex items-center gap-3 border-b border-border/40 py-2.5 pr-3 pl-12 last:border-b-0 sm:pr-4 sm:pl-14"
                    >
                      {/* Subcategory Icon */}
                      <div
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: `${child.color}15`,
                          color: child.color,
                        }}
                      >
                        <CategoryIcon name={child.icon} className="size-4" />
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground sm:text-sm">
                          {child.name}
                        </p>

                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          {child.isSystem ? "System" : "Custom"}
                        </span>
                      </div>

                      {/* Subcategory Actions */}
                      {!child.isSystem && (
                        <div
                          className="shrink-0"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <EditSubcategoryDialog subcategory={child} />
                          <DeleteSubcategoryDialog subcategory={child} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
