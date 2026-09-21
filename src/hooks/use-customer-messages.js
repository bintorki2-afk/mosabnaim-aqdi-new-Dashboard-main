"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/src/utils/axios";
import {
  getAudienceSections,
  getMessagesByType,
  parseCustomerMessagesAll,
} from "@/src/lib/customer-messages";

async function fetchCustomerMessagesAll() {
  const res = await axiosInstance.get("/admin/customer-messages/all");
  return parseCustomerMessagesAll(res.data);
}

export function useCustomerMessages(type = "client", enabled = true) {
  const query = useQuery({
    queryKey: ["customer-messages", "all"],
    queryFn: fetchCustomerMessagesAll,
    enabled,
    staleTime: 60_000,
  });

  const data = query.data ?? {
    types: [],
    audiences: [],
    messages: [],
    totalMessages: 0,
  };

  return {
    messages: getMessagesByType(data.messages, type),
    sections: getAudienceSections(data.audiences, type),
    audiences: data.audiences,
    types: data.types,
    totalMessages: data.totalMessages,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
