

// import { apiClient } from "@/lib/api/client";
// import {
//   GetNotificationsResponse,
//   Notification,
// } from "@/types/notification";

// export interface GetNotificationsParams {
//   limit?: number;
//   cursor?: string;
//   status?: "READ" | "UNREAD";
// }

// const notificationApi = {
//   async getNotifications(
//     params?: GetNotificationsParams,
//   ): Promise<GetNotificationsResponse> {
//     const response = await apiClient.get(
//       "/notifications",
//       {
//         params,
//       },
//     );

//     return {
//       notifications: response.data.data,
//       meta: response.data.meta,
//     };
//   },

//   async getNotificationById(
//     notificationId: string,
//   ): Promise<Notification> {
//     const response = await apiClient.get(
//       `/notifications/${notificationId}`,
//     );

//     return response.data.data;
//   },

//   async markAsRead(
//     notificationId: string,
//   ): Promise<Notification> {
//     const response = await apiClient.put(
//       `/notifications/${notificationId}/read`,
//     );

//     return response.data.data;
//   },

//   async markAllAsRead(): Promise<{
//     modifiedCount: number;
//   }> {
//     const response = await apiClient.put(
//       "/notifications/read-all",
//     );

//     return response.data.data;
//   },

//   async deleteNotification(
//     notificationId: string,
//   ): Promise<void> {
//     await apiClient.delete(
//       `/notifications/${notificationId}`,
//     );
//   },
// };

// export default notificationApi;



import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

import type { ApiResponse } from "@/types/api.types";

import type {
  GetNotificationsResponse,
  Notification,
} from "@/types/notification";

export interface GetNotificationsParams {
  limit?: number;
  cursor?: string;
  status?: "READ" | "UNREAD";
}

export const notificationApi = {
  // ----------------------------------------
  // Notifications
  // ----------------------------------------

  getNotifications: async (
    params?: GetNotificationsParams,
  ) => {
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
      meta: data.meta as GetNotificationsResponse["meta"],
    };
  },

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

  deleteNotification: async (
    notificationId: string,
  ) => {
    const { data } =
      await apiClient.delete<ApiResponse<null>>(
        `${API_ENDPOINTS.NOTIFICATIONS.BASE}/${notificationId}`,
      );

    return data;
  },
};

