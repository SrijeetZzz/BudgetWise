
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, Receipt, WalletCards, Tags } from "lucide-react";

interface MobileNavItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  pathname: string;
}

function MobileNavItem({
  href,
  label,
  icon: Icon,
  pathname,
}: MobileNavItemProps) {
  const isActive =
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`
        relative flex flex-1 flex-col items-center justify-center gap-1 py-1.5
        text-[10px] font-bold transition-all duration-200 active:scale-95
        ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}
      `}
    >
      {/* Active Indicator Bar */}
      {isActive && (
        <span className="absolute -top-2 h-1 w-8 rounded-full bg-primary shadow-xs transition-all duration-300" />
      )}

      {/* Icon Wrapper */}
      <div
        className={`flex size-8 items-center justify-center rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-primary/15 text-primary"
            : "bg-transparent text-muted-foreground"
        }`}
      >
        <Icon
          className={`size-4.5 transition-transform duration-200 ${
            isActive ? "scale-110 stroke-[2.2]" : "stroke-[1.8]"
          }`}
        />
      </div>

      <span className="truncate tracking-tight">{label}</span>
    </Link>
  );
}

export function MobileBottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 pointer-events-none lg:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))] px-4">
      {/* Transparent Dock Container */}
      <div className="pointer-events-auto mx-auto max-w-md rounded-2xl border border-white/10 dark:border-white/5 bg-background/30 px-2 py-1 shadow-xl backdrop-blur-md backdrop-saturate-150">
        <div className="flex items-center justify-between gap-1">
          <MobileNavItem
            href="/dashboard"
            label="Home"
            icon={Home}
            pathname={pathname}
          />

          <MobileNavItem
            href="/transactions"
            label="Transactions"
            icon={Receipt}
            pathname={pathname}
          />

          <MobileNavItem
            href="/categories"
            label="Categories"
            icon={Tags}
            pathname={pathname}
          />

          <MobileNavItem
            href="/budgets"
            label="Budgets"
            icon={WalletCards}
            pathname={pathname}
          />

          <MobileNavItem
            href="/reports"
            label="Reports"
            icon={BarChart3}
            pathname={pathname}
          />
        </div>
      </div>
    </nav>
  );
}