import {
  Box,
  Text,
  Wrap,
  WrapItem,
  HStack,
  Badge,
  For,
} from "@chakra-ui/react";
import { useColorModeValue } from "../../../components/ui/color-mode";
import type { FilterState } from "../../../services/companies.service";
import { useActiveFilters } from "../utils/filter-utils";

interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveFilter: (key: keyof FilterState) => void;
}

export const ActiveFilters = ({
  filters,
  onRemoveFilter,
}: ActiveFiltersProps) => {
  const activeFilters = useActiveFilters(filters);
  const bgColor = useColorModeValue("brand.50", "brand.900");
  const borderColor = useColorModeValue("brand.200", "brand.600");
  const textColor = useColorModeValue("brand.700", "brand.200");

  if (activeFilters.length === 0) return null;

  const getTagColorScheme = (key: string) => {
    switch (key) {
      case "search":
        return "purple";
      case "growthStage":
        return "green";
      case "customerFocus":
        return "pink";
      case "fundingType":
        return "orange";
      case "minRank":
      case "maxRank":
        return "yellow";
      case "minFunding":
      case "maxFunding":
        return "teal";
      default:
        return "blue";
    }
  };

  return (
    <Box
      mb={6}
      p={4}
      bg={bgColor}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
    >
      <HStack mb={3} gap={2}>
        <Text fontSize="sm" fontWeight="semibold" color={textColor}>
          🏷️ Active Filters
        </Text>
        <Badge colorPalette="brand" borderRadius="full">
          {activeFilters.length}
        </Badge>
      </HStack>

      <Wrap gap={2}>
        <For each={activeFilters}>
          {({ key, label }) => (
            <WrapItem key={key}>
              <Badge
                size="md"
                colorPalette={getTagColorScheme(key)}
                borderRadius="full"
                variant="solid"
                cursor="pointer"
                onClick={() => onRemoveFilter(key as keyof FilterState)}
                _hover={{ opacity: 0.8 }}
              >
                {label} ✕
              </Badge>
            </WrapItem>
          )}
        </For>
      </Wrap>
    </Box>
  );
};
