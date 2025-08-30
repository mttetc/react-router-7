import {
  Grid,
  Center,
  Spinner,
  Text,
  VStack,
  Box,
  useColorModeValue,
  Fade,
  ScaleFade,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Card,
  CardBody,
  Flex,
  HStack,
  Select,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
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
    <Card bg={bgColor} h="300px">
      <CardBody>
        <VStack align="start" spacing={4}>
          <Skeleton height="40px" width="40px" borderRadius="full" />
          <SkeletonText noOfLines={2} spacing="2" width="80%" />
          <SkeletonText noOfLines={3} spacing="2" width="100%" />
          <SimpleGrid columns={2} spacing={2} width="100%">
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </SimpleGrid>
        </VStack>
      </CardBody>
    </Card>
  );
};

export const CompanyGrid = ({ companies, isLoading, filters, onFilterChange }: CompanyGridProps) => {
  const emptyBgColor = useColorModeValue("gray.50", "gray.800");

  if (isLoading) {
    return (
      <Box>
        {/* Header with count and sorting - also shown during loading */}
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="sm" color="gray.500">
            Loading companies...
          </Text>
          
          <HStack spacing={3}>
            <Text fontSize="xs" color="gray.500">
              Sort by:
            </Text>
            <Select
              size="sm"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              w="120px"
              focusBorderColor="blue.400"
              isDisabled={isLoading}
            >
              <option value="">Default</option>
              <option value="name">Name</option>
              <option value="rank">Rank</option>
              <option value="funding">Funding</option>
            </Select>
            
            <ButtonGroup size="sm" isAttached>
              <Button
                variant={filters.sortOrder === "asc" ? "solid" : "outline"}
                colorScheme="blue"
                onClick={() => onFilterChange({ sortOrder: "asc" })}
                px={2}
                isDisabled={isLoading}
              >
                ↑
              </Button>
              <Button
                variant={filters.sortOrder === "desc" ? "solid" : "outline"}
                colorScheme="blue"
                onClick={() => onFilterChange({ sortOrder: "desc" })}
                px={2}
                isDisabled={isLoading}
              >
                ↓
              </Button>
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
          spacing={6}
        >
          {Array.from({ length: 12 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </SimpleGrid>
      </Box>
    );
  }

  if (companies.length === 0) {
    return (
      <Fade in={true}>
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
            <VStack spacing={2} fontSize="sm" color="gray.400">
              <Text>💡 Try removing some filters</Text>
              <Text>🔍 Use broader search terms</Text>
              <Text>📊 Adjust your range filters</Text>
            </VStack>
          </Box>
        </Center>
      </Fade>
    );
  }

  return (
    <Box>
      {/* Header with count and sorting */}
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="sm" color="gray.500">
          Showing {companies.length} companies
        </Text>
        
        <HStack spacing={3}>
          <Text fontSize="xs" color="gray.500">
            Sort by:
          </Text>
          <Select
            size="sm"
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value })}
            w="120px"
            focusBorderColor="blue.400"
          >
            <option value="">Default</option>
            <option value="name">Name</option>
            <option value="rank">Rank</option>
            <option value="funding">Funding</option>
          </Select>
          
          <ButtonGroup size="sm" isAttached>
            <Button
              variant={filters.sortOrder === "asc" ? "solid" : "outline"}
              colorScheme="blue"
              onClick={() => onFilterChange({ sortOrder: "asc" })}
              px={2}
            >
              ↑
            </Button>
            <Button
              variant={filters.sortOrder === "desc" ? "solid" : "outline"}
              colorScheme="blue"
              onClick={() => onFilterChange({ sortOrder: "desc" })}
              px={2}
            >
              ↓
            </Button>
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
        spacing={6}
      >
        {companies.map((company, index) => (
          <ScaleFade key={company.id} in={true} delay={index * 0.05}>
            <CompanyCard company={company} />
          </ScaleFade>
        ))}
      </SimpleGrid>
    </Box>
  );
};
