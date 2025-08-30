import {
  Box,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  useColorModeValue,
  Fade,
  HStack,
  Badge,
} from "@chakra-ui/react";
import type { FilterState } from "../../../services/companies.service";
import { useActiveFilters } from "../utils/filter-utils";

interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveFilter: (key: keyof FilterState) => void;
}

export const ActiveFilters = ({ filters, onRemoveFilter }: ActiveFiltersProps) => {
  const activeFilters = useActiveFilters(filters);
  const bgColor = useColorModeValue("blue.50", "blue.900");

  if (activeFilters.length === 0) return null;

  const getTagColorScheme = (key: string) => {
    switch (key) {
      case "search": return "purple";
      case "growthStage": return "green";
      case "customerFocus": return "pink";
      case "fundingType": return "orange";
      case "minRank":
      case "maxRank": return "yellow";
      case "minFunding":
      case "maxFunding": return "teal";
      default: return "blue";
    }
  };

  return (
    <Fade in={true}>
      <Box 
        mb={6} 
        p={4} 
        bg={bgColor} 
        borderRadius="lg" 
        border="1px solid" 
        borderColor="blue.200"
      >
        <HStack mb={3} spacing={2}>
          <Text fontSize="sm" fontWeight="semibold" color="blue.700">
            🏷️ Active Filters
          </Text>
          <Badge colorScheme="blue" borderRadius="full">
            {activeFilters.length}
          </Badge>
        </HStack>
        
        <Wrap spacing={2}>
          {activeFilters.map(({ key, label }) => (
            <WrapItem key={key}>
              <Tag 
                size="md" 
                colorScheme={getTagColorScheme(key)}
                borderRadius="full"
                variant="solid"
              >
                <TagLabel fontSize="xs">{label}</TagLabel>
                <TagCloseButton
                  onClick={() => onRemoveFilter(key as keyof FilterState)}
                />
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      </Box>
    </Fade>
  );
};
