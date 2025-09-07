/**
 * Zod schemas for type validation and inference
 * Centralized schemas to ensure type safety across the application
 */

import { z } from "zod";

// Company schema
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

// Filter state schema
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

// Pagination state schema
export const PaginationStateSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(20),
});

// Combined filter and pagination schema
export const CompaniesQueryParamsSchema = FilterStateSchema.merge(PaginationStateSchema);

// Paginated result schema
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

// Export inferred types
export type Company = z.infer<typeof CompanySchema>;
export type FilterState = z.infer<typeof FilterStateSchema>;
export type PaginationState = z.infer<typeof PaginationStateSchema>;
export type CompaniesQueryParams = z.infer<typeof CompaniesQueryParamsSchema>;
export type PaginatedResult<T> = z.infer<ReturnType<typeof PaginatedResultSchema<z.ZodType<T>>>>;
export type Currency = z.infer<typeof CurrencySchema>;
export type SelectOption = z.infer<typeof SelectOptionSchema>;
export type FormField = z.infer<typeof FormFieldSchema>;
export type SelectField = z.infer<typeof SelectFieldSchema>;
export type SliderField = z.infer<typeof SliderFieldSchema>;
export type ApiResponse<T> = z.infer<ReturnType<typeof ApiResponseSchema<z.ZodType<T>>>>;
export type SortConfig = z.infer<typeof SortConfigSchema>;
