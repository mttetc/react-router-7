import { useQuery } from "@tanstack/react-query";
import {
  CompaniesService,
  type FilterState,
  type PaginationState,
} from "../../../services/companies.service";

export const useCompaniesData = (
  filters: FilterState,
  pagination: PaginationState
) => {
  return useQuery({
    queryKey: ["companies", "feed", filters, pagination],
    queryFn: () => {
      console.log("🔄 [Client] Fetching companies data (cache miss or stale)");
      return CompaniesService.fetchCompanies(filters, pagination);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
