"use client";

import { useState } from "react";
import {
  Plus,
  FolderPlus,
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

import { useCreateCategory } from "../hooks/use-create-category";
import { CategoryIcon } from "./category-icon";
import { IconPicker } from "./icon-picker";
import { formatEnum } from "@/features/budgets/components/create-budget-dialog";

const PRESET_COLORS = [
  "#F97316", // Orange
  "#EF4444", // Red
  "#10B981", // Emerald
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#EAB308", // Amber
  "#64748B", // Slate
];

export function CreateCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [icon, setIcon] = useState("shopping-bag");
  const [color, setColor] = useState("#F97316");

  const createCategory = useCreateCategory();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !icon.trim()) return;

    await createCategory.mutateAsync({
      name: name.trim(),
      type,
      icon: icon.trim(),
      color,
    });

    setName("");
    setType("EXPENSE");
    setIcon("shopping-bag");
    setColor("#F97316");
    setShowIconPicker(false);
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 flex-row! items-center justify-center gap-2 whitespace-nowrap px-4 text-xs font-semibold transition-all active:scale-95 sm:text-sm"
      >
        <div className="flex flex-row items-center gap-2 whitespace-nowrap">
          <Plus className="size-4 shrink-0" />
          <span className="whitespace-nowrap">Category</span>
        </div>
      </Button>

      {open && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-0">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border/60 bg-card p-6 shadow-2xl transition-all sm:p-7 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="mb-5 flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-xl transition-all"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  <CategoryIcon name={icon || "folder"} className="size-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                    Create Category
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Add a primary income or expense category
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
              {/* Category Name */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="category-name"
                  className="text-xs font-medium text-foreground sm:text-sm"
                >
                  Category Name
                </Label>
                <Input
                  id="category-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Groceries & Supplies"
                  maxLength={50}
                  className="h-11 px-3.5 text-sm sm:h-10 placeholder:text-muted-foreground/60"
                />
              </div>

              {/* Category Type */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground sm:text-sm">
                  Category Type
                </Label>
                <Select
                  value={type}
                  onValueChange={(value) => {
                    if (value === "INCOME" || value === "EXPENSE")
                      setType(value);
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

              {/* Accent Color Palette */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="category-color"
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
                      id="category-color"
                      type="color"
                      value={color}
                      onChange={(event) => setColor(event.target.value)}
                      className="absolute -inset-2 size-14 cursor-pointer border-0 p-0"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Controls */}
              <div className="flex flex-col-reverse justify-end gap-2 border-t border-border/60 pt-4 sm:flex-row sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={createCategory.isPending}
                  className="h-11 text-xs font-medium sm:h-10 sm:text-sm"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  loading={createCategory.isPending}
                  disabled={!name.trim() || !icon.trim()}
                  className="h-11 text-xs font-semibold sm:h-10 sm:text-sm"
                >
                  Create Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
