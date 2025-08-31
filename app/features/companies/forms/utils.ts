import type {
  FilterState,
  PaginationState,
} from "../../../services/companies.service";
import type { FilterFormData, FormErrors } from "./types";

/**
 * Parse form data into FilterState
 */
export function parseFiltersFromFormData(formData: FormData): FilterState {
  const search = formData.get("search")?.toString() || "";
  const growthStage = formData.get("growthStage")?.toString() || "";
  const customerFocus = formData.get("customerFocus")?.toString() || "";
  const fundingType = formData.get("fundingType")?.toString() || "";
  const sortBy = formData.get("sortBy")?.toString() || "";
  const sortOrder = (formData.get("sortOrder")?.toString() || "asc") as
    | "asc"
    | "desc";

  // Parse numeric values
  const minRankStr = formData.get("minRank")?.toString();
  const maxRankStr = formData.get("maxRank")?.toString();
  const minFundingStr = formData.get("minFunding")?.toString();
  const maxFundingStr = formData.get("maxFunding")?.toString();

  const minRank =
    minRankStr && minRankStr !== "1" ? parseInt(minRankStr, 10) : null;
  const maxRank =
    maxRankStr && maxRankStr !== "10000" ? parseInt(maxRankStr, 10) : null;
  const minFunding =
    minFundingStr && minFundingStr !== "0" ? parseInt(minFundingStr, 10) : null;
  const maxFunding =
    maxFundingStr && maxFundingStr !== "100000000"
      ? parseInt(maxFundingStr, 10)
      : null;

  return {
    search,
    growthStage,
    customerFocus,
    fundingType,
    minRank,
    maxRank,
    minFunding,
    maxFunding,
    sortBy,
    sortOrder,
  };
}

/**
 * Convert FilterState to form default values
 */
export function filtersToFormData(filters: FilterState): FilterFormData {
  return {
    search: filters.search || "",
    growthStage: filters.growthStage || "",
    customerFocus: filters.customerFocus || "",
    fundingType: filters.fundingType || "",
    minRank: filters.minRank?.toString() || "1",
    maxRank: filters.maxRank?.toString() || "10000",
    minFunding: filters.minFunding?.toString() || "0",
    maxFunding: filters.maxFunding?.toString() || "100000000",
    sortBy: filters.sortBy || "",
    sortOrder: filters.sortOrder || "asc",
  };
}

/**
 * Validate filter values
 */
export function validateFilters(filters: FilterState): {
  success: boolean;
  errors: FormErrors;
} {
  const errors: FormErrors = {};

  // Validate rank range
  if (filters.minRank && filters.maxRank && filters.minRank > filters.maxRank) {
    errors.minRank = "Minimum rank cannot be greater than maximum rank";
    errors.maxRank = "Maximum rank cannot be less than minimum rank";
  }

  if (filters.minRank && (filters.minRank < 1 || filters.minRank > 10000)) {
    errors.minRank = "Rank must be between 1 and 10,000";
  }

  if (filters.maxRank && (filters.maxRank < 1 || filters.maxRank > 10000)) {
    errors.maxRank = "Rank must be between 1 and 10,000";
  }

  // Validate funding range
  if (
    filters.minFunding &&
    filters.maxFunding &&
    filters.minFunding > filters.maxFunding
  ) {
    errors.minFunding =
      "Minimum funding cannot be greater than maximum funding";
    errors.maxFunding = "Maximum funding cannot be less than minimum funding";
  }

  if (filters.minFunding && filters.minFunding < 0) {
    errors.minFunding = "Funding amount cannot be negative";
  }

  if (filters.maxFunding && filters.maxFunding < 0) {
    errors.maxFunding = "Funding amount cannot be negative";
  }

  // Validate sort order
  if (filters.sortOrder && !["asc", "desc"].includes(filters.sortOrder)) {
    errors.sortOrder = "Sort order must be 'asc' or 'desc'";
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
  };
}
