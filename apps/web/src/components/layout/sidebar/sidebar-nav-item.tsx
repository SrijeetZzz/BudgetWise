'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { LucideIcon } from 'lucide-react';

interface SidebarNavItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

export function SidebarNavItem({
  label,
  href,
  icon: Icon,
  exact = false,
}: SidebarNavItemProps) {
  const pathname = usePathname();

  const isActive = exact
    ? pathname === href
    : pathname === href ||
      pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={[
        'flex items-center gap-3 rounded-xl px-3 py-2.5',
        'text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      ].join(' ')}
    >
      <Icon className="size-4.5 shrink-0" />

      <span>{label}</span>
    </Link>
  );
}