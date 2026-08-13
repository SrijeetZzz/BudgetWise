'use client';

import { useMemo } from 'react';
import { CalendarDays } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { DashboardFilterType } from '@/types/dashboard.types';

interface DashboardFilterProps {
  value: DashboardFilterType;
  onChange: (value: DashboardFilterType) => void;
}

const FILTER_OPTIONS: {
  value: DashboardFilterType;
  label: string;
}[] = [
  { value: 'TODAY', label: 'Today' },
  { value: 'THIS_WEEK', label: 'This Week' },
  { value: 'THIS_MONTH', label: 'This Month' },
  { value: 'LAST_3_MONTHS', label: 'Last 3 Months' },
  { value: 'LAST_6_MONTHS', label: 'Last 6 Months' },
  { value: 'THIS_YEAR', label: 'This Year' },
];

export function DashboardFilter({ value, onChange }: DashboardFilterProps) {
  const selectedOption = useMemo(
    () => FILTER_OPTIONS.find((opt) => opt.value === value),
    [value],
  );

  return (
    <Select
      value={value}
      onValueChange={(nextValue) =>
        onChange(nextValue as DashboardFilterType)
      }
    >
      <SelectTrigger className="h-10 w-45 rounded-xl border-border/60 bg-card px-3.5 text-xs font-semibold sm:text-sm shadow-xs transition-colors hover:bg-muted/40">
        <div className="flex items-center gap-2 truncate">
          <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
          <SelectValue placeholder="Select period">
            {selectedOption?.label ?? 'Select period'}
          </SelectValue>
        </div>
      </SelectTrigger>

      <SelectContent align="end" className="rounded-xl border-border/60">
        {FILTER_OPTIONS.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-xs font-medium sm:text-sm cursor-pointer"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}