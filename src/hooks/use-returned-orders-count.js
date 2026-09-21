"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/src/utils/axios";
import { REFUNDS_CONTRACTS_API } from "@/components/analysis/returned/refund-contract-utils";

const POLL_INTERVAL = 60_000;

// Same dataset as the "طلبات الاسترجاع" page rows + KPI counters
// (GET /admin/analytics/refunds/contracts), so the sidebar badge, the KPI
// cards and the table can never disagree (#19).
const fetchReturnedOrdersTotal = async () => {
  const response = await axiosInstance.get(REFUNDS_CONTRACTS_API, {
    params: { created_at: "all", page: 1 },
  });
  const body = response?.data?.data ?? response?.data ?? {};
  const total = body?.pagination?.total;
  if (total != null) return Number(total) || 0;
  return Array.isArray(body?.contracts) ? body.contracts.length : 0;
};

// Polls the total number of refund requests for the sidebar badge.
export function useReturnedOrdersCount() {
  const { data: total } = useQuery({
    queryKey: ["returnedOrdersTotal"],
    queryFn: fetchReturnedOrdersTotal,
    refetchInterval: POLL_INTERVAL,
    refetchIntervalInBackground: true,
    staleTime: 30_000,
  });

  return total ?? 0;
}
