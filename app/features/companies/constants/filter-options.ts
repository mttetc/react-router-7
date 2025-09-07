/**
 * Shared filter options constants
 * Centralized options to avoid duplication between mobile and desktop components
 */

export interface FilterOption {
  value: string;
  label: string;
}

export const GROWTH_STAGE_OPTIONS: FilterOption[] = [
  { value: "early", label: "🌱 Early" },
  { value: "seed", label: "🌿 Seed" },
  { value: "growing", label: "🌳 Growing" },
  { value: "late", label: "🏢 Late" },
  { value: "exit", label: "🚀 Exit" },
];

export const CUSTOMER_FOCUS_OPTIONS: FilterOption[] = [
  { value: "b2b", label: "🏢 B2B" },
  { value: "b2c", label: "👥 B2C" },
  { value: "b2b_b2c", label: "🔄 B2B & B2C" },
  { value: "b2c_b2b", label: "🔄 B2C & B2B" },
];

export const FUNDING_TYPE_OPTIONS: FilterOption[] = [
  { value: "Seed", label: "🌱 Seed" },
  { value: "Pre Seed", label: "🌰 Pre Seed" },
  { value: "Series A", label: "🅰️ Series A" },
  { value: "Series B", label: "🅱️ Series B" },
  { value: "Series C", label: "©️ Series C" },
  { value: "Series Unknown", label: "❓ Series Unknown" },
  { value: "Angel", label: "👼 Angel" },
  { value: "Grant", label: "🎁 Grant" },
  { value: "Debt Financing", label: "🏦 Debt Financing" },
  { value: "Convertible Note", label: "📝 Convertible Note" },
  { value: "Corporate Round", label: "🏢 Corporate Round" },
  { value: "Undisclosed", label: "🤐 Undisclosed" },
];

// Quick filter configurations
export interface QuickFilterConfig {
  key: string;
  label: string;
  icon: string;
  color: string;
  options: FilterOption[];
}

export const QUICK_FILTER_CONFIGS: QuickFilterConfig[] = [
  {
    key: "growthStage",
    label: "Growth Stage",
    icon: "🌱",
    color: "blue",
    options: GROWTH_STAGE_OPTIONS,
  },
  {
    key: "customerFocus",
    label: "Customer Focus",
    icon: "👥",
    color: "green",
    options: CUSTOMER_FOCUS_OPTIONS,
  },
  {
    key: "fundingType",
    label: "Funding Type",
    icon: "💰",
    color: "orange",
    options: FUNDING_TYPE_OPTIONS,
  },
];

// Validation ranges
export const FILTER_RANGES = {
  rank: { min: 1, max: 1000, step: 1 },
  funding: { min: 0, max: 1000000000, step: 100000 }, // 0 to 1B
} as const;
