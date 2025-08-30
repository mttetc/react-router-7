import {
  VStack,
  HStack,
  Text,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Wrap,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";
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
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <VStack spacing={2} align="start">
        <HStack justify="space-between" w="full">
          <Text fontSize="lg" fontWeight="semibold">
            Filters
          </Text>
          {hasActiveFilters && (
            <Button size="sm" variant="ghost" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </HStack>

        {/* Active Filters */}
        {hasActiveFilters && (
          <Wrap spacing={2}>
            {Object.entries(filters || {}).map(([key, value]) => (
              <Tag key={key} size="sm" colorScheme="blue" variant="solid">
                <TagLabel>
                  {key === "search" ? `"${value}"` : `${key}: ${value}`}
                </TagLabel>
                <TagCloseButton
                  onClick={() => removeFilter(key as keyof CompanyFilters)}
                />
              </Tag>
            ))}
          </Wrap>
        )}
      </VStack>

      {/* Filter Controls */}
      <VStack spacing={4} align="stretch">
        {/* Search */}
        <VStack spacing={2} align="start">
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
        <VStack spacing={2} align="start">
          <Text fontSize="sm" fontWeight="medium">
            Growth Stage
          </Text>
          <Select
            placeholder="Any stage"
            value={filters?.growth_stage || ""}
            onChange={(e) =>
              handleFilterChange("growth_stage", e.target.value || undefined)
            }
            size="sm"
          >
            <option value="seed">Seed</option>
            <option value="early">Early</option>
            <option value="growing">Growing</option>
            <option value="late">Late</option>
            <option value="exit">Exit</option>
          </Select>
        </VStack>

        {/* Customer Focus */}
        <VStack spacing={2} align="start">
          <Text fontSize="sm" fontWeight="medium">
            Customer Focus
          </Text>
          <Select
            placeholder="Any focus"
            value={filters?.customer_focus || ""}
            onChange={(e) =>
              handleFilterChange("customer_focus", e.target.value || undefined)
            }
            size="sm"
          >
            <option value="b2b">B2B</option>
            <option value="b2c">B2C</option>
            <option value="b2b_b2c">B2B & B2C</option>
            <option value="b2c_b2b">B2C & B2B</option>
          </Select>
        </VStack>

        {/* Rank Range */}
        <VStack spacing={2} align="start">
          <Text fontSize="sm" fontWeight="medium">
            Rank Range
          </Text>
          <HStack spacing={2}>
            <NumberInput
              size="sm"
              min={1}
              value={filters?.min_rank || ""}
              onChange={(_, value) =>
                handleFilterChange("min_rank", isNaN(value) ? undefined : value)
              }
            >
              <NumberInputField placeholder="Min" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="sm" color="gray.500">
              to
            </Text>
            <NumberInput
              size="sm"
              min={1}
              value={filters?.max_rank || ""}
              onChange={(_, value) =>
                handleFilterChange("max_rank", isNaN(value) ? undefined : value)
              }
            >
              <NumberInputField placeholder="Max" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
        </VStack>

        {/* Last Funding Type */}
        <VStack spacing={2} align="start">
          <Text fontSize="sm" fontWeight="medium">
            Last Funding Type
          </Text>
          <Select
            placeholder="Any funding type"
            value={filters?.last_funding_type || ""}
            onChange={(e) =>
              handleFilterChange(
                "last_funding_type",
                e.target.value || undefined
              )
            }
            size="sm"
          >
            <option value="Angel">Angel</option>
            <option value="Convertible Note">Convertible Note</option>
            <option value="Seed">Seed</option>
            <option value="Series A">Series A</option>
            <option value="Series B">Series B</option>
            <option value="Series C">Series C</option>
            <option value="Series D">Series D</option>
            <option value="IPO">IPO</option>
          </Select>
        </VStack>

        {/* Funding Amount Range */}
        <VStack spacing={2} align="start">
          <Text fontSize="sm" fontWeight="medium">
            Funding Amount (USD)
          </Text>
          <HStack spacing={2}>
            <NumberInput
              size="sm"
              min={0}
              value={filters?.min_funding || ""}
              onChange={(_, value) =>
                handleFilterChange(
                  "min_funding",
                  isNaN(value) ? undefined : value
                )
              }
            >
              <NumberInputField placeholder="Min" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text fontSize="sm" color="gray.500">
              to
            </Text>
            <NumberInput
              size="sm"
              min={0}
              value={filters?.max_funding || ""}
              onChange={(_, value) =>
                handleFilterChange(
                  "max_funding",
                  isNaN(value) ? undefined : value
                )
              }
            >
              <NumberInputField placeholder="Max" />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
        </VStack>
      </VStack>
    </VStack>
  );
}
