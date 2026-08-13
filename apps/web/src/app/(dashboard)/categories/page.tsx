

import { CategoryList } from "@/features/categories/components/category-list";
import { CreateCategoryDialog } from "@/features/categories/components/create-category-dialog";
import { CreateSubcategoryDialog } from "@/features/categories/components/create-subcategory-dialog";

export default function CategoriesPage() {
  return (
    <div className="w-full space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Heading */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Categories
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Organize your income and expenses with categories and subcategories.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row">
          <CreateCategoryDialog />
          <CreateSubcategoryDialog />
        </div>
      </div>

      {/* Category List */}
      <CategoryList />
    </div>
  );
}