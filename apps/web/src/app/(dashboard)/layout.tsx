
// "use client";

// import { DesktopSidebar } from "@/components/layout/sidebar/desktop-sidebar";
// import { DashboardHeader } from "@/components/layout/topbar/dashboard-header";
// import { ProtectedRoute } from "@/features/auth/components/protected-route";
// import { useAuthStore } from "@/store/auth.store";

// import type { ReactNode } from "react";

// interface DashboardLayoutProps {
//   children: ReactNode;
// }

// export default function DashboardLayout({ children }: DashboardLayoutProps) {
//   const user = useAuthStore((state) => state.user);

//   console.log("AUTH USER:", user);

//   return (
//     <ProtectedRoute>
//       <div className="min-h-screen bg-background">
//         <DesktopSidebar />

//         <div className="lg:pl-64">
//           <DashboardHeader user={user} />

//           <main className="mx-auto w-full max-w-7xl p-6">{children}</main>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }


"use client";

import { MobileBottomNavigation } from "@/components/layout/mobile-nav/mobile-bottom-navigation";
import { DesktopSidebar } from "@/components/layout/sidebar/desktop-sidebar";

import { DashboardHeader } from "@/components/layout/topbar/dashboard-header";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { useAuthStore } from "@/store/auth.store";

import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <DesktopSidebar />

        {/* Main Content */}
        <div className="lg:pl-64">
          <DashboardHeader user={user} />

          <main
            className="
              mx-auto
              w-full
              max-w-7xl
              px-0
              py-4
              pb-28
              sm:px-6
              lg:p-6
            "
          >
            {children}
          </main>
        </div>

        {/* Mobile Navigation */}
        <MobileBottomNavigation />
      </div>
    </ProtectedRoute>
  );
}