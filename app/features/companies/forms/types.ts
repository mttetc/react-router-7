import type { FilterState } from "../../../services/companies.service";

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

export interface FilterFormData {
  search?: string;
  growthStage?: string;
  customerFocus?: string;
  fundingType?: string;
  minRank?: string;
  maxRank?: string;
  minFunding?: string;
  maxFunding?: string;
  sortBy?: string;
  sortOrder?: string;
}
