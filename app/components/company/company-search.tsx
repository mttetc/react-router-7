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
} from "@chakra-ui/react";
import { Tooltip } from "../../components/ui/tooltip";
import { useState, useEffect, useCallback } from "react";
import type { CompanyFilters } from "../../utils/companies.types";

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
                    colorPalette="blue"
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
          <select
            value={filters?.growth_stage || ""}
            onChange={(e: any) =>
              handleFilterChange("growth_stage", e.target.value || undefined)
            }
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              width: "100%",
              fontSize: "14px",
            }}
          >
            <option value="">Any stage</option>
            <option value="seed">Seed</option>
            <option value="early">Early</option>
            <option value="growing">Growing</option>
            <option value="late">Late</option>
            <option value="exit">Exit</option>
          </select>
        </VStack>

        {/* Customer Focus */}
        <VStack gap={2} align="start">
          <Text fontSize="sm" fontWeight="medium">
            Customer Focus
          </Text>
          <select
            value={filters?.customer_focus || ""}
            onChange={(e: any) =>
              handleFilterChange("customer_focus", e.target.value || undefined)
            }
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              width: "100%",
              fontSize: "14px",
            }}
          >
            <option value="">Any focus</option>
            <option value="b2b">B2B</option>
            <option value="b2c">B2C</option>
            <option value="b2b_b2c">B2B & B2C</option>
            <option value="b2c_b2b">B2C & B2B</option>
          </select>
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
              min={1}
              value={filters?.max_rank?.toString() || ""}
              onValueChange={(details) =>
                handleFilterChange(
                  "max_rank",
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

        {/* Last Funding Type */}
        <VStack gap={2} align="start">
          <Text fontSize="sm" fontWeight="medium">
            Last Funding Type
          </Text>
          <select
            value={filters?.last_funding_type || ""}
            onChange={(e: any) =>
              handleFilterChange(
                "last_funding_type",
                e.target.value || undefined
              )
            }
            style={{
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #e2e8f0",
              width: "100%",
              fontSize: "14px",
            }}
          >
            <option value="">Any funding type</option>
            <option value="Angel">Angel</option>
            <option value="Convertible Note">Convertible Note</option>
            <option value="Seed">Seed</option>
            <option value="Series A">Series A</option>
            <option value="Series B">Series B</option>
            <option value="Series C">Series C</option>
            <option value="Series D">Series D</option>
            <option value="IPO">IPO</option>
          </select>
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
