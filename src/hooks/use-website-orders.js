"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { axiosInstance } from "@/src/utils/axios";

/**
 * Website orders (طلبات الموقع) — no-login submissions from the public site.
 * GET /admin/website-orders?status=&search=&per_page=&page=
 * -> { summary:{total,new}, items:[...], pagination }
 */
export function useWebsiteOrders({ status = "", search = "", perPage = 20, page = 1 } = {}) {
  const query = useQuery({
    queryKey: ["admin-website-orders", { status, search, perPage, page }],
    queryFn: () =>
      axiosInstance
        .get("/admin/website-orders", {
          params: {
            status: status || undefined,
            search: search || undefined,
            per_page: perPage,
            page,
          },
        })
        .then((res) => res.data),
    placeholderData: keepPreviousData,
  });

  const payload = query.data?.data ?? query.data ?? {};

  return {
    summary: payload.summary ?? { total: 0, new: 0 },
    items: Array.isArray(payload.items) ? payload.items : [],
    pagination: payload.pagination ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
