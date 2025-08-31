import {
  VStack,
  HStack,
  Text,
  Input,
  NumberInput,
  Button,
  Wrap,
  Badge,
  For,
  Select,
  Portal,
  createListCollection,
} from "@chakra-ui/react";
import { Tooltip } from "../../components/ui/tooltip";
import { useState, useEffect, useCallback } from "react";
import type { CompanyFilters } from "../../utils/companies.types";

// Collections for select components
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
    { value: "Series D", label: "🔢 Series D" },
    { value: "IPO", label: "📈 IPO" },
    { value: "Angel", label: "👼 Angel" },
    { value: "Convertible Note", label: "📝 Convertible Note" },
    { value: "Undisclosed", label: "🤐 Undisclosed" },
  ],
});

interface CompanySearchProps {
  filters?: CompanyFilters;
  onFiltersChange: (filters: CompanyFilters) => void;
}

export function CompanySearch({
  filters = {},
  onFiltersChange,
}: CompanySearchProps) {
  const [localFilters, setLocalFilters] = useState<CompanyFilters>(filters);
  const [searchValue, setSearchValue] = useState(filters?.search || "");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== (filters?.search || "")) {
        handleFilterChange("search", searchValue || undefined);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, filters?.search]);

  const handleFilterChange = useCallback(
    (key: keyof CompanyFilters, value: any) => {
      const newFilters = { ...localFilters, [key]: value };
      if (value === "" || value === undefined || value === null) {
        delete newFilters[key];
      }
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [localFilters, onFiltersChange]
  );

  const clearFilters = useCallback(() => {
    setLocalFilters({});
    setSearchValue("");
    onFiltersChange({});
  }, [onFiltersChange]);

  const removeFilter = useCallback(
    (key: keyof CompanyFilters) => {
      const newFilters = { ...localFilters };
      delete newFilters[key];
      if (key === "search") {
        setSearchValue("");
      }
      setLocalFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [localFilters, onFiltersChange]
  );

  const hasActiveFilters = Object.keys(filters || {}).length > 0;

  return (
    <VStack gap={6} align="stretch">
      {/* Header */}
      <VStack gap={2} align="start">
        <HStack justify="space-between" w="full">
          <Text fontSize="lg" fontWeight="semibold">
            Filters
          </Text>
          {hasActiveFilters && (
            <Tooltip
              content="Remove all active filters"
              positioning={{ placement: "top" }}
            >
              <Button size="sm" variant="ghost" onClick={clearFilters}>
                Clear All
              </Button>
            </Tooltip>
          )}
        </HStack>

        {/* Active Filters */}
        {hasActiveFilters && (
          <Wrap gap={2}>
            <For each={Object.entries(filters || {})}>
              {([key, value]) => (
                <Tooltip
                  key={key}
                  content={`Click to remove ${key} filter`}
                  positioning={{ placement: "top" }}
                >
                  <Badge
                    size="sm"
                    colorPalette="brand"
                    variant="solid"
                    cursor="pointer"
                    onClick={() => removeFilter(key as keyof CompanyFilters)}
                    _hover={{ opacity: 0.8 }}
                  >
                    {key === "search" ? `"${value}"` : `${key}: ${value}`} ✕
                  </Badge>
                </Tooltip>
              )}
            </For>
          </Wrap>
        )}
      </VStack>

      {/* Filter Controls */}
      <VStack gap={4} align="stretch">
        {/* Search */}
        <VStack gap={2} align="start">
          <Text fontSize="sm" fontWeight="medium">
            Search
          </Text>
          <Input
            placeholder="Company name, domain, or description..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            size="sm"
            borderRadius="lg"
          />
        </VStack>

        {/* Growth Stage */}
        <VStack gap={2} align="start">
          <Text fontSize="sm" fontWeight="medium">
            Growth Stage
          </Text>
          <Select.Root
            collection={growthStageCollection}
            size="sm"
            value={filters?.growth_stage ? [filters.growth_stage] : []}
            onValueChange={(details) => {
              handleFilterChange("growth_stage", details.value[0] || undefined);
            }}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Any stage" />
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
        </VStack>

        {/* Customer Focus */}
        <VStack gap={2} align="start">
          <Text fontSize="sm" fontWeight="medium">
            Customer Focus
          </Text>
          <Select.Root
            collection={customerFocusCollection}
            size="sm"
            value={filters?.customer_focus ? [filters.customer_focus] : []}
            onValueChange={(details) => {
              handleFilterChange("customer_focus", details.value[0] || undefined);
            }}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Any focus" />
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
        </VStack>

        {/* Rank Range */}
        <VStack gap={2} align="start">
          <Text fontSize="sm" fontWeight="medium">
            Rank Range
          </Text>
          <HStack gap={2}>
            <NumberInput.Root
              min={1}
              value={filters?.min_rank?.toString() || ""}
              onValueChange={(details) =>
                handleFilterChange(
                  "min_rank",
                  details.valueAsNumber || undefined
                )
              }
            >
              <NumberInput.Input />
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
            </NumberInput.Root>
            <Text fontSize="sm" color="gray.500">
              to
            </Text>
            <NumberInput.Root
              min={1}
              value={filters?.max_rank?.toString() || ""}
              onValueChange={(details) =>
                handleFilterChange(
                  "max_rank",
                  details.valueAsNumber || undefined
                )
              }
            >
              <NumberInput.Input />
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
            </NumberInput.Root>
          </HStack>
        </VStack>

        {/* Last Funding Type */}
        <VStack gap={2} align="start">
          <Text fontSize="sm" fontWeight="medium">
            Last Funding Type
          </Text>
          <Select.Root
            collection={fundingTypeCollection}
            size="sm"
            value={filters?.last_funding_type ? [filters.last_funding_type] : []}
            onValueChange={(details) => {
              handleFilterChange(
                "last_funding_type",
                details.value[0] || undefined
              );
            }}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Any funding type" />
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
        </VStack>

        {/* Funding Amount Range */}
        <VStack gap={2} align="start">
          <Text fontSize="sm" fontWeight="medium">
            Funding Amount (USD)
          </Text>
          <HStack gap={2}>
            <NumberInput.Root
              min={0}
              value={filters?.min_funding?.toString() || ""}
              onValueChange={(details) =>
                handleFilterChange(
                  "min_funding",
                  details.valueAsNumber || undefined
                )
              }
            >
              <NumberInput.ValueText />
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
            </NumberInput.Root>
            <Text fontSize="sm" color="gray.500">
              to
            </Text>
            <NumberInput.Root
              min={0}
              value={filters?.max_funding?.toString() || ""}
              onValueChange={(details) =>
                handleFilterChange(
                  "max_funding",
                  details.valueAsNumber || undefined
                )
              }
            >
              <NumberInput.ValueText />
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
            </NumberInput.Root>
          </HStack>
        </VStack>
      </VStack>
    </VStack>
  );
}
