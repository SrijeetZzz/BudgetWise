// 'use client';

// import { Search, SlidersHorizontal, X } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// import type {
//   BudgetPeriod,
//   BudgetQuery,
//   BudgetScope,
//   BudgetStatus,
// } from '@/types/budget.types';

// interface BudgetFiltersProps {
//   filters: BudgetQuery;
//   onFiltersChange: (filters: BudgetQuery) => void;
// }

// const SORT_LABELS: Record<string, string> = {
//   'createdAt-desc': 'Newest first',
//   'createdAt-asc': 'Oldest first',
//   'budgetAmount-desc': 'Highest budget',
//   'budgetAmount-asc': 'Lowest budget',
//   'spentAmount-desc': 'Highest spending',
//   'spentAmount-asc': 'Lowest spending',
//   'remainingAmount-desc': 'Most remaining',
//   'remainingAmount-asc': 'Least remaining',
//   'utilization-desc': 'Highest utilization',
//   'utilization-asc': 'Lowest utilization',
// };

// export function BudgetFilters({
//   filters,
//   onFiltersChange,
// }: BudgetFiltersProps) {
//   const currentSortKey = filters.sortBy
//     ? `${filters.sortBy}-${filters.sortOrder ?? 'desc'}`
//     : 'createdAt-desc';

//   const updateFilter = <K extends keyof BudgetQuery>(
//     key: K,
//     value: BudgetQuery[K],
//   ) => {
//     onFiltersChange({
//       ...filters,
//       [key]: value,
//       page: 1,
//     });
//   };

//   const clearFilters = () => {
//     onFiltersChange({
//       page: 1,
//       limit: filters.limit ?? 10,
//       sortBy: 'createdAt',
//       sortOrder: 'desc',
//     });
//   };

//   const hasFilters =
//     !!filters.search ||
//     !!filters.scope ||
//     !!filters.period ||
//     !!filters.status ||
//     !!filters.sortBy ||
//     !!filters.sortOrder;

//   return (
//     <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5">
//       <div className="space-y-3">
//         {/* Search + Sort */}
//         <div className="grid gap-3 sm:grid-cols-12">
//           <div className="relative sm:col-span-7 lg:col-span-8">
//             <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

//             <Input
//               value={filters.search ?? ''}
//               onChange={(event) =>
//                 updateFilter(
//                   'search',
//                   event.target.value || undefined,
//                 )
//               }
//               placeholder="Search budgets..."
//               className="h-10 rounded-xl border-border/60 pl-10 text-sm"
//             />
//           </div>

//           <div className="sm:col-span-5 lg:col-span-4">
//             <Select
//               value={currentSortKey}
//               onValueChange={(value) => {
//                 if (!value) return;

//                 const separatorIndex =
//                   value.lastIndexOf('-');

//                 const sortBy =
//                   value.slice(0, separatorIndex);

//                 const sortOrder =
//                   value.slice(separatorIndex + 1);

//                 onFiltersChange({
//                   ...filters,
//                   sortBy:
//                     sortBy as BudgetQuery['sortBy'],
//                   sortOrder:
//                     sortOrder as 'asc' | 'desc',
//                   page: 1,
//                 });
//               }}
//             >
//               <SelectTrigger className="h-10 rounded-xl border-border/60 text-sm">
//                 <SelectValue>
//                   {SORT_LABELS[currentSortKey] ??
//                     'Newest first'}
//                 </SelectValue>
//               </SelectTrigger>

//               <SelectContent>
//                 <SelectItem value="createdAt-desc">
//                   Newest first
//                 </SelectItem>

//                 <SelectItem value="createdAt-asc">
//                   Oldest first
//                 </SelectItem>

//                 <SelectItem value="budgetAmount-desc">
//                   Highest budget
//                 </SelectItem>

//                 <SelectItem value="budgetAmount-asc">
//                   Lowest budget
//                 </SelectItem>

//                 <SelectItem value="spentAmount-desc">
//                   Highest spending
//                 </SelectItem>

//                 <SelectItem value="spentAmount-asc">
//                   Lowest spending
//                 </SelectItem>

//                 <SelectItem value="remainingAmount-desc">
//                   Most remaining
//                 </SelectItem>

//                 <SelectItem value="remainingAmount-asc">
//                   Least remaining
//                 </SelectItem>

//                 <SelectItem value="utilization-desc">
//                   Highest utilization
//                 </SelectItem>

//                 <SelectItem value="utilization-asc">
//                   Lowest utilization
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="grid gap-3 sm:grid-cols-3">
//           {/* Scope */}
//           <Select
//             value={filters.scope ?? 'ALL'}
//             onValueChange={(value) => {
//               updateFilter(
//                 'scope',
//                 value === 'ALL'
//                   ? undefined
//                   : (value as BudgetScope),
//               );
//             }}
//           >
//             <SelectTrigger className="h-10 rounded-xl border-border/60 text-sm">
//               <SelectValue placeholder="All scopes" />
//             </SelectTrigger>

//             <SelectContent>
//               <SelectItem value="ALL">
//                 All Scopes
//               </SelectItem>

//               <SelectItem value="OVERALL">
//                 Overall
//               </SelectItem>

//               <SelectItem value="CATEGORY">
//                 Category
//               </SelectItem>

//               <SelectItem value="SUBCATEGORY">
//                 Subcategory
//               </SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Period */}
//           <Select
//             value={filters.period ?? 'ALL'}
//             onValueChange={(value) => {
//               updateFilter(
//                 'period',
//                 value === 'ALL'
//                   ? undefined
//                   : (value as BudgetPeriod),
//               );
//             }}
//           >
//             <SelectTrigger className="h-10 rounded-xl border-border/60 text-sm">
//               <SelectValue placeholder="All periods" />
//             </SelectTrigger>

//             <SelectContent>
//               <SelectItem value="ALL">
//                 All Periods
//               </SelectItem>

//               <SelectItem value="WEEKLY">
//                 Weekly
//               </SelectItem>

//               <SelectItem value="MONTHLY">
//                 Monthly
//               </SelectItem>

//               <SelectItem value="YEARLY">
//                 Yearly
//               </SelectItem>

//               <SelectItem value="CUSTOM">
//                 Custom
//               </SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Status */}
//           <Select
//             value={filters.status ?? 'ALL'}
//             onValueChange={(value) => {
//               updateFilter(
//                 'status',
//                 value === 'ALL'
//                   ? undefined
//                   : (value as BudgetStatus),
//               );
//             }}
//           >
//             <SelectTrigger className="h-10 rounded-xl border-border/60 text-sm">
//               <SelectValue placeholder="All statuses" />
//             </SelectTrigger>

//             <SelectContent>
//               <SelectItem value="ALL">
//                 All Statuses
//               </SelectItem>

//               <SelectItem value="ACTIVE">
//                 Active
//               </SelectItem>

//               <SelectItem value="COMPLETED">
//                 Completed
//               </SelectItem>

//               <SelectItem value="EXPIRED">
//                 Expired
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Bottom */}
//         {hasFilters && (
//           <div className="flex items-center justify-between border-t border-border/60 pt-3">
//             <div className="flex items-center gap-2 text-xs text-muted-foreground">
//               <SlidersHorizontal className="size-3.5" />

//               <span>
//                 Filters applied
//               </span>
//             </div>

//             <Button
//               type="button"
//               variant="ghost"
//               size="sm"
//               onClick={clearFilters}
//               className="h-7 gap-1 px-2.5 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
//             >
//               Reset
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import {
  Search,
  SlidersHorizontal,
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

import type {
  BudgetPeriod,
  BudgetQuery,
  BudgetScope,
  BudgetStatus,
} from "@/types/budget.types";

interface BudgetFiltersProps {
  filters: BudgetQuery;
  onFiltersChange: (
    filters: BudgetQuery,
  ) => void;
}

const SORT_LABELS: Record<
  string,
  string
> = {
  "createdAt-desc": "Newest first",
  "createdAt-asc": "Oldest first",
  "budgetAmount-desc":
    "Highest budget",
  "budgetAmount-asc":
    "Lowest budget",
  "spentAmount-desc":
    "Highest spending",
  "spentAmount-asc":
    "Lowest spending",
  "remainingAmount-desc":
    "Most remaining",
  "remainingAmount-asc":
    "Least remaining",
  "utilization-desc":
    "Highest utilization",
  "utilization-asc":
    "Lowest utilization",
};

function formatEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}

export function BudgetFilters({
  filters,
  onFiltersChange,
}: BudgetFiltersProps) {
  const currentSortKey = filters.sortBy
    ? `${filters.sortBy}-${
        filters.sortOrder ?? "desc"
      }`
    : "createdAt-desc";

  const updateFilter = <
    K extends keyof BudgetQuery,
  >(
    key: K,
    value: BudgetQuery[K],
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: filters.limit ?? 10,

      // Default page view
      period: "MONTHLY",
      status: "ACTIVE",

      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  const hasFilters =
    !!filters.search ||
    !!filters.scope ||
    !!filters.period ||
    !!filters.status ||
    !!filters.sortBy ||
    !!filters.sortOrder;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5">
      <div className="space-y-3">
        {/* Search + Sort */}
        <div className="grid gap-3 sm:grid-cols-12">
          <div className="relative sm:col-span-7 lg:col-span-8">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={filters.search ?? ""}
              onChange={(event) =>
                updateFilter(
                  "search",
                  event.target.value ||
                    undefined,
                )
              }
              placeholder="Search budgets..."
              className="h-10 rounded-xl border-border/60 pl-10 text-sm"
            />
          </div>

          <div className="sm:col-span-5 lg:col-span-4">
            <Select
              value={currentSortKey}
              onValueChange={(value) => {
                if (!value) return;

                const separatorIndex =
                  value.lastIndexOf("-");

                const sortBy =
                  value.slice(
                    0,
                    separatorIndex,
                  );

                const sortOrder =
                  value.slice(
                    separatorIndex + 1,
                  );

                onFiltersChange({
                  ...filters,
                  sortBy:
                    sortBy as BudgetQuery["sortBy"],
                  sortOrder:
                    sortOrder as
                      | "asc"
                      | "desc",
                  page: 1,
                });
              }}
            >
              <SelectTrigger className="h-10 rounded-xl border-border/60 text-sm">
                <SelectValue>
                  {SORT_LABELS[
                    currentSortKey
                  ] ?? "Newest first"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="createdAt-desc">
                  Newest first
                </SelectItem>

                <SelectItem value="createdAt-asc">
                  Oldest first
                </SelectItem>

                <SelectItem value="budgetAmount-desc">
                  Highest budget
                </SelectItem>

                <SelectItem value="budgetAmount-asc">
                  Lowest budget
                </SelectItem>

                <SelectItem value="spentAmount-desc">
                  Highest spending
                </SelectItem>

                <SelectItem value="spentAmount-asc">
                  Lowest spending
                </SelectItem>

                <SelectItem value="remainingAmount-desc">
                  Most remaining
                </SelectItem>

                <SelectItem value="remainingAmount-asc">
                  Least remaining
                </SelectItem>

                <SelectItem value="utilization-desc">
                  Highest utilization
                </SelectItem>

                <SelectItem value="utilization-asc">
                  Lowest utilization
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filters */}
        <div className="grid gap-3 sm:grid-cols-3">
          {/* Scope */}
          <Select
            value={
              filters.scope ?? "ALL"
            }
            onValueChange={(value) => {
              updateFilter(
                "scope",
                value === "ALL"
                  ? undefined
                  : (value as BudgetScope),
              );
            }}
          >
            <SelectTrigger className="h-10 rounded-xl border-border/60 text-sm">
              <SelectValue>
                {filters.scope
                  ? formatEnum(
                      filters.scope,
                    )
                  : "All Scopes"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">
                All Scopes
              </SelectItem>

              <SelectItem value="OVERALL">
                Overall
              </SelectItem>

              <SelectItem value="CATEGORY">
                Category
              </SelectItem>

              <SelectItem value="SUBCATEGORY">
                Subcategory
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Period */}
          <Select
            value={
              filters.period ?? "ALL"
            }
            onValueChange={(value) => {
              updateFilter(
                "period",
                value === "ALL"
                  ? undefined
                  : (value as BudgetPeriod),
              );
            }}
          >
            <SelectTrigger className="h-10 rounded-xl border-border/60 text-sm">
              <SelectValue>
                {filters.period
                  ? formatEnum(
                      filters.period,
                    )
                  : "All Periods"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">
                All Periods
              </SelectItem>

              <SelectItem value="WEEKLY">
                Weekly
              </SelectItem>

              <SelectItem value="MONTHLY">
                Monthly
              </SelectItem>

              <SelectItem value="YEARLY">
                Yearly
              </SelectItem>

              <SelectItem value="CUSTOM">
                Custom
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Status */}
          <Select
            value={
              filters.status ?? "ALL"
            }
            onValueChange={(value) => {
              updateFilter(
                "status",
                value === "ALL"
                  ? undefined
                  : (value as BudgetStatus),
              );
            }}
          >
            <SelectTrigger className="h-10 rounded-xl border-border/60 text-sm">
              <SelectValue>
                {filters.status
                  ? formatEnum(
                      filters.status,
                    )
                  : "All Statuses"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">
                All Statuses
              </SelectItem>

              <SelectItem value="ACTIVE">
                Active
              </SelectItem>

              <SelectItem value="COMPLETED">
                Completed
              </SelectItem>

              <SelectItem value="EXPIRED">
                Expired
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bottom */}
        {hasFilters && (
          <div className="flex items-center justify-between border-t border-border/60 pt-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <SlidersHorizontal className="size-3.5" />

              <span>
                Filters applied
              </span>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 gap-1 px-2.5 text-xs font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Reset
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}