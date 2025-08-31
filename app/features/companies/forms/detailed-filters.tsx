import { useState } from "react";
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
import { ClientOnly } from "~/components/ui/client-only";
import type { FilterState } from "~/services/companies.service";
import { SelectField } from "./select-field";
import { SliderField } from "./slider-field";
import { FundingSliderField } from "./funding-slider-field";
import { useFilterState } from "~/hooks/use-filter-state";

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

interface DetailedFiltersProps {
  defaultOpen?: boolean;
}

export function DetailedFilters({ defaultOpen = false }: DetailedFiltersProps) {
  const { filters } = useFilterState();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const hasActiveAdvancedFilters = Boolean(
    filters.growthStage ||
      filters.customerFocus ||
      filters.fundingType ||
      filters.minRank ||
      filters.maxRank ||
      filters.minFunding ||
      filters.maxFunding
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
                  <SelectField
                    name="growthStage"
                    label="Growth Stage"
                    options={growthStageOptions}
                    placeholder="All stages"
                    defaultValue={filters.growthStage}
                  />

                  <SelectField
                    name="customerFocus"
                    label="Customer Focus"
                    options={customerFocusOptions}
                    placeholder="All customer types"
                    defaultValue={filters.customerFocus}
                  />

                  <SelectField
                    name="fundingType"
                    label="Funding Type"
                    options={fundingTypeOptions}
                    placeholder="All funding types"
                    defaultValue={filters.fundingType}
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
                  <SliderField
                    name="rankRange"
                    label="Rank Range"
                    min={1}
                    max={5000}
                    minName="minRank"
                    maxName="maxRank"
                    minDefaultValue={filters.minRank || 1}
                    maxDefaultValue={filters.maxRank || 5000}
                  />

                  <ClientOnly
                    fallback={
                      <SliderField
                        name="fundingRange"
                        label="Funding Amount (USD)"
                        min={0}
                        max={100000000}
                        step={100000}
                        minName="minFunding"
                        maxName="maxFunding"
                        minDefaultValue={filters.minFunding || 0}
                        maxDefaultValue={filters.maxFunding || 100000000}
                        currency="USD"
                      />
                    }
                  >
                    <FundingSliderField />
                  </ClientOnly>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
}
