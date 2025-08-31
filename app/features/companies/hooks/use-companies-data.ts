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

  return useQuery({
    queryKey,
    queryFn: () => {
      console.log("🔄 [Client] Fetching companies data");
      return CompaniesService.fetchCompanies(filters, pagination);
    },
    initialData,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
