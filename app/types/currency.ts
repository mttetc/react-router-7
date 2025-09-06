export interface CurrencyState {
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
}

export interface CurrencyInfo {
  currency: string;
  currencyName: string;
  convertFromUSD: (amountUSD: number) => number;
  formatAmount: (amountUSD: number) => number;
}
