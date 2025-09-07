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
import type { SliderFieldProps } from "@/types/forms";
import { useSyncArrayState } from "@/hooks/use-sync-state";

interface SliderFieldComponentProps {
  name: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  formatValue?: (value: number) => string;
  currency?: string;
  disabled?: boolean;
  minName: string;
  maxName: string;
  minDefaultValue?: number;
  maxDefaultValue?: number;
}

export function SliderField({
  name,
  label,
  min,
  max,
  step = 1,
  formatValue,
  currency,
  minName,
  maxName,
  minDefaultValue = min,
  maxDefaultValue = max,
  disabled = false,
}: SliderFieldComponentProps) {
  const [currentMinValue, setMinValue] = useQueryState(minName, parseAsInteger);
  const [currentMaxValue, setMaxValue] = useQueryState(maxName, parseAsInteger);
  const [, setPage] = useQueryState("page");
  const [localValues, setLocalValues] = useSyncArrayState({
    initialValue: [currentMinValue ?? min, currentMaxValue ?? max] as const,
    externalValue: [currentMinValue ?? min, currentMaxValue ?? max] as const,
    onSync: useCallback(
      async (values: readonly [number, number]) => {
        const [minVal, maxVal] = values;
        setPage("1"); // Reset page to 1 when filter changes
        setMinValue(minVal === min ? null : minVal);
        setMaxValue(maxVal === max ? null : maxVal);
      },
      [minName, maxName, min, max, setMinValue, setMaxValue, setPage]
    ),
    debounceMs: 300,
  });

  const handleValueChange = (details: { value: number[] }) => {
    setLocalValues(details.value as [number, number]);
  };

  const formatDisplayValue = (value: number) => {
    if (formatValue) {
      return formatValue(value);
    }

    if (currency) {
      return (
        <FormatNumber
          value={value}
          style="currency"
          currency={currency}
          notation="compact"
          maximumFractionDigits={1}
        />
      );
    }

    return (
      <FormatNumber
        value={value}
        notation="standard"
        maximumFractionDigits={0}
      />
    );
  };

  const fieldId = `slider-${name}`;
  const labelId = `${fieldId}-label`;

  return (
    <Field.Root>
      <Text fontSize="xs" color="gray.500" id={labelId} as="label">
        {label}
      </Text>
      <Box w="100%" role="group">
        <Slider.Root
          width="100%"
          min={min}
          max={max}
          step={step}
          cursor="pointer"
          colorPalette="purple"
          value={[...localValues]}
          onValueChange={handleValueChange}
          disabled={disabled}
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
            {localValues[0] > min
              ? formatDisplayValue(localValues[0])
              : formatDisplayValue(min)}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {localValues[1] < max
              ? formatDisplayValue(localValues[1])
              : formatDisplayValue(max)}
          </Text>
        </HStack>
      </Box>
      <Field.ErrorText />
    </Field.Root>
  );
}
