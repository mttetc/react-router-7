import { Box, Container, Grid, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import { useDebounce } from "rooks";
import { useColorModeValue } from "../components/ui/color-mode";

// Services and hooks
import { ActiveFilters } from "~/features/companies/components/active-filters";
import { CompanyTable } from "~/features/companies/components/company-table";
import { FilterSidebar } from "~/features/companies/components/filter-sidebar";
import { Header } from "~/features/companies/components/header";
import { Pagination } from "~/features/companies/components/pagination";
import { useActiveFilterCount } from "../features/companies/utils/filter-utils";
import {
  buildURLParams,
  type FilterState,
  type PaginationState,
  parseFiltersFromURL,
  parsePaginationFromURL,
} from "../services/companies.service";
import { getCompanies } from "../utils/companies.server";
import type { Company, PaginatedResult } from "../utils/companies.types";

// Components

// ============================================================================
// TYPES
// ============================================================================

interface LoaderData {
  companiesData: PaginatedResult<Company>;
  filters: FilterState;
  pagination: PaginationState;
}

// ============================================================================
// LOADER
// ============================================================================

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<LoaderData> {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Parse filters and pagination from URL
  const filters = parseFiltersFromURL(searchParams);
  const pagination = parsePaginationFromURL(searchParams);

  console.log("🚀 [SSR] Fetching companies data:", {
    filters,
    pagination,
  });

  // Fetch companies data directly on the server (only for initial load)
  const startTime = Date.now();

  const serverParams = {
    page: pagination.page,
    limit: pagination.limit,
    search: filters.search || undefined,
    growth_stage: filters.growthStage || undefined,
    customer_focus: filters.customerFocus || undefined,
    last_funding_type: filters.fundingType || undefined,
    min_rank: filters.minRank || undefined,
    max_rank: filters.maxRank || undefined,
    min_funding: filters.minFunding || undefined,
    max_funding: filters.maxFunding || undefined,
    sortBy: filters.sortBy || undefined,
    sortOrder: filters.sortOrder,
  };

  console.log("📋 [SSR] Server params:", serverParams);

  const companiesData = await getCompanies(serverParams);

  const endTime = Date.now();
  console.log(`✅ [SSR] Fetch completed in ${endTime - startTime}ms`);
  console.log("📊 [SSR] Fetched data:", {
    hasData: !!companiesData,
    companiesCount: companiesData?.data?.length || 0,
    totalPages: companiesData?.totalPages,
    currentPage: companiesData?.page,
  });

  // Return the data directly to be used as initialData
  return {
    companiesData,
    filters,
    pagination,
  };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

// Main component
export default function CompanyFeed() {
  const loaderData = useLoaderData<LoaderData>();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Initialize state from URL params
  const [filters, setFilters] = useState<FilterState>(() =>
    parseFiltersFromURL(searchParams)
  );

  const [pagination, setPagination] = useState<PaginationState>(() =>
    parsePaginationFromURL(searchParams)
  );

  // Use server data directly
  const data = loaderData.companiesData;
  const isLoading = false; // Server-side rendering, no loading state

  // Debounced navigation to prevent excessive server calls
  const navigateToFilters = (
    newFilters: FilterState,
    newPagination: PaginationState
  ) => {
    const params = buildURLParams(newFilters, newPagination);
    const newSearch = params.toString();
    const currentSearch = searchParams.toString();

    if (newSearch !== currentSearch) {
      navigate(`?${newSearch}`, { replace: true });
    }
  };

  const debouncedNavigate = useDebounce(navigateToFilters, 300);

  // Filter management with immediate UI updates but debounced navigation
  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    const updatedPagination = { ...pagination, page: 1 }; // Reset to first page

    // Update UI state immediately
    setFilters(updatedFilters);
    setPagination(updatedPagination);

    // Debounce the navigation (which triggers server fetch)
    debouncedNavigate(updatedFilters, updatedPagination);
  };

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
    if (
      key === "minRank" ||
      key === "maxRank" ||
      key === "minFunding" ||
      key === "maxFunding"
    ) {
      updateFilters({ [key]: null });
    } else {
      updateFilters({ [key]: "" });
    }
  };

  const goToPage = (page: number) => {
    const updatedPagination = { ...pagination, page };

    // Update UI state immediately
    setPagination(updatedPagination);

    // Navigate immediately for pagination (no debounce needed)
    navigateToFilters(filters, updatedPagination);
  };

  // Count active filters
  const activeFilterCount = useActiveFilterCount(filters);

  return (
    <Box minH="100vh" bg={bgColor}>
      <Header />

      <Container maxW="8xl" py={8}>
        <Grid templateColumns="320px 1fr" gap={8}>
          {/* Left Sidebar - Filters */}
          <FilterSidebar
            filters={filters}
            onFilterChange={updateFilters}
            onReset={resetFilters}
            activeFilterCount={activeFilterCount}
          />

          {/* Right Content */}
          <Box overflow="hidden">
            {/* Active Filters */}
            <ActiveFilters filters={filters} onRemoveFilter={removeFilter} />

            {/* Table Header */}
            <Box mb={4}>
              <Text fontSize="sm" color="gray.500">
                {isLoading
                  ? "Loading companies..."
                  : `Showing ${data?.data?.length || 0} companies`}
              </Text>
            </Box>

            {/* Company Table */}
            <CompanyTable
              companies={data?.data || []}
              isLoading={isLoading}
              filters={filters}
              onFilterChange={updateFilters}
            />

            {/* Pagination - Only show if there are results */}
            {data && data.total > 0 && (
              <Box mt={8}>
                <Pagination
                  currentPage={data.page}
                  totalPages={data.totalPages}
                  onPageChange={goToPage}
                  isLoading={isLoading}
                />
              </Box>
            )}
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}
