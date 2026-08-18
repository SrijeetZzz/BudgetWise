import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { notificationApi } from "../api/notification.api";

import {
  notificationKeys,
} from "../../../constants/query-keys";

import type {
  NotificationStatus,
} from "../../../types/notification";

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

type NotificationStatusFilter =
  | "READ"
  | "UNREAD";

/*
 * =========================================================
 * GET NOTIFICATIONS
 *
 * Cursor-based pagination
 * =========================================================
 */

export const useNotifications = (
  status: NotificationStatusFilter = "UNREAD",
  limit = 20,
) => {
  return useInfiniteQuery({
    queryKey:
      notificationKeys.list({
        limit,
        status,
      }),

    queryFn: ({
      pageParam,
    }) =>
      notificationApi.getNotifications({
        limit,

        cursor: pageParam,

        status,
      }),

    /*
     * First request has no cursor.
     */

    initialPageParam:
      undefined as
        | string
        | undefined,

    /*
     * Get cursor for next page.
     */

    getNextPageParam: (
      lastPage,
    ) => {
      if (
        !lastPage.meta?.hasMore
      ) {
        return undefined;
      }

      return (
        lastPage.meta.nextCursor ??
        undefined
      );
    },
  });
};

/*
 * =========================================================
 * HAS UNREAD NOTIFICATIONS
 * =========================================================
 *
 * Useful for:
 *
 * - AppHeader notification badge
 * - Bottom navigation badge
 * - Notification icon badge
 * =========================================================
 */

export const useHasUnreadNotifications =
  () => {
    return useQuery({
      queryKey:
        notificationKeys.list({
          limit: 1,
          status: "UNREAD",
        }),

      queryFn: () =>
        notificationApi.getNotifications(
          {
            limit: 1,
            status: "UNREAD",
          },
        ),

      select: (
        response,
      ) =>
        response.data.length > 0,
    });
  };

/*
 * =========================================================
 * MARK ONE AS READ
 * =========================================================
 */

export const useMarkNotificationAsRead =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        notificationId: string,
      ) =>
        notificationApi.markAsRead(
          notificationId,
        ),

      onSuccess: () => {
        /*
         * Refresh:
         *
         * - unread list
         * - read list
         * - unread badge
         */

        queryClient.invalidateQueries(
          {
            queryKey:
              notificationKeys.all,
          },
        );
      },
    });
  };

/*
 * =========================================================
 * MARK ALL AS READ
 * =========================================================
 */

export const useMarkAllNotificationsAsRead =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: () =>
        notificationApi.markAllAsRead(),

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey:
              notificationKeys.all,
          },
        );
      },
    });
  };

/*
 * =========================================================
 * DELETE NOTIFICATION
 * =========================================================
 */

export const useDeleteNotification =
  () => {
    const queryClient =
      useQueryClient();

    return useMutation({
      mutationFn: (
        notificationId: string,
      ) =>
        notificationApi.deleteNotification(
          notificationId,
        ),

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey:
              notificationKeys.all,
          },
        );
      },
    });
  };