
// 'use client';

// import {
//   CalendarDays,
//   MoreHorizontal,
//   Pencil,
//   Trash2,
//   Wallet,
// } from 'lucide-react';
// import { useState } from 'react';

// import type {
//   Budget,
//   BudgetCategory,
// } from '@/types/budget.types';

// import { EditBudgetDialog } from './edit-budget-dialog';
// import { DeleteBudgetDialog } from './delete-budget-dialog';


// interface BudgetCardProps {
//   budget: Budget;
// }

// function getCategory(
//   value: string | BudgetCategory | null | undefined,
// ) {
//   if (!value || typeof value === 'string') {
//     return null;
//   }

//   return value;
// }

// function formatCurrency(
//   amount: number,
//   currency = 'INR',
// ) {
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency,
//     maximumFractionDigits: 2,
//   }).format(amount);
// }

// function formatDate(date: string) {
//   return new Intl.DateTimeFormat('en-IN', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//   }).format(new Date(date));
// }

// function formatEnum(value: string) {
//   return value
//     .toLowerCase()
//     .split('_')
//     .map(
//       (part) =>
//         part.charAt(0).toUpperCase() +
//         part.slice(1),
//     )
//     .join(' ');
// }

// export function BudgetCard({
//   budget,
// }: BudgetCardProps) {
//   const [editOpen, setEditOpen] = useState(false);
//   const [deleteOpen, setDeleteOpen] = useState(false);

//   const category = getCategory(budget.categoryId);

//   const subcategory = getCategory(
//     budget.subcategoryId,
//   );

//   const utilization = Math.min(
//     Math.max(budget.utilization, 0),
//     100,
//   );

//   const isExceeded =
//     budget.spentAmount > budget.budgetAmount;

//   return (
//     <>
//       <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
//         {/* Header */}
//         <div className="flex items-start justify-between gap-3">
//           <div className="flex min-w-0 items-center gap-3">
//             <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
//               <Wallet className="size-4" />
//             </div>

//             <div className="min-w-0">
//               <p className="truncate text-sm font-semibold">
//                 {budget.scope === 'OVERALL'
//                   ? 'Overall Budget'
//                   : category?.name ??
//                     'Category Budget'}
//               </p>

//               {subcategory && (
//                 <p className="truncate text-xs text-muted-foreground">
//                   {subcategory.name}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="relative shrink-0">
//             <button
//               type="button"
//               aria-label="Budget actions"
//               className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
//               onClick={(event) => {
//                 const menu =
//                   event.currentTarget.nextElementSibling;

//                 menu?.classList.toggle('hidden');
//               }}
//             >
//               <MoreHorizontal className="size-4" />
//             </button>

//             <div className="absolute right-0 top-9 z-20 hidden w-40 rounded-xl border border-border/60 bg-popover p-1 shadow-lg">
//               <button
//                 type="button"
//                 onClick={() => setEditOpen(true)}
//                 className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
//               >
//                 <Pencil className="size-4" />
//                 <span>Edit budget</span>
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setDeleteOpen(true)}
//                 className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
//               >
//                 <Trash2 className="size-4" />
//                 <span>Delete budget</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Amounts */}
//         <div className="mt-5 flex items-end justify-between gap-3">
//           <div>
//             <p className="text-xs text-muted-foreground">
//               Spent
//             </p>

//             <p
//               className={`mt-0.5 text-lg font-bold ${
//                 isExceeded
//                   ? 'text-destructive'
//                   : 'text-foreground'
//               }`}
//             >
//               {formatCurrency(
//                 budget.spentAmount,
//               )}
//             </p>
//           </div>

//           <div className="text-right">
//             <p className="text-xs text-muted-foreground">
//               Budget
//             </p>

//             <p className="mt-0.5 text-sm font-semibold">
//               {formatCurrency(
//                 budget.budgetAmount,
//               )}
//             </p>
//           </div>
//         </div>

//         {/* Progress */}
//         <div className="mt-4">
//           <div className="mb-1.5 flex items-center justify-between text-xs">
//             <span className="text-muted-foreground">
//               {budget.utilization.toFixed(1)}% used
//             </span>

//             <span
//               className={
//                 isExceeded
//                   ? 'font-semibold text-destructive'
//                   : 'font-medium text-muted-foreground'
//               }
//             >
//               {formatCurrency(
//                 budget.remainingAmount,
//               )}{' '}
//               left
//             </span>
//           </div>

//           <div className="h-2 overflow-hidden rounded-full bg-muted">
//             <div
//               className={`h-full rounded-full transition-all ${
//                 isExceeded
//                   ? 'bg-destructive'
//                   : 'bg-primary'
//               }`}
//               style={{
//                 width: `${utilization}%`,
//               }}
//             />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3">
//           <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
//             <CalendarDays className="size-3.5" />

//             <span>
//               {formatDate(budget.startDate)}
//               {' – '}
//               {formatDate(budget.endDate)}
//             </span>
//           </div>

//           <div className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold">
//             {formatEnum(budget.period)}
//           </div>
//         </div>
//       </div>

//       {/* Edit */}
//       <EditBudgetDialog
//         budget={budget}
//         open={editOpen}
//         onOpenChange={setEditOpen}
//       />

//       {/* Delete */}
//       <DeleteBudgetDialog
//         budget={budget}
//         open={deleteOpen}
//         onOpenChange={setDeleteOpen}
//       />
//     </>
//   );
// }

// "use client";

// import {
//   CalendarDays,
//   MoreHorizontal,
//   Pencil,
//   Repeat,
//   Trash2,
//   Wallet,
// } from "lucide-react";
// import { useState } from "react";

// import type {
//   Budget,
//   BudgetCategory,
// } from "@/types/budget.types";

// import { EditBudgetDialog } from "./edit-budget-dialog";
// import { EditBudgetRecurrenceDialog } from "./edit-budget-recurrence-dialog";
// import { DeleteBudgetDialog } from "./delete-budget-dialog";

// interface BudgetCardProps {
//   budget: Budget;
// }

// function getCategory(
//   value: string | BudgetCategory | null | undefined,
// ) {
//   if (!value || typeof value === "string") {
//     return null;
//   }

//   return value;
// }

// function formatCurrency(
//   amount: number,
//   currency = "INR",
// ) {
//   return new Intl.NumberFormat("en-IN", {
//     style: "currency",
//     currency,
//     maximumFractionDigits: 2,
//   }).format(amount);
// }

// function formatDate(date: string) {
//   return new Intl.DateTimeFormat("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }).format(new Date(date));
// }

// function formatEnum(value: string) {
//   return value
//     .toLowerCase()
//     .split("_")
//     .map(
//       (part) =>
//         part.charAt(0).toUpperCase() +
//         part.slice(1),
//     )
//     .join(" ");
// }

// export function BudgetCard({
//   budget,
// }: BudgetCardProps) {
//   const [menuOpen, setMenuOpen] =
//     useState(false);

//   const [editOpen, setEditOpen] =
//     useState(false);

//   const [recurrenceEditOpen, setRecurrenceEditOpen] =
//     useState(false);

//   const [deleteOpen, setDeleteOpen] =
//     useState(false);

//   const category = getCategory(
//     budget.categoryId,
//   );

//   const subcategory = getCategory(
//     budget.subcategoryId,
//   );

//   const utilization = Math.min(
//     Math.max(budget.utilization, 0),
//     100,
//   );

//   const isExceeded =
//     budget.spentAmount >
//     budget.budgetAmount;

//   /**
//    * Only the original/root budget can
//    * modify the recurrence template.
//    *
//    * Generated budgets may have recurrence
//    * information, but they must NOT show
//    * "Edit recurrence".
//    */
//   const isRecurrenceRoot =
//     Boolean(
//       budget.recurrence?.enabled &&
//         budget.recurrence.rootBudgetId ===
//           budget._id,
//     );

//   const handleEditBudget = () => {
//     setMenuOpen(false);
//     setEditOpen(true);
//   };

//   const handleEditRecurrence = () => {
//     setMenuOpen(false);
//     setRecurrenceEditOpen(true);
//   };

//   const handleDeleteBudget = () => {
//     setMenuOpen(false);
//     setDeleteOpen(true);
//   };

//   return (
//     <>
//       <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
//         {/* Header */}
//         <div className="flex items-start justify-between gap-3">
//           <div className="flex min-w-0 items-center gap-3">
//             <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
//               <Wallet className="size-4" />
//             </div>

//             <div className="min-w-0">
//               <p className="truncate text-sm font-semibold">
//                 {budget.scope === "OVERALL"
//                   ? "Overall Budget"
//                   : category?.name ??
//                     "Category Budget"}
//               </p>

//               {subcategory && (
//                 <p className="truncate text-xs text-muted-foreground">
//                   {subcategory.name}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="relative shrink-0">
//             <button
//               type="button"
//               aria-label="Budget actions"
//               aria-expanded={menuOpen}
//               className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
//               onClick={() =>
//                 setMenuOpen(
//                   (previous) => !previous,
//                 )
//               }
//             >
//               <MoreHorizontal className="size-4" />
//             </button>

//             {menuOpen && (
//               <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-border/60 bg-popover p-1 shadow-lg">
//                 {/* Edit current budget */}
//                 <button
//                   type="button"
//                   onClick={handleEditBudget}
//                   className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
//                 >
//                   <Pencil className="size-4" />

//                   <span>
//                     Edit budget
//                   </span>
//                 </button>

//                 {/* Edit recurrence template */}
//                 {isRecurrenceRoot && (
//                   <button
//                     type="button"
//                     onClick={
//                       handleEditRecurrence
//                     }
//                     className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
//                   >
//                     <Repeat className="size-4" />

//                     <span>
//                       Edit recurrence
//                     </span>
//                   </button>
//                 )}

//                 {/* Delete current budget */}
//                 <button
//                   type="button"
//                   onClick={
//                     handleDeleteBudget
//                   }
//                   className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
//                 >
//                   <Trash2 className="size-4" />

//                   <span>
//                     Delete budget
//                   </span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Amounts */}
//         <div className="mt-5 flex items-end justify-between gap-3">
//           <div>
//             <p className="text-xs text-muted-foreground">
//               Spent
//             </p>

//             <p
//               className={`mt-0.5 text-lg font-bold ${
//                 isExceeded
//                   ? "text-destructive"
//                   : "text-foreground"
//               }`}
//             >
//               {formatCurrency(
//                 budget.spentAmount,
//               )}
//             </p>
//           </div>

//           <div className="text-right">
//             <p className="text-xs text-muted-foreground">
//               Budget
//             </p>

//             <p className="mt-0.5 text-sm font-semibold">
//               {formatCurrency(
//                 budget.budgetAmount,
//               )}
//             </p>
//           </div>
//         </div>

//         {/* Progress */}
//         <div className="mt-4">
//           <div className="mb-1.5 flex items-center justify-between text-xs">
//             <span className="text-muted-foreground">
//               {budget.utilization.toFixed(
//                 1,
//               )}
//               % used
//             </span>

//             <span
//               className={
//                 isExceeded
//                   ? "font-semibold text-destructive"
//                   : "font-medium text-muted-foreground"
//               }
//             >
//               {formatCurrency(
//                 budget.remainingAmount,
//               )}{" "}
//               left
//             </span>
//           </div>

//           <div className="h-2 overflow-hidden rounded-full bg-muted">
//             <div
//               className={`h-full rounded-full transition-all ${
//                 isExceeded
//                   ? "bg-destructive"
//                   : "bg-primary"
//               }`}
//               style={{
//                 width: `${utilization}%`,
//               }}
//             />
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3">
//           <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
//             <CalendarDays className="size-3.5" />

//             <span>
//               {formatDate(
//                 budget.startDate,
//               )}
//               {" – "}
//               {formatDate(
//                 budget.endDate,
//               )}
//             </span>
//           </div>

//           <div className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold">
//             {formatEnum(budget.period)}
//           </div>
//         </div>
//       </div>

//       {/* Edit current budget */}
//       <EditBudgetDialog
//         budget={budget}
//         open={editOpen}
//         onOpenChange={setEditOpen}
//       />

//       {/* Edit recurrence template */}
//       {isRecurrenceRoot && (
//         <EditBudgetRecurrenceDialog
//           budget={budget}
//           open={recurrenceEditOpen}
//           onOpenChange={
//             setRecurrenceEditOpen
//           }
//         />
//       )}

//       {/* Delete */}
//       <DeleteBudgetDialog
//         budget={budget}
//         open={deleteOpen}
//         onOpenChange={setDeleteOpen}
//       />
//     </>
//   );
// }


"use client";

import {
  CalendarDays,
  MoreHorizontal,
  Pencil,
  Repeat,
  Trash2,
  Wallet,
} from "lucide-react";
import { useState } from "react";

import type {
  Budget,
  BudgetCategory,
} from "@/types/budget.types";

import { EditBudgetDialog } from "./edit-budget-dialog";
import { EditBudgetRecurrenceDialog } from "./edit-budget-recurrence-dialog";
import { DeleteBudgetDialog } from "./delete-budget-dialog";

interface BudgetCardProps {
  budget: Budget;
}

function getCategory(
  value: string | BudgetCategory | null | undefined,
) {
  if (!value || typeof value === "string") {
    return null;
  }

  return value;
}

function formatCurrency(
  amount: number,
  currency = "INR",
) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

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

export function BudgetCard({
  budget,
}: BudgetCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [recurrenceEditOpen, setRecurrenceEditOpen] =
    useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const category = getCategory(budget.categoryId);

  const subcategory = getCategory(
    budget.subcategoryId,
  );

  const utilization = Math.min(
    Math.max(budget.utilization, 0),
    100,
  );

  const isExceeded =
    budget.spentAmount > budget.budgetAmount;

  /**
   * A recurring budget can be either:
   *
   * 1. The root/template budget
   *    recurrence.enabled === true
   *    rootBudgetId === current budget id
   *
   * 2. A generated budget
   *    recurrence.enabled === false
   *    rootBudgetId points to the original budget
   *
   * Both should show the "Recurring" badge.
   */
  const isRecurringBudget =
    Boolean(
      budget.recurrence?.enabled ||
        budget.recurrence?.rootBudgetId,
    );

  /**
   * Only the root budget owns the recurrence
   * configuration.
   *
   * Generated budgets must use the normal
   * budget edit endpoint only.
   */
  const isRecurrenceRoot =
    Boolean(
      budget.recurrence?.enabled &&
        budget.recurrence.rootBudgetId ===
          budget._id,
    );

  const handleEditBudget = () => {
    setMenuOpen(false);
    setEditOpen(true);
  };

  const handleEditRecurrence = () => {
    setMenuOpen(false);
    setRecurrenceEditOpen(true);
  };

  const handleDeleteBudget = () => {
    setMenuOpen(false);
    setDeleteOpen(true);
  };

  return (
    <>
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {/* Icon */}
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Wallet className="size-4" />
            </div>

            {/* Budget name */}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {budget.scope === "OVERALL"
                  ? "Overall Budget"
                  : category?.name ??
                    "Category Budget"}
              </p>

              {subcategory && (
                <p className="truncate text-xs text-muted-foreground">
                  {subcategory.name}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="relative shrink-0">
            <button
              type="button"
              aria-label="Budget actions"
              aria-expanded={menuOpen}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() =>
                setMenuOpen(
                  (previous) => !previous,
                )
              }
            >
              <MoreHorizontal className="size-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-9 z-20 w-48 rounded-xl border border-border/60 bg-popover p-1 shadow-lg">
                {/* Edit current budget */}
                <button
                  type="button"
                  onClick={handleEditBudget}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <Pencil className="size-4" />

                  <span>
                    Edit budget
                  </span>
                </button>

                {/* Edit recurrence template */}
                {isRecurrenceRoot && (
                  <button
                    type="button"
                    onClick={handleEditRecurrence}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <Repeat className="size-4" />

                    <span>
                      Edit recurrence
                    </span>
                  </button>
                )}

                {/* Delete current budget */}
                <button
                  type="button"
                  onClick={handleDeleteBudget}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />

                  <span>
                    Delete budget
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Amounts */}
        <div className="mt-5 flex items-end justify-between gap-3">
          {/* Spent */}
          <div>
            <p className="text-xs text-muted-foreground">
              Spent
            </p>

            <p
              className={`mt-0.5 text-lg font-bold ${
                isExceeded
                  ? "text-destructive"
                  : "text-foreground"
              }`}
            >
              {formatCurrency(
                budget.spentAmount,
              )}
            </p>
          </div>

          {/* Budget */}
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              Budget
            </p>

            <p className="mt-0.5 text-sm font-semibold">
              {formatCurrency(
                budget.budgetAmount,
              )}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {budget.utilization.toFixed(1)}%
              {" "}
              used
            </span>

            <span
              className={
                isExceeded
                  ? "font-semibold text-destructive"
                  : "font-medium text-muted-foreground"
              }
            >
              {formatCurrency(
                budget.remainingAmount,
              )}{" "}
              left
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${
                isExceeded
                  ? "bg-destructive"
                  : "bg-primary"
              }`}
              style={{
                width: `${utilization}%`,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3">
          {/* Dates */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />

            <span>
              {formatDate(budget.startDate)}
              {" – "}
              {formatDate(budget.endDate)}
            </span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-end gap-1.5">
            {/* Period */}
            <div className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold">
              {formatEnum(budget.period)}
            </div>

            {/* Recurring */}
            {isRecurringBudget && (
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                <Repeat className="size-3" />

                <span>Recurring</span>
              </div>
            )}
          </div>
        </div>

        {/* Recurrence information */}
        {isRecurrenceRoot &&
          budget.recurrence && (
            <div className="mt-3 rounded-xl border border-primary/10 bg-primary/5 px-3 py-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Repeat className="size-3.5 text-primary" />

                  <span className="text-xs font-medium">
                    Recurring budget
                  </span>
                </div>

                <span className="text-[10px] font-medium text-muted-foreground">
                  {budget.recurrence.status ===
                  "ACTIVE"
                    ? "Active"
                    : "Stopped"}
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
                <span>
                  Future amount:{" "}
                  {formatCurrency(
                    budget.recurrence
                      .budgetAmount,
                  )}
                </span>

                {budget.recurrence
                  .nextGenerationDate && (
                  <span>
                    Next:{" "}
                    {formatDate(
                      budget.recurrence
                        .nextGenerationDate,
                    )}
                  </span>
                )}

                {budget.recurrence.endDate && (
                  <span>
                    Until:{" "}
                    {formatDate(
                      budget.recurrence.endDate,
                    )}
                  </span>
                )}
              </div>
            </div>
          )}
      </div>

      {/* Edit current budget */}
      <EditBudgetDialog
        budget={budget}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* Edit recurrence template */}
      {isRecurrenceRoot && (
        <EditBudgetRecurrenceDialog
          budget={budget}
          open={recurrenceEditOpen}
          onOpenChange={
            setRecurrenceEditOpen
          }
        />
      )}

      {/* Delete current budget */}
      <DeleteBudgetDialog
        budget={budget}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}