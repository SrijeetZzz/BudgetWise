'use client';

import { PropsWithChildren } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';

import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
import { AuthProvider } from './auth-provider';

export function AppProvider({
  children,
}: PropsWithChildren) {
  return (
    <GoogleOAuthProvider
      clientId={
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!
      }
    >
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            {children}

            <Toaster
              richColors
              closeButton
              position="top-center"
            />
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}