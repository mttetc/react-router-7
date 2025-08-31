import { i, is, parseAsInteger, parseAsString } from "nuqs";
import type { FilterState } from "~/services/companies.service";

/**
 * Custom parser for sort order that ensures only 'asc' or 'desc' values
 */
const parseAsSortOrder = {
  parse: (value: string): "asc" | "desc" => {
    return value === "desc" ? "desc" : "asc";
  },
  serialize: (value: "asc" | "desc"): string => value,
  withDefault: (defaultValue: "asc" | "desc") => ({
    parse: (value: string): "asc" | "desc" => {
      return value === "desc" ? "desc" : "asc";
    },
    serialize: (value: "asc" | "desc"): string => value,
    defaultValue,
  }),
};

/**
 * Custom hook that provides all filter-related query state hooks
 * This centralizes all filter state management with type safety
 */
export function useFilterState() {
  // Use is for better batching of updates
  const [filters, setFilters] = is({
    search: parseAsString.withDefault(""),
    growthStage: parseAsString.withDefault(""),
    customerFocus: parseAsString.withDefault(""),
    fundingType: parseAsString.withDefault(""),
    minRank: parseAsInteger,
    maxRank: parseAsInteger,
    minFunding: parseAsInteger,
    maxFunding: parseAsInteger,
    sortBy: parseAsString.withDefault(""),
    sortOrder: parseAsSortOrder.withDefault("asc"),
  });

  // Individual setters for backward compatibility
  const setSearch = (value: string | null) =>
    setFilters({ search: value || "" });
  const setGrowthStage = (value: string | null) =>
    setFilters({ growthStage: value || "" });
  const setCustomerFocus = (value: string | null) =>
    setFilters({ customerFocus: value || "" });
  const setFundingType = (value: string | null) =>
    setFilters({ fundingType: value || "" });
  const setSortBy = (value: string | null) =>
    setFilters({ sortBy: value || "" });
  const setSortOrder = (value: "asc" | "desc") =>
    setFilters({ sortOrder: value });
  const setMinRank = (value: number | null) => setFilters({ minRank: value });
  const setMaxRank = (value: number | null) => setFilters({ maxRank: value });
  const setMinFunding = (value: number | null) =>
    setFilters({ minFunding: value });
  const setMaxFunding = (value: number | null) =>
    setFilters({ maxFunding: value });

  // Debug logging (reduced frequency)
  // console.log("🎯 [nuqs] Current filter state:", JSON.stringify(filters));

  // Batch update function for applying multiple filters at once
  const updateFilters = async (
    updates: Partial<FilterState>,
    resetPage = true
  ) => {
    // Use setFilters for batched updates - this will update all keys in a single URL change
    await setFilters(updates);
  };

  // Reset all filters to default values
  const resetFilters = async () => {
    await setFilters({
      search: "",
      growthStage: "",
      customerFocus: "",
      fundingType: "",
      minRank: null,
      maxRank: null,
      minFunding: null,
      maxFunding: null,
      sortBy: "",
      sortOrder: "asc",
    });
  };

  // Remove a specific filter
  const removeFilter = async (key: keyof FilterState) => {
    const updates: Partial<FilterState> = {};

    if (
      key === "minRank" ||
      key === "maxRank" ||
      key === "minFunding" ||
      key === "maxFunding"
    ) {
      updates[key] = null;
    } else if (key === "sortOrder") {
      updates[key] = "asc";
    } else {
      updates[key] = "";
    }

    await updateFilters(updates);
  };

  return {
    // Individual filter states and setters
    search: filters.search,
    setSearch,
    growthStage: filters.growthStage,
    setGrowthStage,
    customerFocus: filters.customerFocus,
    setCustomerFocus,
    fundingType: filters.fundingType,
    setFundingType,
    sortBy: filters.sortBy,
    setSortBy,
    sortOrder: filters.sortOrder,
    setSortOrder,
    minRank: filters.minRank,
    setMinRank,
    maxRank: filters.maxRank,
    setMaxRank,
    minFunding: filters.minFunding,
    setMinFunding,
    maxFunding: filters.maxFunding,
    setMaxFunding,

    // Computed and utility functions
    filters,
    updateFilters,
    resetFilters,
    removeFilter,
  };
}

/**
 * Hook for pagination state management
 */
export function usePaginationState() {
  const [page, setPage] = i("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(12)
  );

  const pagination = { page, limit };

  const goToPage = async (newPage: number) => {
    await setPage(newPage);
  };

  const resetPagination = async () => {
    await setPage(1);
  };

  return {
    page,
    setPage,
    limit,
    setLimit,
    pagination,
    goToPage,
    resetPagination,
  };
}
