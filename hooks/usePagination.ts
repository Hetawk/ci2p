"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface UsePaginationOptions {
  defaultPage?: number;
  defaultLimit?: number;
  updateURL?: boolean;
}

export interface PaginationState {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface UsePaginationReturn extends PaginationState {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setPaginationData: (data: {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }) => void;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  getQueryParams: () => URLSearchParams;
}

/**
 * Hook for managing pagination state with URL sync
 */
export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const { defaultPage = 1, defaultLimit = 10, updateURL = true } = options;

  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize from URL params or defaults
  const [page, setPageState] = useState(() => {
    if (updateURL) {
      const urlPage = searchParams.get("page");
      return urlPage ? parseInt(urlPage) : defaultPage;
    }
    return defaultPage;
  });

  const [limit, setLimitState] = useState(() => {
    if (updateURL) {
      const urlLimit = searchParams.get("limit");
      return urlLimit ? parseInt(urlLimit) : defaultLimit;
    }
    return defaultLimit;
  });

  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Update URL when page or limit changes
  useEffect(() => {
    if (updateURL) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [page, limit, updateURL, router, searchParams]);

  const setPage = useCallback((newPage: number) => {
    setPageState(Math.max(1, newPage));
  }, []);

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(Math.max(1, newLimit));
    setPageState(1); // Reset to first page when limit changes
  }, []);

  const setPaginationData = useCallback(
    (data: {
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    }) => {
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setHasNextPage(data.hasNextPage);
      setHasPreviousPage(data.hasPreviousPage);
    },
    []
  );

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage(page + 1);
    }
  }, [page, hasNextPage, setPage]);

  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setPage(page - 1);
    }
  }, [page, hasPreviousPage, setPage]);

  const firstPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const lastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages, setPage]);

  const getQueryParams = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    return params;
  }, [page, limit, searchParams]);

  return {
    page,
    limit,
    totalPages,
    total,
    hasNextPage,
    hasPreviousPage,
    setPage,
    setLimit,
    setPaginationData,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    getQueryParams,
  };
}
