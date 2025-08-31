import {
  Box,
  Field,
  HStack,
  Slider,
  Text,
  FormatNumber,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useCurrencyStore } from "~/stores/currency.store";
import { convertCurrency, convertToUSD } from "~/utils/currency.utils";
import type { FilterState } from "~/services/companies.service";
import { useSyncArrayState } from "~/hooks/use-sync-state";
import { useFilterState } from "~/hooks/use-filter-state";

interface FundingSliderFieldProps {
  // No props needed - gets state from nuqs
}

export function FundingSliderField({}: FundingSliderFieldProps) {
  const { filters, updateFilters } = useFilterState();
  const currentCurrency = useCurrencyStore((state) => state.selectedCurrency);

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

  // Sync state hook for smooth slider interaction with debounced updates
  const [localValues, setLocalValues] = useSyncArrayState({
    initialValue: [minFundingDisplay, maxFundingDisplay] as const,
    externalValue: [minFundingDisplay, maxFundingDisplay] as const,
    onSync: useCallback(
      async (values: readonly [number, number]) => {
        const [minVal, maxVal] = values;

        // Convert user currency values back to USD for the API
        const minUSD = minVal === 0 ? null : convertUserCurrencyToUSD(minVal);
        const maxUSD =
          maxVal === maxSliderValue ? null : convertUserCurrencyToUSD(maxVal);

        await updateFilters({
          minFunding: minUSD,
          maxFunding: maxUSD,
        });
      },
      [convertUserCurrencyToUSD, maxSliderValue, updateFilters]
    ),
    debounceMs: 300,
  });

  const handleValueChange = (details: { value: number[] }) => {
    setLocalValues(details.value as [number, number]);
  };

  const formatDisplayValue = (value: number) => {
    return (
      <FormatNumber
        value={value}
        style="currency"
        currency={currentCurrency}
        notation="compact"
        maximumFractionDigits={1}
      />
    );
  };

  const fieldId = `slider-fundingRange`;

  return (
    <Field.Root>
      <Field.Label
        fontSize="sm"
        fontWeight="semibold"
        color="gray.600"
        htmlFor={fieldId}
      >
        Funding Amount ({currentCurrency})
      </Field.Label>

      <Box role="group" aria-labelledby={fieldId} w="100%">
        <Slider.Root
          id={fieldId}
          width="100%"
          min={0}
          max={maxSliderValue}
          step={convertToUserCurrency(100000)}
          cursor="pointer"
          colorPalette="purple"
          value={[...localValues]}
          onValueChange={handleValueChange}
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs />
          </Slider.Control>
        </Slider.Root>

        <HStack justify="space-between" mt={2}>
          <Text fontSize="xs" color="gray.500">
            {localValues[0] > 0
              ? formatDisplayValue(localValues[0])
              : formatDisplayValue(0)}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {localValues[1] < maxSliderValue
              ? formatDisplayValue(localValues[1])
              : formatDisplayValue(maxSliderValue)}
          </Text>
        </HStack>
      </Box>
      <Field.ErrorText />
    </Field.Root>
  );
}
