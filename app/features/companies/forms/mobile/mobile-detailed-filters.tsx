import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Collapsible,
  HStack,
  Icon,
  Separator,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaChevronDown, FaChevronUp, FaCog } from "react-icons/fa";
// import { useSyncArrayState } from "@/hooks/use-sync-state";
import type { FilterState } from "@/lib/companies-client";
import { MobileSelectField } from "./mobile-select-field";
import { MobileSliderField } from "./mobile-slider-field";
import { MobileFundingSliderField } from "./mobile-funding-slider-field";

// Data for select options
const growthStageOptions = [
  { value: "early", label: "🌱 Early" },
  { value: "seed", label: "🌿 Seed" },
  { value: "growing", label: "🌳 Growing" },
  { value: "late", label: "🏢 Late" },
  { value: "exit", label: "🚀 Exit" },
];

const customerFocusOptions = [
  { value: "b2b", label: "🏢 B2B" },
  { value: "b2c", label: "👥 B2C" },
  { value: "b2b_b2c", label: "🔄 B2B & B2C" },
  { value: "b2c_b2b", label: "🔄 B2C & B2B" },
];

const fundingTypeOptions = [
  { value: "Seed", label: "🌱 Seed" },
  { value: "Pre Seed", label: "🌰 Pre Seed" },
  { value: "Series A", label: "🅰️ Series A" },
  { value: "Series B", label: "🅱️ Series B" },
  { value: "Series C", label: "©️ Series C" },
  { value: "Series Unknown", label: "❓ Series Unknown" },
  { value: "Angel", label: "👼 Angel" },
  { value: "Grant", label: "🎁 Grant" },
  { value: "Debt Financing", label: "🏦 Debt Financing" },
  { value: "Convertible Note", label: "📝 Convertible Note" },
  { value: "Corporate Round", label: "🏢 Corporate Round" },
  { value: "Undisclosed", label: "🤐 Undisclosed" },
];

interface MobileDetailedFiltersProps {
  initialFilters: FilterState;
  onFiltersChange?: (filters: Partial<FilterState>) => void;
  defaultOpen?: boolean;
}

export function MobileDetailedFilters({
  initialFilters,
  onFiltersChange,
  defaultOpen = false,
}: MobileDetailedFiltersProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Update local state when initialFilters change (from parent)
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Check if any advanced filters are active
  const hasActiveAdvancedFilters = !!(
    filters.growthStage ||
    filters.customerFocus ||
    filters.fundingType ||
    filters.minRank ||
    filters.maxRank ||
    filters.minFunding ||
    filters.maxFunding
  );

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  return (
    <Box>
      <Button
        variant="outline"
        colorPalette={hasActiveAdvancedFilters ? "purple" : "gray"}
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        width="full"
        justifyContent="space-between"
      >
        <HStack>
          <FaCog />
          <Text>More Filters</Text>
          {hasActiveAdvancedFilters && (
            <Box w={2} h={2} bg="purple.500" borderRadius="full" />
          )}
        </HStack>
        <Icon size="xs">{isOpen ? <FaChevronUp /> : <FaChevronDown />}</Icon>
      </Button>

      <Collapsible.Root open={isOpen}>
        <Collapsible.Content>
          <Box pt={4}>
            <Stack gap={6}>
              {/* Categories */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.700"
                  mb={3}
                >
                  Company Categories
                </Text>
                <Stack gap={4}>
                  <MobileSelectField
                    name="growthStage"
                    label="Growth Stage"
                    options={growthStageOptions}
                    placeholder="All stages"
                    value={filters.growthStage}
                    onChange={(value) => updateFilter("growthStage", value)}
                  />

                  <MobileSelectField
                    name="customerFocus"
                    label="Customer Focus"
                    options={customerFocusOptions}
                    placeholder="All customer types"
                    value={filters.customerFocus}
                    onChange={(value) => updateFilter("customerFocus", value)}
                  />

                  <MobileSelectField
                    name="fundingType"
                    label="Funding Type"
                    options={fundingTypeOptions}
                    placeholder="All funding types"
                    value={filters.fundingType}
                    onChange={(value) => updateFilter("fundingType", value)}
                  />
                </Stack>
              </Box>

              <Separator />

              {/* Ranges */}
              <Box>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray.700"
                  mb={3}
                >
                  Numeric Ranges
                </Text>
                <Stack gap={4}>
                  <MobileSliderField
                    name="rankRange"
                    label="Rank Range"
                    min={1}
                    max={5000}
                    minValue={filters.minRank || 1}
                    maxValue={filters.maxRank || 5000}
                    onMinChange={(value) => updateFilter("minRank", value)}
                    onMaxChange={(value) => updateFilter("maxRank", value)}
                  />

                  <MobileFundingSliderField
                    minValue={filters.minFunding || 0}
                    maxValue={filters.maxFunding || 100000000}
                    onMinChange={(value) => updateFilter("minFunding", value)}
                    onMaxChange={(value) => updateFilter("maxFunding", value)}
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
}
