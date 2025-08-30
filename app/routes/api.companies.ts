import type { LoaderFunctionArgs } from "react-router";
import { getCompanies } from "../utils/companies.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  
  // Parse all filter parameters
  const q = url.searchParams.get("q") ?? "";
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const limit = parseInt(url.searchParams.get("limit") ?? "12", 10);
  const growth_stage = url.searchParams.get("growth_stage") ?? undefined;
  const customer_focus = url.searchParams.get("customer_focus") ?? undefined;
  const last_funding_type = url.searchParams.get("last_funding_type") ?? undefined;
  const min_rank = url.searchParams.get("min_rank") ? parseInt(url.searchParams.get("min_rank")!, 10) : undefined;
  const max_rank = url.searchParams.get("max_rank") ? parseInt(url.searchParams.get("max_rank")!, 10) : undefined;
  const min_funding = url.searchParams.get("min_funding") ? parseInt(url.searchParams.get("min_funding")!, 10) : undefined;
  const max_funding = url.searchParams.get("max_funding") ? parseInt(url.searchParams.get("max_funding")!, 10) : undefined;

  try {
    const companies = await getCompanies({
      page,
      limit,
      search: q,
      growth_stage,
      customer_focus,
      last_funding_type,
      min_rank,
      max_rank,
      min_funding,
      max_funding,
    });

    return Response.json(companies);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return Response.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
