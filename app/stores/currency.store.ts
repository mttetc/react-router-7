"use client";

import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { persist, createJSONStorage } from "zustand/middleware";
import { getCurrencyFromLocale } from "../utils/currency.utils";

interface CurrencyState {
  selectedCurrency: string;
  isAutoDetect: boolean;
  isHydrated: boolean;
  setSelectedCurrency: (currency: string) => void;
  setIsAutoDetect: (autoDetect: boolean) => void;
  getEffectiveCurrency: () => string;
  setHydrated: (hydrated: boolean) => void;
}

function getDetectedCurrency(): string {
  if (typeof window !== "undefined" && window.navigator) {
    return getCurrencyFromLocale(window.navigator.language || "en-US");
  }
  return "USD";
}

export const useCurrencyStore = createWithEqualityFn<CurrencyState>()(
  persist(
    (set, get) => ({
      selectedCurrency: "USD",
      isAutoDetect: true,
      isHydrated: false,

      setSelectedCurrency: (currency: string) => {
        set({ selectedCurrency: currency });
      },

      setIsAutoDetect: (autoDetect: boolean) => {
        set({ isAutoDetect: autoDetect });

        if (autoDetect) {
          const detectedCurrency = getDetectedCurrency();
          set({ selectedCurrency: detectedCurrency });
        }
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated });
      },

      getEffectiveCurrency: () => {
        const state = get();
        if (state.isAutoDetect) {
          return getDetectedCurrency();
        }
        return state.selectedCurrency;
      },
    }),
    {
      name: "currency-preferences",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedCurrency: state.selectedCurrency,
        isAutoDetect: state.isAutoDetect,
      }),
      onRehydrateStorage: () => (state) => {
        // Initialize with detected currency if auto-detect is enabled
        if (state?.isAutoDetect) {
          const detectedCurrency = getDetectedCurrency();
          state.selectedCurrency = detectedCurrency;
        }
        // Mark as hydrated
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  ),
  shallow
);

// Convenience hooks for specific parts of the store
export const useCurrency = () =>
  useCurrencyStore(
    (state) => ({
      selectedCurrency: state.selectedCurrency,
      isAutoDetect: state.isAutoDetect,
      isHydrated: state.isHydrated,
      setSelectedCurrency: state.setSelectedCurrency,
      setIsAutoDetect: state.setIsAutoDetect,
      getEffectiveCurrency: state.getEffectiveCurrency,
      setHydrated: state.setHydrated,
    }),
    shallow
  );

export const useEffectiveCurrency = () =>
  useCurrencyStore((state) => state.getEffectiveCurrency(), shallow);

export const useCurrencyHydrated = () =>
  useCurrencyStore((state) => state.isHydrated, shallow);
