import type { LoaderFunctionArgs } from "react-router";
import { getCompanies } from "../utils/companies.server";
import {
  parseFiltersFromURL,
  parsePaginationFromURL,
} from "../services/companies.service";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  // Parse filters and pagination from URL
  const filters = parseFiltersFromURL(searchParams);
  const pagination = parsePaginationFromURL(searchParams);

  // Fetch companies data
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

  // Return clean JSON
  return Response.json(companiesData);
}
