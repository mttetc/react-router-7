import { Box, Field, HStack, Slider, Text } from "@chakra-ui/react";
import { useCallback } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import { useSyncArrayState } from "@/hooks/use-sync-state";
import { ClientOnly } from "@/components/ui/client-only";

/**
 * Props for the SliderField component
 * @interface SliderFieldComponentProps
 */
interface SliderFieldComponentProps {
  /** Unique identifier for the slider field */
  name: string;
  /** Display label for the slider */
  label: string;
  /** Minimum value for the slider */
  min: number;
  /** Maximum value for the slider */
  max: number;
  /** Step size for the slider (default: 1) */
  step?: number;
  /** Custom formatter function for displaying values */
  formatValue?: (value: number) => string;
  /** Currency code for currency formatting */
  currency?: string;
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Query parameter name for minimum value */
  minName: string;
  /** Query parameter name for maximum value */
  maxName: string;
  /** Default minimum value */
  minDefaultValue?: number;
  /** Default maximum value */
  maxDefaultValue?: number;
}

/**
 * SliderField component for range input with URL state management
 * @description A dual-handle slider component that syncs with URL parameters
 * @param props - Component props
 * @returns JSX element
 * @example
 * ```tsx
 * <SliderField
 *   name="rank"
 *   label="Company Rank"
 *   min={1}
 *   max={1000}
 *   minName="minRank"
 *   maxName="maxRank"
 *   currency="USD"
 * />
 * ```
 */
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
      // Use consistent formatting that works the same on server and client
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        notation: "compact",
        maximumFractionDigits: 1,
      });
      return formatter.format(value);
    }

    // Use consistent number formatting
    const formatter = new Intl.NumberFormat("en-US", {
      notation: "standard",
      maximumFractionDigits: 0,
    });
    return formatter.format(value);
  };

  const fieldId = `slider-${name}`;
  const labelId = `${fieldId}-label`;

  return (
    <Field.Root>
      <Text fontSize="xs" color="gray.500" id={labelId} as="label">
        {label}
      </Text>
      <ClientOnly fallback={<Box w="100%" h="60px" />}>
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
      </ClientOnly>
      <Field.ErrorText />
    </Field.Root>
  );
}
