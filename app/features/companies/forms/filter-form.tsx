import { Box, VStack } from "@chakra-ui/react";

import { SmartSearch } from "./smart-search";
import { QuickFilters } from "./quick-filters";
import { ActiveFilters } from "./active-filters";
import { ClientOnly } from "~/components/ui/client-only";
import { DetailedFilters } from "./detailed-filters";
import { useFilterState } from "~/hooks/use-filter-state";

export function FilterForm() {
  const filterState = useFilterState();
  const { filters, removeFilter, resetFilters } = filterState;

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
        {/* Smart Search - Primary Interface */}
        <SmartSearch filterState={filterState} />

        {/* Quick Filters - Secondary Interface */}
        <QuickFilters filterState={filterState} />

        {/* Active Filters - Show what's applied */}
        <ClientOnly fallback={null}>
          <ActiveFilters
            filters={filters}
            onRemoveFilter={removeFilter}
            onResetAll={resetFilters}
          />
        </ClientOnly>

        {/* Advanced Filters - Collapsible for power users */}
        <DetailedFilters filterState={filterState} />
      </VStack>
    </Box>
  );
}
