/**
 * Filter-related types
 * Centralized filter types to avoid duplication
 */

export interface FilterState {
  search: string;
  growthStage: string;
  customerFocus: string;
  fundingType: string;
  minRank: number | null;
  maxRank: number | null;
  minFunding: number | null;
  maxFunding: number | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface PaginationState {
  page: number;
  limit: number;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface ActiveFilter {
  key: keyof FilterState;
  value: string | number;
  label: string;
  color: string;
}

export interface ParsedFilter {
  type: keyof FilterState;
  value: string;
  label: string;
  color: string;
}

// API parameter mapping
export interface CompaniesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  growth_stage?: string;
  customer_focus?: string;
  last_funding_type?: string;
  min_rank?: number;
  max_rank?: number;
  min_funding?: number;
  max_funding?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Form field props
export interface FilterFieldProps {
  name: string;
  label: string;
  defaultValue?: string | number | null;
  disabled?: boolean;
}

export interface SelectFieldProps extends FilterFieldProps {
  options: FilterOption[];
  placeholder?: string;
}

export interface SliderFieldProps extends FilterFieldProps {
  min: number;
  max: number;
  minValue?: number | null;
  maxValue?: number | null;
  step?: number;
  currency?: string;
}
