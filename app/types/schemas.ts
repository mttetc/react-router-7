/**
 * Zod schemas for type validation and inference
 * Centralized schemas to ensure type safety across the application
 *
 * @fileoverview This module contains all Zod schemas used for validation
 * and type inference throughout the application. It provides a single
 * source of truth for data validation and TypeScript types.
 */

import { z } from "zod";

/**
 * Schema for validating Company entities
 * @description Validates company data structure with all required and optional fields
 */
export const CompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  domain: z.string(),
  rank: z.number().int().positive(),
  description: z.string(),
  createdAt: z.date().nullable(),
  growth_stage: z.string().nullable(),
  last_funding_type: z.string().nullable(),
  last_funding_amount: z.number().nullable(),
  customer_focus: z.string().nullable(),
});

/**
 * Schema for validating filter state
 * @description Defines all possible filter parameters with their types and defaults
 */
export const FilterStateSchema = z.object({
  search: z.string().default(""),
  growthStage: z.string().nullable().default(null),
  customerFocus: z.string().nullable().default(null),
  fundingType: z.string().nullable().default(null),
  minRank: z.number().int().positive().nullable().default(null),
  maxRank: z.number().int().positive().nullable().default(null),
  minFunding: z.number().int().nonnegative().nullable().default(null),
  maxFunding: z.number().int().nonnegative().nullable().default(null),
  sortBy: z.string().default("rank"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

/**
 * Schema for validating pagination state
 * @description Defines pagination parameters with validation rules
 */
export const PaginationStateSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(20),
});

/**
 * Combined schema for companies query parameters
 * @description Merges filter and pagination schemas for complete query validation
 */
export const CompaniesQueryParamsSchema = FilterStateSchema.merge(
  PaginationStateSchema
);

/**
 * Generic schema for paginated results
 * @description Creates a schema for paginated API responses
 * @param dataSchema - Schema for the data array items
 * @returns Zod schema for paginated results
 */
export const PaginatedResultSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
  });

// Currency schema
export const CurrencySchema = z.object({
  code: z.string().length(3),
  name: z.string(),
  symbol: z.string(),
  rate: z.number().positive(),
});

// Form field schemas
export const SelectOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const FormFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  defaultValue: z.union([z.string(), z.number(), z.null()]).optional(),
  disabled: z.boolean().default(false),
});

export const SelectFieldSchema = FormFieldSchema.extend({
  options: z.array(SelectOptionSchema),
  placeholder: z.string().default("Select an option"),
});

export const SliderFieldSchema = FormFieldSchema.extend({
  min: z.number(),
  max: z.number(),
  step: z.number().positive().default(1),
  formatValue: z.function().optional(),
});

// API response schema
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    success: z.boolean(),
    message: z.string().optional(),
  });

// Sort configuration schema
export const SortConfigSchema = z.object({
  field: z.string(),
  direction: z.enum(["asc", "desc"]),
});

// Export inferred types with JSDoc documentation

/** Company entity type inferred from CompanySchema */
export type Company = z.infer<typeof CompanySchema>;

/** Filter state type inferred from FilterStateSchema */
export type FilterState = z.infer<typeof FilterStateSchema>;

/** Pagination state type inferred from PaginationStateSchema */
export type PaginationState = z.infer<typeof PaginationStateSchema>;

/** Combined companies query parameters type */
export type CompaniesQueryParams = z.infer<typeof CompaniesQueryParamsSchema>;

/** Generic paginated result type */
export type PaginatedResult<T> = z.infer<
  ReturnType<typeof PaginatedResultSchema<z.ZodType<T>>>
>;

/** Currency type inferred from CurrencySchema */
export type Currency = z.infer<typeof CurrencySchema>;

/** Select option type for form fields */
export type SelectOption = z.infer<typeof SelectOptionSchema>;

/** Base form field type */
export type FormField = z.infer<typeof FormFieldSchema>;

/** Select field type with options */
export type SelectField = z.infer<typeof SelectFieldSchema>;

/** Slider field type with range configuration */
export type SliderField = z.infer<typeof SliderFieldSchema>;

/** Generic API response type */
export type ApiResponse<T> = z.infer<
  ReturnType<typeof ApiResponseSchema<z.ZodType<T>>>
>;

/** Sort configuration type */
export type SortConfig = z.infer<typeof SortConfigSchema>;
