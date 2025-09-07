/**
 * Common types shared across the application
 * Global types that are not specific to any particular feature
 *
 * @fileoverview This module contains types that are truly global and shared
 * across multiple features or components in the application.
 */

import { z } from "zod";

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

// Form interfaces
export interface FormFieldProps {
  name: string;
  label: string;
  defaultValue?: string | number | null;
  disabled?: boolean;
}

export interface SelectFieldProps extends FormFieldProps {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  parser: any; // nuqs parser
}

export interface SliderFieldProps extends FormFieldProps {
  min: number;
  max: number;
  step?: number;
  formatValue?: (value: number) => string;
  currency?: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface FormState {
  errors: FormErrors;
  success?: boolean;
}
