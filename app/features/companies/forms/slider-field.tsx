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
import type { SliderFieldProps } from "./types";
import { useSyncArrayState } from "~/hooks/use-sync-state";

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
  const { pending } = useFormStatus();

  // Sync state hook for smooth slider interaction with debounced form submission
  const [localValues, setLocalValues] = useSyncArrayState({
    initialValue: [minDefaultValue, maxDefaultValue] as const,
    externalValue: [minDefaultValue, maxDefaultValue] as const,
    onSync: useCallback(
      (values: readonly [number, number]) => {
        const [minVal, maxVal] = values;

        // Update hidden inputs
        const minInput = document.querySelector(
          `input[name="${minName}"]`
        ) as HTMLInputElement;
        const maxInput = document.querySelector(
          `input[name="${maxName}"]`
        ) as HTMLInputElement;

        if (minInput && maxInput) {
          minInput.value = minVal === min ? "" : minVal.toString();
          maxInput.value = maxVal === max ? "" : maxVal.toString();

          // Auto-submit form
          minInput.form?.requestSubmit();
        }
      },
      [minName, maxName, min, max]
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
        {/* Hidden inputs for form submission */}
        <input
          type="hidden"
          name={minName}
          defaultValue={
            minDefaultValue === min ? "" : minDefaultValue.toString()
          }
        />
        <input
          type="hidden"
          name={maxName}
          defaultValue={
            maxDefaultValue === max ? "" : maxDefaultValue.toString()
          }
        />

        <Slider.Root
          id={fieldId}
          width="100%"
          min={min}
          max={max}
          step={step}
          cursor="pointer"
          colorPalette="purple"
          value={localValues}
          onValueChange={handleValueChange}
          disabled={disabled || pending}
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
