import { useCurrency } from "../../../../stores/currency.store";
import {
  convertCurrency,
  convertToUSD,
  getCurrencySymbol,
} from "../../../../utils/currency.utils";
import type { FilterState } from "../../../../services/companies.service";
import { SliderField } from "./slider-field";

interface FundingSliderFieldProps {
  filters: FilterState;
}

export function FundingSliderField({ filters }: FundingSliderFieldProps) {
  const { currency } = useCurrency();

  const getEffectiveCurrency = () => {
    return currency || "USD";
  };

  const currentCurrency = getEffectiveCurrency();

  // Convert USD amounts to user's currency for display
  const convertToUserCurrency = (usdAmount: number) => {
    return convertCurrency(usdAmount, currentCurrency);
  };

  // Convert user currency amounts back to USD for API
  const convertUserCurrencyToUSD = (userCurrencyAmount: number) => {
    return convertToUSD(userCurrencyAmount, currentCurrency);
  };

  // Convert slider values (USD) to display values (user currency)
  const minFundingDisplay = filters.minFunding
    ? convertToUserCurrency(filters.minFunding)
    : 0;
  const maxFundingDisplay = filters.maxFunding
    ? convertToUserCurrency(filters.maxFunding)
    : convertToUserCurrency(100000000);
  const maxSliderValue = convertToUserCurrency(100000000);

  const formatValue = (value: number): string => {
    const symbol = getCurrencySymbol(currentCurrency);
    if (value >= 1000000) {
      return `${symbol}${(value / 1000000).toFixed(1)}M`;
    }
    return `${symbol}${value.toLocaleString()}`;
  };

  return (
    <SliderField
      name="fundingRange"
      label={`Funding Amount (${currentCurrency})`}
      min={0}
      max={maxSliderValue}
      step={convertToUserCurrency(100000)}
      minName="minFunding"
      maxName="maxFunding"
      minDefaultValue={minFundingDisplay}
      maxDefaultValue={maxFundingDisplay}
      formatValue={formatValue}
    />
  );
}
