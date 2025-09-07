import {
  Box,
  Field,
  HStack,
  Slider,
  Text,
  FormatNumber,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import { useCurrencyStore } from "@/stores/currency.store";
import { convertCurrency, convertToUSD } from "@/utils/currency-utils";
import { useSyncArrayState } from "@/hooks/use-sync-state";

export function FundingSliderField() {
  const [minFunding, setMinFunding] = useQueryState(
    "minFunding",
    parseAsInteger
  );
  const [maxFunding, setMaxFunding] = useQueryState(
    "maxFunding",
    parseAsInteger
  );
  const [, setPage] = useQueryState("page");
  const currentCurrency = useCurrencyStore((state) => state.selectedCurrency);

  const minFundingDisplay = minFunding
    ? convertCurrency(minFunding, currentCurrency)
    : 0;
  const maxFundingDisplay = maxFunding
    ? convertCurrency(maxFunding, currentCurrency)
    : convertCurrency(100000000, currentCurrency);
  const maxSliderValue = convertCurrency(100000000, currentCurrency);

  const [localValues, setLocalValues] = useSyncArrayState({
    initialValue: [minFundingDisplay, maxFundingDisplay] as const,
    externalValue: [minFundingDisplay, maxFundingDisplay] as const,
    onSync: useCallback(
      async (values: readonly [number, number]) => {
        const [minVal, maxVal] = values;

        const minUSD =
          minVal === 0 ? null : convertToUSD(minVal, currentCurrency);
        const maxUSD =
          maxVal === maxSliderValue
            ? null
            : convertToUSD(maxVal, currentCurrency);

        setPage("1"); // Reset page to 1 when filter changes
        setMinFunding(minUSD);
        setMaxFunding(maxUSD);
      },
      [maxSliderValue, setMinFunding, setMaxFunding, currentCurrency, setPage]
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
  const labelId = `${fieldId}-label`;

  return (
    <Field.Root>
      <Text
        fontSize="sm"
        fontWeight="semibold"
        color="gray.600"
        id={labelId}
        as="label"
      >
        Funding Amount ({currentCurrency})
      </Text>

      <Box role="group" aria-labelledby={labelId} w="100%">
        <Slider.Root
          width="100%"
          min={0}
          max={maxSliderValue}
          step={convertCurrency(100000, currentCurrency)}
          cursor="pointer"
          colorPalette="purple"
          value={[...localValues]}
          onValueChange={handleValueChange}
          aria-labelledby={[labelId]}
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
