import { useState, useCallback } from "react";
import {
  Box,
  HStack,
  Text,
  VStack,
  Slider,
  NumberInput,
} from "@chakra-ui/react";
import { useSyncArrayState } from "@/hooks/use-sync-state";

interface MobileSliderFieldProps {
  name: string;
  label: string;
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  onMinChange: (value: number | null) => void;
  onMaxChange: (value: number | null) => void;
  step?: number;
}

export function MobileSliderField({
  name,
  label,
  min,
  max,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  step = 1,
}: MobileSliderFieldProps) {
  // Memoize the onSync callback
  const onSyncCallback = useCallback(
    (newRange: [number, number]) => {
      onMinChange(newRange[0]);
      onMaxChange(newRange[1]);
    },
    [onMinChange, onMaxChange]
  );

  const [range, setRange] = useSyncArrayState({
    initialValue: [minValue, maxValue] as [number, number],
    externalValue: [minValue, maxValue] as [number, number],
    onSync: onSyncCallback,
    debounceMs: 0, // No debounce for mobile - immediate updates
  });

  const handleRangeChange = (newRange: [number, number]) => {
    setRange(newRange);
  };

  const handleMinInputChange = (value: string) => {
    const numValue = parseInt(value) || min;
    const clampedValue = Math.max(min, Math.min(numValue, range[1]));
    const newRange = [clampedValue, range[1]] as [number, number];
    setRange(newRange);
    onMinChange(clampedValue);
    onMaxChange(range[1]);
  };

  const handleMaxInputChange = (value: string) => {
    const numValue = parseInt(value) || max;
    const clampedValue = Math.max(range[0], Math.min(numValue, max));
    const newRange = [range[0], clampedValue] as [number, number];
    setRange(newRange);
    onMinChange(range[0]);
    onMaxChange(clampedValue);
  };

  return (
    <VStack align="stretch" gap={3}>
      <Text fontSize="sm" fontWeight="medium" color="gray.700">
        {label}
      </Text>

      <VStack gap={2}>
        <HStack gap={2} width="100%">
          <Box flex="1">
            <Text fontSize="xs" color="gray.600" mb={1}>
              Min
            </Text>
            <NumberInput.Root
              value={range[0].toString()}
              onValueChange={(details) => handleMinInputChange(details.value)}
              min={min}
              max={range[1]}
              step={step}
              size="sm"
            >
              <NumberInput.Input />
            </NumberInput.Root>
          </Box>

          <Box flex="1">
            <Text fontSize="xs" color="gray.600" mb={1}>
              Max
            </Text>
            <NumberInput.Root
              value={range[1].toString()}
              onValueChange={(details) => handleMaxInputChange(details.value)}
              min={range[0]}
              max={max}
              step={step}
              size="sm"
            >
              <NumberInput.Input />
            </NumberInput.Root>
          </Box>
        </HStack>

        <Box width="100%" px={2}>
          <Slider.Root
            value={range}
            onValueChange={(details) =>
              handleRangeChange(details.value as [number, number])
            }
            min={min}
            max={max}
            step={step}
            minStepsBetweenThumbs={1}
          >
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumb index={0} />
              <Slider.Thumb index={1} />
            </Slider.Control>
          </Slider.Root>
        </Box>
      </VStack>
    </VStack>
  );
}
