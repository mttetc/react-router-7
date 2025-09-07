/**
 * Validation utilities using Zod schemas
 * Provides type-safe validation and error handling
 */

import { z } from "zod";
import {
  CompanySchema,
  FilterStateSchema,
  PaginationStateSchema,
  CompaniesQueryParamsSchema,
  PaginatedResultSchema,
} from "@/types/schemas";

/**
 * Validate company data
 */
export function validateCompany(data: unknown): z.infer<typeof CompanySchema> {
  return CompanySchema.parse(data);
}

/**
 * Validate filter state
 */
export function validateFilterState(
  data: unknown
): z.infer<typeof FilterStateSchema> {
  return FilterStateSchema.parse(data);
}

/**
 * Validate pagination state
 */
export function validatePaginationState(
  data: unknown
): z.infer<typeof PaginationStateSchema> {
  return PaginationStateSchema.parse(data);
}

/**
 * Validate companies query parameters
 */
export function validateCompaniesQueryParams(
  data: unknown
): z.infer<typeof CompaniesQueryParamsSchema> {
  return CompaniesQueryParamsSchema.parse(data);
}

/**
 * Validate paginated result
 */
export function validatePaginatedResult<T>(
  data: unknown,
  itemSchema: z.ZodType<T>
): z.infer<ReturnType<typeof PaginatedResultSchema<z.ZodType<T>>>> {
  return PaginatedResultSchema(itemSchema).parse(data);
}

/**
 * Safe validation with error handling
 */
export function safeValidate<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: z.ZodError } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
}

/**
 * Validate URL search parameters
 */
export function validateSearchParams(
  searchParams: URLSearchParams
): Partial<z.infer<typeof CompaniesQueryParamsSchema>> {
  const params: Record<string, any> = {};

  // Parse string parameters
  const stringParams = [
    "search",
    "growthStage",
    "customerFocus",
    "fundingType",
    "sortBy",
  ];
  stringParams.forEach((param) => {
    const value = searchParams.get(param);
    if (value) params[param] = value;
  });

  // Parse number parameters
  const numberParams = [
    "minRank",
    "maxRank",
    "minFunding",
    "maxFunding",
    "page",
    "limit",
  ];
  numberParams.forEach((param) => {
    const value = searchParams.get(param);
    if (value) {
      const num = parseInt(value, 10);
      if (!isNaN(num)) params[param] = num;
    }
  });

  // Parse sort order
  const sortOrder = searchParams.get("sortOrder");
  if (sortOrder && ["asc", "desc"].includes(sortOrder)) {
    params.sortOrder = sortOrder;
  }

  return params;
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(error: z.ZodError): string[] {
  return error.issues.map((err: z.ZodIssue) => {
    const path = err.path.length > 0 ? `${err.path.join(".")}: ` : "";
    return `${path}${err.message}`;
  });
}
