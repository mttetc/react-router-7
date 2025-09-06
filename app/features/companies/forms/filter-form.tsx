import { Box, VStack } from "@chakra-ui/react";
import { useQueryState } from "nuqs";
import { filtersSearchParams } from "~/lib/search-params";

import { SmartSearch } from "./smart-search";
import { QuickFilters } from "./quick-filters";
import { ActiveFilters } from "./active-filters";
import { ClientOnly } from "~/components/ui/client-only";
import { DetailedFilters } from "./detailed-filters";

export function FilterForm() {
  const [search, setSearch] = useQueryState(
    "search",
    filtersSearchParams.search
  );
  const [growthStage, setGrowthStage] = useQueryState(
    "growthStage",
    filtersSearchParams.growthStage
  );
  const [customerFocus, setCustomerFocus] = useQueryState(
    "customerFocus",
    filtersSearchParams.customerFocus
  );
  const [fundingType, setFundingType] = useQueryState(
    "fundingType",
    filtersSearchParams.fundingType
  );
  const [minRank, setMinRank] = useQueryState(
    "minRank",
    filtersSearchParams.minRank
  );
  const [maxRank, setMaxRank] = useQueryState(
    "maxRank",
    filtersSearchParams.maxRank
  );
  const [minFunding, setMinFunding] = useQueryState(
    "minFunding",
    filtersSearchParams.minFunding
  );
  const [maxFunding, setMaxFunding] = useQueryState(
    "maxFunding",
    filtersSearchParams.maxFunding
  );
  const [sortBy, setSortBy] = useQueryState(
    "sortBy",
    filtersSearchParams.sortBy
  );
  const [sortOrder, setSortOrder] = useQueryState(
    "sortOrder",
    filtersSearchParams.sortOrder
  );
  const [page, setPage] = useQueryState("page", filtersSearchParams.page);
  const [limit, setLimit] = useQueryState("limit", filtersSearchParams.limit);

  const filters = {
    search: search || "",
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

  const removeFilter = (key: keyof typeof filters) => {
    if (key === "search") setSearch(null);
    else if (key === "growthStage") setGrowthStage(null);
    else if (key === "customerFocus") setCustomerFocus(null);
    else if (key === "fundingType") setFundingType(null);
    else if (key === "minRank") setMinRank(null);
    else if (key === "maxRank") setMaxRank(null);
    else if (key === "minFunding") setMinFunding(null);
    else if (key === "maxFunding") setMaxFunding(null);
    else if (key === "sortBy") setSortBy(null);
    else if (key === "sortOrder") setSortOrder("asc");
    else if (key === "page") setPage(1);
    else if (key === "limit") setLimit(12);
  };

  const resetFilters = () => {
    setSearch(null);
    setGrowthStage(null);
    setCustomerFocus(null);
    setFundingType(null);
    setMinRank(null);
    setMaxRank(null);
    setMinFunding(null);
    setMaxFunding(null);
    setSortBy(null);
    setSortOrder("asc");
    setPage(1);
    setLimit(12);
  };

  return (
    <Box
      bg="white"
      borderRadius="lg"
      shadow="sm"
      border="1px solid"
      borderColor="gray.200"
      p={4}
      h="fit-content"
      maxH="100%"
      overflow="hidden"
    >
      <VStack gap={6} align="stretch">
        <SmartSearch />

        <QuickFilters />

        <ClientOnly fallback={null}>
          <ActiveFilters
            filters={filters}
            onRemoveFilter={removeFilter}
            onResetAll={resetFilters}
          />
        </ClientOnly>

        <DetailedFilters />
      </VStack>
    </Box>
  );
}
