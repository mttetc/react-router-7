import { useRef, useCallback, useEffect, useState } from "react";
import { Box, Input, HStack, Text, Badge, VStack, For } from "@chakra-ui/react";
import { FaSearch, FaMagic } from "react-icons/fa";
import { useTextField } from "@react-aria/textfield";
import { useFocusRing } from "@react-aria/focus";
import type { FilterState } from "@/lib/companies-client";
import { useCurrencyStore } from "@/stores/currency.store";
import {
  parseSmartSearch,
  type ParsedFilter,
} from "../../utils/smart-search-utils";

interface MobileSmartSearchProps {
  initialValue: string;
  onFiltersChange?: (
    filters: Partial<FilterState & { search: string }>
  ) => void;
}

export function MobileSmartSearch({
  initialValue,
  onFiltersChange,
}: MobileSmartSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const currentCurrency = useCurrencyStore((state) => state.selectedCurrency);

  const [query, setQuery] = useState(initialValue);

  // Parse filters when query changes (for display purposes only) - use local state
  const [parsedFilters, setParsedFilters] = useState<ParsedFilter[]>([]);

  useEffect(() => {
    if (query.trim() === "") {
      setParsedFilters([]);
    } else {
      const { parsedFilters: newParsedFilters } = parseSmartSearch(
        query,
        currentCurrency
      );
      setParsedFilters(newParsedFilters);
    }
  }, [query, currentCurrency]);

  const handleChange = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);

      // Parse and update filters when query changes
      if (onFiltersChange) {
        if (newQuery.trim() === "") {
          onFiltersChange({ search: "" });
        } else {
          const { filters, remainingQuery } = parseSmartSearch(
            newQuery,
            currentCurrency
          );
          onFiltersChange({
            ...filters,
            search: remainingQuery.trim(),
          });
        }
      }
    },
    [onFiltersChange, currentCurrency]
  );

  // Use React Aria text field for proper accessibility
  const { inputProps, descriptionProps } = useTextField(
    {
      label: "Smart search for companies",
      placeholder: "Search",
      value: query,
      onChange: handleChange,
      description:
        "Search by funding (1M, $5M+), stage (seed, series A), focus (B2B, B2C), or rank (top 100).",
    },
    inputRef
  );

  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <VStack align="stretch" gap={2}>
      <VStack align="start" gap={1}>
        <HStack gap={2}>
          <FaMagic size={12} color="purple.500" />
          <Text fontSize="xs" fontWeight="semibold" color="purple.600">
            Smart Search
          </Text>
        </HStack>
        <Text
          {...descriptionProps}
          fontSize="xs"
          color="gray.600"
          lineHeight="1.4"
        >
          Search by funding (1M, $5M+), stage (seed, series A), focus (B2B,
          B2C), or rank (top 100).
        </Text>
      </VStack>

      <HStack
        borderWidth={1}
        borderColor="gray.300"
        borderRadius="md"
        px={3}
        py={2}
        bg="gray.50"
        _focusWithin={{
          borderColor: "purple.500",
          boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
          bg: "white",
        }}
        minH="40px"
      >
        <FaSearch color="gray.400" style={{ fontSize: "14px" }} />
        <Input
          ref={inputRef}
          {...(inputProps as any)}
          {...(focusProps as any)}
          border="none"
          outline="none"
          _focus={{
            boxShadow: "none",
            outline: isFocusVisible
              ? "2px solid var(--chakra-colors-purple-500)"
              : "none",
            outlineOffset: "2px",
          }}
          _placeholder={{ color: "gray.400" }}
          fontSize="sm"
          bg="transparent"
          p={0}
          h="auto"
          flex={1}
        />
        {parsedFilters.length > 0 && (
          <FaMagic
            color="purple.500"
            title="Smart filters detected"
            size={12}
          />
        )}
      </HStack>

      {parsedFilters.length > 0 && (
        <HStack flexWrap="wrap" gap={1}>
          <Text fontSize="xs" color="gray.500">
            Detected:
          </Text>
          <For each={parsedFilters}>
            {(filter) => (
              <Badge
                key={`${filter.type}-${filter.value}`}
                colorPalette={filter.color}
                size="sm"
                variant="surface"
              >
                {filter.label}
              </Badge>
            )}
          </For>
        </HStack>
      )}
    </VStack>
  );
}
