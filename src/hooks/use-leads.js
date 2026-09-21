"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { axiosInstance } from "@/src/utils/axios";

/**
 * Potential customers (leads) — CR2.
 * GET /admin/leads?status=&search=&per_page=&page=
 * -> { summary:{total,potential,paid}, items:[...], pagination }
 */
export function useLeads({ status = "potential", search = "", perPage = 20, page = 1 } = {}) {
  const query = useQuery({
    queryKey: ["admin-leads", { status, search, perPage, page }],
    queryFn: () =>
      axiosInstance
        .get("/admin/leads", {
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
    summary: payload.summary ?? { total: 0, potential: 0, paid: 0 },
    items: Array.isArray(payload.items) ? payload.items : [],
    pagination: payload.pagination ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
