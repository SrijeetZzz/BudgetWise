// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { CalendarDays, Plus, X } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { useCategories } from "@/features/categories/hooks/use-categories";
// import { CategoryIcon } from "@/features/categories/components/category-icon";

// import { useCreateBudget } from "../hooks/use-create-budget";

// import type { Category } from "@/types/category.types";

// import type {
//   BudgetPeriod,
//   BudgetScope,
//   CreateBudgetInput,
// } from "@/types/budget.types";

// interface CreateBudgetDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// const SCOPES: BudgetScope[] = ["OVERALL", "CATEGORY", "SUBCATEGORY"];

// const PERIODS: BudgetPeriod[] = ["WEEKLY", "MONTHLY", "YEARLY", "CUSTOM"];

// export const formatEnum = (value: string) => {
//   return value
//     .toLowerCase()
//     .split("_")
//     .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
//     .join(" ");
// }

// function toDateInputValue(date: Date) {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// }

// export function CreateBudgetDialog({
//   open,
//   onOpenChange,
// }: CreateBudgetDialogProps) {
//   const createBudget = useCreateBudget();

//   const { data: categoryResponse, isLoading: categoriesLoading } =
//     useCategories();

//   const categories = categoryResponse?.data ?? [];

//   const parentCategories = useMemo(
//     () => categories.filter((category) => category.level === 0),
//     [categories],
//   );

//   const [scope, setScope] = useState<BudgetScope>("OVERALL");

//   const [categoryId, setCategoryId] = useState("");

//   const [subcategoryId, setSubcategoryId] = useState("");

//   const [period, setPeriod] = useState<BudgetPeriod>("MONTHLY");

//   const [startDate, setStartDate] = useState("");

//   const [endDate, setEndDate] = useState("");

//   const [budgetAmount, setBudgetAmount] = useState("");

//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!open) return;

//     setScope("OVERALL");
//     setCategoryId("");
//     setSubcategoryId("");
//     setPeriod("MONTHLY");
//     setStartDate("");
//     setEndDate("");
//     setBudgetAmount("");
//     setError("");
//   }, [open]);

//   const subcategories = useMemo(
//     () =>
//       categories.filter(
//         (category) =>
//           category.level === 1 && category.parentCategoryId === categoryId,
//       ),
//     [categories, categoryId],
//   );

//   const selectedCategory = categories.find(
//     (category) => category._id === categoryId,
//   );

//   const selectedSubcategory = categories.find(
//     (category) => category._id === subcategoryId,
//   );

//   const handleScopeChange = (nextScope: BudgetScope) => {
//     setScope(nextScope);

//     if (nextScope === "OVERALL") {
//       setCategoryId("");
//       setSubcategoryId("");
//     }

//     if (nextScope === "CATEGORY") {
//       setSubcategoryId("");
//     }
//   };

//   const handleCategoryChange = (value: string | null) => {
//     setCategoryId(value || "");
//     setSubcategoryId("");
//   };

//   const handlePeriodChange = (nextPeriod: BudgetPeriod) => {
//     setPeriod(nextPeriod);

//     /*
//      * We deliberately don't automatically calculate
//      * dates here. The backend requires explicit
//      * startDate and endDate, so the user should see
//      * exactly what period is being submitted.
//      */
//   };

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setError("");

//     if (scope === "CATEGORY" && !categoryId) {
//       setError("Please select a category.");
//       return;
//     }

//     if (scope === "SUBCATEGORY" && !categoryId) {
//       setError("Please select a category.");
//       return;
//     }

//     if (scope === "SUBCATEGORY" && !subcategoryId) {
//       setError("Please select a subcategory.");
//       return;
//     }

//     if (!startDate) {
//       setError("Start date is required.");
//       return;
//     }

//     if (!endDate) {
//       setError("End date is required.");
//       return;
//     }

//     if (endDate < startDate) {
//       setError("End date must be after the start date.");
//       return;
//     }

//     const amount = Number(budgetAmount);

//     if (!Number.isFinite(amount) || amount <= 0) {
//       setError("Budget amount must be greater than 0.");
//       return;
//     }

//     const payload: CreateBudgetInput = {
//       scope,
//       period,
//       startDate: new Date(`${startDate}T00:00:00`).toISOString(),
//       endDate: new Date(`${endDate}T23:59:59`).toISOString(),
//       budgetAmount: amount,
//     };

//     if (scope === "CATEGORY" || scope === "SUBCATEGORY") {
//       payload.categoryId = categoryId;
//     }

//     if (scope === "SUBCATEGORY") {
//       payload.subcategoryId = subcategoryId;
//     }

//     try {
//       await createBudget.mutateAsync(payload);

//       onOpenChange(false);
//     } catch (err: any) {
//       setError(
//         err?.response?.data?.message ??
//           "Unable to create budget. Please try again.",
//       );
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-0">
//       <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border/60 bg-card shadow-2xl animate-in zoom-in-95 duration-150">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-border/60 p-5 sm:p-6">
//           <div className="flex items-center gap-3">
//             <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
//               <Plus className="size-5" />
//             </div>

//             <div>
//               <h2 className="text-base font-bold tracking-tight sm:text-lg">
//                 Create Budget
//               </h2>

//               <p className="text-xs text-muted-foreground">
//                 Set a spending limit and track your progress.
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={() => onOpenChange(false)}
//             className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
//           >
//             <X className="size-4" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
//           {/* Scope */}
//           <div className="space-y-1.5">
//             <Label className="text-xs font-medium sm:text-sm">
//               Budget Scope
//             </Label>

//             <Select
//               value={scope}
//               onValueChange={(value) => handleScopeChange(value as BudgetScope)}
//             >
//               <SelectTrigger className="h-10 rounded-xl text-sm">
//                 <SelectValue>
//                   {(value) => formatEnum(value as string)}
//                 </SelectValue>
//               </SelectTrigger>

//               <SelectContent>
//                 {SCOPES.map((item) => (
//                   <SelectItem key={item} value={item}>
//                     {formatEnum(item)}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <p className="text-[11px] text-muted-foreground">
//               {scope === "OVERALL"
//                 ? "Track all expense transactions."
//                 : scope === "CATEGORY"
//                   ? "Track spending within a category."
//                   : "Track spending within a specific subcategory."}
//             </p>
//           </div>

//           {/* Category */}
//           {scope !== "OVERALL" && (
//             <div className="space-y-1.5">
//               <Label className="text-xs font-medium sm:text-sm">Category</Label>

//               <Select
//                 value={categoryId}
//                 onValueChange={handleCategoryChange}
//                 disabled={categoriesLoading}
//               >
//                 <SelectTrigger className="h-10 rounded-xl text-sm">
//                   <SelectValue
//                     placeholder={
//                       categoriesLoading
//                         ? "Loading categories..."
//                         : "Select category"
//                     }
//                   >
//                     {selectedCategory && (
//                       <div className="flex items-center gap-2">
//                         <CategoryIcon
//                           name={selectedCategory.icon}
//                           className="size-4"
//                         />

//                         <span>{selectedCategory.name}</span>
//                       </div>
//                     )}
//                   </SelectValue>
//                 </SelectTrigger>

//                 <SelectContent>
//                   {parentCategories.map((category) => (
//                     <SelectItem key={category._id} value={category._id}>
//                       <div className="flex items-center gap-2">
//                         <CategoryIcon name={category.icon} className="size-4" />

//                         <span>{category.name}</span>
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           {/* Subcategory */}
//           {scope === "SUBCATEGORY" && (
//             <div className="space-y-1.5">
//               <Label className="text-xs font-medium sm:text-sm">
//                 Subcategory
//               </Label>

//               <Select
//                 value={subcategoryId}
//                 onValueChange={(value) => {
//                   setSubcategoryId(value || "");
//                 }}
//                 disabled={!categoryId || subcategories.length === 0}
//               >
//                 <SelectTrigger className="h-10 rounded-xl text-sm">
//                   <SelectValue
//                     placeholder={
//                       !categoryId
//                         ? "Select category first"
//                         : subcategories.length === 0
//                           ? "No subcategories"
//                           : "Select subcategory"
//                     }
//                   >
//                     {selectedSubcategory && (
//                       <div className="flex items-center gap-2">
//                         <CategoryIcon
//                           name={selectedSubcategory.icon}
//                           className="size-4"
//                         />

//                         <span>{selectedSubcategory.name}</span>
//                       </div>
//                     )}
//                   </SelectValue>
//                 </SelectTrigger>

//                 <SelectContent>
//                   {subcategories.map((subcategory) => (
//                     <SelectItem key={subcategory._id} value={subcategory._id}>
//                       <div className="flex items-center gap-2">
//                         <CategoryIcon
//                           name={subcategory.icon}
//                           className="size-4"
//                         />

//                         <span>{subcategory.name}</span>
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           {/* Period */}
//           <div className="space-y-1.5">
//             <Label className="text-xs font-medium sm:text-sm">
//               Budget Period
//             </Label>

//             <Select
//               value={period}
//               onValueChange={(value) =>
//                 handlePeriodChange(value as BudgetPeriod)
//               }
//             >
//               <SelectTrigger className="h-10 rounded-xl text-sm">
//                 <SelectValue>
//                   {(value) => formatEnum(value as string)}
//                 </SelectValue>
//               </SelectTrigger>

//               <SelectContent>
//                 {PERIODS.map((item) => (
//                   <SelectItem key={item} value={item}>
//                     {formatEnum(item)}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Dates */}
//           <div className="grid gap-3 sm:grid-cols-2">
//             <div className="space-y-1.5">
//               <Label
//                 htmlFor="budget-start-date"
//                 className="text-xs font-medium sm:text-sm"
//               >
//                 Start Date
//               </Label>

//               <div className="relative">
//                 <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

//                 <Input
//                   id="budget-start-date"
//                   type="date"
//                   value={startDate}
//                   onChange={(event) => setStartDate(event.target.value)}
//                   className="h-10 rounded-xl pl-9 text-sm"
//                 />
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               <Label
//                 htmlFor="budget-end-date"
//                 className="text-xs font-medium sm:text-sm"
//               >
//                 End Date
//               </Label>

//               <div className="relative">
//                 <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

//                 <Input
//                   id="budget-end-date"
//                   type="date"
//                   min={startDate || undefined}
//                   value={endDate}
//                   onChange={(event) => setEndDate(event.target.value)}
//                   className="h-10 rounded-xl pl-9 text-sm"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Amount */}
//           <div className="space-y-1.5">
//             <Label
//               htmlFor="budget-amount"
//               className="text-xs font-medium sm:text-sm"
//             >
//               Budget Amount
//             </Label>

//             <Input
//               id="budget-amount"
//               type="number"
//               min="0"
//               step="0.01"
//               value={budgetAmount}
//               onChange={(event) => setBudgetAmount(event.target.value)}
//               placeholder="e.g. 25000"
//               className="h-10 rounded-xl text-sm"
//             />
//           </div>

//           {/* Error */}
//           {error && (
//             <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs font-medium text-destructive">
//               {error}
//             </div>
//           )}

//           {/* Actions */}
//           <div className="flex flex-col-reverse gap-2 border-t border-border/60 pt-4 sm:flex-row sm:justify-end sm:gap-3">
//             <Button
//               type="button"
//               variant="outline"
//               disabled={createBudget.isPending}
//               onClick={() => onOpenChange(false)}
//               className="h-10"
//             >
//               Cancel
//             </Button>

//             <Button
//               type="submit"
//               disabled={
//                 createBudget.isPending ||
//                 !startDate ||
//                 !endDate ||
//                 !budgetAmount ||
//                 (scope !== "OVERALL" && !categoryId) ||
//                 (scope === "SUBCATEGORY" && !subcategoryId)
//               }
//               className="h-10"
//             >
//               {createBudget.isPending ? "Creating..." : "Create Budget"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { CalendarDays, Plus, X } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { useCategories } from "@/features/categories/hooks/use-categories";
// import { CategoryIcon } from "@/features/categories/components/category-icon";

// import { useCreateBudget } from "../hooks/use-create-budget";

// import type {
//   BudgetPeriod,
//   BudgetScope,
//   CreateBudgetInput,
// } from "@/types/budget.types";

// interface CreateBudgetDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// const SCOPES: BudgetScope[] = [
//   "OVERALL",
//   "CATEGORY",
//   "SUBCATEGORY",
// ];

// const PERIODS: BudgetPeriod[] = [
//   "WEEKLY",
//   "MONTHLY",
//   "YEARLY",
//   "CUSTOM",
// ];

// export const formatEnum = (value: string) => {
//   return value
//     .toLowerCase()
//     .split("_")
//     .map(
//       (part) =>
//         part.charAt(0).toUpperCase() +
//         part.slice(1),
//     )
//     .join(" ");
// };

// export function CreateBudgetDialog({
//   open,
//   onOpenChange,
// }: CreateBudgetDialogProps) {
//   const createBudget = useCreateBudget();

//   const {
//     data: categoryResponse,
//     isLoading: categoriesLoading,
//   } = useCategories();

//   const categories =
//     categoryResponse?.data ?? [];

//   const parentCategories = useMemo(
//     () =>
//       categories.filter(
//         (category) => category.level === 0,
//       ),
//     [categories],
//   );

//   const [scope, setScope] =
//     useState<BudgetScope>("OVERALL");

//   const [categoryId, setCategoryId] =
//     useState("");

//   const [subcategoryId, setSubcategoryId] =
//     useState("");

//   const [period, setPeriod] =
//     useState<BudgetPeriod>("MONTHLY");

//   const [startDate, setStartDate] =
//     useState("");

//   const [endDate, setEndDate] =
//     useState("");

//   const [budgetAmount, setBudgetAmount] =
//     useState("");

//   // Recurrence
//   const [recurring, setRecurring] =
//     useState(false);

//   const [recurrenceAmount, setRecurrenceAmount] =
//     useState("");

//   const [recurrenceEndDate, setRecurrenceEndDate] =
//     useState("");

//   const [error, setError] =
//     useState("");

//   useEffect(() => {
//     if (!open) return;

//     setScope("OVERALL");
//     setCategoryId("");
//     setSubcategoryId("");
//     setPeriod("MONTHLY");
//     setStartDate("");
//     setEndDate("");
//     setBudgetAmount("");

//     // Reset recurrence
//     setRecurring(false);
//     setRecurrenceAmount("");
//     setRecurrenceEndDate("");

//     setError("");
//   }, [open]);

//   const subcategories = useMemo(
//     () =>
//       categories.filter(
//         (category) =>
//           category.level === 1 &&
//           category.parentCategoryId ===
//             categoryId,
//       ),
//     [categories, categoryId],
//   );

//   const selectedCategory =
//     categories.find(
//       (category) =>
//         category._id === categoryId,
//     );

//   const selectedSubcategory =
//     categories.find(
//       (category) =>
//         category._id === subcategoryId,
//     );

//   const handleScopeChange = (
//     nextScope: BudgetScope,
//   ) => {
//     setScope(nextScope);

//     if (nextScope === "OVERALL") {
//       setCategoryId("");
//       setSubcategoryId("");
//     }

//     if (nextScope === "CATEGORY") {
//       setSubcategoryId("");
//     }
//   };

//   const handleCategoryChange = (
//     value: string | null,
//   ) => {
//     setCategoryId(value || "");
//     setSubcategoryId("");
//   };

//   const handlePeriodChange = (
//     nextPeriod: BudgetPeriod,
//   ) => {
//     setPeriod(nextPeriod);

//     /**
//      * Backend does not support recurring
//      * CUSTOM budgets.
//      */
//     if (nextPeriod === "CUSTOM") {
//       setRecurring(false);
//       setRecurrenceAmount("");
//       setRecurrenceEndDate("");
//     }
//   };

//   const handleSubmit = async (
//     event: React.FormEvent<HTMLFormElement>,
//   ) => {
//     event.preventDefault();
//     setError("");

//     // -----------------------------
//     // Scope validation
//     // -----------------------------

//     if (
//       scope === "CATEGORY" &&
//       !categoryId
//     ) {
//       setError(
//         "Please select a category.",
//       );
//       return;
//     }

//     if (
//       scope === "SUBCATEGORY" &&
//       !categoryId
//     ) {
//       setError(
//         "Please select a category.",
//       );
//       return;
//     }

//     if (
//       scope === "SUBCATEGORY" &&
//       !subcategoryId
//     ) {
//       setError(
//         "Please select a subcategory.",
//       );
//       return;
//     }

//     // -----------------------------
//     // Date validation
//     // -----------------------------

//     if (!startDate) {
//       setError(
//         "Start date is required.",
//       );
//       return;
//     }

//     if (!endDate) {
//       setError(
//         "End date is required.",
//       );
//       return;
//     }

//     if (endDate < startDate) {
//       setError(
//         "End date must be after the start date.",
//       );
//       return;
//     }

//     // -----------------------------
//     // Budget amount validation
//     // -----------------------------

//     const amount = Number(
//       budgetAmount,
//     );

//     if (
//       !Number.isFinite(amount) ||
//       amount <= 0
//     ) {
//       setError(
//         "Budget amount must be greater than 0.",
//       );
//       return;
//     }

//     // -----------------------------
//     // Recurrence validation
//     // -----------------------------

//     if (
//       recurring &&
//       period === "CUSTOM"
//     ) {
//       setError(
//         "Recurring budgets are not supported for custom periods.",
//       );
//       return;
//     }

//     if (
//       recurring &&
//       recurrenceEndDate &&
//       recurrenceEndDate < endDate
//     ) {
//       setError(
//         "Recurrence end date must be after the current budget period.",
//       );
//       return;
//     }

//     let futureBudgetAmount:
//       | number
//       | undefined;

//     if (
//       recurring &&
//       recurrenceAmount
//     ) {
//       futureBudgetAmount =
//         Number(recurrenceAmount);

//       if (
//         !Number.isFinite(
//           futureBudgetAmount,
//         ) ||
//         futureBudgetAmount <= 0
//       ) {
//         setError(
//           "Future budget amount must be greater than 0.",
//         );
//         return;
//       }
//     }

//     // -----------------------------
//     // Create base payload
//     // -----------------------------

//     const payload: CreateBudgetInput = {
//       scope,
//       period,

//       startDate: new Date(
//         `${startDate}T00:00:00`,
//       ).toISOString(),

//       endDate: new Date(
//         `${endDate}T23:59:59`,
//       ).toISOString(),

//       budgetAmount: amount,
//     };

//     // -----------------------------
//     // Category
//     // -----------------------------

//     if (
//       scope === "CATEGORY" ||
//       scope === "SUBCATEGORY"
//     ) {
//       payload.categoryId =
//         categoryId;
//     }

//     // -----------------------------
//     // Subcategory
//     // -----------------------------

//     if (
//       scope === "SUBCATEGORY"
//     ) {
//       payload.subcategoryId =
//         subcategoryId;
//     }

//     // -----------------------------
//     // Recurrence
//     // -----------------------------

//     if (recurring) {
//       payload.recurrence = {
//         enabled: true,
//       };

//       /**
//        * If omitted, backend uses the
//        * current budget amount.
//        */
//       if (
//         futureBudgetAmount !==
//         undefined
//       ) {
//         payload.recurrence.budgetAmount =
//           futureBudgetAmount;
//       }

//       /**
//        * If omitted, recurrence continues
//        * indefinitely.
//        */
//       if (recurrenceEndDate) {
//         payload.recurrence.endDate =
//           new Date(
//             `${recurrenceEndDate}T23:59:59`,
//           ).toISOString();
//       }
//     }

//     // -----------------------------
//     // API call
//     // -----------------------------

//     try {
//       await createBudget.mutateAsync(
//         payload,
//       );

//       onOpenChange(false);
//     } catch (err: any) {
//       setError(
//         err?.response?.data?.message ??
//           "Unable to create budget. Please try again.",
//       );
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in-0">
//       <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border/60 bg-card shadow-2xl animate-in zoom-in-95 duration-150">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b border-border/60 p-5 sm:p-6">
//           <div className="flex items-center gap-3">
//             <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
//               <Plus className="size-5" />
//             </div>

//             <div>
//               <h2 className="text-base font-bold tracking-tight sm:text-lg">
//                 Create Budget
//               </h2>

//               <p className="text-xs text-muted-foreground">
//                 Set a spending limit and
//                 track your progress.
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={() =>
//               onOpenChange(false)
//             }
//             className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
//           >
//             <X className="size-4" />
//           </button>
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="space-y-5 p-5 sm:p-6"
//         >
//           {/* Scope */}
//           <div className="space-y-1.5">
//             <Label className="text-xs font-medium sm:text-sm">
//               Budget Scope
//             </Label>

//             <Select
//               value={scope}
//               onValueChange={(value) =>
//                 handleScopeChange(
//                   value as BudgetScope,
//                 )
//               }
//             >
//               <SelectTrigger className="h-10 rounded-xl text-sm">
//                 <SelectValue>
//                   {(value) =>
//                     formatEnum(
//                       value as string,
//                     )
//                   }
//                 </SelectValue>
//               </SelectTrigger>

//               <SelectContent>
//                 {SCOPES.map((item) => (
//                   <SelectItem
//                     key={item}
//                     value={item}
//                   >
//                     {formatEnum(item)}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             <p className="text-[11px] text-muted-foreground">
//               {scope === "OVERALL"
//                 ? "Track all expense transactions."
//                 : scope === "CATEGORY"
//                   ? "Track spending within a category."
//                   : "Track spending within a specific subcategory."}
//             </p>
//           </div>

//           {/* Category */}
//           {scope !== "OVERALL" && (
//             <div className="space-y-1.5">
//               <Label className="text-xs font-medium sm:text-sm">
//                 Category
//               </Label>

//               <Select
//                 value={categoryId}
//                 onValueChange={
//                   handleCategoryChange
//                 }
//                 disabled={
//                   categoriesLoading
//                 }
//               >
//                 <SelectTrigger className="h-10 rounded-xl text-sm">
//                   <SelectValue
//                     placeholder={
//                       categoriesLoading
//                         ? "Loading categories..."
//                         : "Select category"
//                     }
//                   >
//                     {selectedCategory && (
//                       <div className="flex items-center gap-2">
//                         <CategoryIcon
//                           name={
//                             selectedCategory.icon
//                           }
//                           className="size-4"
//                         />

//                         <span>
//                           {
//                             selectedCategory.name
//                           }
//                         </span>
//                       </div>
//                     )}
//                   </SelectValue>
//                 </SelectTrigger>

//                 <SelectContent>
//                   {parentCategories.map(
//                     (category) => (
//                       <SelectItem
//                         key={
//                           category._id
//                         }
//                         value={
//                           category._id
//                         }
//                       >
//                         <div className="flex items-center gap-2">
//                           <CategoryIcon
//                             name={
//                               category.icon
//                             }
//                             className="size-4"
//                           />

//                           <span>
//                             {
//                               category.name
//                             }
//                           </span>
//                         </div>
//                       </SelectItem>
//                     ),
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           {/* Subcategory */}
//           {scope ===
//             "SUBCATEGORY" && (
//             <div className="space-y-1.5">
//               <Label className="text-xs font-medium sm:text-sm">
//                 Subcategory
//               </Label>

//               <Select
//                 value={
//                   subcategoryId
//                 }
//                 onValueChange={(
//                   value,
//                 ) => {
//                   setSubcategoryId(
//                     value || "",
//                   );
//                 }}
//                 disabled={
//                   !categoryId ||
//                   subcategories.length ===
//                     0
//                 }
//               >
//                 <SelectTrigger className="h-10 rounded-xl text-sm">
//                   <SelectValue
//                     placeholder={
//                       !categoryId
//                         ? "Select category first"
//                         : subcategories.length ===
//                             0
//                           ? "No subcategories"
//                           : "Select subcategory"
//                     }
//                   >
//                     {selectedSubcategory && (
//                       <div className="flex items-center gap-2">
//                         <CategoryIcon
//                           name={
//                             selectedSubcategory.icon
//                           }
//                           className="size-4"
//                         />

//                         <span>
//                           {
//                             selectedSubcategory.name
//                           }
//                         </span>
//                       </div>
//                     )}
//                   </SelectValue>
//                 </SelectTrigger>

//                 <SelectContent>
//                   {subcategories.map(
//                     (subcategory) => (
//                       <SelectItem
//                         key={
//                           subcategory._id
//                         }
//                         value={
//                           subcategory._id
//                         }
//                       >
//                         <div className="flex items-center gap-2">
//                           <CategoryIcon
//                             name={
//                               subcategory.icon
//                             }
//                             className="size-4"
//                           />

//                           <span>
//                             {
//                               subcategory.name
//                             }
//                           </span>
//                         </div>
//                       </SelectItem>
//                     ),
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           {/* Period */}
//           <div className="space-y-1.5">
//             <Label className="text-xs font-medium sm:text-sm">
//               Budget Period
//             </Label>

//             <Select
//               value={period}
//               onValueChange={(value) =>
//                 handlePeriodChange(
//                   value as BudgetPeriod,
//                 )
//               }
//             >
//               <SelectTrigger className="h-10 rounded-xl text-sm">
//                 <SelectValue>
//                   {(value) =>
//                     formatEnum(
//                       value as string,
//                     )
//                   }
//                 </SelectValue>
//               </SelectTrigger>

//               <SelectContent>
//                 {PERIODS.map((item) => (
//                   <SelectItem
//                     key={item}
//                     value={item}
//                   >
//                     {formatEnum(item)}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             {period === "CUSTOM" && (
//               <p className="text-[11px] text-muted-foreground">
//                 Custom budgets cannot be
//                 recurring.
//               </p>
//             )}
//           </div>

//           {/* Recurrence */}
//           {period !== "CUSTOM" && (
//             <div className="space-y-4 rounded-xl border border-border/60 bg-muted/30 p-4">
//               <div className="flex items-center justify-between gap-4">
//                 <div>
//                   <Label className="text-sm font-medium">
//                     Recurring Budget
//                   </Label>

//                   <p className="mt-1 text-[11px] text-muted-foreground">
//                     Automatically generate
//                     the next budget period.
//                   </p>
//                 </div>

//                 <button
//                   type="button"
//                   role="switch"
//                   aria-checked={
//                     recurring
//                   }
//                   onClick={() =>
//                     setRecurring(
//                       (value) =>
//                         !value,
//                     )
//                   }
//                   className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
//                     recurring
//                       ? "bg-primary"
//                       : "bg-muted-foreground/30"
//                   }`}
//                 >
//                   <span
//                     className={`absolute top-0.5 size-5 rounded-full bg-background shadow-sm transition-transform ${
//                       recurring
//                         ? "translate-x-5"
//                         : "translate-x-0.5"
//                     }`}
//                   />
//                 </button>
//               </div>

//               {recurring && (
//                 <div className="space-y-4 border-t border-border/60 pt-4">
//                   {/* Future amount */}
//                   <div className="space-y-1.5">
//                     <Label
//                       htmlFor="recurrence-budget-amount"
//                       className="text-xs font-medium sm:text-sm"
//                     >
//                       Future Budget Amount
//                     </Label>

//                     <Input
//                       id="recurrence-budget-amount"
//                       type="number"
//                       min="0"
//                       step="0.01"
//                       value={
//                         recurrenceAmount
//                       }
//                       onChange={(
//                         event,
//                       ) =>
//                         setRecurrenceAmount(
//                           event.target
//                             .value,
//                         )
//                       }
//                       placeholder={
//                         budgetAmount
//                           ? `Same as ${budgetAmount}`
//                           : "e.g. 10000"
//                       }
//                       className="h-10 rounded-xl text-sm"
//                     />

//                     <p className="text-[11px] text-muted-foreground">
//                       Leave empty to use
//                       the current budget
//                       amount.
//                     </p>
//                   </div>

//                   {/* Recurrence end date */}
//                   <div className="space-y-1.5">
//                     <Label
//                       htmlFor="recurrence-end-date"
//                       className="text-xs font-medium sm:text-sm"
//                     >
//                       Recurrence End Date
//                     </Label>

//                     <div className="relative">
//                       <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

//                       <Input
//                         id="recurrence-end-date"
//                         type="date"
//                         min={
//                           endDate ||
//                           undefined
//                         }
//                         value={
//                           recurrenceEndDate
//                         }
//                         onChange={(
//                           event,
//                         ) =>
//                           setRecurrenceEndDate(
//                             event.target
//                               .value,
//                           )
//                         }
//                         className="h-10 rounded-xl pl-9 text-sm"
//                       />
//                     </div>

//                     <p className="text-[11px] text-muted-foreground">
//                       Leave empty to continue
//                       indefinitely.
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Dates */}
//           <div className="grid gap-3 sm:grid-cols-2">
//             <div className="space-y-1.5">
//               <Label
//                 htmlFor="budget-start-date"
//                 className="text-xs font-medium sm:text-sm"
//               >
//                 Start Date
//               </Label>

//               <div className="relative">
//                 <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

//                 <Input
//                   id="budget-start-date"
//                   type="date"
//                   value={startDate}
//                   onChange={(event) =>
//                     setStartDate(
//                       event.target.value,
//                     )
//                   }
//                   className="h-10 rounded-xl pl-9 text-sm"
//                 />
//               </div>
//             </div>

//             <div className="space-y-1.5">
//               <Label
//                 htmlFor="budget-end-date"
//                 className="text-xs font-medium sm:text-sm"
//               >
//                 End Date
//               </Label>

//               <div className="relative">
//                 <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

//                 <Input
//                   id="budget-end-date"
//                   type="date"
//                   min={
//                     startDate ||
//                     undefined
//                   }
//                   value={endDate}
//                   onChange={(event) =>
//                     setEndDate(
//                       event.target.value,
//                     )
//                   }
//                   className="h-10 rounded-xl pl-9 text-sm"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Amount */}
//           <div className="space-y-1.5">
//             <Label
//               htmlFor="budget-amount"
//               className="text-xs font-medium sm:text-sm"
//             >
//               Budget Amount
//             </Label>

//             <Input
//               id="budget-amount"
//               type="number"
//               min="0"
//               step="0.01"
//               value={budgetAmount}
//               onChange={(event) =>
//                 setBudgetAmount(
//                   event.target.value,
//                 )
//               }
//               placeholder="e.g. 25000"
//               className="h-10 rounded-xl text-sm"
//             />
//           </div>

//           {/* Error */}
//           {error && (
//             <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs font-medium text-destructive">
//               {error}
//             </div>
//           )}

//           {/* Actions */}
//           <div className="flex flex-col-reverse gap-2 border-t border-border/60 pt-4 sm:flex-row sm:justify-end sm:gap-3">
//             <Button
//               type="button"
//               variant="outline"
//               disabled={
//                 createBudget.isPending
//               }
//               onClick={() =>
//                 onOpenChange(false)
//               }
//               className="h-10"
//             >
//               Cancel
//             </Button>

//             <Button
//               type="submit"
//               disabled={
//                 createBudget.isPending ||
//                 !startDate ||
//                 !endDate ||
//                 !budgetAmount ||
//                 (scope !== "OVERALL" &&
//                   !categoryId) ||
//                 (scope ===
//                   "SUBCATEGORY" &&
//                   !subcategoryId)
//               }
//               className="h-10"
//             >
//               {createBudget.isPending
//                 ? "Creating..."
//                 : recurring
//                   ? "Create Recurring Budget"
//                   : "Create Budget"}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Plus, X, AlertCircle, Loader2 } from "lucide-react";

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

import { useCategories } from "@/features/categories/hooks/use-categories";
import { CategoryIcon } from "@/features/categories/components/category-icon";

import { useCreateBudget } from "../hooks/use-create-budget";

import type {
  BudgetPeriod,
  BudgetScope,
  CreateBudgetInput,
} from "@/types/budget.types";

interface CreateBudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SCOPES: BudgetScope[] = [
  "OVERALL",
  "CATEGORY",
  "SUBCATEGORY",
];

const PERIODS: BudgetPeriod[] = [
  "WEEKLY",
  "MONTHLY",
  "YEARLY",
  "CUSTOM",
];

export const formatEnum = (value: string) => {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
};

export function CreateBudgetDialog({
  open,
  onOpenChange,
}: CreateBudgetDialogProps) {
  const createBudget = useCreateBudget();

  const {
    data: categoryResponse,
    isLoading: categoriesLoading,
  } = useCategories();

  const categories = categoryResponse?.data ?? [];

  const parentCategories = useMemo(
    () =>
      categories.filter(
        (category) => category.level === 0,
      ),
    [categories],
  );

  const [scope, setScope] = useState<BudgetScope>("OVERALL");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [period, setPeriod] = useState<BudgetPeriod>("MONTHLY");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");

  // Recurrence
  const [recurring, setRecurring] = useState(false);
  const [recurrenceAmount, setRecurrenceAmount] = useState("");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setScope("OVERALL");
    setCategoryId("");
    setSubcategoryId("");
    setPeriod("MONTHLY");
    setStartDate("");
    setEndDate("");
    setBudgetAmount("");

    // Reset recurrence
    setRecurring(false);
    setRecurrenceAmount("");
    setRecurrenceEndDate("");

    setError("");
  }, [open]);

  const subcategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.level === 1 &&
          category.parentCategoryId === categoryId,
      ),
    [categories, categoryId],
  );

  const selectedCategory = categories.find(
    (category) => category._id === categoryId,
  );

  const selectedSubcategory = categories.find(
    (category) => category._id === subcategoryId,
  );

  const handleScopeChange = (nextScope: BudgetScope) => {
    setScope(nextScope);

    if (nextScope === "OVERALL") {
      setCategoryId("");
      setSubcategoryId("");
    }

    if (nextScope === "CATEGORY") {
      setSubcategoryId("");
    }
  };

  const handleCategoryChange = (value: string | null) => {
    setCategoryId(value || "");
    setSubcategoryId("");
  };

  const handlePeriodChange = (nextPeriod: BudgetPeriod) => {
    setPeriod(nextPeriod);

    if (nextPeriod === "CUSTOM") {
      setRecurring(false);
      setRecurrenceAmount("");
      setRecurrenceEndDate("");
    }
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");

    if (scope === "CATEGORY" && !categoryId) {
      setError("Please select a category.");
      return;
    }

    if (scope === "SUBCATEGORY" && !categoryId) {
      setError("Please select a category.");
      return;
    }

    if (scope === "SUBCATEGORY" && !subcategoryId) {
      setError("Please select a subcategory.");
      return;
    }

    if (!startDate) {
      setError("Start date is required.");
      return;
    }

    if (!endDate) {
      setError("End date is required.");
      return;
    }

    if (endDate < startDate) {
      setError("End date must be after the start date.");
      return;
    }

    const amount = Number(budgetAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Budget amount must be greater than 0.");
      return;
    }

    if (recurring && period === "CUSTOM") {
      setError("Recurring budgets are not supported for custom periods.");
      return;
    }

    if (recurring && recurrenceEndDate && recurrenceEndDate < endDate) {
      setError(
        "Recurrence end date must be after the current budget period.",
      );
      return;
    }

    let futureBudgetAmount: number | undefined;

    if (recurring && recurrenceAmount) {
      futureBudgetAmount = Number(recurrenceAmount);

      if (!Number.isFinite(futureBudgetAmount) || futureBudgetAmount <= 0) {
        setError("Future budget amount must be greater than 0.");
        return;
      }
    }

    const payload: CreateBudgetInput = {
      scope,
      period,

      startDate: new Date(`${startDate}T00:00:00`).toISOString(),
      endDate: new Date(`${endDate}T23:59:59`).toISOString(),

      budgetAmount: amount,
    };

    if (scope === "CATEGORY" || scope === "SUBCATEGORY") {
      payload.categoryId = categoryId;
    }

    if (scope === "SUBCATEGORY") {
      payload.subcategoryId = subcategoryId;
    }

    if (recurring) {
      payload.recurrence = {
        enabled: true,
      };

      if (futureBudgetAmount !== undefined) {
        payload.recurrence.budgetAmount = futureBudgetAmount;
      }

      if (recurrenceEndDate) {
        payload.recurrence.endDate = new Date(
          `${recurrenceEndDate}T23:59:59`,
        ).toISOString();
      }
    }

    try {
      await createBudget.mutateAsync(payload);
      onOpenChange(false);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Unable to create budget. Please try again.",
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md animate-in fade-in-0 duration-200">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Plus className="size-5" />
            </div>

            <div>
              <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
                Create Budget
              </h2>
              <p className="text-xs text-muted-foreground">
                Set spending limits and track your financial allocations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex size-8 items-center justify-center rounded-xl border border-border/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="space-y-5 p-5 sm:p-6">
            {/* Scope Selection */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground sm:text-sm">
                Budget Scope
              </Label>

              <Select
                value={scope}
                onValueChange={(value) =>
                  handleScopeChange(value as BudgetScope)
                }
              >
                <SelectTrigger className="h-10 rounded-xl border-border/60 px-3.5 text-xs font-semibold sm:text-sm">
                  <SelectValue placeholder="Select scope" />
                </SelectTrigger>

                <SelectContent className="rounded-xl border-border/60">
                  {SCOPES.map((item) => (
                    <SelectItem
                      key={item}
                      value={item}
                      className="text-xs font-medium sm:text-sm cursor-pointer"
                    >
                      {formatEnum(item)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <p className="text-[11px] font-medium text-muted-foreground">
                {scope === "OVERALL"
                  ? "Tracks total spending across all categories."
                  : scope === "CATEGORY"
                    ? "Tracks spending limited to a specific category."
                    : "Tracks spending within a specific subcategory."}
              </p>
            </div>

            {/* Category */}
            {scope !== "OVERALL" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground sm:text-sm">
                  Category
                </Label>

                <Select
                  value={categoryId}
                  onValueChange={handleCategoryChange}
                  disabled={categoriesLoading}
                >
                  <SelectTrigger className="h-10 rounded-xl border-border/60 px-3.5 text-xs font-semibold sm:text-sm">
                    <SelectValue
                      placeholder={
                        categoriesLoading
                          ? "Loading categories..."
                          : "Select category"
                      }
                    >
                      {selectedCategory && (
                        <div className="flex items-center gap-2">
                          <CategoryIcon
                            name={selectedCategory.icon}
                            className="size-4 text-primary"
                          />
                          <span className="font-semibold text-foreground">
                            {selectedCategory.name}
                          </span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent className="rounded-xl border-border/60">
                    {parentCategories.map((category) => (
                      <SelectItem
                        key={category._id}
                        value={category._id}
                        className="text-xs font-medium sm:text-sm cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <CategoryIcon
                            name={category.icon}
                            className="size-4"
                          />
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Subcategory */}
            {scope === "SUBCATEGORY" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground sm:text-sm">
                  Subcategory
                </Label>

                <Select
                  value={subcategoryId}
                  onValueChange={(value) => setSubcategoryId(value || "")}
                  disabled={!categoryId || subcategories.length === 0}
                >
                  <SelectTrigger className="h-10 rounded-xl border-border/60 px-3.5 text-xs font-semibold sm:text-sm">
                    <SelectValue
                      placeholder={
                        !categoryId
                          ? "Select category first"
                          : subcategories.length === 0
                            ? "No subcategories found"
                            : "Select subcategory"
                      }
                    >
                      {selectedSubcategory && (
                        <div className="flex items-center gap-2">
                          <CategoryIcon
                            name={selectedSubcategory.icon}
                            className="size-4 text-primary"
                          />
                          <span className="font-semibold text-foreground">
                            {selectedSubcategory.name}
                          </span>
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>

                  <SelectContent className="rounded-xl border-border/60">
                    {subcategories.map((subcategory) => (
                      <SelectItem
                        key={subcategory._id}
                        value={subcategory._id}
                        className="text-xs font-medium sm:text-sm cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <CategoryIcon
                            name={subcategory.icon}
                            className="size-4"
                          />
                          <span>{subcategory.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Period */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground sm:text-sm">
                Budget Period
              </Label>

              <Select
                value={period}
                onValueChange={(value) =>
                  handlePeriodChange(value as BudgetPeriod)
                }
              >
                <SelectTrigger className="h-10 rounded-xl border-border/60 px-3.5 text-xs font-semibold sm:text-sm">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>

                <SelectContent className="rounded-xl border-border/60">
                  {PERIODS.map((item) => (
                    <SelectItem
                      key={item}
                      value={item}
                      className="text-xs font-medium sm:text-sm cursor-pointer"
                    >
                      {formatEnum(item)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {period === "CUSTOM" && (
                <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                  Custom timeframe budgets cannot be configured to auto-recur.
                </p>
              )}
            </div>

            {/* Recurrence Toggle Card */}
            {period !== "CUSTOM" && (
              <div className="space-y-4 rounded-2xl border border-border/60 bg-muted/20 p-4 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold text-foreground sm:text-sm">
                      Auto-Recurring Budget
                    </Label>
                    <p className="text-[11px] font-medium text-muted-foreground">
                      Automatically renew limit upon cycle completion
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={recurring}
                    onClick={() => setRecurring((v) => !v)}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                      recurring ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  >
                    <span
                      className={`inline-block size-5 rounded-full bg-background shadow-xs transition-transform duration-200 ease-in-out ${
                        recurring ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {recurring && (
                  <div className="space-y-4 border-t border-border/60 pt-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="recurrence-budget-amount"
                        className="text-xs font-semibold text-foreground sm:text-sm"
                      >
                        Next Cycle Budget Amount
                      </Label>

                      <Input
                        id="recurrence-budget-amount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={recurrenceAmount}
                        onChange={(e) => setRecurrenceAmount(e.target.value)}
                        placeholder={
                          budgetAmount
                            ? `Default: ₹${budgetAmount}`
                            : "e.g. 10000"
                        }
                        className="h-10 rounded-xl border-border/60 px-3.5 text-xs font-medium sm:text-sm"
                      />

                      <p className="text-[11px] font-medium text-muted-foreground">
                        Leave empty to retain current budget limit
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="recurrence-end-date"
                        className="text-xs font-semibold text-foreground sm:text-sm"
                      >
                        Recurrence Termination Date
                      </Label>

                      <div className="relative">
                        <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="recurrence-end-date"
                          type="date"
                          min={endDate || undefined}
                          value={recurrenceEndDate}
                          onChange={(e) => setRecurrenceEndDate(e.target.value)}
                          className="h-10 rounded-xl border-border/60 pl-10 pr-3.5 text-xs font-medium sm:text-sm"
                        />
                      </div>

                      <p className="text-[11px] font-medium text-muted-foreground">
                        Leave blank to repeat indefinitely
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dates */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="budget-start-date"
                  className="text-xs font-semibold text-foreground sm:text-sm"
                >
                  Start Date
                </Label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="budget-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-10 rounded-xl border-border/60 pl-10 pr-3.5 text-xs font-medium sm:text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="budget-end-date"
                  className="text-xs font-semibold text-foreground sm:text-sm"
                >
                  End Date
                </Label>

                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="budget-end-date"
                    type="date"
                    min={startDate || undefined}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-10 rounded-xl border-border/60 pl-10 pr-3.5 text-xs font-medium sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <Label
                htmlFor="budget-amount"
                className="text-xs font-semibold text-foreground sm:text-sm"
              >
                Budget Amount (₹)
              </Label>

              <Input
                id="budget-amount"
                type="number"
                min="0"
                step="0.01"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="e.g. 25000"
                className="h-10 rounded-xl border-border/60 px-3.5 text-xs font-medium sm:text-sm"
              />
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs font-semibold text-destructive">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="mt-auto flex flex-col-reverse gap-2 border-t border-border/60 bg-card p-5 sm:flex-row sm:justify-end sm:gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={createBudget.isPending}
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-xl text-xs font-bold sm:text-sm"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                createBudget.isPending ||
                !startDate ||
                !endDate ||
                !budgetAmount ||
                (scope !== "OVERALL" && !categoryId) ||
                (scope === "SUBCATEGORY" && !subcategoryId)
              }
              className="h-10 gap-2 rounded-xl text-xs font-bold sm:text-sm"
            >
              {createBudget.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              <span>
                {createBudget.isPending
                  ? "Creating..."
                  : recurring
                    ? "Create Recurring Budget"
                    : "Create Budget"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}