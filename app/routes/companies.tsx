import {
  Box,
  Container,
  Grid,
  Presence,
  ScrollArea,
  Text,
  useScrollArea,
} from "@chakra-ui/react";

import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigation } from "react-router";
import { useEffect } from "react";
import { useColorModeValue } from "../components/ui/color-mode";

// Services and hooks

import { CompanyTable } from "~/features/companies/components/company-table";
import { Header } from "~/features/companies/components/header";
import { Pagination } from "~/features/companies/components/pagination";
import { FilterForm } from "~/features/companies/forms";
import {
  buildURLParams,
  type FilterState,
  type PaginationState,
  parseFiltersFromURL,
  parsePaginationFromURL,
} from "../services/companies.service";
import { getCompanies } from "../utils/companies.server";
import type { Company, PaginatedResult } from "../utils/companies.types";
import { useFilterState, usePaginationState } from "~/hooks/use-filter-state";
import { useCompaniesData } from "~/features/companies/hooks/use-companies-data";

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
// LOADER (SSR Support)
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

  // Use the same parameter format as the client-side service
  const serverParams = {
    page: pagination.page,
    limit: pagination.limit,
    search: filters.search || undefined,
    growthStage: filters.growthStage || undefined,
    customerFocus: filters.customerFocus || undefined,
    fundingType: filters.fundingType || undefined,
    minRank: filters.minRank || undefined,
    maxRank: filters.maxRank || undefined,
    minFunding: filters.minFunding || undefined,
    maxFunding: filters.maxFunding || undefined,
    sortBy: filters.sortBy || undefined,
    sortOrder: filters.sortOrder,
  };

  console.log("📋 [SSR] Server params:", serverParams);

  // Convert to snake_case for the server function
  const companiesData = await getCompanies({
    page: serverParams.page,
    limit: serverParams.limit,
    search: serverParams.search,
    growth_stage: serverParams.growthStage,
    customer_focus: serverParams.customerFocus,
    last_funding_type: serverParams.fundingType,
    min_rank: serverParams.minRank,
    max_rank: serverParams.maxRank,
    min_funding: serverParams.minFunding,
    max_funding: serverParams.maxFunding,
    sortBy: serverParams.sortBy,
    sortOrder: serverParams.sortOrder,
  });

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
  const navigation = useNavigation();
  const scrollArea = useScrollArea();

  // Get filter and pagination state from nuqs hooks
  const { filters, updateFilters } = useFilterState();
  const { pagination, goToPage, resetPagination } = usePaginationState();

  // Use React Query to fetch data that responds to filter changes
  const { data, isLoading, error } = useCompaniesData(
    filters,
    pagination,
    undefined // Don't use initial data for now to test if React Query works
  );

  // Check if we're navigating (for additional loading states)
  const isNavigating = navigation.state === "loading";

  // Debug: Log data changes
  useEffect(() => {
    console.log("📊 [Companies] Data updated:", {
      hasData: !!data,
      companiesCount: data?.data?.length || 0,
      totalPages: data?.totalPages,
      currentPage: data?.page,
      isLoading,
      error: !!error,
    });
  }, [data, isLoading, error]);

  // Note: Pagination reset is now handled automatically in useFilterState
  // when filters change, preventing race conditions and multiple API calls

  // Enhanced pagination handler with scroll
  const handlePageChange = async (page: number) => {
    // Scroll to top when changing pages
    scrollArea.scrollToEdge({ edge: "top", behavior: "instant" });

    // Navigate to new page
    await goToPage(page);
  };

  return (
    <Box
      height="100dvh"
      bgImage="url(bg.png)"
      bgSize="cover"
      backgroundPosition="center"
      backgroundAttachment="fixed"
      pos="relative"
      zIndex={0}
      display="flex"
      flexDirection="column"
      _before={{
        content: '""',
        pos: "absolute",
        inset: 0,
        bgColor: useColorModeValue(
          "rgba(255, 255, 255, 0.8)",
          "rgba(0, 0, 0, 0.7)"
        ),
        zIndex: -1,
      }}
    >
      <Header />

      <ScrollArea.RootProvider value={scrollArea} flex="1">
        <ScrollArea.Viewport>
          <Container maxW="8xl" py={8}>
            <Grid templateColumns="320px 1fr" gap={8}>
              {/* Left Sidebar - Modern Filters */}
              <Presence
                present={true}
                animationName={{
                  _open: "slide-from-left, fade-in",
                  _closed: "slide-to-left, fade-out",
                }}
                animationDuration="moderate"
                animationDelay="0.1s"
              >
                <FilterForm />
              </Presence>

              {/* Right Content */}
              <Presence
                present={true}
                animationName={{
                  _open: "slide-from-right, fade-in",
                  _closed: "slide-to-right, fade-out",
                }}
                animationDuration="moderate"
                animationDelay="0.2s"
                overflow="hidden"
              >
                <Box overflow="hidden">
                  {/* Table Header */}
                  <Box mb={4}>
                    <Text fontSize="sm" color="gray.500">
                      {isLoading || isNavigating
                        ? "Loading companies..."
                        : error
                        ? "Error loading companies"
                        : `Showing ${data?.data?.length || 0} companies`}
                    </Text>
                  </Box>

                  {/* Company Table */}
                  <CompanyTable
                    companies={data?.data || []}
                    isLoading={isLoading || isNavigating}
                    filters={filters}
                    onFilterChange={updateFilters} // Use nuqs updateFilters for sorting
                  />

                  {/* Pagination - Only show if there are results */}
                  {data && data.total > 0 && (
                    <Box mt={8}>
                      <Pagination
                        currentPage={data.page}
                        totalPages={data.totalPages}
                        onPageChange={handlePageChange}
                        isLoading={isLoading || isNavigating}
                      />
                    </Box>
                  )}
                </Box>
              </Presence>
            </Grid>
          </Container>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar>
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.RootProvider>
    </Box>
  );
}
