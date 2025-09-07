import type { LoaderFunctionArgs } from "react-router";
import {
  getCompaniesServer,
  parseCompaniesParamsFromURL,
} from "@/lib/companies-server";

/**
 * API endpoint for fetching companies data
 * Accepts query parameters for filtering, pagination, and sorting
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const params = parseCompaniesParamsFromURL(url.searchParams);
  const companiesData = await getCompaniesServer(params);

  return Response.json(companiesData);
}
