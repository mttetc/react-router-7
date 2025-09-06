"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, lazy, Suspense } from "react";
import { ClientOnly } from "./client-only";

// Dynamically import ReactQueryDevtools to prevent hydration issues
const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((module) => ({
    default: module.ReactQueryDevtools,
  }))
);

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
            staleTime: 1000 * 60 * 2, // 2 minutes - shorter for better responsiveness
            gcTime: 1000 * 60 * 10, // 10 minutes - keep cached data
            refetchOnWindowFocus: false, // Prevent unnecessary refetches
            refetchOnMount: false, // Don't refetch if we have fresh data
            refetchOnReconnect: true, // Refetch when reconnecting
            retry: (failureCount, error) => {
              const errorMessage = error?.message || "";
              // Don't retry on browser extension connection errors
              if (
                errorMessage.includes("Could not establish connection") ||
                errorMessage.includes("Receiving end does not exist") ||
                errorMessage.includes("Extension context invalidated") ||
                errorMessage.includes("chrome-extension://") ||
                errorMessage.includes("moz-extension://") ||
                errorMessage.includes("safari-extension://")
              ) {
                return false; // Don't log, just silently fail
              }
              // Don't retry on 4xx client errors
              if (errorMessage.includes('4')) {
                return false;
              }
              return failureCount < 2; // Only retry once
            },
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
            // Prevent multiple simultaneous requests
            networkMode: 'online',
          },
          mutations: {
            retry: 1,
            networkMode: 'online',
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show DevTools in development - use ClientOnly to prevent hydration issues */}
      {process.env.NODE_ENV === "development" && (
        <ClientOnly>
          <Suspense fallback={null}>
            <ReactQueryDevtools
              initialIsOpen={false}
              buttonPosition="bottom-right"
            />
          </Suspense>
        </ClientOnly>
      )}
    </QueryClientProvider>
  );
}
