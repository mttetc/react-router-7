import { Box, Stack, VStack } from "@chakra-ui/react";
import { Form } from "react-router";
import { useActionState } from "react";

import type { FilterState } from "~/services/companies.service";
import { SmartSearch } from "./smart-search";
import { QuickFilters } from "./quick-filters";
import { ActiveFilters } from "./active-filters";
import { ClientOnly } from "~/components/ui/client-only";
import { DetailedFilters } from "./detailed-filters";
import { filtersToFormData } from "./utils";
import type { FormState } from "./types";

interface FilterFormProps {
  filters: FilterState;
  action: string;
  onRemoveFilter: (key: keyof FilterState) => void;
  onResetAll: () => void;
}

export function FilterForm({
  filters,
  action,
  onRemoveFilter,
  onResetAll,
}: FilterFormProps) {
  const [state, formAction] = useActionState(
    async (prevState: FormState, formData: FormData) => {
      // This will be handled by the route action
      return prevState;
    },
    { errors: {} }
  );

  const formData = filtersToFormData(filters);

  const formId = "filter-form";

  return (
    <Box width="100%">
      <Form id={formId} method="post" action={action}>
        {/* Hidden inputs for form submission */}
        <Box display="none">
          <input name="search" defaultValue={formData.search} />
          <input name="growthStage" defaultValue={formData.growthStage} />
          <input name="customerFocus" defaultValue={formData.customerFocus} />
          <input name="fundingType" defaultValue={formData.fundingType} />
          <input name="minRank" defaultValue={formData.minRank} />
          <input name="maxRank" defaultValue={formData.maxRank} />
          <input name="minFunding" defaultValue={formData.minFunding} />
          <input name="maxFunding" defaultValue={formData.maxFunding} />
          <input name="sortBy" defaultValue={formData.sortBy} />
          <input name="sortOrder" defaultValue={formData.sortOrder} />
        </Box>

        <VStack gap={6} align="stretch">
          {/* Smart Search - Primary Interface */}
          <SmartSearch defaultValue={filters.search} />

          {/* Quick Filters - Secondary Interface */}
          <QuickFilters currentFilters={filters} formId={formId} />

          {/* Active Filters - Show what's applied */}
          <ClientOnly fallback={null}>
            <ActiveFilters
              filters={filters}
              onRemoveFilter={onRemoveFilter}
              onResetAll={onResetAll}
            />
          </ClientOnly>

          {/* Advanced Filters - Collapsible for power users */}
          <DetailedFilters filters={filters} />
        </VStack>
      </Form>
    </Box>
  );
}
