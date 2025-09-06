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
import { useCallback } from "react";

import { useQueryStates } from "nuqs";
import { CompanyTable } from "@/features/companies/components/company-table";
import { Header } from "@/features/companies/components/header";
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

  // Build params object for useCompaniesData
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

  // Now useCompaniesData will refetch when URL changes
  const { data, isLoading, error } = useCompaniesData(
    params,
    loaderData.companiesData
  );

  const isNavigating = navigation.state === "loading";

  const handlePageChange = useCallback(
    async (newPage: number) => {
      scrollArea.scrollToEdge({ edge: "top", behavior: "instant" });
      // Use the batched setter to avoid multiple state updates
      setQueryParams({ page: newPage });
    },
    [scrollArea, setQueryParams]
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
        bgColor: "rgba(255, 255, 255, 0.8)",
        zIndex: -1,
      }}
    >
      <Header />

      <Container p={4} h="100%" minH={0}>
        <Grid templateColumns="320px 1fr" gap={8} h="100%">
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
          <Box
            display="flex"
            flexDirection="column"
            overflow="hidden"
            minH="min-content"
            maxH="100%"
          >
            <Presence
              present={!!data || isLoading || isNavigating}
              animationName={{
                _open: "slide-from-right, fade-in",
                _closed: "slide-to-right, fade-out",
              }}
              animationDuration="moderate"
              animationDelay="0.2s"
            >
              <Box mb={2}>
                <Text fontSize="sm" color="gray.500">
                  {isLoading || isNavigating
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
                    />
                  </Presence>
                </ScrollArea.Content>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar />
            </ScrollArea.Root>

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
