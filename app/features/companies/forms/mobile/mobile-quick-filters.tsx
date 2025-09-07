import {
  HStack,
  Button,
  Text,
  Wrap,
  FormatNumber,
  Tag,
  For,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
// import { useSyncArrayState } from "@/hooks/use-sync-state";
import type { FilterState } from "@/lib/companies-client";
import { useCurrencyStore } from "@/stores/currency.store";
import { convertCurrency } from "@/utils/currency-utils";

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
    filters: { minRank: 1, maxRank: 100 },
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

interface MobileQuickFiltersProps {
  initialFilters: FilterState;
  onFiltersChange?: (filters: Partial<FilterState>) => void;
}

export function MobileQuickFilters({
  initialFilters,
  onFiltersChange,
}: MobileQuickFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Update local state when initialFilters change (from parent)
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

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
    const isCurrentlyActive = isFilterActive(quickFilter);

    if (isCurrentlyActive) {
      // Clear the filters
      const newFilters = { ...filters };
      Object.keys(quickFilter.filters).forEach((key) => {
        (newFilters as any)[key] = null;
      });
      setFilters(newFilters);
      if (onFiltersChange) {
        onFiltersChange(newFilters);
      }
    } else {
      // Apply the filters
      const newFilters = { ...filters };
      Object.entries(quickFilter.filters).forEach(([key, value]) => {
        (newFilters as any)[key] = value;
      });
      setFilters(newFilters);
      if (onFiltersChange) {
        onFiltersChange(newFilters);
      }
    }
  };

  const isFilterActive = (quickFilter: ProcessedQuickFilter): boolean => {
    return Object.entries(quickFilter.filters).every(([key, value]) => {
      const currentValue = (filters as any)[key];
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
              onClick={() => applyQuickFilter(filter)}
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
