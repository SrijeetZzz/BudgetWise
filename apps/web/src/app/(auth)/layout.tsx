import { GuestRoute } from '@/features/auth/components/guest-route';
import type { ReactNode } from 'react';



interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <GuestRoute>
      <main className="min-h-screen bg-background">
        {children}
      </main>
    </GuestRoute>
  );
}