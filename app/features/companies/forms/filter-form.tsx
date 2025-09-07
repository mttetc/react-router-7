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
import { MobileFilterForm } from "./mobile/mobile-filter-form";
import {
  createFilterRemovalHandler,
  createFilterResetHandler,
  createFiltersObject,
  createFilterSetterWithPageReset,
} from "../utils/filter-form-utils";

interface FilterFormProps {
  isInDrawer?: boolean;
}

export function FilterForm({ isInDrawer = false }: FilterFormProps) {
  // If in drawer mode, use the mobile filter form with sync state
  if (isInDrawer) {
    return <MobileFilterForm />;
  }

  const complementaryRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const quickFiltersRef = useRef<HTMLDivElement>(null);
  const activeFiltersRef = useRef<HTMLDivElement>(null);
  const detailedFiltersRef = useRef<HTMLDivElement>(null);

  // Use React Aria landmarks for proper accessibility
  const { landmarkProps: complementaryProps } = useLandmark(
    { role: "complementary", "aria-label": "Desktop company filters" },
    complementaryRef
  );
  const { landmarkProps: searchProps } = useLandmark(
    { role: "search", "aria-label": "Desktop search companies" },
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

  // Create filter setters object with page reset for filter changes (but not sorting)
  const filterSetters = {
    search: createFilterSetterWithPageReset(setSearch, setPage),
    growthStage: createFilterSetterWithPageReset(setGrowthStage, setPage),
    customerFocus: createFilterSetterWithPageReset(setCustomerFocus, setPage),
    fundingType: createFilterSetterWithPageReset(setFundingType, setPage),
    minRank: createFilterSetterWithPageReset(setMinRank, setPage),
    maxRank: createFilterSetterWithPageReset(setMaxRank, setPage),
    minFunding: createFilterSetterWithPageReset(setMinFunding, setPage),
    maxFunding: createFilterSetterWithPageReset(setMaxFunding, setPage),
    sortBy: setSortBy, // Sorting doesn't reset page
    sortOrder: setSortOrder, // Sorting doesn't reset page
    page: setPage, // Page setter doesn't need page reset
    limit: setLimit, // Limit setter doesn't need page reset
  };

  // Use useMemo to prevent infinite re-renders from getCurrentSearchInput()
  const filters = useMemo(
    () =>
      createFiltersObject(
        getCurrentSearchInput(),
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
        limit
      ),
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

  const removeFilter = createFilterRemovalHandler(filterSetters);
  const resetFilters = createFilterResetHandler(filterSetters);

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
              hideClearAll={isInDrawer}
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
