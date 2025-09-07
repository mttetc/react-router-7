import { Box, VStack } from "@chakra-ui/react";
import { useQueryState } from "nuqs";
import { filtersSearchParams } from "@/lib/search-params";
import { useMemo, useRef } from "react";
import { useLandmark } from "@react-aria/landmark";

import { SmartSearch, getCurrentSearchInput } from "./smart-search";
import { QuickFilters } from "./quick-filters";
import { ActiveFilters } from "./active-filters";
import { ClientOnly } from "@/components/ui/client-only";
import { DetailedFilters } from "./detailed-filters";

interface FilterFormProps {
  isInDrawer?: boolean;
}

export function FilterForm({ isInDrawer = false }: FilterFormProps) {
  const complementaryRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const quickFiltersRef = useRef<HTMLDivElement>(null);
  const activeFiltersRef = useRef<HTMLDivElement>(null);
  const detailedFiltersRef = useRef<HTMLDivElement>(null);

  // Use React Aria landmarks for proper accessibility
  const { landmarkProps: complementaryProps } = useLandmark(
    { role: "complementary", "aria-label": "Company filters" },
    complementaryRef
  );
  const { landmarkProps: searchProps } = useLandmark(
    { role: "search", "aria-label": "Search companies" },
    searchRef
  );
  // Group elements don't need landmark props, just ARIA attributes
  const quickFiltersProps = { role: "group", "aria-label": "Quick filters" };
  const activeFiltersProps = { role: "group", "aria-label": "Active filters" };
  const detailedFiltersProps = {
    role: "group",
    "aria-label": "Detailed filters",
  };

  const [, setSearch] = useQueryState("search", filtersSearchParams.search);
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

  // Use useMemo to prevent infinite re-renders from getCurrentSearchInput()
  const filters = useMemo(
    () => ({
      search: getCurrentSearchInput(),
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
    }),
    [
      growthStage,
      customerFocus,
      fundingType,
      minRank,
      maxRank,
      minFunding,
      maxFunding,
      sortBy,
      sortOrder,
      page,
      limit,
    ]
  );

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
    // Only reset active filters, keep search intact
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
      ref={complementaryRef}
      {...complementaryProps}
      {...(isInDrawer
        ? {}
        : {
            bg: "white",
            borderRadius: "lg",
            shadow: "sm",
            border: "1px solid",
            borderColor: "gray.200",
            p: 4,
            h: "fit-content",
            maxH: "100%",
            overflow: "hidden",
          })}
    >
      <VStack gap={6} align="stretch">
        <Box ref={searchRef} {...searchProps}>
          <SmartSearch />
        </Box>

        <Box ref={quickFiltersRef} {...quickFiltersProps}>
          <QuickFilters />
        </Box>

        <ClientOnly fallback={null}>
          <Box ref={activeFiltersRef} {...activeFiltersProps}>
            <ActiveFilters
              filters={filters}
              onRemoveFilter={removeFilter}
              onResetAll={resetFilters}
            />
          </Box>
        </ClientOnly>

        <Box ref={detailedFiltersRef} {...detailedFiltersProps}>
          <DetailedFilters />
        </Box>
      </VStack>
    </Box>
  );
}
