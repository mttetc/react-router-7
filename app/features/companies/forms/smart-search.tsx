import { useState, useRef, useCallback } from "react";
import {
  Box,
  Input,
  HStack,
  Text,
  Badge,
  VStack,
  Portal,
  Card,
  For,
} from "@chakra-ui/react";
import { FaSearch, FaMagic } from "react-icons/fa";
import { useDebounce } from "rooks";
import type { FilterState } from "../../../services/companies.service";
import { useFilterState } from "~/hooks/use-filter-state";

// Helper function to format currency amounts for labels
const formatCurrencyLabel = (value: number, type: "min" | "max"): string => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
  return `${type === "min" ? "Min" : "Max"} ${formatted}`;
};

interface SmartSearchProps {
  // No props needed - component manages its own state via nuqs
}

interface ParsedFilter {
  type: string;
  value: string;
  label: string;
  color: string;
}

// Smart search patterns
const SEARCH_PATTERNS = [
  // Funding patterns
  {
    pattern: /\$(\d+(?:\.\d+)?)\s*([kmb])?[\+\-]?/gi,
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

function parseSmartSearch(query: string): {
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
          if (query.includes("+") || query.includes("above")) {
            filters.minFunding = value;
            parsedFilters.push({
              type: "minFunding",
              value: value.toString(),
              label: formatCurrencyLabel(value, "min"),
              color: "green",
            });
          } else {
            filters.maxFunding = value;
            parsedFilters.push({
              type: "maxFunding",
              value: value.toString(),
              label: formatCurrencyLabel(value, "max"),
              color: "green",
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

export function SmartSearch({}: SmartSearchProps) {
  const { search, updateFilters } = useFilterState();
  const [query, setQuery] = useState(search);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [parsedFilters, setParsedFilters] = useState<ParsedFilter[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

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

    // Parse smart search
    const {
      filters,
      remainingQuery,
      parsedFilters: newParsedFilters,
    } = parseSmartSearch(newQuery);
    setParsedFilters(newParsedFilters);

    // Update filters with debounce
    debouncedUpdateFilters(filters, remainingQuery);
  };

  const suggestions = [
    "Series A companies",
    "B2B early stage",
    "$1M+ funding",
    "Seed stage B2C",
    "Top 100 companies",
    "Angel funded startups",
  ];

  return (
    <Box position="relative">
      <Box position="relative">
        <HStack
          borderWidth={1}
          borderColor="gray.300"
          borderRadius="lg"
          px={4}
          py={3}
          bg="white"
          _focusWithin={{
            borderColor: "purple.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
          }}
        >
          <FaSearch color="gray.400" />
          <Input
            ref={inputRef}
            placeholder="Search companies or try 'Series A B2B companies' or '$5M+ funding'..."
            value={query}
            onChange={handleChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            border="none"
            outline="none"
            _focus={{ boxShadow: "none" }}
            fontSize="sm"
          />
          {parsedFilters.length > 0 && (
            <FaMagic color="purple.500" title="Smart filters detected" />
          )}
        </HStack>

        {/* Parsed filters display */}
        {parsedFilters.length > 0 && (
          <HStack mt={2} flexWrap="wrap" gap={1}>
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
      </Box>

      {/* Search suggestions */}
      {showSuggestions && query.length === 0 && (
        <Portal>
          <Card.Root
            position="absolute"
            top="100%"
            left={0}
            right={0}
            mt={1}
            zIndex={1000}
            maxW="md"
            shadow="lg"
          >
            <Card.Body p={3}>
              <VStack align="start" gap={2}>
                <HStack gap={2} mb={2}>
                  <FaMagic size={12} color="purple.500" />
                  <Text fontSize="xs" fontWeight="semibold" color="purple.600">
                    Try smart search:
                  </Text>
                </HStack>
                <For each={suggestions}>
                  {(suggestion) => (
                    <Text
                      key={suggestion}
                      fontSize="sm"
                      color="gray.600"
                      cursor="pointer"
                      _hover={{ color: "purple.600", bg: "purple.50" }}
                      px={2}
                      py={1}
                      borderRadius="md"
                      onClick={() => {
                        setQuery(suggestion);
                        handleChange({
                          target: {
                            value: suggestion,
                          },
                        } as any);
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion}
                    </Text>
                  )}
                </For>
              </VStack>
            </Card.Body>
          </Card.Root>
        </Portal>
      )}
    </Box>
  );
}
