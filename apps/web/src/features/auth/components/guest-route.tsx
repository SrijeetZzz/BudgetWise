// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// import { useAuthStore } from '@/store/auth.store';

// interface GuestRouteProps {
//   children: React.ReactNode;
// }

// export function GuestRoute({
//   children,
// }: GuestRouteProps) {
//   const router = useRouter();

//   const isAuthenticated = useAuthStore(
//     (state) => state.isAuthenticated,
//   );

//   useEffect(() => {
//     if (isAuthenticated) {
//       router.replace('/dashboard');
//     }
//   }, [isAuthenticated, router]);

//   return <>{children}</>;
// }
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";

interface GuestRouteProps {
  children: React.ReactNode;
}

export function GuestRoute({ children }: GuestRouteProps) {
  const router = useRouter();

  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
