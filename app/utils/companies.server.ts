import { prisma } from "./prisma.server";

export interface Company {
  id: string;
  name: string;
  domain: string;
  rank: number;
  description: string;
  createdAt: Date | null;
  growth_stage: string | null;
  last_funding_type: string | null;
  last_funding_amount: number | null;
  customer_focus: string | null;
}

export interface CompanyFilters {
  search?: string;
  growth_stage?: string;
  customer_focus?: string;
  last_funding_type?: string;
  min_rank?: number;
  max_rank?: number;
  min_funding?: number;
  max_funding?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getCompanies(
  params: {
    page?: number;
    limit?: number;
  } & CompanyFilters
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
  } = params;

  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { domain: { contains: search, mode: "insensitive" } },
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

  // Execute queries in parallel
  const [rawCompanies, total] = await Promise.all([
    prisma.company.findMany({
      where,
      skip,
      take: limit,
      orderBy: { rank: "asc" },
    }),
    prisma.company.count({ where }),
  ]);

  // Convert BigInt to number for last_funding_amount
  const companies = rawCompanies.map((company) => ({
    ...company,
    last_funding_amount: company.last_funding_amount
      ? Number(company.last_funding_amount)
      : null,
  }));

  const totalPages = Math.ceil(total / limit);

  return {
    data: companies,
    total,
    page,
    limit,
    totalPages,
  };
}

export async function searchCompanies(query: string): Promise<Company[]> {
  const rawCompanies = await prisma.company.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { domain: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 10,
    orderBy: { rank: "asc" },
  });

  // Convert BigInt to number for last_funding_amount
  return rawCompanies.map((company) => ({
    ...company,
    last_funding_amount: company.last_funding_amount
      ? Number(company.last_funding_amount)
      : null,
  }));
}
