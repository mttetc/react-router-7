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
import { useColorModeValue } from "../components/ui/color-mode";
import { useCallback } from "react";

import { useQueryStates } from "nuqs";
import { CompanyTable } from "~/features/companies/components/company-table";
import { Header } from "~/features/companies/components/header";
import { Pagination } from "~/features/companies/components/pagination";
import { FilterForm } from "~/features/companies/forms/filter-form";
import { useCompaniesData } from "~/features/companies/hooks/use-companies-data";
import { filtersSearchParams, loadFilters } from "~/lib/search-params";
import { getCompanies } from "../utils/companies.server";
import type { Company, PaginatedResult } from "../utils/companies.types";

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
  // Use nuqs loader to parse filters from URL
  const filters = loadFilters(request);
  const companiesData = await getCompanies({
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
    growth_stage: filters.growthStage || undefined,
    customer_focus: filters.customerFocus || undefined,
    last_funding_type: filters.fundingType || undefined,
    min_rank: filters.minRank ?? undefined,
    max_rank: filters.maxRank ?? undefined,
    min_funding: filters.minFunding ?? undefined,
    max_funding: filters.maxFunding ?? undefined,
    sortBy: filters.sortBy || undefined,
    sortOrder: filters.sortOrder as "asc" | "desc",
  });

  return {
    companiesData,
  };
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

  // Build filters object for useCompaniesData
  const filters = {
    search: search || "",
    growthStage: growthStage || "",
    customerFocus: customerFocus || "",
    fundingType: fundingType || "",
    minRank,
    maxRank,
    minFunding,
    maxFunding,
    sortBy: sortBy || "",
    sortOrder: (sortOrder || "asc") as "asc" | "desc",
  };

  const pagination = { page: page || 1, limit: limit || 12 };

  // Now useCompaniesData will refetch when URL changes
  const { data, isLoading, error } = useCompaniesData(
    filters,
    pagination,
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
