import { parseAsString, parseAsInteger, createLoader } from "nuqs/server";

// Define all filter search params with their parsers
export const filtersSearchParams = {
  search: parseAsString.withDefault(""),
  growthStage: parseAsString.withDefault(""),
  customerFocus: parseAsString.withDefault(""),
  fundingType: parseAsString.withDefault(""),
  minRank: parseAsInteger,
  maxRank: parseAsInteger,
  minFunding: parseAsInteger,
  maxFunding: parseAsInteger,
  sortBy: parseAsString.withDefault(""),
  sortOrder: parseAsString.withDefault("asc"),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(12),
};

// Create loader for SSR
export const loadFilters = createLoader(filtersSearchParams);

// Export individual parsers for client-side use
export const {
  search: searchParser,
  growthStage: growthStageParser,
  customerFocus: customerFocusParser,
  fundingType: fundingTypeParser,
  minRank: minRankParser,
  maxRank: maxRankParser,
  minFunding: minFundingParser,
  maxFunding: maxFundingParser,
  sortBy: sortByParser,
  sortOrder: sortOrderParser,
  page: pageParser,
  limit: limitParser,
} = filtersSearchParams;
