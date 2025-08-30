import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  VStack,
  HStack,
  Text,
  Input,
  Select,
  Button,
  Card,
  CardBody,
  Badge,
  IconButton,
  useColorModeValue,
  Divider,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import type { LoaderFunctionArgs } from "react-router";
import type { Company, PaginatedResult } from "../utils/companies.types";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FilterState {
  search: string;
  growthStage: string;
  customerFocus: string;
  fundingType: string;
}

interface PaginationState {
  page: number;
  limit: number;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

const fetchCompanies = async (
  filters: FilterState,
  pagination: PaginationState
): Promise<PaginatedResult<Company>> => {
  const params = new URLSearchParams();
  
  if (filters.search) params.set("q", filters.search);
  if (filters.growthStage) params.set("growth_stage", filters.growthStage);
  if (filters.customerFocus) params.set("customer_focus", filters.customerFocus);
  if (filters.fundingType) params.set("last_funding_type", filters.fundingType);
  
  params.set("page", pagination.page.toString());
  params.set("limit", pagination.limit.toString());

  const response = await fetch(`/api/companies?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch companies");
  }
  return response.json();
};

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

const useCompaniesData = (filters: FilterState, pagination: PaginationState) => {
  return useQuery({
    queryKey: ["companies", "test", filters, pagination],
    queryFn: () => fetchCompanies(filters, pagination),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const useFilters = (initialFilters: FilterState) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      growthStage: "",
      customerFocus: "",
      fundingType: "",
    });
  };

  return { filters, updateFilter, resetFilters };
};

const usePagination = (initialPage = 1, initialLimit = 12) => {
  const [pagination, setPagination] = useState<PaginationState>({
    page: initialPage,
    limit: initialLimit,
  });

  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const changeLimit = (limit: number) => {
    setPagination({ page: 1, limit });
  };

  return { pagination, goToPage, changeLimit };
};

// ============================================================================
// COMPONENTS
// ============================================================================

const Header = () => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      shadow="sm"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Container maxW="8xl" py={4}>
        <Heading size="lg" color="brand.500">
          Company Explorer
        </Heading>
        <Text color="gray.600" mt={1}>
          Discover and explore innovative companies
        </Text>
      </Container>
    </Box>
  );
};

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
}

const FilterSidebar = ({ filters, onFilterChange, onReset }: FilterSidebarProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Card bg={bgColor} borderColor={borderColor} h="fit-content" position="sticky" top="100px">
      <CardBody>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Heading size="md">Filters</Heading>
            <Button size="sm" variant="ghost" onClick={onReset}>
              Reset
            </Button>
          </HStack>

          <VStack spacing={4} align="stretch">
            <Box>
              <Text fontWeight="medium" mb={2}>
                Search
              </Text>
              <Input
                placeholder="Search companies..."
                value={filters.search}
                onChange={(e) => onFilterChange("search", e.target.value)}
              />
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>
                Growth Stage
              </Text>
              <Select
                placeholder="All stages"
                value={filters.growthStage}
                onChange={(e) => onFilterChange("growthStage", e.target.value)}
              >
                <option value="early">Early</option>
                <option value="seed">Seed</option>
                <option value="series-a">Series A</option>
                <option value="series-b">Series B</option>
                <option value="growth">Growth</option>
              </Select>
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>
                Customer Focus
              </Text>
              <Select
                placeholder="All types"
                value={filters.customerFocus}
                onChange={(e) => onFilterChange("customerFocus", e.target.value)}
              >
                <option value="b2b">B2B</option>
                <option value="b2c">B2C</option>
                <option value="b2c_b2b">B2B & B2C</option>
              </Select>
            </Box>

            <Box>
              <Text fontWeight="medium" mb={2}>
                Funding Type
              </Text>
              <Select
                placeholder="All funding types"
                value={filters.fundingType}
                onChange={(e) => onFilterChange("fundingType", e.target.value)}
              >
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
                <option value="Series C">Series C</option>
                <option value="Pre Seed">Pre Seed</option>
                <option value="Undisclosed">Undisclosed</option>
              </Select>
            </Box>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

interface CompanyCardProps {
  company: Company;
}

const CompanyCard = ({ company }: CompanyCardProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const formatFunding = (amount: number | null) => {
    if (!amount) return "N/A";
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  return (
    <Card
      bg={bgColor}
      borderColor={borderColor}
      _hover={{ shadow: "md", transform: "translateY(-2px)" }}
      transition="all 0.2s"
      cursor="pointer"
    >
      <CardBody>
        <VStack align="start" spacing={3}>
          <HStack justify="space-between" w="full">
            <Heading size="sm" noOfLines={1}>
              {company.name}
            </Heading>
            <Badge colorScheme="blue" fontSize="xs">
              #{company.rank}
            </Badge>
          </HStack>

          <Text fontSize="sm" color="gray.600" noOfLines={1}>
            {company.domain}
          </Text>

          <Text fontSize="sm" noOfLines={3} minH="60px">
            {company.description}
          </Text>

          <Divider />

          <VStack spacing={2} align="start" w="full">
            <HStack justify="space-between" w="full">
              <Text fontSize="xs" color="gray.500">
                Stage:
              </Text>
              <Badge size="sm" colorScheme="green">
                {company.growth_stage || "Unknown"}
              </Badge>
            </HStack>

            <HStack justify="space-between" w="full">
              <Text fontSize="xs" color="gray.500">
                Focus:
              </Text>
              <Badge size="sm" colorScheme="purple">
                {company.customer_focus?.toUpperCase() || "N/A"}
              </Badge>
            </HStack>

            <HStack justify="space-between" w="full">
              <Text fontSize="xs" color="gray.500">
                Funding:
              </Text>
              <Text fontSize="xs" fontWeight="medium">
                {formatFunding(company.last_funding_amount)}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

interface CompanyGridProps {
  companies: Company[];
  isLoading: boolean;
}

const CompanyGrid = ({ companies, isLoading }: CompanyGridProps) => {
  if (isLoading) {
    return (
      <Center h="400px">
        <VStack spacing={4}>
          <Spinner size="xl" color="brand.500" />
          <Text color="gray.500">Loading companies...</Text>
        </VStack>
      </Center>
    );
  }

  if (companies.length === 0) {
    return (
      <Center h="400px">
        <VStack spacing={4}>
          <Text fontSize="lg" color="gray.500">
            No companies found
          </Text>
          <Text fontSize="sm" color="gray.400">
            Try adjusting your filters
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Grid
      templateColumns={{
        base: "1fr",
        md: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
        xl: "repeat(4, 1fr)",
      }}
      gap={6}
    >
      {companies.map((company) => (
        <GridItem key={company.id}>
          <CompanyCard company={company} />
        </GridItem>
      ))}
    </Grid>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }: PaginationProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <Card bg={bgColor} borderColor={borderColor}>
      <CardBody>
        <HStack justify="space-between" align="center">
          <Text fontSize="sm" color="gray.600">
            Page {currentPage} of {totalPages}
          </Text>

          <HStack spacing={2}>
            <IconButton
              aria-label="Previous page"
              icon={<ChevronLeftIcon />}
              size="sm"
              variant="outline"
              isDisabled={currentPage === 1 || isLoading}
              onClick={() => onPageChange(currentPage - 1)}
            />

            {getPageNumbers().map((page) => (
              <Button
                key={page}
                size="sm"
                variant={page === currentPage ? "solid" : "outline"}
                colorScheme={page === currentPage ? "brand" : "gray"}
                isDisabled={isLoading}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}

            <IconButton
              aria-label="Next page"
              icon={<ChevronRightIcon />}
              size="sm"
              variant="outline"
              isDisabled={currentPage === totalPages || isLoading}
              onClick={() => onPageChange(currentPage + 1)}
            />
          </HStack>
        </HStack>
      </CardBody>
    </Card>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  return { q };
}

export default function TestPage() {
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // Custom hooks for state management
  const { filters, updateFilter, resetFilters } = useFilters({
    search: "",
    growthStage: "",
    customerFocus: "",
    fundingType: "",
  });

  const { pagination, goToPage } = usePagination(1, 12);

  // Data fetching with TanStack Query
  const { data, isLoading, error } = useCompaniesData(filters, pagination);

  return (
    <Box minH="100vh" bg={bgColor}>
      <Header />
      
      <Container maxW="8xl" py={8}>
        <Grid templateColumns="300px 1fr" gap={8}>
          {/* Left Sidebar - Filters */}
          <GridItem>
            <FilterSidebar
              filters={filters}
              onFilterChange={updateFilter}
              onReset={resetFilters}
            />
          </GridItem>

          {/* Right Content - Grid + Pagination */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Results Summary */}
              <HStack justify="space-between" align="center">
                <Text color="gray.600">
                  {data ? `${data.total} companies found` : "Loading..."}
                </Text>
                {error && (
                  <Text color="red.500" fontSize="sm">
                    Error loading companies
                  </Text>
                )}
              </HStack>

              {/* Company Grid */}
              <CompanyGrid
                companies={data?.data || []}
                isLoading={isLoading}
              />

              {/* Pagination */}
              {data && (
                <Pagination
                  currentPage={data.page}
                  totalPages={data.totalPages}
                  onPageChange={goToPage}
                  isLoading={isLoading}
                />
              )}
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}