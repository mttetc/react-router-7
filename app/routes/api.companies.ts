import {
  getCompaniesServer,
  parseCompaniesParamsFromURL,
} from "@/features/companies/api/companies-server";
import type { LoaderFunctionArgs } from "react-router";

/**
 * API endpoint for fetching companies data
 * Accepts query parameters for filtering, pagination, and sorting
 */
export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const url = new URL(request.url);
    const params = parseCompaniesParamsFromURL(url.searchParams);
    const companiesData = await getCompaniesServer(params);

    return Response.json(companiesData);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("API Error:", error);

    // Return appropriate error response
    if (error instanceof Error && error.message.includes("Invalid")) {
      return Response.json(
        { error: "Invalid request parameters", details: error.message },
        { status: 400 }
      );
    }

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
