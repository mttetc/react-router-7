import { Box, Button, HStack, Text, Wrap, For, Tag } from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";
import { useState, useEffect, useMemo } from "react";
import type { FilterState } from "@/features/companies/api/companies-client";
import { useCurrencyStore } from "@/stores/currency.store";
import { convertCurrency, getCurrencySymbol } from "@/stores/currency-utils";

interface MobileActiveFiltersProps {
  initialFilters: FilterState;
  onFiltersChange?: (filters: Partial<FilterState>) => void;
}

interface ActiveFilter {
  key: string;
  label: string;
  color: string;
}

const STAGE_LABELS: Record<string, string> = {
  early: "🌱 Early",
  seed: "🌿 Seed",
  growing: "🌳 Growing",
  late: "🏢 Late",
  exit: "🚀 Exit",
};

const FOCUS_LABELS: Record<string, string> = {
  b2b: "🏢 B2B",
  b2c: "👥 B2C",
  b2b_b2c: "🔄 B2B & B2C",
  b2c_b2b: "🔄 B2C & B2B",
};

function createGrowthStageFilter(growthStage: string): ActiveFilter {
  return {
    key: "growthStage",
    label: `Stage: ${STAGE_LABELS[growthStage] || growthStage}`,
    color: "green",
  };
}

function createCustomerFocusFilter(customerFocus: string): ActiveFilter {
  return {
    key: "customerFocus",
    label: `Focus: ${FOCUS_LABELS[customerFocus] || customerFocus}`,
    color: "blue",
  };
}

function createFundingTypeFilter(fundingType: string): ActiveFilter {
  return {
    key: "fundingType",
    label: `Funding: ${fundingType}`,
    color: "purple",
  };
}

function createRankRangeFilter(
  minRank: number | null,
  maxRank: number | null
): ActiveFilter {
  const min = minRank || 1;
  const max = maxRank || 5000;
  return {
    key: "rankRange",
    label: `Rank: ${min}-${max}`,
    color: "yellow",
  };
}

function createFundingRangeFilter(
  minFunding: number | null,
  maxFunding: number | null,
  currentCurrency: string
): ActiveFilter {
  const min = minFunding || 0;
  const max = maxFunding || 100000000;
  const convertedMin = convertCurrency(min, currentCurrency);
  const convertedMax = convertCurrency(max, currentCurrency);
  const symbol = getCurrencySymbol(currentCurrency);

  return {
    key: "fundingRange",
    label: `Funding: ${symbol}${convertedMin.toLocaleString()}-${symbol}${convertedMax.toLocaleString()}`,
    color: "orange",
  };
}

export function MobileActiveFilters({
  initialFilters,
  onFiltersChange,
}: MobileActiveFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const currentCurrency = useCurrencyStore((state) => state.selectedCurrency);

  // Update local state when initialFilters change (from parent)
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Generate active filter tags using functional approach
  const activeFilters = useMemo((): ActiveFilter[] => {
    const filtersList: ActiveFilter[] = [];

    if (filters.growthStage) {
      filtersList.push(createGrowthStageFilter(filters.growthStage));
    }

    if (filters.customerFocus) {
      filtersList.push(createCustomerFocusFilter(filters.customerFocus));
    }

    if (filters.fundingType) {
      filtersList.push(createFundingTypeFilter(filters.fundingType));
    }

    if (filters.minRank || filters.maxRank) {
      filtersList.push(createRankRangeFilter(filters.minRank, filters.maxRank));
    }

    if (filters.minFunding || filters.maxFunding) {
      filtersList.push(
        createFundingRangeFilter(
          filters.minFunding,
          filters.maxFunding,
          currentCurrency
        )
      );
    }

    return filtersList;
  }, [filters, currentCurrency]);

  const removeFilter = (key: string) => {
    const newFilters = { ...filters };

    switch (key) {
      case "rankRange":
        newFilters.minRank = null;
        newFilters.maxRank = null;
        break;
      case "fundingRange":
        newFilters.minFunding = null;
        newFilters.maxFunding = null;
        break;
      case "growthStage":
        newFilters.growthStage = "";
        break;
      case "customerFocus":
        newFilters.customerFocus = "";
        break;
      case "fundingType":
        newFilters.fundingType = "";
        break;
      default:
        // Handle any other filter keys safely
        if (key in newFilters) {
          (newFilters as Record<string, unknown>)[key] = "";
        }
    }

    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      ...filters, // Keep current filters
      growthStage: "",
      customerFocus: "",
      fundingType: "",
      minRank: null,
      maxRank: null,
      minFunding: null,
      maxFunding: null,
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <Box>
      <HStack justify="space-between" align="center" mb={3}>
        <Text fontSize="sm" fontWeight="semibold" color="gray.700">
          Active Filters ({activeFilters.length})
        </Text>
        <Button
          size="xs"
          variant="plain"
          colorPalette="purple"
          onClick={clearAllFilters}
          flexShrink={0}
          _hover={{ textDecoration: "underline" }}
        >
          Clear all
        </Button>
      </HStack>

      <Wrap gap={2}>
        <For each={activeFilters}>
          {(filter) => (
            <Tag.Root
              key={filter.key}
              colorPalette={filter.color}
              size="sm"
              variant="surface"
            >
              <HStack gap={1}>
                <Text fontSize="xs">{filter.label}</Text>
                <Box
                  cursor="pointer"
                  onClick={() => removeFilter(filter.key)}
                  _hover={{ opacity: 0.7 }}
                >
                  <FaTimes size={10} />
                </Box>
              </HStack>
            </Tag.Root>
          )}
        </For>
      </Wrap>
    </Box>
  );
}
