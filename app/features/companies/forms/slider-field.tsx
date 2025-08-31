import { Box, Field, HStack, Slider, Text } from "@chakra-ui/react";
import { useFormStatus } from "react-router";
import type { SliderFieldProps } from "./types";
import { debouncedSubmit } from "./utils";

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

  const handleValueChange = (details: { value: number[] }) => {
    const [minVal, maxVal] = details.value;

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

      // Auto-submit form on change with debouncing
      debouncedSubmit(minInput.form);
    }
  };

  const formatDisplayValue = (value: number): string => {
    if (formatValue) {
      return formatValue(value);
    }

    if (currency) {
      const symbol =
        currency === "USD" ? "$" : currency === "EUR" ? "€" : currency;
      if (value >= 1000000) {
        return `${symbol}${(value / 1000000).toFixed(1)}M`;
      }
      return `${symbol}${value.toLocaleString()}`;
    }

    return value.toLocaleString();
  };

  return (
    <Field.Root>
      <Field.Label fontSize="xs" color="gray.500">
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
          width="100%"
          min={min}
          max={max}
          step={step}
          cursor="pointer"
          colorPalette="purple"
          value={[minDefaultValue, maxDefaultValue]}
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
            {minDefaultValue > min
              ? formatDisplayValue(minDefaultValue)
              : formatDisplayValue(min)}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {maxDefaultValue < max
              ? formatDisplayValue(maxDefaultValue)
              : formatDisplayValue(max)}
          </Text>
        </HStack>
      </Box>
      <Field.ErrorText />
    </Field.Root>
  );
}
