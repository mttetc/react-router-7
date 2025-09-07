import { prisma } from "@/utils/prisma-server";
import type { Company, PaginatedResult } from "@/types/schemas";
import {
  CompaniesQueryParamsSchema,
  PaginatedResultSchema,
  CompanySchema,
  type CompaniesQueryParams,
} from "@/types/schemas";

// Server-side API functions for companies data

export async function getCompaniesServer(
  params: Partial<CompaniesQueryParams> = {}
): Promise<PaginatedResult<Company>> {
  // Validate input parameters
  const validationResult = CompaniesQueryParamsSchema.safeParse(params);
  if (!validationResult.success) {
    throw new Error(
      `Invalid query parameters: ${validationResult.error.issues
        .map((i) => i.message)
        .join(", ")}`
    );
  }

  const validatedParams = validationResult.data;
  const {
    page = 1,
    limit = 12,
    search,
    growthStage: growth_stage,
    customerFocus: customer_focus,
    fundingType: last_funding_type,
    minRank: min_rank,
    maxRank: max_rank,
    minFunding: min_funding,
    maxFunding: max_funding,
    sortBy = "rank",
    sortOrder = "asc",
  } = validatedParams;

  // Build Prisma where clause for filtering
  const where: any = {};

  if (search) {
    // Search across name, domain, and description
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { domain: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (growth_stage) {
    where.growth_stage = growth_stage;
  }

  if (customer_focus) {
    where.customer_focus = customer_focus;
  }

  if (last_funding_type) {
    where.last_funding_type = last_funding_type;
  }

  if (
    (min_rank !== null && min_rank !== undefined) ||
    (max_rank !== null && max_rank !== undefined)
  ) {
    where.rank = {};
    if (min_rank !== null && min_rank !== undefined) where.rank.gte = min_rank;
    if (max_rank !== null && max_rank !== undefined) where.rank.lte = max_rank;
  }

  if (
    (min_funding !== null && min_funding !== undefined) ||
    (max_funding !== null && max_funding !== undefined)
  ) {
    where.last_funding_amount = {};
    if (min_funding !== null && min_funding !== undefined)
      where.last_funding_amount.gte = min_funding;
    if (max_funding !== null && max_funding !== undefined)
      where.last_funding_amount.lte = max_funding;
  }

  // Build sorting clause
  const orderBy: any = {};
  orderBy[sortBy] = sortOrder;

  // Execute paginated query and count in parallel
  const [data, total] = await Promise.all([
    prisma.company.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.company.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Transform and validate the response data
  const transformedData = data.map((company) => ({
    ...company,
    // Convert BigInt to Number for JSON serialization
    last_funding_amount: company.last_funding_amount
      ? Number(company.last_funding_amount)
      : null,
  }));

  // Validate each company in the response
  const validatedData = transformedData.map((company) => {
    const companyValidation = CompanySchema.safeParse(company);
    if (!companyValidation.success) {
      console.error(`Invalid company data:`, companyValidation.error.issues);
      throw new Error(`Invalid company data for company ${company.id}`);
    }
    return companyValidation.data;
  });

  const result = {
    data: validatedData,
    total,
    page,
    limit,
    totalPages,
  };

  // Validate the entire response structure
  const responseValidation =
    PaginatedResultSchema(CompanySchema).safeParse(result);
  if (!responseValidation.success) {
    console.error(
      `Invalid response structure:`,
      responseValidation.error.issues
    );
    throw new Error("Invalid response structure");
  }

  return responseValidation.data;
}

// URL parameter parsing utilities

/**
 * Parse URL search parameters into CompaniesQueryParams
 * Handles camelCase URL params and converts them to snake_case for the API
 */
export function parseCompaniesParamsFromURL(
  searchParams: URLSearchParams
): Partial<CompaniesQueryParams> {
  const parseStringParam = (value: string | null): string => {
    if (!value || value === "undefined" || value === "null") return "";
    return value;
  };

  const parseNumberParam = (value: string | null): number | undefined => {
    if (!value || value === "undefined" || value === "null") return undefined;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? undefined : parsed;
  };

  const rawParams = {
    page: parseNumberParam(searchParams.get("page")) || 1,
    limit: parseNumberParam(searchParams.get("limit")) || 12,
    search: parseStringParam(searchParams.get("search")),
    growthStage: parseStringParam(searchParams.get("growthStage")),
    customerFocus: parseStringParam(searchParams.get("customerFocus")),
    fundingType: parseStringParam(searchParams.get("fundingType")),
    minRank: parseNumberParam(searchParams.get("minRank")),
    maxRank: parseNumberParam(searchParams.get("maxRank")),
    minFunding: parseNumberParam(searchParams.get("minFunding")),
    maxFunding: parseNumberParam(searchParams.get("maxFunding")),
    sortBy: parseStringParam(searchParams.get("sortBy")) || "rank",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
  };

  // Validate the parsed parameters
  const validationResult = CompaniesQueryParamsSchema.safeParse(rawParams);
  if (!validationResult.success) {
    console.error(`Invalid URL parameters:`, validationResult.error.issues);
    // Return safe defaults instead of throwing to prevent crashes
    return {
      page: 1,
      limit: 12,
      search: "",
      sortBy: "rank",
      sortOrder: "asc",
    };
  }

  return validationResult.data;
}
