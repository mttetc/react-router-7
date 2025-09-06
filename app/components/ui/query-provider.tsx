"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 30, // 30 minutes
            retry: (failureCount, error) => {
              const errorMessage = error?.message || '';
              // Don't retry on browser extension connection errors
              if (
                errorMessage.includes('Could not establish connection') ||
                errorMessage.includes('Receiving end does not exist') ||
                errorMessage.includes('Extension context invalidated') ||
                errorMessage.includes('chrome-extension://')
              ) {
                console.warn('🔌 Browser extension error detected, not retrying:', errorMessage);
                return false;
              }
              return failureCount < 3;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show DevTools in development and when window is available (client-side) */}
      {process.env.NODE_ENV === "development" && typeof window !== "undefined" && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      )}
    </QueryClientProvider>
  );
}
