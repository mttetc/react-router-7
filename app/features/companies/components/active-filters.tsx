import {
  Box,
  Text,
  Wrap,
  WrapItem,
  HStack,
  Badge,
  For,
  Presence,
  IconButton,
  Flex,
  Spacer,
  Tag,
} from "@chakra-ui/react";
import { LuTag, LuX, LuRotateCcw } from "react-icons/lu";
import { useColorModeValue } from "../../../components/ui/color-mode";
import type { FilterState } from "../../../services/companies.service";
import { useActiveFilters } from "../utils/filter-utils";

interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveFilter: (key: keyof FilterState) => void;
  onResetAll: () => void;
}

export const ActiveFilters = ({
  filters,
  onRemoveFilter,
  onResetAll,
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
    <Presence
      present={activeFilters.length > 0}
      animationName={{
        _open: "slide-from-top, fade-in",
        _closed: "slide-to-top, fade-out",
      }}
      animationDuration="moderate"
    >
      <Box
        mb={6}
        p={4}
        bg={bgColor}
        borderRadius="lg"
        border="1px solid"
        borderColor={borderColor}
        overflow="hidden"
      >
        <Flex mb={3} align="center" gap={2}>
          <HStack gap={2}>
            <LuTag size={16} color={textColor} />
            <Text fontSize="sm" fontWeight="semibold" color={textColor}>
              Active Filters
            </Text>
            <Badge colorPalette="purple" variant="surface">
              {activeFilters.length}
            </Badge>
          </HStack>
          <Spacer />
          <Presence
            present={activeFilters.length > 0}
            animationName={{
              _open: "scale-fade-in",
              _closed: "scale-fade-out",
            }}
            animationDuration="fast"
          >
            <IconButton
              size="sm"
              variant="ghost"
              colorPalette="red"
              onClick={onResetAll}
              aria-label="Reset all filters"
            >
              <LuRotateCcw size={14} />
            </IconButton>
          </Presence>
        </Flex>

        <Wrap gap={2}>
          <For each={activeFilters}>
            {({ key, label }) => (
              <Presence
                key={key}
                present={true}
                animationName={{
                  _open: "scale-fade-in",
                  _closed: "scale-fade-out",
                }}
                animationDuration="fast"
              >
                <WrapItem>
                  <Tag.Root colorPalette={getTagColorScheme(key)}>
                    <Tag.Label>{label}</Tag.Label>
                    <Tag.EndElement cursor="pointer">
                      <Tag.CloseTrigger
                        onClick={() => onRemoveFilter(key as keyof FilterState)}
                      />
                    </Tag.EndElement>
                  </Tag.Root>
                </WrapItem>
              </Presence>
            )}
          </For>
        </Wrap>
      </Box>
    </Presence>
  );
};
