import {
  Box,
  Container,
  Grid,
  Presence,
  ScrollArea,
  Text,
  useScrollArea,
  Spinner,
  HStack,
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
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { filtersSearchParams } from "@/lib/search-params";
import {
  getCompaniesServer,
  parseCompaniesParamsFromURL,
} from "@/features/companies/api/companies-server";
import type {
  Company,
  PaginatedResult,
} from "@/features/companies/types/schemas";

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

  // Transform URL params to API params (keep camelCase for Zod validation)
  const params = {
    page: page || 1,
    limit: limit || 12,
    search: search || "",
    growthStage: growthStage || null,
    customerFocus: customerFocus || null,
    fundingType: fundingType || null,
    minRank: minRank || null,
    maxRank: maxRank || null,
    minFunding: minFunding || null,
    maxFunding: maxFunding || null,
    sortBy: sortBy || "rank",
    sortOrder: (sortOrder || "asc") as "asc" | "desc",
  };

  // Fetch companies data - will refetch when URL params change
  const { data, isLoading, isFetching, error } = useCompaniesData(
    params,
    loaderData.companiesData
  );

  // Show loading state when we don't have data yet OR when we're fetching new data
  const shouldShowLoading = isLoading || (isFetching && !data);

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
          isLoading={shouldShowLoading || isNavigating}
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
                present={!!data || shouldShowLoading || isNavigating}
                animationName={{
                  _open: "fade-in",
                  _closed: "fade-out",
                }}
                animationDuration="moderate"
              >
                <Box mb={2}>
                  <HStack gap={2}>
                    <Text fontSize="sm" color="gray.500">
                      {shouldShowLoading || isNavigating
                        ? "Loading companies..."
                        : error
                        ? "Error loading companies"
                        : `Showing ${data?.data?.length || 0} companies`}
                    </Text>
                    {isFetching && !shouldShowLoading && data && (
                      <Spinner size="xs" color="purple.500" />
                    )}
                  </HStack>
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
                      present={!!data || shouldShowLoading || isNavigating}
                      animationName={{
                        _open: "fade-in",
                        _closed: "fade-out",
                      }}
                      animationDuration="moderate"
                    >
                      <CompanyTable
                        companies={data?.data || []}
                        isLoading={shouldShowLoading || isNavigating}
                        currentPage={data?.page || 1}
                      />
                    </Presence>
                  </ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar />
              </ScrollArea.Root>

              {((data && data.total > 0) ||
                shouldShowLoading ||
                isNavigating) && (
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
                      isLoading={shouldShowLoading || isNavigating}
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
        <ErrorBoundary name="Mobile Filter Drawer">
          <MobileFilterDrawer
            isOpen={isFilterDrawerOpen}
            onClose={() => setIsFilterDrawerOpen(false)}
            activeFiltersCount={activeFiltersCount}
          />
        </ErrorBoundary>
      </Box>
    </Box>
  );
}
