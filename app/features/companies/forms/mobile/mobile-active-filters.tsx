import { Box, Button, HStack, Text, Wrap, For, Tag } from "@chakra-ui/react";
import { FaTimes, FaUndo } from "react-icons/fa";
import React, { useCallback, useState, useEffect } from "react";
// import { useSyncArrayState } from "@/hooks/use-sync-state";
import type { FilterState } from "@/lib/companies-client";
import { useCurrencyStore } from "@/stores/currency.store";
import { convertCurrency, getCurrencySymbol } from "@/utils/currency-utils";

interface MobileActiveFiltersProps {
  initialFilters: FilterState;
  onFiltersChange?: (filters: Partial<FilterState>) => void;
}

export function MobileActiveFilters({
  initialFilters,
  onFiltersChange,
}: MobileActiveFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Update local state when initialFilters change (from parent)
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const currentCurrency = useCurrencyStore((state) => state.selectedCurrency);

  // Generate active filter tags (excluding search)
  const activeFilters = [];

  if (filters.growthStage) {
    const stageLabels: Record<string, string> = {
      early: "🌱 Early",
      seed: "🌿 Seed",
      growing: "🌳 Growing",
      late: "🏢 Late",
      exit: "🚀 Exit",
    };
    activeFilters.push({
      key: "growthStage",
      label: `Stage: ${
        stageLabels[filters.growthStage] || filters.growthStage
      }`,
      color: "green",
    });
  }

  if (filters.customerFocus) {
    const focusLabels: Record<string, string> = {
      b2b: "🏢 B2B",
      b2c: "👥 B2C",
      b2b_b2c: "🔄 B2B & B2C",
      b2c_b2b: "🔄 B2C & B2B",
    };
    activeFilters.push({
      key: "customerFocus",
      label: `Focus: ${
        focusLabels[filters.customerFocus] || filters.customerFocus
      }`,
      color: "blue",
    });
  }

  if (filters.fundingType) {
    activeFilters.push({
      key: "fundingType",
      label: `Funding: ${filters.fundingType}`,
      color: "purple",
    });
  }

  if (filters.minRank || filters.maxRank) {
    const minRank = filters.minRank || 1;
    const maxRank = filters.maxRank || 5000;
    activeFilters.push({
      key: "rankRange",
      label: `Rank: ${minRank}-${maxRank}`,
      color: "yellow",
    });
  }

  if (filters.minFunding || filters.maxFunding) {
    const minFunding = filters.minFunding || 0;
    const maxFunding = filters.maxFunding || 100000000;
    const convertedMin = convertCurrency(minFunding, currentCurrency);
    const convertedMax = convertCurrency(maxFunding, currentCurrency);
    const symbol = getCurrencySymbol(currentCurrency);

    activeFilters.push({
      key: "fundingRange",
      label: `Funding: ${symbol}${convertedMin.toLocaleString()}-${symbol}${convertedMax.toLocaleString()}`,
      color: "orange",
    });
  }

  const removeFilter = (key: string) => {
    const newFilters = { ...filters };

    if (key === "rankRange") {
      newFilters.minRank = null;
      newFilters.maxRank = null;
    } else if (key === "fundingRange") {
      newFilters.minFunding = null;
      newFilters.maxFunding = null;
    } else {
      (newFilters as any)[key] = "";
    }

    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      ...filters, // Keep current filters
      growthStage: "",
      customerFocus: "",
      fundingType: "",
      minRank: null,
      maxRank: null,
      minFunding: null,
      maxFunding: null,
      page: 1, // Reset to first page
    };
    setFilters(clearedFilters);
    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
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
          variant="outline"
          colorPalette="brand"
          onClick={clearAllFilters}
          flexShrink={0}
        >
          <FaUndo />
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
