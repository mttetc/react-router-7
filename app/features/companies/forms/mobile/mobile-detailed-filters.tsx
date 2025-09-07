import { useState, useCallback, useEffect } from "react";
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
import type { FilterState } from "@/types/schemas";
import { MobileSelectField } from "./mobile-select-field";
import { MobileSliderField } from "./mobile-slider-field";
import { MobileFundingSliderField } from "./mobile-funding-slider-field";
import {
  GROWTH_STAGE_OPTIONS,
  CUSTOMER_FOCUS_OPTIONS,
  FUNDING_TYPE_OPTIONS,
  FILTER_RANGES,
} from "../../constants/filter-options";

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

  const updateFilter = useCallback(
    (key: keyof FilterState, value: any) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      if (onFiltersChange) {
        onFiltersChange(newFilters);
      }
    },
    [filters, onFiltersChange]
  );

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
                    options={GROWTH_STAGE_OPTIONS}
                    placeholder="All stages"
                    value={filters.growthStage}
                    onChange={(value) => updateFilter("growthStage", value)}
                  />

                  <MobileSelectField
                    name="customerFocus"
                    label="Customer Focus"
                    options={CUSTOMER_FOCUS_OPTIONS}
                    placeholder="All customer types"
                    value={filters.customerFocus}
                    onChange={(value) => updateFilter("customerFocus", value)}
                  />

                  <MobileSelectField
                    name="fundingType"
                    label="Funding Type"
                    options={FUNDING_TYPE_OPTIONS}
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
                    min={FILTER_RANGES.rank.min}
                    max={FILTER_RANGES.rank.max}
                    minValue={filters.minRank ?? FILTER_RANGES.rank.min}
                    maxValue={filters.maxRank ?? FILTER_RANGES.rank.max}
                    onMinChange={(value) => updateFilter("minRank", value)}
                    onMaxChange={(value) => updateFilter("maxRank", value)}
                  />

                  <MobileFundingSliderField
                    minValue={filters.minFunding ?? FILTER_RANGES.funding.min}
                    maxValue={filters.maxFunding ?? FILTER_RANGES.funding.max}
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
