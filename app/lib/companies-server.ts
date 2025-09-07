import { prisma } from "@/utils/prisma-server";
import type { Company, PaginatedResult } from "@/types/companies";

// Server-side API functions for companies data

export interface CompaniesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  growth_stage?: string;
  customer_focus?: string;
  last_funding_type?: string;
  min_rank?: number;
  max_rank?: number;
  min_funding?: number;
  max_funding?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getCompaniesServer(
  params: CompaniesQueryParams = {}
): Promise<PaginatedResult<Company>> {
  const {
    page = 1,
    limit = 12,
    search,
    growth_stage,
    customer_focus,
    last_funding_type,
    min_rank,
    max_rank,
    min_funding,
    max_funding,
    sortBy = "rank",
    sortOrder = "asc",
  } = params;

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

  if (min_rank !== undefined || max_rank !== undefined) {
    where.rank = {};
    if (min_rank !== undefined) where.rank.gte = min_rank;
    if (max_rank !== undefined) where.rank.lte = max_rank;
  }

  if (min_funding !== undefined || max_funding !== undefined) {
    where.last_funding_amount = {};
    if (min_funding !== undefined) where.last_funding_amount.gte = min_funding;
    if (max_funding !== undefined) where.last_funding_amount.lte = max_funding;
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

  return {
    data: data.map((company) => ({
      ...company,
      // Convert BigInt to Number for JSON serialization
      last_funding_amount: company.last_funding_amount
        ? Number(company.last_funding_amount)
        : null,
    })),
    total,
    page,
    limit,
    totalPages,
  };
}

// URL parameter parsing utilities

/**
 * Parse URL search parameters into CompaniesQueryParams
 * Handles camelCase URL params and converts them to snake_case for the API
 */
export function parseCompaniesParamsFromURL(
  searchParams: URLSearchParams
): CompaniesQueryParams {
  const parseStringParam = (value: string | null): string => {
    if (!value || value === "undefined" || value === "null") return "";
    return value;
  };

  const parseNumberParam = (value: string | null): number | undefined => {
    if (!value || value === "undefined" || value === "null") return undefined;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? undefined : parsed;
  };

  return {
    page: parseNumberParam(searchParams.get("page")) || 1,
    limit: parseNumberParam(searchParams.get("limit")) || 12,
    search: parseStringParam(searchParams.get("search")),
    growth_stage: parseStringParam(searchParams.get("growthStage")),
    customer_focus: parseStringParam(searchParams.get("customerFocus")),
    last_funding_type: parseStringParam(searchParams.get("fundingType")),
    min_rank: parseNumberParam(searchParams.get("minRank")),
    max_rank: parseNumberParam(searchParams.get("maxRank")),
    min_funding: parseNumberParam(searchParams.get("minFunding")),
    max_funding: parseNumberParam(searchParams.get("maxFunding")),
    sortBy: parseStringParam(searchParams.get("sortBy")) || "rank",
    sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
  };
}
