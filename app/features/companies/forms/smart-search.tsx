import { useState, useRef, useCallback } from "react";
import { Box, Input, HStack, Text, Badge, VStack, For } from "@chakra-ui/react";
import { FaSearch, FaMagic } from "react-icons/fa";
import { useDebounce } from "rooks";
import type { FilterState } from "../../../services/companies.service";
import { useFilterState } from "~/hooks/use-filter-state";
import { useCurrencyStore } from "~/stores/currency.store";
import { convertCurrency, convertToUSD } from "~/utils/currency.utils";

// Helper function to format currency amounts for labels
const formatCurrencyLabel = (
  value: number,
  type: "min" | "max",
  currency: string
): string => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
  return `${type === "min" ? "Min" : "Max"} ${formatted}`;
};

interface SmartSearchProps {
  filterState: ReturnType<
    typeof import("~/hooks/use-filter-state").useFilterState
  >;
}

interface ParsedFilter {
  type: string;
  value: string;
  label: string;
  color: string;
}

// Smart search patterns
const SEARCH_PATTERNS = [
  // Funding patterns - works with or without $ symbol
  {
    pattern: /\$?(\d+(?:\.\d+)?)\s*([kmb])[\+\-]?/gi,
    type: "funding",
    extract: (match: RegExpMatchArray) => {
      const amount = parseFloat(match[1]);
      const unit = match[2]?.toLowerCase();
      const multiplier =
        unit === "k"
          ? 1000
          : unit === "m"
          ? 1000000
          : unit === "b"
          ? 1000000000
          : 1;
      return amount * multiplier;
    },
  },

  // Growth stage patterns
  {
    pattern: /\b(early|seed|growing|late|exit)\s*(stage)?\b/gi,
    type: "growthStage",
  },

  // Customer focus patterns
  {
    pattern: /\b(b2b|b2c|business|consumer)\b/gi,
    type: "customerFocus",
    map: {
      business: "b2b",
      consumer: "b2c",
    },
  },

  // Funding type patterns
  {
    pattern: /\b(series\s*[a-z]|seed|angel|grant|debt|convertible|ipo)\b/gi,
    type: "fundingType",
    map: {
      "series a": "Series A",
      "series b": "Series B",
      "series c": "Series C",
      seed: "Seed",
      angel: "Angel",
      grant: "Grant",
      debt: "Debt Financing",
      convertible: "Convertible Note",
      ipo: "Initial Coin Offering",
    },
  },

  // Rank patterns
  { pattern: /\b(?:rank|position|top)\s*(\d+)/gi, type: "rank" },
];

function parseSmartSearch(
  query: string,
  currentCurrency: string
): {
  filters: Partial<FilterState>;
  remainingQuery: string;
  parsedFilters: ParsedFilter[];
} {
  let remainingQuery = query;
  const filters: Partial<FilterState> = {};
  const parsedFilters: ParsedFilter[] = [];

  SEARCH_PATTERNS.forEach(({ pattern, type, extract, map }) => {
    const matches = [...query.matchAll(pattern)];

    matches.forEach((match) => {
      let value: any = match[1] || match[0];

      if (extract) {
        value = extract(match);
      } else if (map) {
        const mappedValue = (map as any)[value.toLowerCase()];
        value = mappedValue || value;
      }

      // Apply filters based on type
      switch (type) {
        case "funding":
          // Convert from user's currency to USD for filtering (data is stored in USD)
          // User types "1M" in EUR, we need to convert 1M EUR to USD
          const usdAmount = convertToUSD(value, currentCurrency);

          if (query.includes("+") || query.includes("above")) {
            filters.minFunding = usdAmount;
            parsedFilters.push({
              type: "minFunding",
              value: value.toString(),
              label: formatCurrencyLabel(value, "min", currentCurrency),
              color: "orange",
            });
          } else {
            filters.maxFunding = usdAmount;
            parsedFilters.push({
              type: "maxFunding",
              value: value.toString(),
              label: formatCurrencyLabel(value, "max", currentCurrency),
              color: "orange",
            });
          }
          break;

        case "growthStage":
          filters.growthStage = value.toLowerCase();
          parsedFilters.push({
            type: "growthStage",
            value: value.toLowerCase(),
            label: `${value} Stage`,
            color: "blue",
          });
          break;

        case "customerFocus":
          filters.customerFocus = value.toLowerCase();
          parsedFilters.push({
            type: "customerFocus",
            value: value.toLowerCase(),
            label: value.toUpperCase(),
            color: "purple",
          });
          break;

        case "fundingType":
          filters.fundingType = value;
          parsedFilters.push({
            type: "fundingType",
            value: value,
            label: value,
            color: "orange",
          });
          break;

        case "rank":
          filters.maxRank = parseInt(value);
          parsedFilters.push({
            type: "maxRank",
            value: value,
            label: `Top ${value}`,
            color: "yellow",
          });
          break;
      }

      // Remove matched text from remaining query
      remainingQuery = remainingQuery.replace(match[0], "").trim();
    });
  });

  return { filters, remainingQuery, parsedFilters };
}

export function SmartSearch({ filterState }: SmartSearchProps) {
  const { search, updateFilters, resetFilters } = filterState;
  const [query, setQuery] = useState(search);
  const [parsedFilters, setParsedFilters] = useState<ParsedFilter[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentCurrency = useCurrencyStore((state) => state.selectedCurrency);

  // Debounced function to update filters
  const debouncedUpdateFilters = useDebounce(
    async (filters: Partial<FilterState>, remainingQuery: string) => {
      await updateFilters({
        ...filters,
        search: remainingQuery,
      });
    },
    300
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (newQuery.trim() === "") {
      // If input is empty, clear all smart search filters
      setParsedFilters([]);
      debouncedUpdateFilters(
        {
          search: "",
          // Clear smart search related filters
          growthStage: "",
          customerFocus: "",
          fundingType: "",
          minFunding: null,
          maxFunding: null,
          minRank: null,
          maxRank: null,
        },
        ""
      );
    } else {
      // Parse smart search
      const {
        filters,
        remainingQuery,
        parsedFilters: newParsedFilters,
      } = parseSmartSearch(newQuery, currentCurrency);
      setParsedFilters(newParsedFilters);

      // Update filters with debounce
      debouncedUpdateFilters(filters, remainingQuery);
    }
  };

  return (
    <VStack align="stretch" gap={2}>
      {/* Explanatory text */}
      <VStack align="start" gap={1}>
        <HStack gap={2}>
          <FaMagic size={12} color="purple.500" />
          <Text fontSize="xs" fontWeight="semibold" color="purple.600">
            Smart Search
          </Text>
        </HStack>
        <Text fontSize="xs" color="gray.600" lineHeight="1.4">
          Type keywords to automatically filter companies. Try terms like
          funding amounts (1M, $5M+), growth stages (seed, series A), customer
          focus (B2B, B2C), or company rankings (top 100).
        </Text>
      </VStack>

      {/* Search input */}
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
        <FaSearch color="gray.400" size={14} />
        <Input
          ref={inputRef}
          placeholder="Search"
          value={query}
          onChange={handleChange}
          border="none"
          outline="none"
          _focus={{ boxShadow: "none" }}
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

      {/* Detected filters display */}
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
