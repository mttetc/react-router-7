import { useState, useCallback } from "react";
import {
  Box,
  HStack,
  Text,
  VStack,
  Slider,
  NumberInput,
  FormatNumber,
} from "@chakra-ui/react";
import { useCurrencyStore } from "@/stores/currency.store";
import { convertCurrency, convertToUSD } from "@/stores/currency-utils";

interface MobileFundingSliderFieldProps {
  minValue: number;
  maxValue: number;
  onMinChange: (value: number | null) => void;
  onMaxChange: (value: number | null) => void;
}

export function MobileFundingSliderField({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: MobileFundingSliderFieldProps) {
  const currentCurrency = useCurrencyStore((state) => state.selectedCurrency);

  // Convert USD values to current currency for display
  const displayMinValue = convertCurrency(minValue, currentCurrency);
  const displayMaxValue = convertCurrency(maxValue, currentCurrency);

  const [range, setRange] = useState<[number, number]>([
    displayMinValue,
    displayMaxValue,
  ]);

  const handleRangeChange = useCallback(
    (newRange: [number, number]) => {
      setRange(newRange);
      // Convert back to USD for storage
      const usdMin = convertToUSD(newRange[0], currentCurrency);
      const usdMax = convertToUSD(newRange[1], currentCurrency);
      onMinChange(usdMin);
      onMaxChange(usdMax);
    },
    [currentCurrency, onMinChange, onMaxChange]
  );

  const handleMinInputChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(numValue, range[1]));
    const newRange = [clampedValue, range[1]] as [number, number];
    setRange(newRange);
    // Convert back to USD for storage
    const usdMin = convertToUSD(clampedValue, currentCurrency);
    const usdMax = convertToUSD(range[1], currentCurrency);
    onMinChange(usdMin);
    onMaxChange(usdMax);
  };

  const handleMaxInputChange = (value: string) => {
    const maxAllowed = Math.max(displayMaxValue, 100000000);
    const numValue = parseInt(value) || maxAllowed;
    const clampedValue = Math.max(range[0], Math.min(numValue, maxAllowed));
    const newRange = [range[0], clampedValue] as [number, number];
    setRange(newRange);
    // Convert back to USD for storage
    const usdMin = convertToUSD(range[0], currentCurrency);
    const usdMax = convertToUSD(clampedValue, currentCurrency);
    onMinChange(usdMin);
    onMaxChange(usdMax);
  };

  return (
    <VStack align="stretch" gap={3}>
      <Text fontSize="sm" fontWeight="medium" color="gray.700">
        Funding Amount ({currentCurrency})
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
              min={0}
              max={range[1]}
              step={Math.max(100000, Math.floor(displayMaxValue / 1000))}
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
              max={Math.max(displayMaxValue, 100000000)}
              step={Math.max(100000, Math.floor(displayMaxValue / 1000))}
              size="sm"
            >
              <NumberInput.Input />
            </NumberInput.Root>
          </Box>
        </HStack>

        <Slider.Root
          value={range}
          onValueChange={(details) =>
            handleRangeChange(details.value as [number, number])
          }
          min={0}
          colorPalette="purple"
          max={Math.max(displayMaxValue, 100000000)}
          step={Math.max(100000, Math.floor(displayMaxValue / 1000))}
          minStepsBetweenThumbs={1}
          w="100%"
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0} />
            <Slider.Thumb index={1} />
          </Slider.Control>
        </Slider.Root>

        <HStack justify="space-between" width="100%" px={2}>
          <Text fontSize="xs" color="gray.500">
            <FormatNumber
              value={range[0]}
              style="currency"
              currency={currentCurrency}
              notation="compact"
            />
          </Text>
          <Text fontSize="xs" color="gray.500">
            <FormatNumber
              value={range[1]}
              style="currency"
              currency={currentCurrency}
              notation="compact"
            />
          </Text>
        </HStack>
      </VStack>
    </VStack>
  );
}
