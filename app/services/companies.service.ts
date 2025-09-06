import type { Company, PaginatedResult } from "../utils/companies.types";

// ============================================================================
// TYPES (pour compatibilité avec les hooks nuqs)
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
// URL PARSING UTILITIES (pour le loader)
// ============================================================================

const parseStringParam = (value: string | null): string => {
  if (!value || value === "undefined" || value === "null") return "";
  return value;
};

const parseNumberParam = (value: string | null): number | null => {
  if (!value || value === "undefined" || value === "null") return null;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
};

export function parseFiltersFromURL(
  searchParams: URLSearchParams
): FilterState {
  return {
    search: parseStringParam(searchParams.get("search")),
    growthStage: parseStringParam(searchParams.get("growthStage")),
    customerFocus: parseStringParam(searchParams.get("customerFocus")),
    fundingType: parseStringParam(searchParams.get("fundingType")),
    minRank: parseNumberParam(searchParams.get("minRank")),
    maxRank: parseNumberParam(searchParams.get("maxRank")),
    minFunding: parseNumberParam(searchParams.get("minFunding")),
    maxFunding: parseNumberParam(searchParams.get("maxFunding")),
    sortBy: parseStringParam(searchParams.get("sortBy")),
    sortOrder: (parseStringParam(searchParams.get("sortOrder")) as "asc" | "desc") || "asc",
  };
}

export function parsePaginationFromURL(
  searchParams: URLSearchParams
): PaginationState {
  const page = parseNumberParam(searchParams.get("page")) || 1;
  const limit = parseNumberParam(searchParams.get("limit")) || 12;
  
  return {
    page: page > 0 ? page : 1,
    limit: limit > 0 ? limit : 12,
  };
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

export async function fetchCompanies(
  filters: FilterState,
  pagination: PaginationState
): Promise<PaginatedResult<Company>> {
  console.log("🌐 [Service] fetchCompanies called with:", {
    filters,
    pagination,
  });

  // Construire les params à partir des valeurs passées
  const params = new URLSearchParams();

  // Ajouter les filtres (seulement si ils ont des valeurs)
  if (filters.search) params.set("search", filters.search);
  if (filters.growthStage) params.set("growthStage", filters.growthStage);
  if (filters.customerFocus) params.set("customerFocus", filters.customerFocus);
  if (filters.fundingType) params.set("fundingType", filters.fundingType);
  if (filters.minRank) params.set("minRank", filters.minRank.toString());
  if (filters.maxRank) params.set("maxRank", filters.maxRank.toString());
  if (filters.minFunding)
    params.set("minFunding", filters.minFunding.toString());
  if (filters.maxFunding)
    params.set("maxFunding", filters.maxFunding.toString());
  if (filters.sortBy && filters.sortBy !== "")
    params.set("sortBy", filters.sortBy);
  if (filters.sortOrder !== "asc") params.set("sortOrder", filters.sortOrder);

  // Ajouter la pagination (seulement si pas par défaut)
  if (pagination.page !== 1) params.set("page", pagination.page.toString());
  if (pagination.limit !== 12) params.set("limit", pagination.limit.toString());

  const url = `/api/companies?${params}`;
  console.log("🌐 [Service] Fetching URL:", url);

  const response = await fetch(url);

  if (!response.ok) {
    console.error(
      "❌ [Service] Fetch failed:",
      response.status,
      response.statusText
    );
    throw new Error("Failed to fetch companies");
  }

  const companiesData = await response.json();
  console.log("✅ [Service] Clean JSON response:", companiesData);

  return companiesData;
}
