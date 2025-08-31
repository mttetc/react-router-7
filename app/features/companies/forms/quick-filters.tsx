import {
  HStack,
  Button,
  Text,
  Wrap,
  FormatNumber,
  Tag,
  For,
} from "@chakra-ui/react";
import { useFormStatus } from "react-dom";
import type { FilterState } from "../../../services/companies.service";
import { useCurrencyStore } from "~/stores/currency.store";
import { convertCurrency, getCurrencySymbol } from "~/utils/currency.utils";
import { ClientOnly } from "~/components/ui/client-only";

interface QuickFilterBase {
  id: string;
  labelKey: string;
  filters: Partial<FilterState>;
  color: string;
  fundingAmount?: number; // USD amount for funding filters
}

interface ProcessedQuickFilter {
  id: string;
  labelKey: string;
  filters: Partial<FilterState>;
  color: string;
  fundingAmount?: number;
  convertedAmount?: number;
}

const QUICK_FILTER_TEMPLATES: QuickFilterBase[] = [
  {
    id: "early-stage",
    labelKey: "🌱 Early Stage",
    filters: { growthStage: "early" },
    color: "green",
  },
  {
    id: "b2b",
    labelKey: "🏢 B2B",
    filters: { customerFocus: "b2b" },
    color: "blue",
  },
  {
    id: "recently-funded",
    labelKey: "💰 Recently Funded",
    filters: { fundingType: "Series A" },
    color: "purple",
  },
  {
    id: "high-funding",
    labelKey: "🚀 {amount}+",
    filters: { minFunding: 1000000 },
    fundingAmount: 1000000,
    color: "orange",
  },
  {
    id: "seed-stage",
    labelKey: "🌿 Seed Stage",
    filters: { growthStage: "seed" },
    color: "teal",
  },
  {
    id: "b2c",
    labelKey: "👥 B2C",
    filters: { customerFocus: "b2c" },
    color: "pink",
  },
  {
    id: "top-100",
    labelKey: "🏆 Top 100",
    filters: { maxRank: 100 },
    color: "yellow",
  },
  {
    id: "mega-funding",
    labelKey: "🦄 {amount}+",
    filters: { minFunding: 10000000 },
    fundingAmount: 10000000,
    color: "red",
  },
];

interface QuickFiltersProps {
  currentFilters: FilterState;
  formId?: string;
}

function QuickFiltersInner({
  currentFilters,
  formId = "filter-form",
}: QuickFiltersProps) {
  const { pending } = useFormStatus();
  const currentCurrency = useCurrencyStore((state) => state.selectedCurrency);

  // Generate quick filters with currency-aware data
  const quickFilters: ProcessedQuickFilter[] = QUICK_FILTER_TEMPLATES.map(
    (template) => {
      const result: ProcessedQuickFilter = {
        id: template.id,
        labelKey: template.labelKey,
        filters: { ...template.filters },
        color: template.color,
      };

      // Handle funding amount conversion
      if (template.fundingAmount) {
        result.fundingAmount = template.fundingAmount;
        result.convertedAmount = convertCurrency(
          template.fundingAmount,
          currentCurrency
        );

        // Keep USD for backend
        if (template.filters.minFunding) {
          result.filters.minFunding = template.fundingAmount;
        }
      }

      return result;
    }
  );

  const applyQuickFilter = (quickFilter: ProcessedQuickFilter) => {
    const form = document.getElementById(formId) as HTMLFormElement;
    if (!form) return;

    const isCurrentlyActive = isFilterActive(quickFilter);

    // Update form fields with the quick filter values
    Object.entries(quickFilter.filters).forEach(([key, value]) => {
      const hiddenInput = form.querySelector(
        `input[name="${key}"]`
      ) as HTMLInputElement;
      if (hiddenInput) {
        // If filter is currently active, clear it; otherwise, apply it
        hiddenInput.value = isCurrentlyActive ? "" : value?.toString() || "";
      }
    });

    form.requestSubmit();
  };

  const isFilterActive = (quickFilter: ProcessedQuickFilter): boolean => {
    return Object.entries(quickFilter.filters).every(([key, value]) => {
      const currentValue = (currentFilters as any)[key];
      return currentValue === value;
    });
  };

  return (
    <Wrap gap={1} align="center">
      <For each={quickFilters}>
        {(filter) => {
          const isActive = isFilterActive(filter);

          return (
            <Button
              key={filter.id}
              colorPalette={filter.color}
              variant={isActive ? "solid" : "outline"}
              size="2xs"
              onClick={() => !pending && applyQuickFilter(filter)}
              disabled={pending}
            >
              {filter.convertedAmount ? (
                <>
                  {filter.labelKey.split("{amount}")[0]}
                  <FormatNumber
                    value={filter.convertedAmount}
                    style="currency"
                    currency={currentCurrency}
                    notation="compact"
                    maximumFractionDigits={1}
                  />
                  {filter.labelKey.split("{amount}")[1]}
                </>
              ) : (
                filter.labelKey
              )}
            </Button>
          );
        }}
      </For>
    </Wrap>
  );
}

export function QuickFilters({ currentFilters, formId }: QuickFiltersProps) {
  return (
    <ClientOnly
      fallback={
        <Wrap gap={1} align="center">
          <For each={QUICK_FILTER_TEMPLATES.filter((t) => !t.fundingAmount)}>
            {(template) => (
              <Button
                key={template.id}
                colorPalette={template.color}
                variant="outline"
                size="2xs"
                disabled
              >
                {template.labelKey}
              </Button>
            )}
          </For>
        </Wrap>
      }
    >
      <QuickFiltersInner currentFilters={currentFilters} formId={formId} />
    </ClientOnly>
  );
}
