import { Box, Container, Grid, useColorModeValue } from "@chakra-ui/react";
import { useState, useMemo, useEffect } from "react";
import { useDebounce } from "rooks";
import { useNavigate, useSearchParams } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

// Services and hooks
import {
  type FilterState,
  type PaginationState,
  parseFiltersFromURL,
  parsePaginationFromURL,
  buildURLParams,
} from "../services/companies.service";
import { useCompaniesData } from "../features/companies/hooks/use-companies-data";
import { useActiveFilterCount } from "../features/companies/utils/filter-utils";

// Components
import {
  Header,
  FilterSidebar,
  ActiveFilters,
  CompanyGrid,
  Pagination,
} from "../features/companies/components";

// ============================================================================
// LOADER
// ============================================================================

export async function loader({ request }: LoaderFunctionArgs) {
  return {};
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CompanyFeed() {
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
  const { data, isLoading, error } = useCompaniesData(filters, pagination);

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

            {/* Company Grid */}
            <CompanyGrid companies={data?.data || []} isLoading={isLoading} />

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
  );
}
