import {
  Box,
  Container,
  Flex,
  Heading,
  VStack,
  useColorModeValue,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useLoaderData, useSubmit } from "react-router";
import {
  queryOptions,
  useSuspenseQuery,
  useIsFetching,
} from "@tanstack/react-query";
import { CompanySearch } from "../components/company/company-search";
import { CompanyCard } from "../components/company/company-card";
import type {
  CompanyFilters,
  PaginatedResult,
  Company,
} from "../utils/companies.types";
import type { QueryClient } from "@tanstack/react-query";
import type { LoaderFunctionArgs } from "react-router";

const companiesQuery = (initialData: PaginatedResult<Company>) =>
  queryOptions({
    queryKey: ["companies", "list", initialData],
    queryFn: async (): Promise<PaginatedResult<Company>> => {
      // This will only be called if there's no initial data
      // In our case, we always have initial data from the loader
      return initialData;
    },
    staleTime: 0, // Always consider data stale so it refetches on filter changes
  });

export async function loader({ request }: LoaderFunctionArgs) {
  const { getCompanies } = await import("../utils/companies.server");

  const url = new URL(request.url);

  // Extract filters from URL search params
  const filters: CompanyFilters = {};
  const search = url.searchParams.get("search");
  if (search) filters.search = search;

  const growth_stage = url.searchParams.get("growth_stage");
  if (growth_stage) filters.growth_stage = growth_stage;

  const customer_focus = url.searchParams.get("customer_focus");
  if (customer_focus) filters.customer_focus = customer_focus;

  const last_funding_type = url.searchParams.get("last_funding_type");
  if (last_funding_type) filters.last_funding_type = last_funding_type;

  const min_rank = url.searchParams.get("min_rank");
  if (min_rank) filters.min_rank = parseInt(min_rank, 10);

  const max_rank = url.searchParams.get("max_rank");
  if (max_rank) filters.max_rank = parseInt(max_rank, 10);

  const min_funding = url.searchParams.get("min_funding");
  if (min_funding) filters.min_funding = parseInt(min_funding, 10);

  const max_funding = url.searchParams.get("max_funding");
  if (max_funding) filters.max_funding = parseInt(max_funding, 10);

  // Get initial data server-side
  const initialData = await getCompanies({
    page: 1,
    limit: 12,
    ...filters,
  });

  return { filters, initialData };
}

export default function Companies() {
  const { filters: initialFilters, initialData } = useLoaderData() as {
    filters: CompanyFilters;
    initialData: PaginatedResult<Company>;
  };

  const [filters, setFilters] = useState<CompanyFilters>(initialFilters);
  const submit = useSubmit();

  // Use TanStack Query to get the data with initial data from loader
  const { data: companiesData } = useSuspenseQuery(companiesQuery(initialData));
  const isFetching = useIsFetching({ queryKey: ["companies", "list"] }) > 0;

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const sidebarBg = useColorModeValue("white", "gray.800");

  const handleFiltersChange = (newFilters: CompanyFilters) => {
    setFilters(newFilters);

    // Create form data with filters
    const formData = new FormData();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value != null && value !== "") {
        formData.append(key, String(value));
      }
    });

    // Submit to update URL and trigger loader
    submit(formData, { method: "get" });
  };

  const companies = companiesData.data;

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Header */}
      <Box bg="white" shadow="sm" borderBottom="1px" borderColor="gray.200">
        <Container maxW="7xl" py={4}>
          <Heading size="lg" color="gray.800">
            Company Directory
          </Heading>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="7xl" py={8}>
        <Flex gap={8} align="start">
          {/* Left Sidebar - Filters */}
          <Box
            w="300px"
            bg={sidebarBg}
            p={6}
            borderRadius="lg"
            shadow="sm"
            borderWidth="1px"
            borderColor="gray.200"
            position="sticky"
            top="24px"
            maxH="calc(100vh - 120px)"
            overflowY="auto"
          >
            <CompanySearch
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </Box>

          {/* Right Content - Companies Grid */}
          <Box flex="1">
            <VStack spacing={6} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {companies.map((company: Company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </SimpleGrid>

              {/* Pagination info */}
              <Text textAlign="center" color="gray.500" fontSize="sm">
                Showing {companies.length} of {companiesData.total} companies
                {companiesData.totalPages > 1 && (
                  <span>
                    {" "}
                    (Page {companiesData.page} of {companiesData.totalPages})
                  </span>
                )}
              </Text>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
