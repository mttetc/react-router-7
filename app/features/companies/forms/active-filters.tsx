import {
  Button,
  For,
  FormatNumber,
  HStack,
  Presence,
  Tag,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { FaUndo } from "react-icons/fa";
import { useCurrencyStore } from "@/stores/currency.store";
import { convertCurrency } from "@/utils/currency-utils";
import type { FilterState } from "@/lib/companies-client";
import { getFilterColor } from "./filter-colors";
import { getCurrentSearchInput } from "./smart-search";

interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveFilter: (key: keyof FilterState) => void;
  onResetAll: () => void;
}

interface ActiveFilter {
  key: keyof FilterState;
  label: string;
  value?: string;
  color: string;
  // For dynamic formatting
  type?: "funding" | "rank" | "text";
  minAmount?: number;
  maxAmount?: number;
  currency?: string;
}

function getActiveFilters(
  filters: FilterState,
  currency: string
): ActiveFilter[] {
  const active: ActiveFilter[] = [];

  // Only show search filter if it contains magic filters
  // Regular search terms are not shown as active filters for cleaner UI

  if (filters.growthStage) {
    const stageLabels: Record<string, string> = {
      early: "🌱 Early Stage",
      seed: "🌿 Seed Stage",
      growing: "🌳 Growing",
      late: "🏢 Late Stage",
      exit: "🚀 Exit",
    };
    active.push({
      key: "growthStage",
      label: "Growth Stage",
      value: stageLabels[filters.growthStage] || filters.growthStage,
      color: getFilterColor("growthStage", filters.growthStage),
    });
  }

  if (filters.customerFocus) {
    const focusLabels: Record<string, string> = {
      b2b: "🏢 B2B",
      b2c: "👥 B2C",
      b2b_b2c: "🔄 B2B & B2C",
      b2c_b2b: "🔄 B2C & B2B",
    };
    active.push({
      key: "customerFocus",
      label: "Customer Focus",
      value: focusLabels[filters.customerFocus] || filters.customerFocus,
      color: getFilterColor("customerFocus", filters.customerFocus),
    });
  }

  if (filters.fundingType) {
    active.push({
      key: "fundingType",
      label: "Funding Type",
      value: filters.fundingType,
      color: getFilterColor("fundingType"),
    });
  }

  if (filters.minRank || filters.maxRank) {
    let value = "";
    if (filters.minRank && filters.maxRank) {
      value = `Rank ${filters.minRank}-${filters.maxRank}`;
    } else if (filters.minRank) {
      value = `Rank ${filters.minRank}+`;
    } else if (filters.maxRank) {
      value = `Top ${filters.maxRank}`;
    }

    active.push({
      key: filters.minRank ? "minRank" : "maxRank",
      label: "Rank Range",
      value,
      type: "rank",
      color: getFilterColor("rank"),
    });
  }

  if (filters.minFunding || filters.maxFunding) {
    // Convert USD amounts to user's currency for display
    const minConverted = filters.minFunding
      ? convertCurrency(filters.minFunding, currency)
      : undefined;
    const maxConverted = filters.maxFunding
      ? convertCurrency(filters.maxFunding, currency)
      : undefined;

    active.push({
      key: filters.minFunding ? "minFunding" : "maxFunding",
      label: "Funding Amount",
      type: "funding",
      minAmount: minConverted,
      maxAmount: maxConverted,
      currency,
      color: getFilterColor("funding"),
    });
  }

  return active;
}

export function ActiveFilters({
  filters,
  onRemoveFilter,
  onResetAll,
}: ActiveFiltersProps) {
  const currency = useCurrencyStore((state) => state.selectedCurrency);

  // Memoize the expensive calculation to prevent unnecessary re-renders
  const activeFilters = useMemo(() => {
    return getActiveFilters(filters, currency);
  }, [filters, currency]);

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <HStack
      p={3}
      bg="gray.50"
      borderRadius="md"
      justify="space-between"
      align="center"
      flexWrap="wrap"
      gap={2}
    >
      <HStack align="center" flexWrap="wrap" gap={1} flex={1}>
        <Text fontSize="xs" fontWeight="medium" color="gray.600">
          Active:
        </Text>

        <Wrap gap={1}>
          <For each={activeFilters}>
            {(filter) => (
              <Presence
                key={filter.key}
                present={true}
                display="flex"
                animationName={{
                  _open: "fade-in",
                  _closed: "fade-out",
                }}
                animationDuration="fast"
              >
                <Tag.Root
                  colorPalette={filter.color}
                  variant="surface"
                  size="sm"
                >
                  <Tag.Label>
                    {filter.type === "funding" ? (
                      <>
                        {filter.minAmount && filter.maxAmount ? (
                          <>
                            <FormatNumber
                              value={filter.minAmount}
                              style="currency"
                              currency={filter.currency}
                              notation="compact"
                              maximumFractionDigits={1}
                            />
                            {" - "}
                            <FormatNumber
                              value={filter.maxAmount}
                              style="currency"
                              currency={filter.currency}
                              notation="compact"
                              maximumFractionDigits={1}
                            />
                          </>
                        ) : filter.minAmount ? (
                          <>
                            <FormatNumber
                              value={filter.minAmount}
                              style="currency"
                              currency={filter.currency}
                              notation="compact"
                              maximumFractionDigits={1}
                            />
                            +
                          </>
                        ) : filter.maxAmount ? (
                          <>
                            Up to{" "}
                            <FormatNumber
                              value={filter.maxAmount}
                              style="currency"
                              currency={filter.currency}
                              notation="compact"
                              maximumFractionDigits={1}
                            />
                          </>
                        ) : null}
                      </>
                    ) : (
                      filter.value
                    )}
                  </Tag.Label>
                  <Tag.EndElement>
                    <Tag.CloseTrigger
                      onClick={() => onRemoveFilter(filter.key)}
                      aria-label={`Remove ${filter.label} filter`}
                    />
                  </Tag.EndElement>
                </Tag.Root>
              </Presence>
            )}
          </For>
        </Wrap>
      </HStack>

      <Button
        size="xs"
        variant="outline"
        colorPalette="gray"
        onClick={onResetAll}
        flexShrink={0}
      >
        <FaUndo />
        Clear all
      </Button>
    </HStack>
  );
}
