import { useQuery } from "@tanstack/react-query";
import { companiesKeys, getCompaniesClient } from "@/lib/companies-client";
import type { Company, PaginatedResult } from "@/types/schemas";
import type { CompaniesQueryParams } from "@/lib/companies-client";

/**
 * Hook for fetching companies data with React Query
 * @param params - Filter and pagination parameters
 * @param initialData - Server-side rendered data for initial load
 */
export function useCompaniesData(
  params: CompaniesQueryParams,
  initialData?: PaginatedResult<Company>
) {
  const queryKey = companiesKeys.list(params);

  const query = useQuery({
    queryKey,
    queryFn: () => getCompaniesClient(params),
    // Use placeholderData only for initial load, not for subsequent refetches
    placeholderData: initialData,
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

  // Return isFetching instead of isLoading for instant loading states
  return {
    ...query,
    isLoading: query.isFetching,
  };
}
