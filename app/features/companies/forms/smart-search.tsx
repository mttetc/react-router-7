import { useState, useRef, useCallback, useEffect } from "react";
import { Box, Input, HStack, Text, Badge, VStack, For } from "@chakra-ui/react";
import { FaSearch, FaMagic } from "react-icons/fa";
import { useDebounce } from "rooks";
import { useQueryState } from "nuqs";
import { useTextField } from "@react-aria/textfield";
import { useFocusRing } from "@react-aria/focus";
import { filtersSearchParams } from "@/lib/search-params";
import type { FilterState } from "@/lib/companies-client";
import { useCurrencyStore } from "@/stores/currency.store";
import { convertCurrency, convertToUSD } from "@/utils/currency-utils";
import {
  parseSmartSearch,
  type ParsedFilter,
} from "../utils/smart-search-utils";

// Export the search input value directly
let currentSearchInput = "";
let currentParsedFilters: any[] = [];

export const getCurrentSearchInput = () => currentSearchInput;
export const getCurrentParsedFilters = () => currentParsedFilters;

export const hasOnlyMagicFilters = () => {
  if (!currentSearchInput.trim()) return false;
  // If we have parsed filters and the remaining query after parsing is empty/minimal
  const { remainingQuery } = parseSmartSearch(currentSearchInput, "USD"); // Use USD as default
  return currentParsedFilters.length > 0 && !remainingQuery.trim();
};

export function SmartSearch() {
  const [search, setSearch] = useQueryState(
    "search",
    filtersSearchParams.search
  );
  const [, setGrowthStage] = useQueryState(
    "growthStage",
    filtersSearchParams.growthStage
  );
  const [, setCustomerFocus] = useQueryState(
    "customerFocus",
    filtersSearchParams.customerFocus
  );
  const [, setFundingType] = useQueryState(
    "fundingType",
    filtersSearchParams.fundingType
  );
  const [, setMinRank] = useQueryState("minRank", filtersSearchParams.minRank);
  const [, setMaxRank] = useQueryState("maxRank", filtersSearchParams.maxRank);
  const [, setMinFunding] = useQueryState(
    "minFunding",
    filtersSearchParams.minFunding
  );
  const [, setMaxFunding] = useQueryState(
    "maxFunding",
    filtersSearchParams.maxFunding
  );

  const [query, setQuery] = useState(search || "");
  const [parsedFilters, setParsedFilters] = useState<ParsedFilter[]>([]);
  const [immediateSearchState, setImmediateSearchState] = useState(
    search || ""
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const currentCurrency = useCurrencyStore((state) => state.selectedCurrency);

  // Clear input when search is cleared via active filter removal
  useEffect(() => {
    if (!search && currentSearchInput) {
      setQuery("");
      currentSearchInput = "";
      setParsedFilters([]);
    }
  }, [search]);

  const debouncedUpdateFilters = useDebounce(
    (allFilters: Partial<FilterState & { search: string }>) => {
      if (allFilters.search !== undefined) {
        setSearch(allFilters.search || null);
      }
      if (allFilters.growthStage !== undefined) {
        setGrowthStage(allFilters.growthStage || null);
      }
      if (allFilters.customerFocus !== undefined) {
        setCustomerFocus(allFilters.customerFocus || null);
      }
      if (allFilters.fundingType !== undefined) {
        setFundingType(allFilters.fundingType || null);
      }
      if (allFilters.minRank !== undefined) {
        setMinRank(allFilters.minRank);
      }
      if (allFilters.maxRank !== undefined) {
        setMaxRank(allFilters.maxRank);
      }
      if (allFilters.minFunding !== undefined) {
        setMinFunding(allFilters.minFunding);
      }
      if (allFilters.maxFunding !== undefined) {
        setMaxFunding(allFilters.maxFunding);
      }
    },
    300
  );

  const handleChange = (newQuery: string) => {
    setQuery(newQuery);
    currentSearchInput = newQuery; // Always show what's in the input

    if (newQuery.trim() === "") {
      setParsedFilters([]);
      currentParsedFilters = []; // Clear stored filters
      // Only clear the search, keep other filters intact
      debouncedUpdateFilters({
        search: "",
      });
    } else {
      const {
        filters,
        remainingQuery,
        parsedFilters: newParsedFilters,
      } = parseSmartSearch(newQuery, currentCurrency);

      setParsedFilters(newParsedFilters);
      currentParsedFilters = newParsedFilters; // Store for hasOnlyMagicFilters check

      // Keep the original query in search if there are magic filters
      const searchValue =
        newParsedFilters.length > 0 ? newQuery : remainingQuery.trim();

      debouncedUpdateFilters({
        ...filters,
        search: searchValue,
      });
    }
  };

  // Use React Aria text field for proper accessibility
  const { inputProps, descriptionProps } = useTextField(
    {
      label: "Smart search for companies",
      placeholder: "Search",
      value: query,
      onChange: handleChange,
      description:
        "Search by funding (1M, $5M+), stage (seed, series A), focus (B2B, B2C), or rank (top 100).",
    },
    inputRef
  );

  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <VStack align="stretch" gap={2}>
      <VStack align="start" gap={1}>
        <HStack gap={2}>
          <FaMagic size={12} color="purple.500" />
          <Text fontSize="xs" fontWeight="semibold" color="purple.600">
            Smart Search
          </Text>
        </HStack>
        <Text
          {...descriptionProps}
          fontSize="xs"
          color="gray.600"
          lineHeight="1.4"
        >
          Search by funding (1M, $5M+), stage (seed, series A), focus (B2B,
          B2C), or rank (top 100).
        </Text>
      </VStack>

      <HStack
        borderWidth={1}
        borderColor="gray.300"
        borderRadius="md"
        px={3}
        py={2}
        bg="gray.50"
        _focusWithin={{
          borderColor: "purple.500",
          boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
          bg: "white",
        }}
        minH="40px"
      >
        <FaSearch color="gray.400" style={{ fontSize: "14px" }} />
        <Input
          ref={inputRef}
          {...(inputProps as any)}
          {...(focusProps as any)}
          border="none"
          outline="none"
          _focus={{
            boxShadow: "none",
            outline: isFocusVisible
              ? "2px solid var(--chakra-colors-purple-500)"
              : "none",
            outlineOffset: "2px",
          }}
          _placeholder={{ color: "gray.400" }}
          fontSize="sm"
          bg="transparent"
          p={0}
          h="auto"
          flex={1}
        />
        {parsedFilters.length > 0 && (
          <FaMagic
            color="purple.500"
            title="Smart filters detected"
            size={12}
          />
        )}
      </HStack>

      {parsedFilters.length > 0 && (
        <HStack flexWrap="wrap" gap={1}>
          <Text fontSize="xs" color="gray.500">
            Detected:
          </Text>
          <For each={parsedFilters}>
            {(filter) => (
              <Badge
                key={`${filter.type}-${filter.value}`}
                colorPalette={filter.color}
                size="sm"
                variant="surface"
              >
                {filter.label}
              </Badge>
            )}
          </For>
        </HStack>
      )}
    </VStack>
  );
}
