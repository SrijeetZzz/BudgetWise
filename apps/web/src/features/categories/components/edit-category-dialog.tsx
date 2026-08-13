
'use client';

import { useEffect, useState } from 'react';
import { Pencil, X, Check, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useUpdateCategory } from '../hooks/use-update-category';
import { CategoryIcon } from './category-icon';

import type { Category } from '@/types/category.types';

const PRESET_COLORS = [
  '#F97316', // Orange
  '#EF4444', // Red
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EAB308', // Amber
  '#64748B', // Slate
];

const POPULAR_ICONS = [
  'shopping-bag',
  'utensils',
  'car',
  'home',
  'briefcase',
  'heart-pulse',
  'film',
  'plane',
  'gift',
  'wallet',
  'graduation-cap',
  'wrench',
];

interface EditCategoryDialogProps {
  category: Category;
}

export function EditCategoryDialog({ category }: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(category.name);
  const [icon, setIcon] = useState(category.icon);
  const [color, setColor] = useState(category.color);

  const updateCategory = useUpdateCategory();

  useEffect(() => {
    if (!open) return;
    setName(category.name);
    setIcon(category.icon);
    setColor(category.color);
  }, [category, open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !icon.trim()) return;

    await updateCategory.mutateAsync({
      categoryId: category._id,
      payload: {
        name: name.trim(),
        icon: icon.trim(),
        color,
      },
    });

    setOpen(false);
  };

  if (category.isSystem) {
    return null;
  }

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-8 flex-row! items-center justify-center gap-1.5 px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground active:scale-95"
      >
        <Pencil className="size-3.5 shrink-0" />
      </Button>

      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-0">
          <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-6 shadow-2xl transition-all sm:p-7 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-xl transition-all"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  <CategoryIcon name={icon || 'folder'} className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                    Edit Category
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Update category details and preferences
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-category-name"
                  className="text-xs font-medium text-foreground sm:text-sm"
                >
                  Category Name
                </Label>
                <Input
                  id="edit-category-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Groceries & Supplies"
                  maxLength={50}
                  className="h-11 px-3.5 text-sm sm:h-10 placeholder:text-muted-foreground/60"
                />
              </div>

              {/* Icon Selector Grid */}
              <div className="space-y-2">
                <Label
                  htmlFor="edit-category-icon"
                  className="text-xs font-medium text-foreground sm:text-sm"
                >
                  Select Icon
                </Label>

                <div className="grid grid-cols-6 gap-2 rounded-xl border border-border/60 bg-muted/20 p-2.5">
                  {POPULAR_ICONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setIcon(item)}
                      className={`flex size-9 items-center justify-center rounded-lg transition-all ${
                        icon === item
                          ? 'bg-card shadow-sm border border-border/80 text-foreground scale-105'
                          : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'
                      }`}
                    >
                      <CategoryIcon name={item} className="size-4" />
                    </button>
                  ))}
                </div>

                <div className="relative flex items-center">
                  <Input
                    id="edit-category-icon"
                    value={icon}
                    onChange={(event) => setIcon(event.target.value)}
                    placeholder="Or type Lucide icon (e.g. camera)"
                    maxLength={50}
                    className="h-10 px-3.5 pr-9 text-xs sm:text-sm placeholder:text-muted-foreground/60"
                  />
                  <Search className="absolute right-3 size-4 text-muted-foreground/60 pointer-events-none" />
                </div>
              </div>

              {/* Color Swatches */}
              <div className="space-y-2">
                <Label
                  htmlFor="edit-category-color"
                  className="text-xs font-medium text-foreground sm:text-sm"
                >
                  Accent Color
                </Label>

                <div className="flex items-center gap-2">
                  <div className="flex flex-1 items-center justify-between gap-1.5 rounded-xl border border-border/60 bg-muted/20 p-2">
                    {PRESET_COLORS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setColor(preset)}
                        className="relative size-6 rounded-full transition-transform hover:scale-110 active:scale-95"
                        style={{ backgroundColor: preset }}
                      >
                        {color.toUpperCase() === preset.toUpperCase() && (
                          <Check className="absolute inset-0 m-auto size-3 text-white" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60">
                    <input
                      id="edit-category-color"
                      type="color"
                      value={color}
                      onChange={(event) => setColor(event.target.value)}
                      className="absolute -inset-2 size-14 cursor-pointer border-0 p-0"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse justify-end gap-2 pt-4 sm:flex-row sm:gap-3 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={updateCategory.isPending}
                  className="h-11 text-xs font-medium sm:h-10 sm:text-sm"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  loading={updateCategory.isPending}
                  disabled={!name.trim() || !icon.trim()}
                  className="h-11 text-xs font-semibold sm:h-10 sm:text-sm"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}