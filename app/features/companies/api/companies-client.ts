import type {
  Company,
  PaginatedResult,
  CompaniesQueryParams,
} from "@/features/companies/types/schemas";

// Client-side API functions for companies data
// Makes HTTP requests to the API route for dynamic filtering

export async function getCompaniesClient(
  params: Partial<CompaniesQueryParams> = {}
): Promise<PaginatedResult<Company>> {
  const searchParams = new URLSearchParams();

  // Build URL search parameters (camelCase format)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const url = `/api/companies?${searchParams.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `HTTP error! status: ${response.status}, details: ${JSON.stringify(
        errorData
      )}`
    );
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
