import {
  Badge,
  Box,
  Card,
  Field,
  For,
  HStack,
  Input,
  Portal,
  Select,
  Separator,
  Slider,
  Stack,
  Text,
  createListCollection,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { useColorModeValue } from "../../../components/ui/color-mode";
import type { FilterState } from "../../../services/companies.service";
import { useCurrency } from "../../../stores/currency.store";
import {
  convertCurrency,
  convertToUSD,
  getCurrencySymbol,
  getCurrencyName,
} from "../../../utils/currency.utils";
import { ClientOnly } from "../../../components/ui/client-only";

// Data collections for Chakra UI Select
const growthStageCollection = createListCollection({
  items: [
    { value: "early", label: "🌱 Early" },
    { value: "seed", label: "🌿 Seed" },
    { value: "growing", label: "🌳 Growing" },
    { value: "late", label: "🏢 Late" },
    { value: "exit", label: "🚀 Exit" },
  ],
});

const customerFocusCollection = createListCollection({
  items: [
    { value: "b2b", label: "🏢 B2B" },
    { value: "b2c", label: "👥 B2C" },
    { value: "b2b_b2c", label: "🔄 B2B & B2C" },
    { value: "b2c_b2b", label: "🔄 B2C & B2B" },
  ],
});

const fundingTypeCollection = createListCollection({
  items: [
    { value: "Seed", label: "🌱 Seed" },
    { value: "Series A", label: "🅰️ Series A" },
    { value: "Series B", label: "🅱️ Series B" },
    { value: "Series C", label: "©️ Series C" },
    { value: "Angel", label: "👼 Angel" },
    { value: "Convertible Note", label: "📝 Convertible Note" },
    { value: "Undisclosed", label: "🤐 Undisclosed" },
  ],
});

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
}

// Component for the funding amount field that needs client-side currency
function FundingAmountField({
  filters,
  onFilterChange,
}: {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
}) {
  const { getEffectiveCurrency } = useCurrency();

  const currentCurrency = getEffectiveCurrency();
  const currencySymbol = getCurrencySymbol(currentCurrency);

  // Convert USD amounts to user's currency for display
  const convertToUserCurrency = (usdAmount: number) => {
    return convertCurrency(usdAmount, currentCurrency);
  };

  // Convert user currency amounts back to USD for API
  const convertUserCurrencyToUSD = (userCurrencyAmount: number) => {
    return convertToUSD(userCurrencyAmount, currentCurrency);
  };

  // Convert slider values (USD) to display values (user currency)
  const minFundingDisplay = filters.minFunding
    ? convertToUserCurrency(filters.minFunding)
    : 0;
  const maxFundingDisplay = filters.maxFunding
    ? convertToUserCurrency(filters.maxFunding)
    : convertToUserCurrency(100000000);
  const maxSliderValue = convertToUserCurrency(100000000);

  return (
    <Field.Root>
      <Field.Label fontSize="xs" color="gray.500">
        Funding Amount ({currentCurrency})
      </Field.Label>
      <Box w="100%">
        <Slider.Root
          width="100%"
          min={0}
          max={maxSliderValue}
          cursor="pointer"
          step={convertToUserCurrency(100000)} // Convert step to user currency
          colorPalette="purple"
          value={[minFundingDisplay, maxFundingDisplay]}
          onValueChange={(details) => {
            const [minUser, maxUser] = details.value;
            // Convert back to USD for the API
            const minUSD =
              minUser === 0 ? null : convertUserCurrencyToUSD(minUser);
            const maxUSD =
              maxUser === maxSliderValue
                ? null
                : convertUserCurrencyToUSD(maxUser);
            onFilterChange({
              minFunding: minUSD,
              maxFunding: maxUSD,
            });
          }}
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs />
          </Slider.Control>
        </Slider.Root>
        <HStack justify="space-between" mt={2}>
          <Text fontSize="xs" color="gray.500">
            {minFundingDisplay > 0
              ? `${currencySymbol}${(minFundingDisplay / 1000000).toFixed(1)}M`
              : `${currencySymbol}0`}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {maxFundingDisplay < maxSliderValue
              ? `${currencySymbol}${(maxFundingDisplay / 1000000).toFixed(1)}M`
              : `${currencySymbol}${(maxSliderValue / 1000000).toFixed(0)}M`}
          </Text>
        </HStack>
      </Box>
    </Field.Root>
  );
}

// SSR-safe fallback component
function FundingAmountFieldFallback({
  filters,
  onFilterChange,
}: {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
}) {
  return (
    <Field.Root>
      <Field.Label fontSize="xs" color="gray.500">
        Funding Amount (USD)
      </Field.Label>
      <Box w="100%">
        <Slider.Root
          width="100%"
          min={0}
          max={100000000}
          cursor="pointer"
          step={100000}
          colorPalette="purple"
          value={[filters.minFunding || 0, filters.maxFunding || 100000000]}
          onValueChange={(details) => {
            const [min, max] = details.value;
            onFilterChange({
              minFunding: min === 0 ? null : min,
              maxFunding: max === 100000000 ? null : max,
            });
          }}
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs />
          </Slider.Control>
        </Slider.Root>
        <HStack justify="space-between" mt={2}>
          <Text fontSize="xs" color="gray.500">
            {filters.minFunding
              ? `$${(filters.minFunding / 1000000).toFixed(1)}M`
              : "$0"}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {filters.maxFunding
              ? `$${(filters.maxFunding / 1000000).toFixed(1)}M`
              : "$100M"}
          </Text>
        </HStack>
      </Box>
    </Field.Root>
  );
}

export const FilterSidebar = ({
  filters,
  onFilterChange,
}: FilterSidebarProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Card.Root
      bg={bgColor}
      borderColor={borderColor}
      h="fit-content"
      position="sticky"
      top="80px"
    >
      <Card.Body>
        <Stack gap={6}>
          {/* Search */}
          <Field.Root>
            <Field.Label fontSize="sm" fontWeight="semibold" color="gray.600">
              <HStack gap={2}>
                <FaSearch />
                <Text>Search</Text>
              </HStack>
            </Field.Label>
            <Input
              placeholder="Search companies, domains, descriptions..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              borderRadius="md"
              size="sm"
            />
          </Field.Root>

          <Separator />

          {/* Categories */}
          <Box>
            <Stack gap={4}>
              <Field.Root>
                <Field.Label fontSize="xs" color="gray.500">
                  Growth Stage
                </Field.Label>
                <Select.Root
                  collection={growthStageCollection}
                  size="sm"
                  value={filters.growthStage ? [filters.growthStage] : []}
                  onValueChange={(details) => {
                    onFilterChange({
                      growthStage: details.value[0] || "",
                    });
                  }}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="All stages" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        <For each={growthStageCollection.items}>
                          {(item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          )}
                        </For>
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label fontSize="xs" color="gray.500">
                  Customer Focus
                </Field.Label>
                <Select.Root
                  collection={customerFocusCollection}
                  size="sm"
                  value={filters.customerFocus ? [filters.customerFocus] : []}
                  onValueChange={(details) => {
                    onFilterChange({
                      customerFocus: details.value[0] || "",
                    });
                  }}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="All customer types" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        <For each={customerFocusCollection.items}>
                          {(item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          )}
                        </For>
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label fontSize="xs" color="gray.500">
                  Funding Type
                </Field.Label>
                <Select.Root
                  collection={fundingTypeCollection}
                  size="sm"
                  value={filters.fundingType ? [filters.fundingType] : []}
                  onValueChange={(details) => {
                    onFilterChange({
                      fundingType: details.value[0] || "",
                    });
                  }}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="All funding types" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        <For each={fundingTypeCollection.items}>
                          {(item) => (
                            <Select.Item item={item} key={item.value}>
                              {item.label}
                              <Select.ItemIndicator />
                            </Select.Item>
                          )}
                        </For>
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </Field.Root>
            </Stack>
          </Box>

          <Separator />

          {/* Ranges */}
          <Box>
            <Stack gap={4}>
              <Field.Root>
                <Field.Label fontSize="xs" color="gray.500">
                  Rank Range
                </Field.Label>
                <Box w="100%">
                  <Slider.Root
                    width="100%"
                    min={1}
                    max={10000}
                    colorPalette="purple"
                    cursor="pointer"
                    value={[filters.minRank || 1, filters.maxRank || 10000]}
                    onValueChange={(details) => {
                      const [min, max] = details.value;
                      onFilterChange({
                        minRank: min === 1 ? null : min,
                        maxRank: max === 10000 ? null : max,
                      });
                    }}
                  >
                    <Slider.Control>
                      <Slider.Track>
                        <Slider.Range />
                      </Slider.Track>
                      <Slider.Thumbs />
                    </Slider.Control>
                  </Slider.Root>
                  <HStack justify="space-between" mt={2}>
                    <Text fontSize="xs" color="gray.500">
                      {filters.minRank || 1}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {filters.maxRank || 10000}
                    </Text>
                  </HStack>
                </Box>
              </Field.Root>

              <ClientOnly
                fallback={
                  <FundingAmountFieldFallback
                    filters={filters}
                    onFilterChange={onFilterChange}
                  />
                }
              >
                <FundingAmountField
                  filters={filters}
                  onFilterChange={onFilterChange}
                />
              </ClientOnly>
            </Stack>
          </Box>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};
