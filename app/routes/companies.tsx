import {
  Box,
  Container,
  Grid,
  Presence,
  ScrollArea,
  Text,
  useScrollArea,
} from "@chakra-ui/react";

import { useEffect } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigation } from "react-router";
import { useColorModeValue } from "../components/ui/color-mode";

// Services and hooks

import { CompanyTable } from "~/features/companies/components/company-table";
import { Header } from "~/features/companies/components/header";
import { Pagination } from "~/features/companies/components/pagination";
import { FilterForm } from "~/features/companies/forms";
import { useCompaniesData } from "~/features/companies/hooks/use-companies-data";
import { useFilterState } from "~/hooks/use-filter-state";
import { useQueryState, parseAsInteger } from "nuqs";
import {
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
// LOADER (Single source of truth for data fetching)
// ============================================================================

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<LoaderData> {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Parse filters and pagination from URL
  const filters = parseFiltersFromURL(searchParams);
  const pagination = parsePaginationFromURL(searchParams);

  console.log("🚀 [Loader] Fetching companies with params:", {
    filters,
    pagination,
  });

  // Fetch companies data - preload pour le SSR
  const companiesData = await getCompanies({
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
  });

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

  // Get filter and pagination state from nuqs hooks (useFilterState has everything!)
  const { filters, updateFilters, page, setPage } = useFilterState();
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(12));

  const pagination = { page, limit };
  const goToPage = async (newPage: number) => {
    await setPage(newPage);
  };

  // Use React Query with server data as initial data
  const { data, isLoading, error } = useCompaniesData(
    filters,
    pagination,
    loaderData.companiesData,
    loaderData.filters,
    loaderData.pagination
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
      error: error ? error.message : null,
      errorDetails: error,
    });
  }, [data, isLoading, error]);

  // Enhanced pagination handler with scroll
  const handlePageChange = async (page: number) => {
    // Scroll to top when changing pages
    scrollArea.scrollToEdge({ edge: "top", behavior: "instant" });

    // Navigate to new page
    await goToPage(page);
  };

  const bgColor = useColorModeValue(
    "rgba(255, 255, 255, 0.8)",
    "rgba(0, 0, 0, 0.7)"
  );

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
        bgColor,
        zIndex: -1,
      }}
    >
      <Header />

      <Container p={4} h="100%" minH={0}>
        <Grid templateColumns="320px 1fr" gap={8} h="100%">
          {/* Left Sidebar - Modern Filters */}

          <ScrollArea.Root variant="hover">
            <ScrollArea.Viewport>
              <ScrollArea.Content>
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
              </ScrollArea.Content>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar />
          </ScrollArea.Root>

          {/* Right Content */}
          <Box display="flex" flexDirection="column" overflow="hidden">
            <Presence
              present={!!data || isLoading || isNavigating}
              animationName={{
                _open: "slide-from-right, fade-in",
                _closed: "slide-to-right, fade-out",
              }}
              animationDuration="moderate"
              animationDelay="0.2s"
            >
              {/* Table Header - Fixed */}
              <Box mb={4}>
                <Text fontSize="sm" color="gray.500">
                  {isLoading || isNavigating
                    ? "Loading companies..."
                    : error
                    ? "Error loading companies"
                    : `Showing ${data?.data?.length || 0} companies`}
                </Text>
              </Box>
            </Presence>

            {/* Company Table - Scrollable */}
            <ScrollArea.Root variant="hover" flex="1">
              <ScrollArea.Viewport>
                <ScrollArea.Content>
                  <Presence
                    present={!!data || isLoading || isNavigating}
                    animationName={{
                      _open: "slide-from-right, fade-in",
                      _closed: "slide-to-right, fade-out",
                    }}
                    animationDuration="moderate"
                    animationDelay="0.3s"
                  >
                    <CompanyTable
                      companies={data?.data || []}
                      isLoading={isLoading || isNavigating}
                      filters={filters}
                      onFilterChange={updateFilters}
                    />
                  </Presence>
                </ScrollArea.Content>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar />
            </ScrollArea.Root>

            {/* Pagination - Fixed at bottom */}
            {((data && data.total > 0) || isLoading || isNavigating) && (
              <Presence
                present
                animationName={{
                  _open: "slide-from-right, fade-in",
                  _closed: "slide-to-right, fade-out",
                }}
                animationDuration="moderate"
                animationDelay="0.4s"
              >
                <Box mt={4}>
                  <Pagination
                    currentPage={data?.page || 1}
                    totalPages={data?.totalPages || 1}
                    onPageChange={handlePageChange}
                    isLoading={isLoading || isNavigating}
                  />
                </Box>
              </Presence>
            )}
          </Box>
        </Grid>
      </Container>
    </Box>
  );
}
