"use client";

import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { persist, createJSONStorage } from "zustand/middleware";
import { getCurrencyFromLocale } from "../utils/currency.utils";

interface CurrencyState {
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  getEffectiveCurrency: () => string;
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

      setSelectedCurrency: (currency: string) => {
        set({ selectedCurrency: currency });
      },

      getEffectiveCurrency: () => {
        const state = get();
        return state.selectedCurrency;
      },
    }),
    {
      name: "currency-preferences",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedCurrency: state.selectedCurrency,
      }),
    }
  ),
  shallow
);
