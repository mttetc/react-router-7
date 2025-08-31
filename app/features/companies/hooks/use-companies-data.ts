import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDebouncedValue } from "rooks";
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
  // Debounce the filters to prevent excessive API calls
  const [debouncedFilters] = useDebouncedValue(filters, 300);

  // Use original filters in query key to maintain consistency
  // But only fetch when debounced filters are ready
  const queryKey = useMemo(
    () => ["companies", "feed", filters, pagination],
    [filters, pagination]
  );

  console.log("🔑 [Client] Query key:", JSON.stringify(queryKey));

  return useQuery({
    queryKey,
    queryFn: () => {
      console.log("🔄 [Client] Fetching companies data (debounced)");
      return CompaniesService.fetchCompanies(debouncedFilters, pagination);
    },
    initialData,
    enabled: JSON.stringify(filters) === JSON.stringify(debouncedFilters), // Only fetch when debounced
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
