

"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import type { DashboardMonthlyComparison } from "@/types/dashboard.types";

interface MonthlyComparisonProps {
  data: DashboardMonthlyComparison;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function MonthlyComparison({
  data,
}: MonthlyComparisonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isIncrease = data.trend === "INCREASE";
  const isDecrease = data.trend === "DECREASE";

  const ArrowIcon = isIncrease
    ? ArrowUp
    : isDecrease
      ? ArrowDown
      : Minus;

  return (
    <div className="relative w-fit shrink-0">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          flex items-center gap-2.5
          rounded-xl
          border
          px-3 py-1.5
          text-xs
          shadow-xs
          transition-all
          whitespace-nowrap
          ${
            isIncrease
              ? "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
              : isDecrease
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                : "border-border/60 bg-card text-foreground hover:bg-muted/50"
          }
        `}
      >
        {isIncrease ? (
          <TrendingUp className="size-3.5 shrink-0" />
        ) : isDecrease ? (
          <TrendingDown className="size-3.5 shrink-0" />
        ) : (
          <Minus className="size-3.5 shrink-0" />
        )}

        <div className="flex items-center gap-1 font-bold">
          <span>
            {data.percentage >= 0 ? "+" : ""}
            {data.percentage.toFixed(1)}%
          </span>

          <span className="text-[10px] font-medium opacity-80">
            vs last month
          </span>
        </div>

        {isOpen ? (
          <ChevronUp className="size-3.5 shrink-0 opacity-70" />
        ) : (
          <ChevronDown className="size-3.5 shrink-0 opacity-70" />
        )}
      </button>

      {/* Popover */}
      {isOpen && (
        <div
          className="
            absolute
            left-0
            top-full
            z-50
            mt-2

            w-[calc(100vw-2rem)]
            max-w-72

            rounded-2xl
            border
            border-border/60
            bg-card
            p-4
            shadow-xl

            animate-in
            fade-in-0
            zoom-in-95
            duration-150

            sm:left-auto
            sm:right-0
            sm:w-72
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
            <span className="text-xs font-bold text-foreground">
              Monthly Comparison
            </span>

            <span
              className={`
                inline-flex
                items-center
                gap-1
                rounded-md
                px-1.5
                py-0.5
                text-[10px]
                font-bold
                ${
                  isIncrease
                    ? "bg-destructive/10 text-destructive"
                    : isDecrease
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                }
              `}
            >
              <ArrowIcon className="size-3" />

              <span>
                {data.percentage >= 0 ? "+" : ""}
                {data.percentage.toFixed(1)}%
              </span>
            </span>
          </div>

          {/* Current / Previous */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-border/40 bg-muted/20 p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Current
              </p>

              <p className="mt-0.5 font-bold text-foreground">
                {formatCurrency(data.currentExpense)}
              </p>
            </div>

            <div className="rounded-xl border border-border/40 bg-muted/20 p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Previous
              </p>

              <p className="mt-0.5 font-bold text-foreground">
                {formatCurrency(data.previousExpense)}
              </p>
            </div>
          </div>

          {/* Difference */}
          <div className="mt-2.5 flex items-center justify-between rounded-xl border border-border/40 bg-muted/10 px-3 py-2 text-xs">
            <span className="text-[11px] font-medium text-muted-foreground">
              Difference
            </span>

            <span
              className={`
                font-extrabold
                ${
                  isIncrease
                    ? "text-destructive"
                    : isDecrease
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-foreground"
                }
              `}
            >
              {data.difference >= 0 ? "+" : ""}
              {formatCurrency(data.difference)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}