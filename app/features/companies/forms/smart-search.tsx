import { useState, useRef, useCallback, useEffect } from "react";
import { Box, Input, HStack, Text, Badge, VStack, For } from "@chakra-ui/react";
import { FaSearch, FaMagic } from "react-icons/fa";
import { useDebounce } from "rooks";
import { useQueryState } from "nuqs";
import { filtersSearchParams } from "@/lib/search-params";
import type { FilterState } from "@/services/companies.service";
import { useCurrencyStore } from "@/stores/currency.store";
import { convertCurrency, convertToUSD } from "@/utils/currency-utils";

// Export the search input value directly
let currentSearchInput = "";
let currentParsedFilters: any[] = [];
export const getCurrentSearchInput = () => currentSearchInput;
export const hasOnlyMagicFilters = () => {
  if (!currentSearchInput.trim()) return false;
  // If we have parsed filters and the remaining query after parsing is empty/minimal
  const { remainingQuery } = parseSmartSearch(currentSearchInput, "USD"); // Use USD as default
  return currentParsedFilters.length > 0 && !remainingQuery.trim();
};

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

interface ParsedFilter {
  type: string;
  value: string;
  label: string;
  color: string;
}

const SEARCH_PATTERNS = [
  // Funding patterns - supports $1M, 5M+, etc. with currency conversion
  // Negative lookbehind to avoid matching B2B, B2C patterns
  {
    pattern: /(?<![a-zA-Z])\$?(\d+(?:\.\d+)?)\s*([kmb])[\+\-]?/gi,
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

  {
    pattern: /\b(early|seed|growing|late|exit)\s*(stage)?\b/gi,
    type: "growthStage",
  },

  {
    pattern: /\b(b2b|b2c|business|consumer)\b/gi,
    type: "customerFocus",
    map: {
      business: "b2b",
      consumer: "b2c",
    },
  },

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

      switch (type) {
        case "funding":
          // Convert user currency to USD since backend data is in USD
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

  // Always include the remaining query as the search term
  filters.search = remainingQuery.trim();

  return { filters, remainingQuery, parsedFilters };
}

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
    async (allFilters: Partial<FilterState & { search: string }>) => {
      if (allFilters.search !== undefined) setSearch(allFilters.search || null);
      if (allFilters.growthStage !== undefined)
        setGrowthStage(allFilters.growthStage || null);
      if (allFilters.customerFocus !== undefined)
        setCustomerFocus(allFilters.customerFocus || null);
      if (allFilters.fundingType !== undefined)
        setFundingType(allFilters.fundingType || null);
      if (allFilters.minRank !== undefined) setMinRank(allFilters.minRank);
      if (allFilters.maxRank !== undefined) setMaxRank(allFilters.maxRank);
      if (allFilters.minFunding !== undefined)
        setMinFunding(allFilters.minFunding);
      if (allFilters.maxFunding !== undefined)
        setMaxFunding(allFilters.maxFunding);
    },
    300
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
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

  return (
    <VStack align="stretch" gap={2}>
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
          id="smart-search-input"
          name="smart-search"
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
          aria-label="Smart search for companies"
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
