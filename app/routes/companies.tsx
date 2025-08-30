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
  InputGroup,
  InputLeftElement,
  Select,
  Button,
  Card,
  CardBody,
  Badge,
  Tag,
  TagLabel,
  TagCloseButton,
  IconButton,
  useColorModeValue,
  Divider,
  Spinner,
  Center,
  Image,
  Link as ChakraLink,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useState, useMemo } from "react";
import { useQuery, useIsFetching } from "@tanstack/react-query";
import { useDebounce } from "rooks";
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
  minRank: number | null;
  maxRank: number | null;
  minFunding: number | null;
  maxFunding: number | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
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
  if (filters.minRank) params.set("min_rank", filters.minRank.toString());
  if (filters.maxRank) params.set("max_rank", filters.maxRank.toString());
  if (filters.minFunding) params.set("min_funding", filters.minFunding.toString());
  if (filters.maxFunding) params.set("max_funding", filters.maxFunding.toString());
  
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
    queryKey: ["companies", "feed", filters, pagination],
    queryFn: () => fetchCompanies(filters, pagination),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
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
      <Container maxW="8xl" py={6}>
        <VStack spacing={2} align="start">
          <Heading size="xl" color="brand.500">
            Company Feed
          </Heading>
          <Text color="gray.600">
            Discover innovative companies with intelligent filtering
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
  activeFilterCount: number;
}

const FilterSidebar = ({ filters, onFilterChange, onReset, activeFilterCount }: FilterSidebarProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Card bg={bgColor} borderColor={borderColor} h="fit-content" position="sticky" top="120px">
      <CardBody>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Heading size="md">Filters</Heading>
            <HStack>
              {activeFilterCount > 0 && (
                <Badge colorScheme="blue" borderRadius="full">
                  {activeFilterCount}
                </Badge>
              )}
              <Button size="sm" variant="ghost" onClick={onReset}>
                Reset
              </Button>
            </HStack>
          </HStack>

          <VStack spacing={4} align="stretch">
            {/* Smart Search */}
            <Box>
              <Text fontWeight="medium" mb={2}>
                Smart Search
              </Text>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder="Search companies, domains..."
                  value={filters.search}
                  onChange={(e) => onFilterChange({ search: e.target.value })}
                />
              </InputGroup>
              <Text fontSize="xs" color="gray.500" mt={1}>
                Search by name, domain, or description
              </Text>
            </Box>

            <Divider />

            {/* Quick Filters */}
            <Box>
              <Text fontWeight="medium" mb={3}>
                Quick Filters
              </Text>
              <VStack spacing={3} align="stretch">
                <Box>
                  <Text fontSize="sm" mb={2}>Growth Stage</Text>
                  <Select
                    placeholder="All stages"
                    size="sm"
                    value={filters.growthStage}
                    onChange={(e) => onFilterChange({ growthStage: e.target.value })}
                  >
                    <option value="early">Early</option>
                    <option value="seed">Seed</option>
                    <option value="growing">Growing</option>
                    <option value="late">Late</option>
                    <option value="exit">Exit</option>
                  </Select>
                </Box>

                <Box>
                  <Text fontSize="sm" mb={2}>Customer Focus</Text>
                  <Select
                    placeholder="All types"
                    size="sm"
                    value={filters.customerFocus}
                    onChange={(e) => onFilterChange({ customerFocus: e.target.value })}
                  >
                    <option value="b2b">B2B</option>
                    <option value="b2c">B2C</option>
                    <option value="b2b_b2c">B2B & B2C</option>
                    <option value="b2c_b2b">B2C & B2B</option>
                  </Select>
                </Box>

                <Box>
                  <Text fontSize="sm" mb={2}>Funding Type</Text>
                  <Select
                    placeholder="All funding"
                    size="sm"
                    value={filters.fundingType}
                    onChange={(e) => onFilterChange({ fundingType: e.target.value })}
                  >
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                    <option value="Series C">Series C</option>
                    <option value="Pre Seed">Pre Seed</option>
                    <option value="Angel">Angel</option>
                    <option value="Convertible Note">Convertible Note</option>
                    <option value="Undisclosed">Undisclosed</option>
                  </Select>
                </Box>
              </VStack>
            </Box>

            <Divider />

            {/* Advanced Filters */}
            <Box>
              <Text fontWeight="medium" mb={3}>
                Advanced
              </Text>
              <VStack spacing={3} align="stretch">
                <Box>
                  <Text fontSize="sm" mb={2}>Rank Range</Text>
                  <HStack>
                    <NumberInput
                      size="sm"
                      value={filters.minRank || ""}
                      onChange={(_, val) => onFilterChange({ minRank: isNaN(val) ? null : val })}
                    >
                      <NumberInputField placeholder="Min" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <Text fontSize="sm">to</Text>
                    <NumberInput
                      size="sm"
                      value={filters.maxRank || ""}
                      onChange={(_, val) => onFilterChange({ maxRank: isNaN(val) ? null : val })}
                    >
                      <NumberInputField placeholder="Max" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </HStack>
                </Box>

                <Box>
                  <Text fontSize="sm" mb={2}>Funding Amount (USD)</Text>
                  <HStack>
                    <NumberInput
                      size="sm"
                      value={filters.minFunding || ""}
                      onChange={(_, val) => onFilterChange({ minFunding: isNaN(val) ? null : val })}
                    >
                      <NumberInputField placeholder="Min $" />
                    </NumberInput>
                    <Text fontSize="sm">to</Text>
                    <NumberInput
                      size="sm"
                      value={filters.maxFunding || ""}
                      onChange={(_, val) => onFilterChange({ maxFunding: isNaN(val) ? null : val })}
                    >
                      <NumberInputField placeholder="Max $" />
                    </NumberInput>
                  </HStack>
                </Box>
              </VStack>
            </Box>

            <Divider />

            {/* Sorting */}
            <Box>
              <Text fontWeight="medium" mb={3}>
                Sort By
              </Text>
              <HStack>
                <Select
                  size="sm"
                  value={filters.sortBy}
                  onChange={(e) => onFilterChange({ sortBy: e.target.value })}
                >
                  <option value="">Default</option>
                  <option value="name">Name</option>
                  <option value="rank">Rank</option>
                  <option value="funding">Funding</option>
                </Select>
                <Select
                  size="sm"
                  value={filters.sortOrder}
                  onChange={(e) => onFilterChange({ sortOrder: e.target.value as "asc" | "desc" })}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </Select>
              </HStack>
            </Box>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveFilter: (key: keyof FilterState) => void;
}

const ActiveFilters = ({ filters, onRemoveFilter }: ActiveFiltersProps) => {
  const activeFilters = useMemo(() => {
    const active = [];
    if (filters.search) active.push({ key: 'search', label: `Search: "${filters.search}"` });
    if (filters.growthStage) active.push({ key: 'growthStage', label: `Stage: ${filters.growthStage}` });
    if (filters.customerFocus) active.push({ key: 'customerFocus', label: `Focus: ${filters.customerFocus}` });
    if (filters.fundingType) active.push({ key: 'fundingType', label: `Funding: ${filters.fundingType}` });
    if (filters.minRank) active.push({ key: 'minRank', label: `Min Rank: ${filters.minRank}` });
    if (filters.maxRank) active.push({ key: 'maxRank', label: `Max Rank: ${filters.maxRank}` });
    if (filters.minFunding) active.push({ key: 'minFunding', label: `Min Funding: $${filters.minFunding.toLocaleString()}` });
    if (filters.maxFunding) active.push({ key: 'maxFunding', label: `Max Funding: $${filters.maxFunding.toLocaleString()}` });
    return active;
  }, [filters]);

  if (activeFilters.length === 0) return null;

  return (
    <Box>
      <Text fontSize="sm" color="gray.600" mb={2}>
        Active Filters:
      </Text>
      <Wrap>
        {activeFilters.map(({ key, label }) => (
          <WrapItem key={key}>
            <Tag size="md" colorScheme="blue" borderRadius="full">
              <TagLabel>{label}</TagLabel>
              <TagCloseButton onClick={() => onRemoveFilter(key as keyof FilterState)} />
            </Tag>
          </WrapItem>
        ))}
      </Wrap>
    </Box>
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

  const logoUrl = `https://app.tryspecter.com/logo?domain=${company.domain}`;

  return (
    <Card
      bg={bgColor}
      borderColor={borderColor}
      _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
      transition="all 0.2s"
      cursor="pointer"
    >
      <CardBody>
        <VStack align="start" spacing={4}>
          <HStack justify="space-between" w="full">
            <HStack>
              <Image
                src={logoUrl}
                alt={`${company.name} logo`}
                boxSize="40px"
                borderRadius="md"
                fallbackSrc="https://via.placeholder.com/40"
              />
              <VStack align="start" spacing={0}>
                <Heading size="sm" noOfLines={1}>
                  {company.name}
                </Heading>
                <ChakraLink
                  href={`https://${company.domain}`}
                  isExternal
                  fontSize="xs"
                  color="gray.500"
                  _hover={{ color: "brand.500" }}
                >
                  {company.domain}
                </ChakraLink>
              </VStack>
            </HStack>
            <Badge colorScheme="blue" fontSize="xs">
              #{company.rank}
            </Badge>
          </HStack>

          <Text fontSize="sm" noOfLines={3} minH="60px">
            {company.description}
          </Text>

          <Divider />

          <Grid templateColumns="1fr 1fr" gap={2} w="full">
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" color="gray.500">Stage</Text>
              <Badge size="sm" colorScheme="green">
                {company.growth_stage || "Unknown"}
              </Badge>
            </VStack>
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" color="gray.500">Focus</Text>
              <Badge size="sm" colorScheme="purple">
                {company.customer_focus?.toUpperCase() || "N/A"}
              </Badge>
            </VStack>
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" color="gray.500">Funding</Text>
              <Text fontSize="xs" fontWeight="medium">
                {formatFunding(company.last_funding_amount)}
              </Text>
            </VStack>
            <VStack align="start" spacing={1}>
              <Text fontSize="xs" color="gray.500">Type</Text>
              <Text fontSize="xs" fontWeight="medium" noOfLines={1}>
                {company.last_funding_type || "N/A"}
              </Text>
            </VStack>
          </Grid>
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
            Try adjusting your filters or search terms
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
        lg: "repeat(2, 1fr)",
        xl: "repeat(3, 1fr)",
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

  if (totalPages <= 1) return null;

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
  return {};
}

export default function CompanyFeed() {
  const bgColor = useColorModeValue("gray.50", "gray.900");

  // State management
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    growthStage: "",
    customerFocus: "",
    fundingType: "",
    minRank: null,
    maxRank: null,
    minFunding: null,
    maxFunding: null,
    sortBy: "",
    sortOrder: "asc",
  });

  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 12,
  });

  // Data fetching with TanStack Query
  const { data, isLoading, error } = useCompaniesData(filters, pagination);

  // Filter management with debouncing for search
  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const debouncedUpdateFilters = useDebounce(updateFilters, 300);

  const resetFilters = () => {
    setFilters({
      search: "",
      growthStage: "",
      customerFocus: "",
      fundingType: "",
      minRank: null,
      maxRank: null,
      minFunding: null,
      maxFunding: null,
      sortBy: "",
      sortOrder: "asc",
    });
    setPagination({ page: 1, limit: 12 });
  };

  const removeFilter = (key: keyof FilterState) => {
    if (key === 'minRank' || key === 'maxRank' || key === 'minFunding' || key === 'maxFunding') {
      updateFilters({ [key]: null });
    } else {
      updateFilters({ [key]: "" });
    }
  };

  const goToPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'sortBy' || key === 'sortOrder') return false;
      return value !== "" && value !== null;
    }).length;
  }, [filters]);

  return (
    <Box minH="100vh" bg={bgColor}>
      <Header />
      
      <Container maxW="8xl" py={8}>
        <Grid templateColumns="320px 1fr" gap={8}>
          {/* Left Sidebar - Filters */}
          <GridItem>
            <FilterSidebar
              filters={filters}
              onFilterChange={updateFilters}
              onReset={resetFilters}
              activeFilterCount={activeFilterCount}
            />
          </GridItem>

          {/* Right Content - Active Filters + Grid + Pagination */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Active Filters */}
              <ActiveFilters filters={filters} onRemoveFilter={removeFilter} />

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
