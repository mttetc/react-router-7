import { Box, Container, Grid, Text } from "@chakra-ui/react";
import type { DehydratedState } from "@tanstack/react-query";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
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
import { useCompaniesData } from "../features/companies/hooks/use-companies-data";
import { useActiveFilterCount } from "../features/companies/utils/filter-utils";
import {
  buildURLParams,
  CompaniesService,
  type FilterState,
  type PaginationState,
  parseFiltersFromURL,
  parsePaginationFromURL,
} from "../services/companies.service";

// Components

// ============================================================================
// TYPES
// ============================================================================

interface LoaderData {
  dehydratedState: DehydratedState;
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

  console.log("🚀 [SSR] Prefetching companies data:", { filters, pagination });

  // Create a new QueryClient for this request
  // On server, gcTime defaults to Infinity which disables manual garbage collection
  // and automatically clears memory once request is finished
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60 * 1000, // 2 minutes
        // On server, we don't need to set gcTime as it defaults to Infinity
        // which is optimal for SSR
      },
    },
  });

  // Prefetch the companies data
  console.log("⏳ [SSR] Starting prefetch...");
  const startTime = Date.now();

  const foo = await queryClient.prefetchQuery({
    queryKey: ["companies", "feed", filters, pagination],
    queryFn: () => CompaniesService.fetchCompanies(filters, pagination),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const endTime = Date.now();
  console.log(`✅ [SSR] Prefetch completed in ${endTime - startTime}ms`);

  // Debug: Log the actual data we fetched
  console.log("📊 [SSR] Prefetched data:", foo);

  // Dehydrate the state
  const dehydratedState = dehydrate(queryClient);

  // Debug: Log what we're sending to the client
  console.log(
    "📦 [SSR] Dehydrated state queries:",
    dehydratedState.queries?.length || 0
  );
  console.log(
    "📦 [SSR] Query keys:",
    dehydratedState.queries?.map((q) => q.queryKey) || []
  );

  // Clear the cache to prevent memory leaks on server
  // This is important for high-traffic applications
  queryClient.clear();

  // Return the dehydrated state
  return {
    dehydratedState,
  };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

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

  // Data fetching with TanStack Query
  const { data, isLoading, error, isFetching, isStale } = useCompaniesData(
    filters,
    pagination
  );

  // Debug: Log what we're getting from the query
  console.log("🔍 [Client] Query state:", {
    hasData: !!data,
    dataKeys: data ? Object.keys(data) : [],
    dataLength: data?.data?.length,
    isLoading,
    isFetching,
    isStale,
    error: error?.message,
  });

  // Sync URL with state changes
  useEffect(() => {
    const params = buildURLParams(filters, pagination);
    const newSearch = params.toString();
    const currentSearch = searchParams.toString();

    if (newSearch !== currentSearch) {
      navigate(`?${newSearch}`, { replace: true });
    }
  }, [filters, pagination, navigate, searchParams]);

  // Filter management with debouncing for search
  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
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
    setPagination((prev) => ({ ...prev, page }));
  };

  // Count active filters
  const activeFilterCount = useActiveFilterCount(filters);

  if (error) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Header />
        <Container maxW="8xl" py={8}>
          <Box textAlign="center" py={20}>
            <Box fontSize="lg" fontWeight="medium" color="red.500" mb={2}>
              Error loading companies
            </Box>
            <Box fontSize="sm" color="gray.500">
              Please try refreshing the page
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <HydrationBoundary state={loaderData.dehydratedState}>
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
            <Box>
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

              {/* Pagination - Always visible */}
              <Box mt={8}>
                <Pagination
                  currentPage={data?.page || 1}
                  totalPages={data?.totalPages || 1}
                  onPageChange={goToPage}
                  isLoading={isLoading}
                />
              </Box>
            </Box>
          </Grid>
        </Container>
      </Box>
    </HydrationBoundary>
  );
}
