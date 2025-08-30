import { useMemo } from "react";
import type { FilterState } from "../../../services/companies.service";

export const useActiveFilters = (filters: FilterState) => {
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
        label: `Min Funding: $${filters.minFunding.toLocaleString()}`,
      });
    if (filters.maxFunding)
      active.push({
        key: "maxFunding",
        label: `Max Funding: $${filters.maxFunding.toLocaleString()}`,
      });
    return active;
  }, [filters]);
};

export const useActiveFilterCount = (filters: FilterState) => {
  return useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === "sortBy" || key === "sortOrder") return false;
      return value !== "" && value !== null;
    }).length;
  }, [filters]);
};

export const formatFunding = (amount: number | null): string => {
  if (!amount) return "N/A";
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
};
