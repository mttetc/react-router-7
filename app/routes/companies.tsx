import {
  Box,
  Container,
  Grid,
  Presence,
  ScrollArea,
  Text,
  useScrollArea,
} from "@chakra-ui/react";

import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
  redirect,
} from "react-router";
import { useColorModeValue } from "../components/ui/color-mode";
import {
  parseFiltersFromFormData,
  validateFilters,
} from "../features/companies/forms/utils";

// Services and hooks
import { ActiveFilters } from "~/features/companies/components/active-filters";
import { CompanyTable } from "~/features/companies/components/company-table";
import { FilterForm } from "~/features/companies/forms";
import { Header } from "~/features/companies/components/header";
import { Pagination } from "~/features/companies/components/pagination";
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
// ACTION
// ============================================================================

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const filters = parseFiltersFromFormData(formData);

  console.log("🔄 [Form Action] Processing form submission:", filters);

  // Validate filters
  const validation = validateFilters(filters);
  if (!validation.success) {
    console.error("❌ [Form Action] Validation failed:", validation.errors);
    return { errors: validation.errors };
  }

  // Build URL params and redirect
  const pagination = { page: 1, limit: 12 };
  const params = buildURLParams(filters, pagination);
  const redirectUrl = `?${params.toString()}`;

  console.log("✅ [Form Action] Redirecting to:", redirectUrl);
  return redirect(redirectUrl);
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
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const scrollArea = useScrollArea();

  // Get current state from loader data
  const filters = loaderData.filters;
  const pagination = loaderData.pagination;

  // Use server data directly
  const data = loaderData.companiesData;
  // Check if we're navigating (loading new data)
  const isLoading = navigation.state === "loading";

  // Simple pagination handler
  const goToPage = (page: number) => {
    // Scroll to top when changing pages
    scrollArea.scrollToEdge({ edge: "top", behavior: "instant" });

    // Navigate to new page
    const newPagination = { ...pagination, page };
    const params = buildURLParams(filters, newPagination);
    window.location.href = `?${params.toString()}`;
  };

  // Simple filter reset (for active filters component)
  const resetFilters = () => {
    const emptyFilters: FilterState = {
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
    };
    const params = buildURLParams(emptyFilters, { page: 1, limit: 12 });
    window.location.href = `?${params.toString()}`;
  };

  const removeFilter = (key: keyof FilterState) => {
    const updatedFilters = { ...filters };
    if (
      key === "minRank" ||
      key === "maxRank" ||
      key === "minFunding" ||
      key === "maxFunding"
    ) {
      updatedFilters[key] = null;
    } else {
      (updatedFilters as any)[key] = "";
    }
    const params = buildURLParams(updatedFilters, { page: 1, limit: 12 });
    window.location.href = `?${params.toString()}`;
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
            <Grid templateColumns="280px 1fr" gap={8}>
              {/* Left Sidebar - Filters */}
              <Presence
                present={true}
                animationName={{
                  _open: "slide-from-bottom, fade-in",
                  _closed: "slide-to-bottom, fade-out",
                }}
                animationDuration="moderate"
                animationDelay="0.1s"
              >
                <FilterForm filters={filters} action="/companies" />
              </Presence>

              {/* Right Content */}
              <Presence
                present={true}
                animationName={{
                  _open: "slide-from-bottom, fade-in",
                  _closed: "slide-to-bottom, fade-out",
                }}
                animationDuration="moderate"
                animationDelay="0.2s"
                overflow="hidden"
              >
                <Box overflow="hidden">
                  {/* Active Filters */}
                  <ActiveFilters
                    filters={filters}
                    onRemoveFilter={removeFilter}
                    onResetAll={resetFilters}
                  />

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
                    onFilterChange={() => {}} // Form handles filtering now
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
