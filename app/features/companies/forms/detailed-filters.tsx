import { useState } from "react";
import { useQueryState } from "nuqs";
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
import { ClientOnly } from "@/components/ui/client-only";
import { SelectField } from "./select-field";
import { SliderField } from "./slider-field";
import { FundingSliderField } from "./funding-slider-field";
import {
  growthStageParser,
  customerFocusParser,
  fundingTypeParser,
  filtersSearchParams,
} from "@/lib/search-params";
import {
  GROWTH_STAGE_OPTIONS,
  CUSTOMER_FOCUS_OPTIONS,
  FUNDING_TYPE_OPTIONS,
  FILTER_RANGES,
} from "../constants/filter-options";

interface DetailedFiltersProps {
  defaultOpen?: boolean;
}

export function DetailedFilters({ defaultOpen = false }: DetailedFiltersProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Get current filter values to detect active state
  const [growthStage] = useQueryState(
    "growthStage",
    filtersSearchParams.growthStage
  );
  const [customerFocus] = useQueryState(
    "customerFocus",
    filtersSearchParams.customerFocus
  );
  const [fundingType] = useQueryState(
    "fundingType",
    filtersSearchParams.fundingType
  );
  const [minRank] = useQueryState("minRank", filtersSearchParams.minRank);
  const [maxRank] = useQueryState("maxRank", filtersSearchParams.maxRank);
  const [minFunding] = useQueryState(
    "minFunding",
    filtersSearchParams.minFunding
  );
  const [maxFunding] = useQueryState(
    "maxFunding",
    filtersSearchParams.maxFunding
  );

  // Check if any advanced filters are active
  const hasActiveAdvancedFilters = !!(
    growthStage ||
    customerFocus ||
    fundingType ||
    minRank ||
    maxRank ||
    minFunding ||
    maxFunding
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
                    options={GROWTH_STAGE_OPTIONS}
                    placeholder="All stages"
                    parser={growthStageParser}
                  />

                  <SelectField
                    name="customerFocus"
                    label="Customer Focus"
                    options={CUSTOMER_FOCUS_OPTIONS}
                    placeholder="All customer types"
                    parser={customerFocusParser}
                  />

                  <SelectField
                    name="fundingType"
                    label="Funding Type"
                    options={FUNDING_TYPE_OPTIONS}
                    placeholder="All funding types"
                    parser={fundingTypeParser}
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
                    minDefaultValue={1}
                    maxDefaultValue={5000}
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
                        minDefaultValue={0}
                        maxDefaultValue={100000000}
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
