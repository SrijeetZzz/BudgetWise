// "use client";

// import Link from "next/link";
// import { Bell, Wallet, Menu } from "lucide-react";

// import { ProfileDropdown } from "./profile-dropdown";
// import { useHasUnreadNotifications } from "@/features/notifications/hooks/use-has-unread-notifications";

// export interface DashboardHeaderUser {
//   name?: string | null;
//   email?: string | null;
//   avatar?: string | null;
//   profileImage?: string | null;
// }

// interface DashboardHeaderProps {
//   user?: DashboardHeaderUser | null;
//   onMobileMenuOpen?: () => void;
// }

// export function DashboardHeader({
//   user,
//   onMobileMenuOpen,
// }: DashboardHeaderProps) {
//   // Extract first name for a personalized greeting
//   const firstName = user?.name ? user.name.split(" ")[0] : null;

//   const { data: hasUnread } = useHasUnreadNotifications();

//   return (
//     <header className="sticky top-0 z-30 border-b border-border/60 bg-card/80 backdrop-blur-md">
//       <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
//         {/* Left Section: Mobile Brand / Desktop Greeting */}
//         <div className="flex items-center gap-3">
//           {/* Mobile Sidebar Toggle Button */}
//           {onMobileMenuOpen && (
//             <button
//               type="button"
//               onClick={onMobileMenuOpen}
//               className="flex size-9 items-center justify-center rounded-xl border border-border/60 bg-muted/20 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
//               aria-label="Open sidebar"
//             >
//               <Menu className="size-5" />
//             </button>
//           )}

//           {/* Mobile Logo Branding */}
//           <Link
//             href="/dashboard"
//             className="flex items-center gap-2.5 lg:hidden"
//           >
//             <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
//               <Wallet className="size-4" />
//             </div>
//             <span className="text-sm font-bold tracking-tight text-foreground">
//               BudgetWise
//             </span>
//           </Link>

//           {/* Desktop Personal Welcome */}
//           <div className="hidden lg:flex lg:flex-col">
//             <h2 className="text-sm font-bold tracking-tight text-foreground">
//               {firstName ? `Welcome back, ${firstName}!` : "Welcome back!"}
//             </h2>
//             <p className="text-[11px] font-medium text-muted-foreground">
//               Here is what is happening with your finance today.
//             </p>
//           </div>
//         </div>

//         {/* Right Section: Actions & Profile */}
//         <div className="flex items-center gap-2">
//           {/* Notifications Button with Unread Badge */}
//           <Link
//             href="/notifications"
//             aria-label="Notifications"
//             className="relative flex size-9 items-center justify-center rounded-xl border border-border/40 bg-muted/20 text-muted-foreground transition-colors hover:border-border/80 hover:bg-muted/50 hover:text-foreground"
//           >
//             <Bell className="size-4" />
//             {/* Dynamic Active Unread Dot */}
//             {hasUnread && (
//               <span className="absolute right-2 top-2 size-2 animate-pulse rounded-full bg-primary ring-2 ring-card" />
//             )}
//           </Link>

//           {/* Profile Dropdown */}
//           <div className="pl-1 border-l border-border/40">
//             <ProfileDropdown user={user} />
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }
// "use client";

// import Link from "next/link";
// import { Bell, Wallet, Menu } from "lucide-react";

// import { ProfileDropdown } from "./profile-dropdown";

// import { useHasUnreadNotifications } from "@/features/notifications/hooks/use-has-unread-notifications";
// import { ThemeToggle } from "@/features/settings/theme-toggle";

// export interface DashboardHeaderUser {
//   name?: string | null;
//   email?: string | null;
//   avatar?: string | null;
//   profileImage?: string | null;
// }

// interface DashboardHeaderProps {
//   user?: DashboardHeaderUser | null;
//   onMobileMenuOpen?: () => void;
// }

// export function DashboardHeader({
//   user,
//   onMobileMenuOpen,
// }: DashboardHeaderProps) {
//   const firstName = user?.name
//     ? user.name.split(" ")[0]
//     : null;

//   const { data: hasUnread } =
//     useHasUnreadNotifications();

//   return (
//     <header className="sticky top-0 z-30 border-b border-border/60 bg-card/80 backdrop-blur-md">
//       <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

//         {/* Left Section */}
//         <div className="flex items-center gap-3">

//           {/* Mobile Sidebar Toggle */}
//           {onMobileMenuOpen && (
//             <button
//               type="button"
//               onClick={onMobileMenuOpen}
//               className="flex size-9 items-center justify-center rounded-xl border border-border/60 bg-muted/20 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
//               aria-label="Open sidebar"
//             >
//               <Menu className="size-5" />
//             </button>
//           )}

//           {/* Mobile Logo */}
//           <Link
//             href="/dashboard"
//             className="flex items-center gap-2.5 lg:hidden"
//           >
//             <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
//               <Wallet className="size-4" />
//             </div>

//             <span className="text-sm font-bold tracking-tight text-foreground">
//               BudgetWise
//             </span>
//           </Link>

//           {/* Desktop Welcome */}
//           <div className="hidden lg:flex lg:flex-col">
//             <h2 className="text-sm font-bold tracking-tight text-foreground">
//               {firstName
//                 ? `Welcome back, ${firstName}!`
//                 : "Welcome back!"}
//             </h2>

//             <p className="text-[11px] font-medium text-muted-foreground">
//               Here is what is happening with your finance today.
//             </p>
//           </div>
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center gap-2">

//           {/* Theme Toggle */}
//           <ThemeToggle />

//           {/* Notifications */}
//           <Link
//             href="/notifications"
//             aria-label="Notifications"
//             className="relative flex size-9 items-center justify-center rounded-xl border border-border/40 bg-muted/20 text-muted-foreground transition-colors hover:border-border/80 hover:bg-muted/50 hover:text-foreground"
//           >
//             <Bell className="size-4" />

//             {hasUnread && (
//               <span className="absolute right-2 top-2 size-2 animate-pulse rounded-full bg-primary ring-2 ring-card" />
//             )}
//           </Link>

//           {/* Profile */}
//           <div className="border-l border-border/40 pl-1">
//             <ProfileDropdown user={user} />
//           </div>

//         </div>
//       </div>
//     </header>
//   );
// }


"use client";

import Link from "next/link";
import { Bell, Wallet, Menu } from "lucide-react";

import { ProfileDropdown } from "./profile-dropdown";
import { useHasUnreadNotifications } from "@/features/notifications/hooks/use-has-unread-notifications";
import { ThemeToggle } from "@/features/settings/theme-toggle";

export interface DashboardHeaderUser {
  name?: string | null;
  email?: string | null;
  avatar?: string | null;
  profileImage?: string | null;
}

interface DashboardHeaderProps {
  user?: DashboardHeaderUser | null;
  onMobileMenuOpen?: () => void;
}

export function DashboardHeader({
  user,
  onMobileMenuOpen,
}: DashboardHeaderProps) {
  const firstName = user?.name ? user.name.split(" ")[0] : null;
  const { data: hasUnread } = useHasUnreadNotifications();

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-card/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle */}
          {onMobileMenuOpen && (
            <button
              type="button"
              onClick={onMobileMenuOpen}
              className="flex size-9 items-center justify-center rounded-xl border border-border/60 bg-muted/20 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="size-5" />
            </button>
          )}

          {/* Mobile Logo */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 lg:hidden"
          >
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <Wallet className="size-4" />
            </div>
            <span className="text-sm font-bold tracking-tight text-foreground">
              BudgetWise
            </span>
          </Link>

          {/* Desktop Welcome */}
          <div className="hidden lg:flex lg:flex-col">
            <h2 className="text-sm font-bold tracking-tight text-foreground">
              {firstName ? `Welcome back, ${firstName}!` : "Welcome back!"}
            </h2>
            <p className="text-[11px] font-medium text-muted-foreground">
              Here is what is happening with your finance today.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Compact Theme Toggle Button */}
          <ThemeToggle />

          {/* Notifications Link */}
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="relative flex size-9 items-center justify-center rounded-xl border border-border/40 bg-muted/20 text-muted-foreground transition-colors hover:border-border/80 hover:bg-muted/50 hover:text-foreground"
          >
            <Bell className="size-4" />
            {hasUnread && (
              <span className="absolute right-2 top-2 size-2 animate-pulse rounded-full bg-primary ring-2 ring-card" />
            )}
          </Link>

          {/* Profile Dropdown */}
          <div className="border-l border-border/40 pl-1">
            <ProfileDropdown user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}