export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function getPaginationParams(urlSearchParams: URLSearchParams, defaultLimit = 20): PaginationParams {
  const page = Math.max(1, parseInt(urlSearchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(urlSearchParams.get('limit') || String(defaultLimit), 10)));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

export function buildPaginatedResponse<T>(items: T[], total: number, params: PaginationParams): PaginatedResult<T> {
  const totalPages = Math.ceil(total / params.limit) || 1;
  return {
    items,
    total,
    page: params.page,
    limit: params.limit,
    totalPages,
  };
}
