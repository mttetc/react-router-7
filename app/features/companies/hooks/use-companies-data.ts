import { useQuery } from "@tanstack/react-query";
import {
  companiesKeys,
  getCompaniesClient,
} from "@/features/companies/api/companies-client";
import type {
  Company,
  PaginatedResult,
  CompaniesQueryParams,
} from "@/features/companies/types/schemas";

/**
 * Custom hook for fetching companies data with React Query
 * Provides optimized caching, error handling, and loading states
 * @param params - Filter and pagination parameters
 * @param initialData - Server-side rendered data for initial load (SSR)
 * @returns Query result with companies data, loading states, and error handling
 * @example
 * ```typescript
 * const { data, isLoading, error } = useCompaniesData({
 *   page: 1,
 *   limit: 12,
 *   search: "tech"
 * }, initialServerData);
 * ```
 */
export function useCompaniesData(
  params: CompaniesQueryParams,
  initialData?: PaginatedResult<Company>
) {
  const queryKey = companiesKeys.list(params);

  const query = useQuery({
    queryKey,
    queryFn: () => getCompaniesClient(params),
    // Use keepPreviousData to avoid flickering during search transitions
    placeholderData: (previousData) => {
      // For initial load, use the server-side rendered data
      if (!previousData && initialData) {
        return initialData;
      }
      // For subsequent queries, keep the previous data to avoid flickering
      return previousData;
    },
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error instanceof Error && error.message.includes("4")) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Return the query directly - React Query already provides all the states we need
  return query;
}
