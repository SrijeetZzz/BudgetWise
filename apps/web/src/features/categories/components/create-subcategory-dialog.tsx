
"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  FolderGit2,
  X,
  Check,
  ChevronDown,
  ChevronUp,
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

import { useCategories } from "../hooks/use-categories";
import { useCreateSubcategory } from "../hooks/use-create-subcategory";
import { CategoryIcon } from "./category-icon";
import { IconPicker } from "./icon-picker";

const PRESET_COLORS = [
  "#22C55E", // Green
  "#3B82F6", // Blue
  "#F97316", // Orange
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#EAB308", // Amber
  "#64748B", // Slate
];

export function CreateSubcategoryDialog() {
  const [open, setOpen] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const [parentCategoryId, setParentCategoryId] = useState("");
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("tag");
  const [color, setColor] = useState("#22C55E");

  const { data, isLoading } = useCategories();
  const createSubcategory = useCreateSubcategory();

  const categories = data?.data ?? [];
  const parentCategories = categories.filter(
    (category) => category.level === 0,
  );
  const parentCategoryItems = parentCategories.map((category) => ({
    value: category._id,
    label: `${category.name} (${category.type})`,
  }));

  useEffect(() => {
    if (!open) return;
    setParentCategoryId("");
    setName("");
    setIcon("tag");
    setColor("#22C55E");
    setShowIconPicker(false);
  }, [open]);

  const selectedParent = parentCategories.find(
    (category) => category._id === parentCategoryId,
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!parentCategoryId || !name.trim() || !icon.trim()) return;

    await createSubcategory.mutateAsync({
      parentCategoryId,
      name: name.trim(),
      icon: icon.trim(),
      color,
    });

    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 flex-row! items-center justify-center gap-2 whitespace-nowrap px-4 text-xs font-semibold transition-all active:scale-95 sm:text-sm"
      >
        <div className="flex flex-row items-center gap-2 whitespace-nowrap">
          <Plus className="size-4 shrink-0" />
          <span>Subcategory</span>
        </div>
      </Button>

      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-0">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border/60 bg-card p-6 shadow-2xl transition-all sm:p-7 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-xl transition-all"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  <CategoryIcon name={icon || "tag"} className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                    Create Subcategory
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Nested item under a primary category
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
              {/* Parent Category Selection */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground sm:text-sm">
                  Parent Category
                </Label>

                <Select
                  items={parentCategoryItems}
                  value={parentCategoryId || null}
                  onValueChange={(value) => {
                    setParentCategoryId(value ?? "");
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-11 px-3.5 text-sm sm:h-10">
                    <SelectValue
                      placeholder={
                        isLoading
                          ? "Loading categories..."
                          : "Select parent category"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {parentCategories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name} ({category.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Parent Badge Preview */}
              {selectedParent && (
                <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
                  <div
                    className="flex size-8 items-center justify-center rounded-lg shrink-0"
                    style={{
                      backgroundColor: `${selectedParent.color}20`,
                      color: selectedParent.color,
                    }}
                  >
                    <CategoryIcon
                      name={selectedParent.icon}
                      className="size-4"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground">
                      {selectedParent.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {selectedParent.type}
                    </p>
                  </div>
                </div>
              )}

              {/* Subcategory Name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="subcategory-name"
                  className="text-xs font-medium text-foreground sm:text-sm"
                >
                  Subcategory Name
                </Label>
                <Input
                  id="subcategory-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Restaurants & Dining"
                  maxLength={50}
                  className="h-11 px-3.5 text-sm sm:h-10 placeholder:text-muted-foreground/60"
                />
              </div>

              {/* Collapsible Icon Toggle Button */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground sm:text-sm">
                  Icon
                </Label>

                <button
                  type="button"
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-3.5 text-left text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:h-10"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex size-7 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${color}18`, color }}
                    >
                      <CategoryIcon name={icon} className="size-4" />
                    </div>
                    <span className="text-xs font-medium capitalize sm:text-sm">
                      {icon.replace("-", " ")}
                    </span>
                  </div>

                  {showIconPicker ? (
                    <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                  )}
                </button>

                {/* Collapsible Icon Drawer */}
                {showIconPicker && (
                  <div className="mt-2 rounded-xl border border-border/60 bg-muted/20 p-3 animate-in fade-in-0">
                    <IconPicker
                      value={icon}
                      onChange={(selectedIcon) => {
                        setIcon(selectedIcon);
                        setShowIconPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Accent Color Palette & Hex Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="subcategory-color"
                  className="text-xs font-medium text-foreground sm:text-sm"
                >
                  Accent Color
                </Label>

                <div className="flex items-center gap-2">
                  {/* Swatch Picker */}
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

                  {/* Native HTML Color Input Trigger */}
                  <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60">
                    <input
                      id="subcategory-color"
                      type="color"
                      value={color}
                      onChange={(event) => setColor(event.target.value)}
                      className="absolute -inset-2 size-14 cursor-pointer border-0 p-0"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse justify-end gap-2 border-t border-border/60 pt-4 sm:flex-row sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={createSubcategory.isPending}
                  className="h-11 text-xs font-medium sm:h-10 sm:text-sm"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  loading={createSubcategory.isPending}
                  disabled={!parentCategoryId || !name.trim() || !icon.trim()}
                  className="h-11 text-xs font-semibold sm:h-10 sm:text-sm"
                >
                  Create Subcategory
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
