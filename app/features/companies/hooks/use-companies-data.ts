import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  CompaniesService,
  type FilterState,
  type PaginationState,
} from "../../../services/companies.service";
import type { Company, PaginatedResult } from "../../../utils/companies.types";

export const useCompaniesData = (
  filters: FilterState,
  pagination: PaginationState,
  initialData?: PaginatedResult<Company>
) => {
  // Create a stable query key that only changes when meaningful values change
  const queryKey = useMemo(() => {
    // Only include non-empty/non-default values to reduce key variations
    const stableFilters = {
      ...(filters.search && { search: filters.search }),
      ...(filters.growthStage && { growthStage: filters.growthStage }),
      ...(filters.customerFocus && { customerFocus: filters.customerFocus }),
      ...(filters.fundingType && { fundingType: filters.fundingType }),
      ...(filters.minRank && { minRank: filters.minRank }),
      ...(filters.maxRank && { maxRank: filters.maxRank }),
      ...(filters.minFunding && { minFunding: filters.minFunding }),
      ...(filters.maxFunding && { maxFunding: filters.maxFunding }),
      ...(filters.sortBy && { sortBy: filters.sortBy }),
      ...(filters.sortOrder !== "asc" && { sortOrder: filters.sortOrder }),
    };
    
    const stablePagination = {
      ...(pagination.page !== 1 && { page: pagination.page }),
      ...(pagination.limit !== 12 && { limit: pagination.limit }),
    };

    return ["companies", "feed", stableFilters, stablePagination];
  }, [filters, pagination]);

  console.log("🔑 [Client] Query key:", JSON.stringify(queryKey));

  return useQuery({
    queryKey,
    queryFn: async () => {
      console.log("🔄 [Client] Fetching companies data with:", {
        filters,
        pagination,
      });
      return CompaniesService.fetchCompanies(filters, pagination);
    },
    initialData,
    staleTime: 1000 * 60 * 2, // 2 minutes - shorter stale time for more responsive updates
    gcTime: 1000 * 60 * 10, // 10 minutes - keep cached data longer
    refetchOnMount: false, // Don't refetch on mount if we have fresh data
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: true, // Refetch when reconnecting to internet
    // Prevent race conditions with better retry configuration
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      return failureCount < 2; // Only retry once
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    // Enable background refetching for better UX
    refetchInterval: false, // Don't poll automatically
    // Prevent multiple simultaneous requests
    networkMode: 'online',
  });
};
