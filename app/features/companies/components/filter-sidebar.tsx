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
              _focus={{
                borderColor: "brand.400",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
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
                      growthStage: details.value[0] || "" 
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
                      customerFocus: details.value[0] || "" 
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
                      fundingType: details.value[0] || "" 
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
                    colorPalette="brand"
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

              <Field.Root>
                <Field.Label fontSize="xs" color="gray.500">
                  Funding Amount (USD)
                </Field.Label>
                <Box w="100%">
                  <Slider.Root
                    width="100%"
                    min={0}
                    max={100000000}
                    step={100000}
                    colorPalette="brand"
                    value={[
                      filters.minFunding || 0,
                      filters.maxFunding || 100000000,
                    ]}
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
            </Stack>
          </Box>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
};