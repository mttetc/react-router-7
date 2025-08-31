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
import { FaUndo } from "react-icons/fa";
import { useCurrencyStore } from "~/stores/currency.store";
import { convertCurrency } from "~/utils/currency.utils";
import type { FilterState } from "../../../services/companies.service";

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

  if (filters.search) {
    active.push({
      key: "search",
      label: "Search",
      value: `"${filters.search}"`,
      color: "gray",
    });
  }

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
    active.push({
      key: "customerFocus",
      label: "Customer Focus",
      value: focusLabels[filters.customerFocus] || filters.customerFocus,
      color: "blue",
    });
  }

  if (filters.fundingType) {
    active.push({
      key: "fundingType",
      label: "Funding Type",
      value: filters.fundingType,
      color: "purple",
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
      color: "yellow",
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
      color: "orange",
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
  const activeFilters = getActiveFilters(filters, currency);

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <Presence
      present={true}
      animationName={{
        _open: "fade-in, scale-in",
        _closed: "fade-out, scale-out",
      }}
      animationDuration="moderate"
    >
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
                  animationName={{
                    _open: "fade-in, scale-in",
                    _closed: "fade-out, scale-out",
                  }}
                  animationDuration="fast"
                  animationDelay="0.05s"
                >
                  <Tag.Root
                    colorPalette={filter.color}
                    variant="solid"
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
                    <Tag.CloseTrigger
                      onClick={() => onRemoveFilter(filter.key)}
                      aria-label={`Remove ${filter.label} filter`}
                    />
                  </Tag.Root>
                </Presence>
              )}
            </For>
          </Wrap>
        </HStack>

        <Presence
          present={true}
          animationName={{
            _open: "fade-in, scale-in",
            _closed: "fade-out, scale-out",
          }}
          animationDuration="fast"
          animationDelay="0.1s"
        >
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
        </Presence>
      </HStack>
    </Presence>
  );
}
