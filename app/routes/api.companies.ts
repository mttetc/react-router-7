import type { LoaderFunctionArgs } from "react-router";
import { getCompanies } from "../utils/companies.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const limit = parseInt(url.searchParams.get("limit") ?? "12", 10);

  try {
    const companies = await getCompanies({ 
      page, 
      limit, 
      search: q 
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
