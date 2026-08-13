'use client';

import { PropsWithChildren } from 'react';

import { useRestoreSession } from '@/features/auth/hooks/use-restore-session';

export function AuthProvider({
  children,
}: PropsWithChildren) {
  useRestoreSession();

  return <>{children}</>;
}