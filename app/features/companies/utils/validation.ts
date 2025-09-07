/**
 * Filter validation utilities
 * Centralized validation logic for filter values
 */

import type { FilterState } from "@/types/schemas";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const filterValidators = {
  /**
   * Validate funding range
   */
  funding: (min: number | null, max: number | null): ValidationResult => {
    const errors: string[] = [];

    if (min !== null && max !== null && min > max) {
      errors.push("Minimum funding cannot be greater than maximum funding");
    }

    if (min !== null && min < 0) {
      errors.push("Minimum funding cannot be negative");
    }

    if (max !== null && max < 0) {
      errors.push("Maximum funding cannot be negative");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate rank range
   */
  rank: (min: number | null, max: number | null): ValidationResult => {
    const errors: string[] = [];

    if (min !== null && max !== null && min > max) {
      errors.push("Minimum rank cannot be greater than maximum rank");
    }

    if (min !== null && min < 1) {
      errors.push("Minimum rank must be at least 1");
    }

    if (max !== null && max < 1) {
      errors.push("Maximum rank must be at least 1");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Validate search query
   */
  search: (query: string): ValidationResult => {
    const errors: string[] = [];

    if (query.length > 100) {
      errors.push("Search query cannot exceed 100 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

/**
 * Validate all filters
 */
export function validateFilters(
  filters: Partial<FilterState>
): ValidationResult {
  const allErrors: string[] = [];

  // Validate funding range
  if (filters.minFunding !== undefined || filters.maxFunding !== undefined) {
    const fundingValidation = filterValidators.funding(
      filters.minFunding || null,
      filters.maxFunding || null
    );
    allErrors.push(...fundingValidation.errors);
  }

  // Validate rank range
  if (filters.minRank !== undefined || filters.maxRank !== undefined) {
    const rankValidation = filterValidators.rank(
      filters.minRank || null,
      filters.maxRank || null
    );
    allErrors.push(...rankValidation.errors);
  }

  // Validate search
  if (filters.search !== undefined) {
    const searchValidation = filterValidators.search(filters.search);
    allErrors.push(...searchValidation.errors);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

/**
 * Sanitize filter values
 */
export function sanitizeFilters(
  filters: Partial<FilterState>
): Partial<FilterState> {
  const sanitized = { ...filters };

  // Sanitize search query
  if (sanitized.search !== undefined) {
    sanitized.search = sanitized.search.trim();
  }

  // Ensure numeric values are within valid ranges
  if (sanitized.minRank !== null && sanitized.minRank !== undefined) {
    sanitized.minRank = Math.max(1, sanitized.minRank);
  }

  if (sanitized.maxRank !== null && sanitized.maxRank !== undefined) {
    sanitized.maxRank = Math.max(1, sanitized.maxRank);
  }

  if (sanitized.minFunding !== null && sanitized.minFunding !== undefined) {
    sanitized.minFunding = Math.max(0, sanitized.minFunding);
  }

  if (sanitized.maxFunding !== null && sanitized.maxFunding !== undefined) {
    sanitized.maxFunding = Math.max(0, sanitized.maxFunding);
  }

  return sanitized;
}
