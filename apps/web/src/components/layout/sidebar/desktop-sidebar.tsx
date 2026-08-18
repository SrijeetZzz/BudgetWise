
'use client';

import Link from 'next/link';

import {
  BarChart3,
  CreditCard,
  Folder,
  LayoutDashboard,
  PiggyBank,
  Settings,
  Sparkles,
  Wallet,
} from 'lucide-react';

import { SidebarNavItem } from './sidebar-nav-item';

const mainNavigation = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'Transactions',
    href: '/transactions',
    icon: CreditCard,
  },
  {
    label: 'Categories',
    href: '/categories',
    icon: Folder,
  },
  {
    label: 'Budgets',
    href: '/budgets',
    icon: PiggyBank,
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: BarChart3,
  },
];

const secondaryNavigation = [
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function DesktopSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border/60 bg-card/80 backdrop-blur-md lg:flex">
      <div className="flex h-full w-full flex-col justify-between">
        {/* Top Header & Brand */}
        <div>
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 px-5">
            <Link
              href="/dashboard"
              className="group flex items-center gap-3 transition-opacity hover:opacity-90"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-transform duration-200 group-hover:scale-105">
                <Wallet className="size-5" />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-foreground">
                  BudgetWise
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">
                  Personal Finance
                </span>
              </div>
            </Link>

            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              <Sparkles className="size-2.5" />
              <span>Pro</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-6 p-4">
            <div className="space-y-1">
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                Menu
              </p>
              {mainNavigation.map((item) => (
                <SidebarNavItem key={item.href} {...item} />
              ))}
            </div>

            <div className="space-y-1">
              <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                Preferences
              </p>
              {secondaryNavigation.map((item) => (
                <SidebarNavItem key={item.href} {...item} />
              ))}
            </div>
          </nav>
        </div>

        {/* Footer Profile & App Info */}
        <div className="shrink-0 border-t border-border/60 p-4">
          <div className="flex items-center justify-between rounded-xl bg-muted/30 p-2.5 transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                BW
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">
                  Workspace
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  v1.0.0 • Free Tier
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}