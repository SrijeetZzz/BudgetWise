import { apiClient } from "../../../lib/api/client";
import { API_ENDPOINTS } from "../../../lib/api/endpoints";
import { ApiResponse } from "../../../types/auth.types";



import type {
  Notification,
  NotificationPaginationMeta,
} from "../../../types/notification";

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

export interface GetNotificationsParams {
  limit?: number;

  cursor?: string;

  status?: "READ" | "UNREAD";
}

/*
 * =========================================================
 * RESPONSE TYPE
 * =========================================================
 */

export interface GetNotificationsResult
  extends ApiResponse<Notification[]> {
  meta?: NotificationPaginationMeta;
}

/*
 * =========================================================
 * API
 * =========================================================
 */

export const notificationApi = {
  /*
   * =======================================================
   * GET NOTIFICATIONS
   * =======================================================
   */

  getNotifications: async (
    params?: GetNotificationsParams,
  ): Promise<GetNotificationsResult> => {
    const { data } =
      await apiClient.get<
        ApiResponse<Notification[]>
      >(
        API_ENDPOINTS.NOTIFICATIONS.BASE,
        {
          params,
        },
      );

    return {
      ...data,

      meta:
        data.meta as
          | NotificationPaginationMeta
          | undefined,
    };
  },

  /*
   * =======================================================
   * GET NOTIFICATION BY ID
   * =======================================================
   */

  getNotificationById: async (
    notificationId: string,
  ) => {
    const { data } =
      await apiClient.get<
        ApiResponse<Notification>
      >(
        `${API_ENDPOINTS.NOTIFICATIONS.BASE}/${notificationId}`,
      );

    return data;
  },

  /*
   * =======================================================
   * MARK ONE AS READ
   * =======================================================
   */

  markAsRead: async (
    notificationId: string,
  ) => {
    const { data } =
      await apiClient.put<
        ApiResponse<Notification>
      >(
        `${API_ENDPOINTS.NOTIFICATIONS.BASE}/${notificationId}/read`,
      );

    return data;
  },

  /*
   * =======================================================
   * MARK ALL AS READ
   * =======================================================
   */

  markAllAsRead: async () => {
    const { data } =
      await apiClient.put<
        ApiResponse<{
          modifiedCount: number;
        }>
      >(
        API_ENDPOINTS.NOTIFICATIONS.READ_ALL,
      );

    return data;
  },

  /*
   * =======================================================
   * DELETE NOTIFICATION
   * =======================================================
   */

  deleteNotification: async (
    notificationId: string,
  ) => {
    const { data } =
      await apiClient.delete<
        ApiResponse<null>
      >(
        `${API_ENDPOINTS.NOTIFICATIONS.BASE}/${notificationId}`,
      );

    return data;
  },
};