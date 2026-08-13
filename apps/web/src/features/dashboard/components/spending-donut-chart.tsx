// // 'use client';

// // import { useMemo } from 'react';
// // import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
// // import { FolderTree } from 'lucide-react';

// // import type { DashboardCategorySpending } from '@/types/dashboard.types';

// // interface SpendingDonutChartProps {
// //   data: DashboardCategorySpending[];
// //   title?: string;
// //   description?: string;
// // }

// // const DEFAULT_COLORS = [
// //   '#3B82F6', // Blue
// //   '#F97316', // Orange
// //   '#10B981', // Emerald
// //   '#EC4899', // Pink
// //   '#8B5CF6', // Purple
// //   '#EAB308', // Amber
// //   '#64748B', // Slate
// // ];

// // function formatCurrency(amount: number) {
// //   return new Intl.NumberFormat('en-IN', {
// //     style: 'currency',
// //     currency: 'INR',
// //     maximumFractionDigits: 0,
// //   }).format(amount);
// // }

// // export function SpendingDonutChart({
// //   data,
// //   title = 'Subcategory Breakdown',
// //   description = 'Detailed breakdown of spending by subcategory',
// // }: SpendingDonutChartProps) {
// //   const totalExpense = useMemo(
// //     () => data.reduce((sum, item) => sum + item.amount, 0),
// //     [data],
// //   );

// //   const chartData = useMemo(
// //     () =>
// //       data.map((item, idx) => ({
// //         ...item,
// //         color: item.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
// //       })),
// //     [data],
// //   );

// //   if (!data.length || totalExpense === 0) {
// //     return (
// //       <section className="flex min-h-95 flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
// //         <div className="flex items-center gap-3">
// //           <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
// //             <FolderTree className="size-5" />
// //           </div>
// //           <div>
// //             <h2 className="text-base font-bold tracking-tight text-foreground">
// //               {title}
// //             </h2>
// //             <p className="text-xs text-muted-foreground">{description}</p>
// //           </div>
// //         </div>

// //         <div className="flex min-h-55 flex-col items-center justify-center text-center">
// //           <FolderTree className="size-8 text-muted-foreground/50" />
// //           <p className="mt-2 text-sm font-semibold text-foreground">
// //             No spending data
// //           </p>
// //           <p className="mt-0.5 text-xs text-muted-foreground">
// //             Subcategory data for this period will appear here.
// //           </p>
// //         </div>
// //       </section>
// //     );
// //   }

// //   return (
// //     <section className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
// //       {/* Header */}
// //       <div className="flex items-center justify-between border-b border-border/60 pb-4">
// //         <div className="flex items-center gap-3">
// //           <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
// //             <FolderTree className="size-5" />
// //           </div>
// //           <div>
// //             <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
// //               {title}
// //             </h2>
// //             <p className="text-xs text-muted-foreground">{description}</p>
// //           </div>
// //         </div>

// //         <div className="text-right">
// //           <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
// //             Total
// //           </span>
// //           <p className="text-sm font-extrabold text-foreground sm:text-base">
// //             {formatCurrency(totalExpense)}
// //           </p>
// //         </div>
// //       </div>

// //       {/* Donut Chart & Legend */}
// //       <div className="mt-4 grid grid-cols-1 items-center gap-6 md:grid-cols-12">
// //         {/* Donut Visual */}
// //         <div className="relative flex h-60 w-full items-center justify-center md:col-span-5">
// //           <ResponsiveContainer width="100%" height="100%">
// //             <PieChart>
// //               <Tooltip
// //                 content={({ active, payload }) => {
// //                   if (active && payload && payload.length) {
// //                     const item = payload[0].payload as typeof chartData[0];
// //                     return (
// //                       <div className="rounded-xl border border-border/60 bg-card p-3 shadow-md">
// //                         <div className="flex items-center gap-2">
// //                           <span
// //                             className="size-2.5 rounded-full"
// //                             style={{ backgroundColor: item.color }}
// //                           />
// //                           <p className="text-xs font-bold text-foreground">
// //                             {item.name}
// //                           </p>
// //                         </div>
// //                         <p className="mt-1 text-xs font-medium text-muted-foreground">
// //                           {formatCurrency(item.amount)}{' '}
// //                           <span className="text-[10px] font-normal">
// //                             ({item.percentage.toFixed(1)}%)
// //                           </span>
// //                         </p>
// //                       </div>
// //                     );
// //                   }
// //                   return null;
// //                 }}
// //               />
// //               <Pie
// //                 data={chartData}
// //                 dataKey="amount"
// //                 nameKey="name"
// //                 cx="50%"
// //                 cy="50%"
// //                 innerRadius={65}
// //                 outerRadius={95}
// //                 paddingAngle={3}
// //                 stroke="none"
// //               >
// //                 {chartData.map((entry) => (
// //                   <Cell
// //                     key={entry.categoryId}
// //                     fill={entry.color}
// //                     className="transition-all duration-200 hover:opacity-80"
// //                   />
// //                 ))}
// //               </Pie>
// //             </PieChart>
// //           </ResponsiveContainer>

// //           {/* Centered Label */}
// //           <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
// //             <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
// //               Items
// //             </span>
// //             <span className="text-lg font-extrabold text-foreground">
// //               {data.length}
// //             </span>
// //           </div>
// //         </div>

// //         {/* Legend List */}
// //         <div className="space-y-2.5 md:col-span-7">
// //           {chartData.map((item) => {
// //             const percentage = Math.min(Math.max(item.percentage, 0), 100);

// //             return (
// //               <div
// //                 key={item.categoryId}
// //                 className="group flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-muted/20 p-2.5 transition-colors hover:bg-muted/40"
// //               >
// //                 <div className="flex min-w-0 items-center gap-2.5">
// //                   <span
// //                     className="size-3 shrink-0 rounded-full transition-transform group-hover:scale-110"
// //                     style={{ backgroundColor: item.color }}
// //                   />
// //                   <span className="truncate text-xs font-semibold text-foreground sm:text-sm">
// //                     {item.name}
// //                   </span>
// //                 </div>

// //                 <div className="flex shrink-0 items-center gap-3">
// //                   <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
// //                     {percentage.toFixed(1)}%
// //                   </span>
// //                   <span className="text-xs font-bold text-foreground sm:text-sm">
// //                     {formatCurrency(item.amount)}
// //                   </span>
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// 'use client';

// import {
//   Cell,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   Tooltip,
// } from 'recharts';

// import type {
//   DashboardCategorySpending,
//   DashboardSubcategorySpending,
// } from '@/types/dashboard.types';

// type SpendingData =
//   | DashboardCategorySpending
//   | DashboardSubcategorySpending;

// interface SpendingDonutChartProps {
//   data: SpendingData[];
//   title?: string;
//   description?: string;
// }

// function formatCurrency(amount: number) {
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     maximumFractionDigits: 0,
//   }).format(amount);
// }

// function getItemId(item: SpendingData) {
//   if ('subcategoryId' in item) {
//     return item.subcategoryId;
//   }

//   return item.categoryId;
// }

// function getItemName(item: SpendingData) {
//   if ('subcategoryName' in item) {
//     return item.subcategoryName;
//   }

//   return item.name;
// }

// export function SpendingDonutChart({
//   data,
//   title = 'Spending Breakdown',
//   description = 'Breakdown of your expenses.',
// }: SpendingDonutChartProps) {
//   const totalExpense = data.reduce(
//     (sum, item) => sum + item.amount,
//     0,
//   );

//   if (!data.length) {
//     return (
//       <section className="rounded-2xl border border-border/60 bg-card p-5">
//         <div>
//           <h2 className="text-sm font-semibold">
//             {title}
//           </h2>

//           <p className="mt-1 text-xs text-muted-foreground">
//             {description}
//           </p>
//         </div>

//         <div className="flex min-h-64 items-center justify-center">
//           <p className="text-sm text-muted-foreground">
//             No spending data available.
//           </p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="rounded-2xl border border-border/60 bg-card p-5">
//       {/* Header */}
//       <div>
//         <h2 className="text-sm font-semibold">
//           {title}
//         </h2>

//         <p className="mt-1 text-xs text-muted-foreground">
//           {description}
//         </p>
//       </div>

//       {/* Chart */}
//       <div className="mt-4 grid items-center gap-5 md:grid-cols-[1fr_180px]">
//         <div className="relative h-64 w-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={data}
//                 dataKey="amount"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 innerRadius="62%"
//                 outerRadius="82%"
//                 paddingAngle={2}
//                 strokeWidth={0}
//               >
//                 {data.map((item) => (
//                   <Cell
//                     key={getItemId(item)}
//                     fill={item.color ?? 'hsl(var(--primary))'}
//                   />
//                 ))}
//               </Pie>

//               <Tooltip
//                 formatter={(value) =>
//                   formatCurrency(Number(value))
//                 }
//                 contentStyle={{
//                   borderRadius: '12px',
//                   border: '1px solid hsl(var(--border))',
//                   background: 'hsl(var(--card))',
//                   fontSize: '12px',
//                 }}
//               />
//             </PieChart>
//           </ResponsiveContainer>

//           {/* Center */}
//           <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
//             <span className="text-xs text-muted-foreground">
//               Total Expense
//             </span>

//             <span className="mt-1 text-lg font-bold tracking-tight">
//               {formatCurrency(totalExpense)}
//             </span>
//           </div>
//         </div>

//         {/* Legend */}
//         <div className="space-y-3">
//           {data.map((item) => (
//             <div
//               key={getItemId(item)}
//               className="flex items-center justify-between gap-3"
//             >
//               <div className="flex min-w-0 items-center gap-2">
//                 <span
//                   className="size-2.5 shrink-0 rounded-full"
//                   style={{
//                     backgroundColor:
//                       item.color ?? 'hsl(var(--primary))',
//                   }}
//                 />

//                 <span className="truncate text-xs font-medium">
//                   {getItemName(item)}
//                 </span>
//               </div>

//               <div className="shrink-0 text-right">
//                 <p className="text-xs font-semibold">
//                   {formatCurrency(item.amount)}
//                 </p>

//                 <p className="text-[10px] text-muted-foreground">
//                   {item.percentage.toFixed(1)}%
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }


// 'use client';

// import { useMemo } from 'react';
// import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
// import { FolderTree } from 'lucide-react';

// import type {
//   DashboardCategorySpending,
//   DashboardSubcategorySpending,
// } from '@/types/dashboard.types';

// type SpendingData =
//   | DashboardCategorySpending
//   | DashboardSubcategorySpending;

// interface SpendingDonutChartProps {
//   data: SpendingData[];
//   title?: string;
//   description?: string;
// }

// const DEFAULT_BASE_COLORS = [
//   '#3B82F6', // Blue
//   '#F97316', // Orange
//   '#10B981', // Emerald
//   '#EC4899', // Pink
//   '#8B5CF6', // Purple
//   '#EAB308', // Amber
//   '#64748B', // Slate
// ];

// function formatCurrency(amount: number) {
//   return new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     maximumFractionDigits: 0,
//   }).format(amount);
// }

// function getItemId(item: SpendingData) {
//   if ('subcategoryId' in item) {
//     return item.subcategoryId;
//   }
//   return item.categoryId;
// }

// function getItemName(item: SpendingData) {
//   if ('subcategoryName' in item) {
//     return item.subcategoryName;
//   }
//   return item.name;
// }

// /* Generates lighter/darker color variations for subcategories sharing a parent category */
// function adjustColorOpacity(hexColor: string, factor: number): string {
//   if (!hexColor || !hexColor.startsWith('#') || hexColor.length !== 7) {
//     return hexColor || '#3B82F6';
//   }

//   const r = parseInt(hexColor.slice(1, 3), 16);
//   const g = parseInt(hexColor.slice(3, 5), 16);
//   const b = parseInt(hexColor.slice(5, 7), 16);

//   const newR = Math.min(255, Math.max(0, Math.round(r + (255 - r) * factor)));
//   const newG = Math.min(255, Math.max(0, Math.round(g + (255 - g) * factor)));
//   const newB = Math.min(255, Math.max(0, Math.round(b + (255 - b) * factor)));

//   return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
// }

// export function SpendingDonutChart({
//   data,
//   title = 'Subcategory Breakdown',
//   description = 'Detailed breakdown of spending by subcategory',
// }: SpendingDonutChartProps) {
//   const totalExpense = useMemo(
//     () => data.reduce((sum, item) => sum + item.amount, 0),
//     [data],
//   );

//   /* Processes subcategories to derive shades matching their parent category colors */
//   const chartData = useMemo(() => {
//     const parentCategoryGroups: Record<string, number> = {};

//     return data.map((item, idx) => {
//       const parentId =
//         'parentCategoryId' in item
//           ? (item as any).parentCategoryId || 'default'
//           : 'default';

//       const parentColor =
//         item.color ||
//         DEFAULT_BASE_COLORS[idx % DEFAULT_BASE_COLORS.length];

//       const count = parentCategoryGroups[parentId] || 0;
//       parentCategoryGroups[parentId] = count + 1;

//       // Apply varying brightness shades for items under the same category group
//       const shadeFactor = count === 0 ? 0 : Math.min(count * 0.22, 0.55);
//       const computedColor =
//         count === 0 ? parentColor : adjustColorOpacity(parentColor, shadeFactor);

//       return {
//         ...item,
//         name: getItemName(item),
//         color: computedColor,
//       };
//     });
//   }, [data]);

//   if (!data.length || totalExpense === 0) {
//     return (
//       <section className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
//         <div className="flex items-center gap-3 border-b border-border/60 pb-4">
//           <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
//             <FolderTree className="size-5" />
//           </div>
//           <div>
//             <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
//               {title}
//             </h2>
//             <p className="text-xs text-muted-foreground">{description}</p>
//           </div>
//         </div>

//         <div className="flex min-h-55 flex-col items-center justify-center text-center">
//           <FolderTree className="size-8 text-muted-foreground/50" />
//           <p className="mt-2 text-sm font-semibold text-foreground">
//             No spending data
//           </p>
//           <p className="mt-0.5 text-xs text-muted-foreground">
//             Subcategory data for this period will appear here.
//           </p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
//       {/* Header aligned with Category Spending component */}
//       <div className="flex items-center justify-between border-b border-border/60 pb-4">
//         <div className="flex items-center gap-3">
//           <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
//             <FolderTree className="size-5" />
//           </div>
//           <div>
//             <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
//               {title}
//             </h2>
//             <p className="text-xs text-muted-foreground">{description}</p>
//           </div>
//         </div>

//         <div className="text-right">
//           <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
//             Total Spent
//           </span>
//           <p className="text-sm font-extrabold text-foreground sm:text-base">
//             {formatCurrency(totalExpense)}
//           </p>
//         </div>
//       </div>

//       {/* Donut Visual & Legend Layout */}
//       <div className="mt-4 grid grid-cols-1 items-center gap-6 md:grid-cols-12">
//         {/* Donut Chart */}
//         <div className="relative flex h-60 w-full items-center justify-center md:col-span-5">
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Tooltip
//                 content={({ active, payload }) => {
//                   if (active && payload && payload.length) {
//                     const item = payload[0].payload as typeof chartData[0];
//                     return (
//                       <div className="rounded-xl border border-border/60 bg-card p-3 shadow-md">
//                         <div className="flex items-center gap-2">
//                           <span
//                             className="size-2.5 rounded-full"
//                             style={{ backgroundColor: item.color }}
//                           />
//                           <p className="text-xs font-bold text-foreground">
//                             {item.name}
//                           </p>
//                         </div>
//                         <p className="mt-1 text-xs font-medium text-muted-foreground">
//                           {formatCurrency(item.amount)}{' '}
//                           <span className="text-[10px] font-normal">
//                             ({item.percentage.toFixed(1)}%)
//                           </span>
//                         </p>
//                       </div>
//                     );
//                   }
//                   return null;
//                 }}
//               />
//               <Pie
//                 data={chartData}
//                 dataKey="amount"
//                 nameKey="name"
//                 cx="50%"
//                 cy="50%"
//                 innerRadius={65}
//                 outerRadius={95}
//                 paddingAngle={3}
//                 stroke="none"
//               >
//                 {chartData.map((entry) => (
//                   <Cell
//                     key={getItemId(entry)}
//                     fill={entry.color}
//                     className="transition-all duration-200 hover:opacity-80"
//                   />
//                 ))}
//               </Pie>
//             </PieChart>
//           </ResponsiveContainer>

//           {/* Centered Ring Label */}
//           <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
//             <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
//               Subcategories
//             </span>
//             <span className="text-lg font-extrabold text-foreground">
//               {data.length}
//             </span>
//           </div>
//         </div>

//         {/* Legend List with Container Cards */}
//         <div className="space-y-2.5 md:col-span-7">
//           {chartData.map((item) => {
//             const percentage = Math.min(Math.max(item.percentage, 0), 100);

//             return (
//               <div
//                 key={getItemId(item)}
//                 className="group flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-muted/20 p-2.5 transition-colors hover:bg-muted/40"
//               >
//                 <div className="flex min-w-0 items-center gap-2.5">
//                   <span
//                     className="size-3 shrink-0 rounded-full transition-transform group-hover:scale-110"
//                     style={{ backgroundColor: item.color }}
//                   />
//                   <span className="truncate text-xs font-semibold text-foreground sm:text-sm">
//                     {item.name}
//                   </span>
//                 </div>

//                 <div className="flex shrink-0 items-center gap-3">
//                   <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
//                     {percentage.toFixed(1)}%
//                   </span>
//                   <span className="text-xs font-bold text-foreground sm:text-sm">
//                     {formatCurrency(item.amount)}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

'use client';

import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { FolderTree } from 'lucide-react';

import type {
  DashboardCategorySpending,
  DashboardSubcategorySpending,
} from '@/types/dashboard.types';

type SpendingData =
  | DashboardCategorySpending
  | DashboardSubcategorySpending;

interface SpendingDonutChartProps {
  data: SpendingData[];
  title?: string;
  description?: string;
}

const DEFAULT_BASE_COLORS = [
  '#3B82F6', // Blue
  '#F97316', // Orange
  '#10B981', // Emerald
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#EAB308', // Amber
  '#64748B', // Slate
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function getItemId(item: SpendingData) {
  if ('subcategoryId' in item) {
    return item.subcategoryId;
  }
  return item.categoryId;
}

function getItemName(item: SpendingData) {
  if ('subcategoryName' in item) {
    return item.subcategoryName;
  }
  return item.name;
}

/* Generates lighter/darker color variations for subcategories sharing a parent category */
function adjustColorOpacity(hexColor: string, factor: number): string {
  if (!hexColor || !hexColor.startsWith('#') || hexColor.length !== 7) {
    return hexColor || '#3B82F6';
  }

  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  const newR = Math.min(255, Math.max(0, Math.round(r + (255 - r) * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g + (255 - g) * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b + (255 - b) * factor)));

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

export function SpendingDonutChart({
  data,
  title = 'Subcategory Breakdown',
  description = 'Detailed breakdown of spending by subcategory',
}: SpendingDonutChartProps) {
  const totalExpense = useMemo(
    () => data.reduce((sum, item) => sum + item.amount, 0),
    [data],
  );

  /* Processes subcategories to derive shades matching their parent category colors */
  const chartData = useMemo(() => {
    const parentCategoryGroups: Record<string, number> = {};

    return data.map((item, idx) => {
      const parentId =
        'parentCategoryId' in item
          ? (item as any).parentCategoryId || 'default'
          : 'default';

      const parentColor =
        item.color ||
        DEFAULT_BASE_COLORS[idx % DEFAULT_BASE_COLORS.length];

      const count = parentCategoryGroups[parentId] || 0;
      parentCategoryGroups[parentId] = count + 1;

      // Apply varying brightness shades for items under the same category group
      const shadeFactor = count === 0 ? 0 : Math.min(count * 0.22, 0.55);
      const computedColor =
        count === 0 ? parentColor : adjustColorOpacity(parentColor, shadeFactor);

      return {
        ...item,
        name: getItemName(item),
        color: computedColor,
      };
    });
  }, [data]);

  if (!data.length || totalExpense === 0) {
    return (
      <section className="flex h-95 flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-3 border-b border-border/60 pb-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FolderTree className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              {title}
            </h2>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <FolderTree className="size-8 text-muted-foreground/50" />
          <p className="mt-2 text-sm font-semibold text-foreground">
            No spending data
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Subcategory data for this period will appear here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex h-95 flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-xs sm:p-6">
      {/* Header aligned with Category Spending component */}
      <div className="flex shrink-0 items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FolderTree className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              {title}
            </h2>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Total Spent
          </span>
          <p className="text-sm font-extrabold text-foreground sm:text-base">
            {formatCurrency(totalExpense)}
          </p>
        </div>
      </div>

      {/* Donut Visual & Legend Layout */}
      <div className="mt-4 grid grid-cols-1 items-center gap-6 md:grid-cols-12">
        {/* Donut Chart */}
        <div className="relative flex h-60 w-full items-center justify-center md:col-span-5">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as typeof chartData[0];
                    return (
                      <div className="rounded-xl border border-border/60 bg-card p-3 shadow-md">
                        <div className="flex items-center gap-2">
                          <span
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <p className="text-xs font-bold text-foreground">
                            {item.name}
                          </p>
                        </div>
                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                          {formatCurrency(item.amount)}{' '}
                          <span className="text-[10px] font-normal">
                            ({item.percentage.toFixed(1)}%)
                          </span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                stroke="none"
              >
                {chartData.map((entry) => (
                  <Cell
                    key={getItemId(entry)}
                    fill={entry.color}
                    className="transition-all duration-200 hover:opacity-80"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Ring Label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Subcategories
            </span>
            <span className="text-lg font-extrabold text-foreground">
              {data.length}
            </span>
          </div>
        </div>

        {/* Scrollable Legend List */}
        <div className="max-h-62.5 space-y-2.5 overflow-y-auto pr-1 md:col-span-7 [scrollbar-thin] [scrollbar-color:hsl(var(--border))_transparent]">
          {chartData.map((item) => {
            const percentage = Math.min(Math.max(item.percentage, 0), 100);

            return (
              <div
                key={getItemId(item)}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-muted/20 p-2.5 transition-colors hover:bg-muted/40"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="size-3 shrink-0 rounded-full transition-transform group-hover:scale-110"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate text-xs font-semibold text-foreground sm:text-sm">
                    {item.name}
                  </span>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {percentage.toFixed(1)}%
                  </span>
                  <span className="text-xs font-bold text-foreground sm:text-sm">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}