/**
 * Pagination utility for API routes
 * Provides consistent pagination across all endpoints
 */

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface PaginationOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

/**
 * Parse pagination parameters from URL search params
 */
export function parsePaginationParams(
  searchParams: URLSearchParams,
  options: PaginationOptions = {}
): Required<PaginationParams> {
  const { defaultLimit = 10, maxLimit = 100 } = options;

  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(searchParams.get("limit") || String(defaultLimit)))
  );
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

  return { page, limit, sortBy, sortOrder };
}

/**
 * Calculate Prisma skip and take values from page and limit
 */
export function calculatePaginationValues(page: number, limit: number) {
  const skip = (page - 1) * limit;
  const take = limit;
  return { skip, take };
}

/**
 * Create pagination metadata
 */
export function createPaginationMeta(
  page: number,
  limit: number,
  total: number
) {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Create a paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    pagination: createPaginationMeta(page, limit, total),
  };
}

/**
 * Prisma orderBy helper - converts string to Prisma orderBy format
 */
export function createOrderBy(sortBy: string, sortOrder: "asc" | "desc") {
  return { [sortBy]: sortOrder };
}
