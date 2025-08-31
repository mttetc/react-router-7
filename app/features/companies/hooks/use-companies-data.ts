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
  // Use filters directly - debouncing happens at the form input level
  const queryKey = useMemo(
    () => ["companies", "feed", filters, pagination],
    [filters, pagination]
  );

  console.log("🔑 [Client] Query key:", JSON.stringify(queryKey));
  console.log("🔍 [Client] Current filters:", JSON.stringify(filters));
  console.log("📄 [Client] Current pagination:", JSON.stringify(pagination));

  return useQuery({
    queryKey,
    queryFn: () => {
      console.log("🔄 [Client] Fetching companies data with:", {
        filters,
        pagination,
      });
      return CompaniesService.fetchCompanies(filters, pagination);
    },
    initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes - prevent unnecessary refetches
    refetchOnMount: false, // Don't refetch on mount if we have data
    refetchOnWindowFocus: false,
    // Add retry configuration to prevent multiple calls on failure
    retry: 1,
    retryDelay: 1000,
  });
};
