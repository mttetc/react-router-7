import type { Company, PaginatedResult } from "@/types/companies";

// ============================================================================
// CLIENT-SIDE LOGIC - Makes HTTP calls to API endpoints
// ============================================================================

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

  // Add all non-undefined parameters to search params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const url = `/api/companies?${searchParams.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// QUERY KEY FACTORY (TkDodo Pattern)
// ============================================================================

export const companiesKeys = {
  all: ["companies"] as const,
  lists: () => [...companiesKeys.all, "list"] as const,
  list: (params: CompaniesQueryParams) => {
    // Create a unique key by serializing the params object
    // This ensures React Query detects changes even with complex objects
    const serializedParams = JSON.stringify(params);
    const key = [
      ...companiesKeys.lists(),
      serializedParams,
      Date.now(),
    ] as const;
    console.log("🏭 [Key Factory] Generated key:", key, "for params:", params);
    console.log("🔍 [Key Factory String]", JSON.stringify(key));
    return key;
  },
  details: () => [...companiesKeys.all, "detail"] as const,
  detail: (id: string) => [...companiesKeys.details(), id] as const,
} as const;

// ============================================================================
// REACT QUERY INTEGRATION
// ============================================================================

export function createCompaniesQuery(params: CompaniesQueryParams) {
  return {
    queryKey: companiesKeys.list(params),
    queryFn: () => getCompaniesClient(params),
  };
}

// ============================================================================
// QUERY CACHE UTILITIES (for future mutations)
// ============================================================================

/**
 * Utility functions for cache invalidation and updates
 * These can be used in mutations to update the cache efficiently
 */
export const companiesCacheUtils = {
  // Invalidate all companies queries
  invalidateAll: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: companiesKeys.all });
  },

  // Invalidate all list queries
  invalidateLists: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: companiesKeys.lists() });
  },

  // Invalidate specific list query
  invalidateList: (queryClient: any, params: CompaniesQueryParams) => {
    queryClient.invalidateQueries({ queryKey: companiesKeys.list(params) });
  },

  // Invalidate all detail queries
  invalidateDetails: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: companiesKeys.details() });
  },

  // Invalidate specific detail query
  invalidateDetail: (queryClient: any, id: string) => {
    queryClient.invalidateQueries({ queryKey: companiesKeys.detail(id) });
  },

  // Remove all companies from cache
  removeAll: (queryClient: any) => {
    queryClient.removeQueries({ queryKey: companiesKeys.all });
  },
};

// ============================================================================
// COMPATIBILITY TYPES (for existing components)
// ============================================================================

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
