export const notificationKeys = {
  all: ["notifications"] as const,

  lists: () =>
    [...notificationKeys.all, "list"] as const,

  list: (params?: {
    limit?: number;
    cursor?: string;
    status?: "READ" | "UNREAD";
  }) =>
    [
      ...notificationKeys.lists(),
      params,
    ] as const,

  details: () =>
    [...notificationKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...notificationKeys.details(), id] as const,
};