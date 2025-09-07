/**
 * Utility functions for filter form operations
 */

import type {
  FilterState,
  PaginationState,
} from "@/features/companies/api/companies-client";

/**
 * Create filter removal handler
 */
export function createFilterRemovalHandler(
  setters: Record<string, (value: any) => void>
) {
  return (key: keyof FilterState) => {
    const setter = setters[key];
    if (setter) {
      setter(null);
    }
  };
}

/**
 * Create filter setter that resets page to 1 when filter changes
 */
export function createFilterSetterWithPageReset(
  setFilter: (value: any) => void,
  setPage: (value: number) => void
) {
  return (value: any) => {
    setFilter(value);
    setPage(1);
  };
}

/**
 * Create filter reset handler
 */
export function createFilterResetHandler(
  setters: Record<string, (value: any) => void>
) {
  return () => {
    // Reset all filters except search
    const resetKeys = [
      "growthStage",
      "customerFocus",
      "fundingType",
      "minRank",
      "maxRank",
      "minFunding",
      "maxFunding",
      "sortBy",
      "sortOrder",
      "page",
      "limit",
    ];

    resetKeys.forEach((key) => {
      const setter = setters[key];
      if (setter) {
        if (key === "sortOrder") {
          setter("asc");
        } else if (key === "page" || key === "limit") {
          setter(key === "page" ? 1 : 12);
        } else {
          setter(null);
        }
      }
    });
  };
}

/**
 * Create filters object from individual filter values
 */
export function createFiltersObject(
  search: string,
  growthStage: string | null,
  customerFocus: string | null,
  fundingType: string | null,
  minRank: number | null,
  maxRank: number | null,
  minFunding: number | null,
  maxFunding: number | null,
  sortBy: string | null,
  sortOrder: string | null,
  page: number | null,
  limit: number | null
): FilterState & PaginationState {
  return {
    search,
    growthStage: growthStage || "",
    customerFocus: customerFocus || "",
    fundingType: fundingType || "",
    minRank,
    maxRank,
    minFunding,
    maxFunding,
    sortBy: sortBy || "",
    sortOrder: (sortOrder || "asc") as "asc" | "desc",
    page: page || 1,
    limit: limit || 12,
  };
}
