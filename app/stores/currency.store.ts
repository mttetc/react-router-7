"use client";

import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { persist, createJSONStorage } from "zustand/middleware";

interface CurrencyState {
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
}

export const useCurrencyStore = createWithEqualityFn<CurrencyState>()(
  persist(
    (set) => ({
      selectedCurrency: "USD",

      setSelectedCurrency: (currency: string) => {
        set({ selectedCurrency: currency });
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
