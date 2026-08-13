import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";


import { notificationKeys } from "@/constants/query-keys";
import { notificationApi } from "../api/notification.api";

type NotificationStatus = "READ" | "UNREAD";

export const useNotifications = (
  status: NotificationStatus = "UNREAD",
  limit = 20,
) => {
  return useInfiniteQuery({
    queryKey: notificationKeys.list({
      limit,
      status,
    }),

    queryFn: ({ pageParam }) =>
      notificationApi.getNotifications({
        limit,
        cursor: pageParam,
        status,
      }),

    initialPageParam: undefined as
      | string
      | undefined,

    getNextPageParam: (lastPage) =>
      lastPage.meta?.hasMore
        ? lastPage.meta.nextCursor
        : undefined,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationApi.markAsRead(notificationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      notificationApi.markAllAsRead(),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationApi.deleteNotification(notificationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};