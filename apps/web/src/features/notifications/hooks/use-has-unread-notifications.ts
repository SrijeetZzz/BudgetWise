import { useQuery } from "@tanstack/react-query";

import { notificationApi } from "../api/notification.api";
import { notificationKeys } from "@/constants/query-keys";

export const useHasUnreadNotifications = () => {
  return useQuery({
    queryKey: notificationKeys.list({
      limit: 1,
      status: "UNREAD",
    }),

    queryFn: () =>
      notificationApi.getNotifications({
        limit: 1,
        status: "UNREAD",
      }),

    select: (response) =>
      response.data.length > 0,
  });
};