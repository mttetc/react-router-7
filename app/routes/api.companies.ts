import {
  getCompaniesServer,
  parseCompaniesParamsFromURL,
} from "@/features/companies/api/companies-server";
import type { LoaderFunctionArgs } from "react-router";

/**
 * API endpoint for fetching companies data
 * This loader handles client-side AJAX requests and is used by React Query for data refetching.
 * It's different from the page loader in companies.tsx which runs during SSR.
 *
 * The API loader:
 * - Handles client-side AJAX requests
 * - Used by React Query for data refetching when filters change
 * - Returns JSON responses for API calls
 * - Includes error handling with proper HTTP status codes
 *
 * The page loader (companies.tsx):
 * - Runs during server-side rendering
 * - Provides initial data to useLoaderData()
 * - Enables faster page loads with pre-rendered content
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
