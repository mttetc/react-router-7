import type { Company, PaginatedResult } from "../utils/companies.types";

// ============================================================================
// TYPES
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

// ============================================================================
// API SERVICE
// ============================================================================

export class CompaniesService {
  private static buildParams(
    filters: FilterState,
    pagination: PaginationState
  ): URLSearchParams {
    const params = new URLSearchParams();

    if (filters.search) params.set("q", filters.search);
    if (filters.growthStage) params.set("growth_stage", filters.growthStage);
    if (filters.customerFocus) params.set("customer_focus", filters.customerFocus);
    if (filters.fundingType) params.set("last_funding_type", filters.fundingType);
    if (filters.minRank) params.set("min_rank", filters.minRank.toString());
    if (filters.maxRank) params.set("max_rank", filters.maxRank.toString());
    if (filters.minFunding) params.set("min_funding", filters.minFunding.toString());
    if (filters.maxFunding) params.set("max_funding", filters.maxFunding.toString());

    params.set("page", pagination.page.toString());
    params.set("limit", pagination.limit.toString());

    return params;
  }

  static async fetchCompanies(
    filters: FilterState,
    pagination: PaginationState
  ): Promise<PaginatedResult<Company>> {
    const params = this.buildParams(filters, pagination);
    const response = await fetch(`/api/companies?${params}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch companies");
    }
    
    return response.json();
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const parseFiltersFromURL = (searchParams: URLSearchParams): FilterState => {
  return {
    search: searchParams.get("search") || "",
    growthStage: searchParams.get("growthStage") || "",
    customerFocus: searchParams.get("customerFocus") || "",
    fundingType: searchParams.get("fundingType") || "",
    minRank: searchParams.get("minRank") ? parseInt(searchParams.get("minRank")!) : null,
    maxRank: searchParams.get("maxRank") ? parseInt(searchParams.get("maxRank")!) : null,
    minFunding: searchParams.get("minFunding") ? parseInt(searchParams.get("minFunding")!) : null,
    maxFunding: searchParams.get("maxFunding") ? parseInt(searchParams.get("maxFunding")!) : null,
    sortBy: (searchParams.get("sortBy") as "name" | "rank" | "funding") || "",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
  };
};

export const parsePaginationFromURL = (searchParams: URLSearchParams): PaginationState => {
  return {
    page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
    limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 12,
  };
};

export const buildURLParams = (filters: FilterState, pagination: PaginationState): URLSearchParams => {
  const params = new URLSearchParams();
  
  if (filters.search) params.set("search", filters.search);
  if (filters.growthStage) params.set("growthStage", filters.growthStage);
  if (filters.customerFocus) params.set("customerFocus", filters.customerFocus);
  if (filters.fundingType) params.set("fundingType", filters.fundingType);
  if (filters.minRank) params.set("minRank", filters.minRank.toString());
  if (filters.maxRank) params.set("maxRank", filters.maxRank.toString());
  if (filters.minFunding) params.set("minFunding", filters.minFunding.toString());
  if (filters.maxFunding) params.set("maxFunding", filters.maxFunding.toString());
  if (filters.sortBy && filters.sortBy !== "") params.set("sortBy", filters.sortBy);
  if (filters.sortOrder !== "asc") params.set("sortOrder", filters.sortOrder);
  if (pagination.page !== 1) params.set("page", pagination.page.toString());
  if (pagination.limit !== 12) params.set("limit", pagination.limit.toString());
  
  return params;
};
