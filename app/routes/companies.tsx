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
import { useCallback, useState } from "react";

import { useQueryStates } from "nuqs";
import { CompanyTable } from "@/features/companies/components/company-table";
import { Header } from "@/features/companies/components/header";
import { MobileLayout } from "@/features/companies/components/mobile-layout";
import { MobileFilterDrawer } from "@/features/companies/components/mobile-filter-drawer";
import { Pagination } from "@/features/companies/components/pagination";
import { FilterForm } from "@/features/companies/forms/filter-form";
import { useCompaniesData } from "@/features/companies/hooks/use-companies-data";
import { filtersSearchParams, loadFilters } from "@/lib/search-params";
import {
  getCompaniesServer,
  parseCompaniesParamsFromURL,
} from "@/lib/companies-server";
import type { Company, PaginatedResult } from "@/types/companies";

interface LoaderData {
  companiesData: PaginatedResult<Company>;
}

export function meta() {
  return [
    { title: "Specter lite - Companies" },
    { name: "description", content: "Browse and filter companies" },
  ];
}

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<LoaderData> {
  const url = new URL(request.url);
  const params = parseCompaniesParamsFromURL(url.searchParams);
  const companiesData = await getCompaniesServer(params);

  return { companiesData };
}

export default function CompanyFeed() {
  const loaderData = useLoaderData<LoaderData>();
  const navigation = useNavigation();
  const scrollArea = useScrollArea();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSqueezedLayout, setIsSqueezedLayout] = useState(true);

  // Read all filters from nuqs
  const [queryParams, setQueryParams] = useQueryStates({
    search: filtersSearchParams.search,
    growthStage: filtersSearchParams.growthStage,
    customerFocus: filtersSearchParams.customerFocus,
    fundingType: filtersSearchParams.fundingType,
    minRank: filtersSearchParams.minRank,
    maxRank: filtersSearchParams.maxRank,
    minFunding: filtersSearchParams.minFunding,
    maxFunding: filtersSearchParams.maxFunding,
    sortBy: filtersSearchParams.sortBy,
    sortOrder: filtersSearchParams.sortOrder,
    page: filtersSearchParams.page,
    limit: filtersSearchParams.limit,
  });

  // Extract individual values for easier access
  const {
    search,
    growthStage,
    customerFocus,
    fundingType,
    minRank,
    maxRank,
    minFunding,
    maxFunding,
    sortBy,
    sortOrder,
    page,
    limit,
  } = queryParams;

  // Transform URL params to API params (camelCase to snake_case)
  const params = {
    page: page || 1,
    limit: limit || 12,
    search: search || undefined,
    growth_stage: growthStage || undefined,
    customer_focus: customerFocus || undefined,
    last_funding_type: fundingType || undefined,
    min_rank: minRank || undefined,
    max_rank: maxRank || undefined,
    min_funding: minFunding || undefined,
    max_funding: maxFunding || undefined,
    sortBy: sortBy || "rank",
    sortOrder: (sortOrder || "asc") as "asc" | "desc",
  };

  // Fetch companies data - will refetch when URL params change
  const { data, isFetching, error } = useCompaniesData(
    params,
    loaderData.companiesData
  );

  const isNavigating = navigation.state === "loading";

  const handlePageChange = useCallback(
    (newPage: number) => {
      // Scroll to top and update page
      scrollArea.scrollToEdge({ edge: "top", behavior: "instant" });
      setQueryParams({ page: newPage });
    },
    [scrollArea, setQueryParams]
  );

  // Calculate active filters count for mobile
  const activeFiltersCount = [
    search,
    growthStage,
    customerFocus,
    fundingType,
    minRank,
    maxRank,
    minFunding,
    maxFunding,
    sortBy && sortBy !== "rank",
    sortOrder && sortOrder !== "asc",
  ].filter(Boolean).length;

  const handleFilterToggle = useCallback(() => {
    setIsFilterDrawerOpen(!isFilterDrawerOpen);
  }, [isFilterDrawerOpen]);

  const handleLayoutToggle = useCallback(() => {
    setIsSqueezedLayout(!isSqueezedLayout);
  }, [isSqueezedLayout]);

  const handleClearAllFilters = useCallback(() => {
    setQueryParams({
      growthStage: null,
      customerFocus: null,
      fundingType: null,
      minRank: null,
      maxRank: null,
      minFunding: null,
      maxFunding: null,
      sortBy: "rank",
      sortOrder: "asc",
      page: 1,
    });
  }, [setQueryParams]);

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
        bgColor: "rgba(255, 255, 255, 0.8)",
        zIndex: -1,
      }}
    >
      <Header
        onFilterToggle={handleFilterToggle}
        activeFiltersCount={activeFiltersCount}
        isFilterOpen={isFilterDrawerOpen}
        onLayoutToggle={handleLayoutToggle}
        isSqueezedLayout={isSqueezedLayout}
      />

      {/* Mobile Layout - hidden on desktop (md and up) */}
      <Box hideFrom="md" h="100%" minH={0}>
        <MobileLayout
          companies={data?.data || []}
          isLoading={isFetching || isNavigating}
          totalPages={data?.totalPages || 1}
          currentPage={data?.page || 1}
          onPageChange={handlePageChange}
          isSqueezed={isSqueezedLayout}
        />
      </Box>

      {/* Desktop Layout - hidden on mobile (below md) */}
      <Box hideBelow="md" h="100%" minH={0}>
        <Container p={4} h="100%" minH={0}>
          <Grid templateColumns="320px 1fr" gap={8} h="100%">
            <ScrollArea.Root variant="hover">
              <ScrollArea.Viewport>
                <ScrollArea.Content>
                  <Presence
                    present={true}
                    animationName={{
                      _open: "fade-in",
                      _closed: "fade-out",
                    }}
                    animationDuration="moderate"
                  >
                    <FilterForm />
                  </Presence>
                </ScrollArea.Content>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar />
            </ScrollArea.Root>

            {/* Right Content */}
            <Box
              display="flex"
              flexDirection="column"
              overflow="hidden"
              minH="min-content"
              maxH="100%"
            >
              <Presence
                present={!!data || isFetching || isNavigating}
                animationName={{
                  _open: "fade-in",
                  _closed: "fade-out",
                }}
                animationDuration="moderate"
              >
                <Box mb={2}>
                  <Text fontSize="sm" color="gray.500">
                    {isFetching || isNavigating
                      ? "Loading companies..."
                      : error
                      ? "Error loading companies"
                      : `Showing ${data?.data?.length || 0} companies`}
                  </Text>
                </Box>
              </Presence>

              <ScrollArea.Root
                variant="hover"
                flex="1"
                h="100%"
                maxH="min-content"
                minH="0"
              >
                <ScrollArea.Viewport>
                  <ScrollArea.Content>
                    <Presence
                      present={!!data || isFetching || isNavigating}
                      animationName={{
                        _open: "fade-in",
                        _closed: "fade-out",
                      }}
                      animationDuration="moderate"
                    >
                      <CompanyTable
                        companies={data?.data || []}
                        isLoading={isFetching || isNavigating}
                        currentPage={data?.page || 1}
                      />
                    </Presence>
                  </ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar />
              </ScrollArea.Root>

              {((data && data.total > 0) || isFetching || isNavigating) && (
                <Presence
                  present
                  animationName={{
                    _open: "fade-in",
                    _closed: "fade-out",
                  }}
                  animationDuration="moderate"
                >
                  <Box mt={4}>
                    <Pagination
                      currentPage={data?.page || 1}
                      totalPages={data?.totalPages || 1}
                      onPageChange={handlePageChange}
                      isLoading={isFetching || isNavigating}
                    />
                  </Box>
                </Presence>
              )}
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* Mobile Filter Drawer - only show on mobile */}
      <Box hideFrom="md">
        <MobileFilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          activeFiltersCount={activeFiltersCount}
          onClearAllFilters={handleClearAllFilters}
        />
      </Box>
    </Box>
  );
}
