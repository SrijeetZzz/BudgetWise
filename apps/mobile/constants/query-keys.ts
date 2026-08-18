/*
 * =========================================================
 * QUERY KEYS
 * =========================================================
 */

export const notificationKeys = {
  all: ["notifications"] as const,

  lists: () =>
    [
      ...notificationKeys.all,
      "list",
    ] as const,

  list: (params?: {
    limit?: number;
    status?: "READ" | "UNREAD";
  }) =>
    [
      ...notificationKeys.lists(),
      params,
    ] as const,

  details: () =>
    [
      ...notificationKeys.all,
      "detail",
    ] as const,

  detail: (
    notificationId: string,
  ) =>
    [
      ...notificationKeys.details(),
      notificationId,
    ] as const,
};