/**
 * Smart search parsing utilities
 */

import type { FilterState } from "@/features/companies/types/schemas";
import { convertToUSD } from "@/stores/currency-utils";

export interface ParsedFilter {
  type: string;
  value: string;
  label: string;
  color: string;
}

/**
 * Format currency label for display
 */
export function formatCurrencyLabel(
  value: number,
  type: "min" | "max",
  currency: string
): string {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
  return `${type === "min" ? "Min" : "Max"} ${formatted}`;
}

/**
 * Search patterns for smart search parsing
 */
export const SEARCH_PATTERNS = [
  // Funding patterns - supports $1M, 5M+, etc. with currency conversion
  // Negative lookbehind to avoid matching B2B, B2C patterns
  {
    // eslint-disable-next-line no-useless-escape
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

/**
 * Parse smart search query and extract filters
 */
export function parseSmartSearch(
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
        case "funding": {
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
        }

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
