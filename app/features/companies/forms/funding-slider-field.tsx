import {
  Box,
  Field,
  HStack,
  Slider,
  Text,
  FormatNumber,
} from "@chakra-ui/react";
import { useFormStatus } from "react-dom";
import { useCallback } from "react";
import { useCurrencyStore } from "~/stores/currency.store";
import { convertCurrency, convertToUSD } from "~/utils/currency.utils";
import type { FilterState } from "~/services/companies.service";
import { useSyncArrayState } from "~/hooks/use-sync-state";

interface FundingSliderFieldProps {
  filters: FilterState;
}

export function FundingSliderField({ filters }: FundingSliderFieldProps) {
  const { pending } = useFormStatus();
  const currentCurrency = useCurrencyStore((state) =>
    state.getEffectiveCurrency()
  );

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

  // Sync state hook for smooth slider interaction with debounced form submission
  const [localValues, setLocalValues] = useSyncArrayState({
    initialValue: [minFundingDisplay, maxFundingDisplay] as const,
    externalValue: [minFundingDisplay, maxFundingDisplay] as const,
    onSync: useCallback(
      (values: readonly [number, number]) => {
        const [minVal, maxVal] = values;

        // Update hidden inputs with USD values (converted from user currency)
        const minInput = document.querySelector(
          `input[name="minFunding"]`
        ) as HTMLInputElement;
        const maxInput = document.querySelector(
          `input[name="maxFunding"]`
        ) as HTMLInputElement;

        if (minInput && maxInput) {
          // Convert user currency values back to USD for the API
          const minUSD =
            minVal === 0 ? "" : convertUserCurrencyToUSD(minVal).toString();
          const maxUSD =
            maxVal === maxSliderValue
              ? ""
              : convertUserCurrencyToUSD(maxVal).toString();

          minInput.value = minUSD;
          maxInput.value = maxUSD;

          // Auto-submit form
          minInput.form?.requestSubmit();
        }
      },
      [convertUserCurrencyToUSD, maxSliderValue]
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
        {/* Hidden inputs for form submission (USD values) */}
        <input
          type="hidden"
          name="minFunding"
          defaultValue={filters.minFunding?.toString() || ""}
        />
        <input
          type="hidden"
          name="maxFunding"
          defaultValue={filters.maxFunding?.toString() || ""}
        />

        <Slider.Root
          id={fieldId}
          width="100%"
          min={0}
          max={maxSliderValue}
          step={convertToUserCurrency(100000)}
          cursor="pointer"
          colorPalette="purple"
          value={localValues}
          onValueChange={handleValueChange}
          disabled={pending}
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
