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
