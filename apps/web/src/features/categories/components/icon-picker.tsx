'use client';

import { Check, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';

import {
  CATEGORY_ICON_OPTIONS,
  CategoryIcon,
} from './category-icon';

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
}

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
  'shopping-cart',
  'coffee',
  'credit-card',
  'smartphone',
  'laptop',
  'dumbbell',
  'music',
  'building-2',
];

export function IconPicker({
  value,
  onChange,
}: IconPickerProps) {
  const [search, setSearch] = useState('');

  const filteredIcons = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return CATEGORY_ICON_OPTIONS;
    }

    return CATEGORY_ICON_OPTIONS.filter(
      (icon) =>
        icon.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <div className="space-y-3">
      {/* Selected Icon */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/30">
          <CategoryIcon
            name={value}
            className="size-5"
          />
        </div>

        <div>
          <p className="text-sm font-medium">
            {value || 'No icon selected'}
          </p>

          <p className="text-xs text-muted-foreground">
            Choose an icon for this category
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search icons..."
          className="pl-9"
        />
      </div>

      {/* Popular */}
      {!search && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Popular
          </p>

          <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
            {POPULAR_ICONS.map((iconName) => {
              const selected =
                value === iconName;

              return (
                <button
                  key={iconName}
                  type="button"
                  title={iconName}
                  onClick={() =>
                    onChange(iconName)
                  }
                  className={`relative flex size-10 items-center justify-center rounded-lg border transition-colors hover:bg-muted ${
                    selected
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border/60'
                  }`}
                >
                  <CategoryIcon
                    name={iconName}
                    className="size-5"
                  />

                  {selected && (
                    <Check className="absolute -right-1 -top-1 size-3.5 rounded-full bg-primary p-0.5 text-primary-foreground" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* All / Search Results */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          {search
            ? 'Search Results'
            : 'All Icons'}
        </p>

        <div className="max-h-48 overflow-y-auto rounded-lg border p-2">
          {filteredIcons.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No icons found.
            </p>
          ) : (
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
              {filteredIcons.map((iconName) => {
                const selected =
                  value === iconName;

                return (
                  <button
                    key={iconName}
                    type="button"
                    title={iconName}
                    onClick={() =>
                      onChange(iconName)
                    }
                    className={`relative flex size-10 items-center justify-center rounded-lg border transition-colors hover:bg-muted ${
                      selected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border/60'
                    }`}
                  >
                    <CategoryIcon
                      name={iconName}
                      className="size-5"
                    />

                    {selected && (
                      <Check className="absolute -right-1 -top-1 size-3.5 rounded-full bg-primary p-0.5 text-primary-foreground" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}