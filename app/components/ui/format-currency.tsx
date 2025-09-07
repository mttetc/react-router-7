"use client";

import { FormatNumber } from "@chakra-ui/react";
import { convertCurrency } from "@/stores/currency-utils";
import { ClientOnly } from "./client-only";
import { useCurrencyStore } from "@/stores/currency.store";

interface FormatCurrencyProps {
  /** Amount in USD (base currency) */
  value: number;
  /** Override the currency (optional) */
  currency?: string;
  /** Number formatting options */
  notation?: "standard" | "scientific" | "engineering" | "compact";
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  /** Whether to show currency symbol */
  showCurrency?: boolean;
}

export function FormatCurrency({
  value,
  currency: overrideCurrency,
  notation = "compact",
  maximumFractionDigits = 1,
  minimumFractionDigits,
  showCurrency = true,
}: FormatCurrencyProps) {
  const currentCurrency = useCurrencyStore((state) => state.selectedCurrency);

  // Determine currency based on store state or override
  const targetCurrency = overrideCurrency || currentCurrency;

  // Convert from USD to target currency
  const convertedAmount = convertCurrency(value, targetCurrency);

  // SSR-safe fallback - show USD format during server rendering
  const ssrFallback = (
    <FormatNumber
      value={value}
      style={showCurrency ? "currency" : "decimal"}
      currency={showCurrency ? "USD" : undefined}
      notation={notation}
      maximumFractionDigits={maximumFractionDigits}
      minimumFractionDigits={minimumFractionDigits}
    />
  );

  return (
    <ClientOnly fallback={ssrFallback}>
      <FormatNumber
        value={convertedAmount}
        style={showCurrency ? "currency" : "decimal"}
        currency={showCurrency ? targetCurrency : undefined}
        notation={notation}
        maximumFractionDigits={maximumFractionDigits}
        minimumFractionDigits={minimumFractionDigits}
      />
    </ClientOnly>
  );
}

interface FormatCurrencyCompactProps {
  /** Amount in USD (base currency) */
  value: number;
  /** Override the currency (optional) */
  currency?: string;
}

/**
 * Simplified component for compact currency formatting
 */
export function FormatCurrencyCompact({
  value,
  currency,
}: FormatCurrencyCompactProps) {
  return (
    <FormatCurrency
      value={value}
      currency={currency}
      notation="compact"
      maximumFractionDigits={1}
    />
  );
}
