import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  fetchCompanies,
  type FilterState,
  type PaginationState,
} from "../../../services/companies.service";
import type { Company, PaginatedResult } from "../../../utils/companies.types";

const companiesKeys = {
  all: ["companies"] as const,
  lists: () => [...companiesKeys.all, "list"] as const,
  list: (filters: FilterState, pagination: PaginationState) =>
    [...companiesKeys.lists(), { filters, pagination }] as const,
} as const;

export const useCompaniesData = (
  filters: FilterState,
  pagination: PaginationState,
  initialData?: PaginatedResult<Company>,
  initialFilters?: FilterState,
  initialPagination?: PaginationState
) => {
  // Utiliser la query key factory (pattern TkDodo)
  // Stabilize query key by using individual values instead of objects
  const queryKey = useMemo(() => {
    return companiesKeys.list(filters, pagination);
  }, [
    // Filters dependencies
    filters.search,
    filters.growthStage,
    filters.customerFocus,
    filters.fundingType,
    filters.minRank,
    filters.maxRank,
    filters.minFunding,
    filters.maxFunding,
    filters.sortBy,
    filters.sortOrder,
    // Pagination dependencies
    pagination.page,
    pagination.limit,
  ]);

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const result = await fetchCompanies(filters, pagination);
        return result;
      } catch (error) {
        console.error("❌ [Client] Fetch failed:", error);
        throw error;
      }
    },
    // Utilise initialData seulement si les filtres/pagination correspondent exactement
    ...(initialData &&
    initialFilters &&
    initialPagination &&
    JSON.stringify(filters) === JSON.stringify(initialFilters) &&
    JSON.stringify(pagination) === JSON.stringify(initialPagination)
      ? { initialData }
      : {}),
    placeholderData: (previousData) => previousData, // Keep previous data during loading
    gcTime: 1000 * 60 * 10, // 10 minutes - keep cached data longer
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: true, // Refetch when reconnecting to internet
    // Prevent race conditions with better retry configuration
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error instanceof Error && error.message.includes("4")) {
        return false;
      }
      return failureCount < 2; // Only retry once
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    // Enable background refetching for better UX
    refetchInterval: false, // Don't poll automatically
    // Prevent multiple simultaneous requests
    networkMode: "online",
  });
};
