import {
  Box,
  Field,
  HStack,
  Slider,
  Text,
  FormatNumber,
} from "@chakra-ui/react";
import { useCallback } from "react";
import type { SliderFieldProps } from "./types";
import { useSyncArrayState } from "~/hooks/use-sync-state";
import { useFilterState } from "~/hooks/use-filter-state";

interface SliderFieldComponentProps extends SliderFieldProps {
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
  const { filters, updateFilters } = useFilterState();

  // Get current values from nuqs state
  const currentMinValue = (filters as any)[minName] || min;
  const currentMaxValue = (filters as any)[maxName] || max;

  // Sync state hook for smooth slider interaction with debounced updates
  const [localValues, setLocalValues] = useSyncArrayState({
    initialValue: [currentMinValue, currentMaxValue] as const,
    externalValue: [currentMinValue, currentMaxValue] as const,
    onSync: useCallback(
      async (values: readonly [number, number]) => {
        const [minVal, maxVal] = values;

        await updateFilters({
          [minName]: minVal === min ? null : minVal,
          [maxName]: maxVal === max ? null : maxVal,
        } as Partial<typeof filters>);
      },
      [minName, maxName, min, max, updateFilters]
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

  return (
    <Field.Root>
      <Field.Label fontSize="xs" color="gray.500" htmlFor={fieldId}>
        {label}
      </Field.Label>
      <Box w="100%" role="group">
        <Slider.Root
          id={fieldId}
          width="100%"
          min={min}
          max={max}
          step={step}
          cursor="pointer"
          colorPalette="purple"
          value={[...localValues]}
          onValueChange={handleValueChange}
          disabled={disabled}
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
