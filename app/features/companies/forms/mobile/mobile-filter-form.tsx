import { Box, VStack } from "@chakra-ui/react";
import { useQueryState } from "nuqs";
import { filtersSearchParams } from "@/lib/search-params";
import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useLandmark } from "@react-aria/landmark";
import type { FilterState } from "@/lib/companies-client";

import { MobileSmartSearch } from "./mobile-smart-search";
import { MobileQuickFilters } from "./mobile-quick-filters";
import { MobileActiveFilters } from "./mobile-active-filters";
import { MobileDetailedFilters } from "./mobile-detailed-filters";
import { createFiltersObject } from "../../utils/filter-form-utils";

interface MobileFilterFormProps {
  onFiltersChange?: (filters: any) => void;
  pendingFilters?: Partial<FilterState>;
}

export function MobileFilterForm({
  onFiltersChange,
  pendingFilters,
}: MobileFilterFormProps) {
  const complementaryRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const quickFiltersRef = useRef<HTMLDivElement>(null);
  const activeFiltersRef = useRef<HTMLDivElement>(null);
  const detailedFiltersRef = useRef<HTMLDivElement>(null);

  // Get current filter values for initial state
  const [search] = useQueryState("search", filtersSearchParams.search);
  const [growthStage] = useQueryState(
    "growthStage",
    filtersSearchParams.growthStage
  );
  const [customerFocus] = useQueryState(
    "customerFocus",
    filtersSearchParams.customerFocus
  );
  const [fundingType] = useQueryState(
    "fundingType",
    filtersSearchParams.fundingType
  );
  const [minRank] = useQueryState("minRank", filtersSearchParams.minRank);
  const [maxRank] = useQueryState("maxRank", filtersSearchParams.maxRank);
  const [minFunding] = useQueryState(
    "minFunding",
    filtersSearchParams.minFunding
  );
  const [maxFunding] = useQueryState(
    "maxFunding",
    filtersSearchParams.maxFunding
  );
  const [sortBy] = useQueryState("sortBy", filtersSearchParams.sortBy);
  const [sortOrder] = useQueryState("sortOrder", filtersSearchParams.sortOrder);
  const [page] = useQueryState("page", filtersSearchParams.page);
  const [limit] = useQueryState("limit", filtersSearchParams.limit);

  // Create initial filters object
  const initialFilters = useMemo(
    () =>
      createFiltersObject(
        search || "",
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
      search,
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

  // Use simple useState for managing pending filters
  const [currentFilters, setCurrentFilters] =
    useState<FilterState>(initialFilters);

  // Update local state when pendingFilters change (from drawer)
  useEffect(() => {
    if (pendingFilters) {
      const updatedFilters = { ...initialFilters, ...pendingFilters };
      setCurrentFilters(updatedFilters);
    }
  }, [pendingFilters, initialFilters]);

  // console.log("🔄 MobileFilterForm render - pendingFilters:", pendingFilters, "currentFilters:", currentFilters);

  // Handle filter changes from child components
  const handleFiltersChange = useCallback(
    (newFilters: Partial<FilterState>) => {
      const updatedFilters = { ...currentFilters, ...newFilters };
      setCurrentFilters(updatedFilters);
      if (onFiltersChange) {
        onFiltersChange(updatedFilters);
      }
    },
    [currentFilters, onFiltersChange]
  );

  // Use React Aria landmarks for proper accessibility
  const { landmarkProps: complementaryProps } = useLandmark(
    { role: "complementary", "aria-label": "Company filters" },
    complementaryRef
  );

  const { landmarkProps: searchProps } = useLandmark(
    { role: "search", "aria-label": "Search companies" },
    searchRef
  );

  const { landmarkProps: quickFiltersProps } = useLandmark(
    { role: "region", "aria-label": "Quick filters" },
    quickFiltersRef
  );

  const { landmarkProps: activeFiltersProps } = useLandmark(
    { role: "region", "aria-label": "Active filters" },
    activeFiltersRef
  );

  const { landmarkProps: detailedFiltersProps } = useLandmark(
    { role: "region", "aria-label": "Detailed filters" },
    detailedFiltersRef
  );

  return (
    <Box {...complementaryProps} ref={complementaryRef}>
      <VStack gap={6} align="stretch">
        {/* Smart Search */}
        <Box {...searchProps} ref={searchRef}>
          <MobileSmartSearch
            initialValue={currentFilters.search}
            onFiltersChange={handleFiltersChange}
          />
        </Box>

        {/* Quick Filters */}
        <Box {...quickFiltersProps} ref={quickFiltersRef}>
          <MobileQuickFilters
            initialFilters={currentFilters}
            onFiltersChange={handleFiltersChange}
          />
        </Box>

        {/* Active Filters */}
        <Box {...activeFiltersProps} ref={activeFiltersRef}>
          <MobileActiveFilters
            initialFilters={currentFilters}
            onFiltersChange={handleFiltersChange}
          />
        </Box>

        {/* Detailed Filters */}
        <Box {...detailedFiltersProps} ref={detailedFiltersRef}>
          <MobileDetailedFilters
            initialFilters={currentFilters}
            onFiltersChange={handleFiltersChange}
          />
        </Box>
      </VStack>
    </Box>
  );
}
