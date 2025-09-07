import type { Company, PaginatedResult } from "@/types/companies";

// Client-side API functions for companies data

export interface CompaniesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  growth_stage?: string;
  customer_focus?: string;
  last_funding_type?: string;
  min_rank?: number;
  max_rank?: number;
  min_funding?: number;
  max_funding?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getCompaniesClient(
  params: CompaniesQueryParams = {}
): Promise<PaginatedResult<Company>> {
  const searchParams = new URLSearchParams();

  // Map server field names to URL parameter names (camelCase)
  const paramMapping: Record<string, string> = {
    growth_stage: "growthStage",
    customer_focus: "customerFocus",
    last_funding_type: "fundingType",
    min_rank: "minRank",
    max_rank: "maxRank",
    min_funding: "minFunding",
    max_funding: "maxFunding",
  };

  // Build URL search parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      const urlParamName = paramMapping[key] || key;
      searchParams.set(urlParamName, String(value));
    }
  });

  const url = `/api/companies?${searchParams.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// React Query key factory for companies

export const companiesKeys = {
  all: ["companies"] as const,
  lists: () => [...companiesKeys.all, "list"] as const,
  list: (params: CompaniesQueryParams) => {
    // Serialize params to create unique keys for different filter combinations
    const serializedParams = JSON.stringify(params);
    return [...companiesKeys.lists(), serializedParams] as const;
  },
  details: () => [...companiesKeys.all, "detail"] as const,
  detail: (id: string) => [...companiesKeys.details(), id] as const,
} as const;

// React Query integration helper
export function createCompaniesQuery(params: CompaniesQueryParams) {
  return {
    queryKey: companiesKeys.list(params),
    queryFn: () => getCompaniesClient(params),
  };
}

// Cache utilities for mutations
export const companiesCacheUtils = {
  invalidateAll: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: companiesKeys.all });
  },
  invalidateLists: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: companiesKeys.lists() });
  },
  invalidateList: (queryClient: any, params: CompaniesQueryParams) => {
    queryClient.invalidateQueries({ queryKey: companiesKeys.list(params) });
  },
  invalidateDetails: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: companiesKeys.details() });
  },
  invalidateDetail: (queryClient: any, id: string) => {
    queryClient.invalidateQueries({ queryKey: companiesKeys.detail(id) });
  },
  removeAll: (queryClient: any) => {
    queryClient.removeQueries({ queryKey: companiesKeys.all });
  },
};

// Legacy types for backward compatibility

export interface FilterState {
  search: string;
  growthStage: string;
  customerFocus: string;
  fundingType: string;
  minRank: number | null;
  maxRank: number | null;
  minFunding: number | null;
  maxFunding: number | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface PaginationState {
  page: number;
  limit: number;
}
