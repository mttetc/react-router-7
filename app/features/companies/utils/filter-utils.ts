import { useMemo } from "react";
import type { FilterState } from "@/features/companies/api/companies-client";
import { useCurrencyStore } from "@/stores/currency.store";
import { convertCurrency, getCurrencySymbol } from "@/stores/currency-utils";

export const useActiveFilters = (filters: FilterState) => {
  const currentCurrency = useCurrencyStore((state) => state.selectedCurrency);

  // Helper function to format funding amounts in user's currency
  const formatFundingForDisplay = (amountUSD: number): string => {
    const targetCurrency = currentCurrency;
    const convertedAmount = convertCurrency(amountUSD, targetCurrency);

    // Format with appropriate currency symbol
    if (convertedAmount >= 1000000) {
      return `${(convertedAmount / 1000000).toFixed(1)}M ${getCurrencySymbol(
        targetCurrency
      )}`;
    }
    if (convertedAmount >= 1000) {
      return `${(convertedAmount / 1000).toFixed(0)}K ${getCurrencySymbol(
        targetCurrency
      )}`;
    }
    return `${convertedAmount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${getCurrencySymbol(
      targetCurrency
    )}`;
  };

  return useMemo(() => {
    const active = [];
    if (filters.search)
      active.push({ key: "search", label: `Search: "${filters.search}"` });
    if (filters.growthStage)
      active.push({
        key: "growthStage",
        label: `Stage: ${filters.growthStage}`,
      });
    if (filters.customerFocus)
      active.push({
        key: "customerFocus",
        label: `Focus: ${filters.customerFocus}`,
      });
    if (filters.fundingType)
      active.push({
        key: "fundingType",
        label: `Funding: ${filters.fundingType}`,
      });
    if (filters.minRank)
      active.push({ key: "minRank", label: `Min Rank: ${filters.minRank}` });
    if (filters.maxRank)
      active.push({ key: "maxRank", label: `Max Rank: ${filters.maxRank}` });
    if (filters.minFunding)
      active.push({
        key: "minFunding",
        label: `Min Funding: ${formatFundingForDisplay(filters.minFunding)}`,
      });
    if (filters.maxFunding)
      active.push({
        key: "maxFunding",
        label: `Max Funding: ${formatFundingForDisplay(filters.maxFunding)}`,
      });
    return active;
  }, [filters, currentCurrency]);
};

export const useActiveFilterCount = (filters: FilterState) => {
  return useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === "sortBy" || key === "sortOrder") return false;
      return value !== "" && value !== null;
    }).length;
  }, [filters]);
};

// Helper function for formatting funding amounts with locale
export const formatFundingWithLocale = (
  amount: number | null,
  locale: string
): string => {
  if (!amount) return "N/A";
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

// Legacy function for backward compatibility - will use detected locale
export const formatFunding = (amount: number | null): string => {
  if (!amount) return "N/A";
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};
