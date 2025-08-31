import { Box, Stack, VStack } from "@chakra-ui/react";

import { SmartSearch } from "./smart-search";
import { QuickFilters } from "./quick-filters";
import { ActiveFilters } from "./active-filters";
import { ClientOnly } from "~/components/ui/client-only";
import { DetailedFilters } from "./detailed-filters";
import { useFilterState } from "~/hooks/use-filter-state";

interface FilterFormProps {
  // No props needed - components manage their own state via nuqs
}

export function FilterForm({}: FilterFormProps) {
  const { filters, removeFilter, resetFilters } = useFilterState();

  return (
    <Box width="100%">
      <VStack gap={6} align="stretch">
        {/* Smart Search - Primary Interface */}
        <SmartSearch />

        {/* Quick Filters - Secondary Interface */}
        <QuickFilters />

        {/* Active Filters - Show what's applied */}
        <ClientOnly fallback={null}>
          <ActiveFilters
            filters={filters}
            onRemoveFilter={removeFilter}
            onResetAll={resetFilters}
          />
        </ClientOnly>

        {/* Advanced Filters - Collapsible for power users */}
        <DetailedFilters />
      </VStack>
    </Box>
  );
}
