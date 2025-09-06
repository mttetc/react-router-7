import { useQuery } from "@tanstack/react-query";
import { companiesKeys, getCompaniesClient } from "@/lib/companies-client";
import type { Company, PaginatedResult } from "@/types/companies";
import type { CompaniesQueryParams } from "@/lib/companies-client";

export function useCompaniesData(
  params: CompaniesQueryParams,
  initialData?: PaginatedResult<Company>
) {
  const queryKey = companiesKeys.list(params);

  console.log("🔑 [Query Key]", queryKey, "for params:", params);
  console.log("🔍 [Query Key String]", JSON.stringify(queryKey));

  const query = useQuery({
    queryKey,
    queryFn: () => {
      console.log("🚀 [QueryFn] Fetching with params:", params);
      return getCompaniesClient(params);
    },
    // Use initialData for the first load, React Query will handle the rest
    ...(initialData ? { initialData } : {}),
    placeholderData: (previousData) => previousData,
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes("4")) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  console.log("📊 [Query Result]", {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    status: query.status,
  });

  return query;
}
