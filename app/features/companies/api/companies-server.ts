import { prisma } from "@/lib/prisma-server";
import {
  CompaniesQueryParamsSchema,
  PaginatedResultSchema,
  CompanySchema,
  type CompaniesQueryParams,
  type Company,
  type PaginatedResult,
} from "@/features/companies/types/schemas";
import type { Prisma } from "@prisma/client";

// Server-side API functions for companies data

/**
 * Fetches companies data from the database with filtering, sorting, and pagination
 * @param params - Filter and pagination parameters
 * @returns Promise resolving to paginated companies data
 * @throws {Error} When validation fails or database query fails
 * @example
 * ```typescript
 * const companies = await getCompaniesServer({
 *   page: 1,
 *   limit: 12,
 *   search: "tech",
 *   growthStage: "early"
 * });
 * ```
 */
export async function getCompaniesServer(
  params: Partial<CompaniesQueryParams> = {}
): Promise<PaginatedResult<Company>> {
  // Validate input parameters with detailed error information
  const validationResult = CompaniesQueryParamsSchema.safeParse(params);
  if (!validationResult.success) {
    const errorDetails = validationResult.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
      code: issue.code,
      received: "received" in issue ? issue.received : undefined,
    }));

    throw new Error(
      `Invalid query parameters: ${JSON.stringify(errorDetails, null, 2)}`
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
  const where: Prisma.CompanyWhereInput = {};

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
  const orderBy: Prisma.CompanyOrderByWithRelationInput = {};
  orderBy[sortBy as keyof Prisma.CompanyOrderByWithRelationInput] = sortOrder;

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
 * Parses URL search parameters into CompaniesQueryParams with validation
 * Handles camelCase URL params and converts them to snake_case for the API
 * @param searchParams - URLSearchParams object from the request
 * @returns Parsed and validated query parameters
 * @throws {Error} When URL parameters are invalid
 * @example
 * ```typescript
 * const url = new URL(request.url);
 * const params = parseCompaniesParamsFromURL(url.searchParams);
 * // Returns: { page: 1, limit: 12, search: "tech", ... }
 * ```
 */
export function parseCompaniesParamsFromURL(
  searchParams: URLSearchParams
): Partial<CompaniesQueryParams> {
  /**
   * Parses a string parameter from URL, handling null/undefined values
   * @param value - Raw string value from URL
   * @returns Cleaned string or empty string if invalid
   */
  const parseStringParam = (value: string | null): string => {
    if (!value || value === "undefined" || value === "null") return "";
    return value;
  };

  /**
   * Parses a number parameter from URL, handling invalid values
   * @param value - Raw string value from URL
   * @returns Parsed number or undefined if invalid
   */
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
