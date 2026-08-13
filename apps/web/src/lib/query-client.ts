// src/lib/query-client.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        const status = (error as { response?: { status?: number } })?.response?.status;

        // Don't retry unauthorized or forbidden requests
        if (status === 401 || status === 403) {
          return false;
        }

        return failureCount < 2;
      },

      staleTime: 1000 * 60 * 5, // 5 minutes

      gcTime: 1000 * 60 * 30, // 30 minutes

      refetchOnWindowFocus: false,

      refetchOnReconnect: true,

      refetchOnMount: false,
    },

    mutations: {
      retry: false,
    },
  },
});