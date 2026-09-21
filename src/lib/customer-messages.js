export function parseCustomerMessagesAll(response) {
  const data = response?.data ?? response;

  return {
    types: data?.types ?? [],
    audiences: data?.audiences ?? [],
    messages: data?.messages ?? [],
    totalMessages: data?.total_messages ?? 0,
  };
}

export function getAudienceByType(audiences, type) {
  return audiences.find((audience) => audience.type === type) ?? null;
}

export function getMessagesByType(messages, type) {
  return messages.filter((message) => message.type === type);
}

export function getAudienceSections(audiences, type) {
  return getAudienceByType(audiences, type)?.sections ?? [];
}
