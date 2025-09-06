export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}

export interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
