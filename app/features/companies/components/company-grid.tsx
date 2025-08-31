import {
  Grid,
  Center,
  Spinner,
  Text,
  VStack,
  Box,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Card,
  Flex,
  HStack,
  ButtonGroup,
  Button,
  For,
} from "@chakra-ui/react";
import { Tooltip } from "../../../components/ui/tooltip";
import { useColorModeValue } from "../../../components/ui/color-mode";
import type { Company } from "../../../utils/companies.types";
import { CompanyCard } from "./company-card";
import type { FilterState } from "../../../services/companies.service";

interface CompanyGridProps {
  companies: Company[];
  isLoading: boolean;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
}

const LoadingSkeleton = () => {
  const bgColor = useColorModeValue("white", "gray.800");

  return (
    <Card.Root bg={bgColor} h="300px">
      <Card.Body>
        <VStack align="start" gap={4}>
          <Skeleton height="40px" width="40px" borderRadius="full" />
          <SkeletonText noOfLines={2} gap="2" width="80%" />
          <SkeletonText noOfLines={3} gap="2" width="100%" />
          <SimpleGrid columns={2} gap={2} width="100%">
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </SimpleGrid>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
};

export const CompanyGrid = ({
  companies,
  isLoading,
  filters,
  onFilterChange,
}: CompanyGridProps) => {
  const emptyBgColor = useColorModeValue("gray.50", "gray.700");

  if (isLoading) {
    return (
      <Box>
        {/* Header with count and sorting - also shown during loading */}
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="sm" color="gray.500">
            Loading companies...
          </Text>

          <HStack gap={3}>
            <Text fontSize="xs" color="gray.500">
              Sort by:
            </Text>
            <select
              value={filters.sortBy}
              onChange={(e: any) => onFilterChange({ sortBy: e.target.value })}
              disabled={isLoading}
              style={{
                padding: "6px",
                borderRadius: "4px",
                border: "1px solid",
                borderColor: "gray.200",
                fontSize: "14px",
                width: "120px",
              }}
            >
              <option value="">Default</option>
              <option value="name">Name</option>
              <option value="rank">Rank</option>
              <option value="funding">Funding</option>
            </select>

            <ButtonGroup size="sm" attached>
              <Tooltip
                content="Sort ascending (A-Z, 1-9)"
                positioning={{ placement: "top" }}
              >
                <Button
                  variant={filters.sortOrder === "asc" ? "solid" : "outline"}
                  colorPalette="brand"
                  onClick={() => onFilterChange({ sortOrder: "asc" })}
                  px={2}
                  disabled={isLoading}
                >
                  ↑
                </Button>
              </Tooltip>
              <Tooltip
                content="Sort descending (Z-A, 9-1)"
                positioning={{ placement: "top" }}
              >
                <Button
                  variant={filters.sortOrder === "desc" ? "solid" : "outline"}
                  colorPalette="brand"
                  onClick={() => onFilterChange({ sortOrder: "desc" })}
                  px={2}
                  disabled={isLoading}
                >
                  ↓
                </Button>
              </Tooltip>
            </ButtonGroup>
          </HStack>
        </Flex>

        <SimpleGrid
          columns={{
            base: 1,
            md: 2,
            lg: 3,
            xl: 4,
          }}
          gap={6}
        >
          <For each={Array.from({ length: 12 }, (_, i) => i)}>
            {(index) => <LoadingSkeleton key={index} />}
          </For>
        </SimpleGrid>
      </Box>
    );
  }

  if (companies.length === 0) {
    return (
      <Box>
        <Center py={20}>
          <Box
            textAlign="center"
            p={8}
            bg={emptyBgColor}
            borderRadius="xl"
            maxW="md"
          >
            <Text fontSize="6xl" mb={4}>
              🔍
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="gray.600" mb={2}>
              No companies found
            </Text>
            <Text fontSize="md" color="gray.500" mb={4}>
              Try adjusting your filters to discover more companies
            </Text>
            <VStack gap={2} fontSize="sm" color="gray.400">
              <Text>💡 Try removing some filters</Text>
              <Text>🔍 Use broader search terms</Text>
              <Text>📊 Adjust your range filters</Text>
            </VStack>
          </Box>
        </Center>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with count and sorting */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="sm" color="gray.500">
          Showing {companies.length} companies
        </Text>

        <HStack gap={3}>
          <Text fontSize="xs" color="gray.500">
            Sort by:
          </Text>
          <select
            value={filters.sortBy}
            onChange={(e: any) => onFilterChange({ sortBy: e.target.value })}
            style={{
              padding: "6px",
              borderRadius: "4px",
              border: "1px solid #e2e8f0",
              fontSize: "14px",
              width: "120px",
            }}
          >
            <option value="">Default</option>
            <option value="name">Name</option>
            <option value="rank">Rank</option>
            <option value="funding">Funding</option>
          </select>

          <ButtonGroup size="sm" attached>
            <Tooltip
              content="Sort ascending (A-Z, 1-9)"
              positioning={{ placement: "top" }}
            >
              <Button
                variant={filters.sortOrder === "asc" ? "solid" : "outline"}
                colorPalette="blue"
                onClick={() => onFilterChange({ sortOrder: "asc" })}
                px={2}
              >
                ↑
              </Button>
            </Tooltip>
            <Tooltip
              content="Sort descending (Z-A, 9-1)"
              positioning={{ placement: "top" }}
            >
              <Button
                variant={filters.sortOrder === "desc" ? "solid" : "outline"}
                colorPalette="blue"
                onClick={() => onFilterChange({ sortOrder: "desc" })}
                px={2}
              >
                ↓
              </Button>
            </Tooltip>
          </ButtonGroup>
        </HStack>
      </Flex>

      <SimpleGrid
        columns={{
          base: 1,
          md: 2,
          lg: 3,
          xl: 4,
        }}
        gap={6}
      >
        <For each={companies}>
          {(company, index) => (
            <Box key={company.id}>
              <CompanyCard company={company} />
            </Box>
          )}
        </For>
      </SimpleGrid>
    </Box>
  );
};
