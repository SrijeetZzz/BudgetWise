import { Types } from "mongoose";
import {
  NotificationStatus,
  NotificationType,
} from "../schemas/notification.schema";

/**
 * DTO for creating a notification internally.
 *
 * Used by Notification Service and eventually
 * by Budget Engine / Recurring Transaction Scheduler.
 */
export interface CreateNotificationDto {
  userId: Types.ObjectId;

  type: NotificationType;

  title: string;

  message: string;

  metadata?: Record<string, unknown>;
}

/**
 * DTO for retrieving notifications.
 *
 * Cursor-based pagination is used internally
 * to support the frontend Load More pattern.
 */
export interface GetNotificationsDto {
  limit?: number;

  cursor?: string;

  status?: NotificationStatus;
}

/**
 * Cursor payload used after decoding the
 * cursor received from the client.
 */
export interface NotificationCursorDto {
  createdAt: Date;

  id: Types.ObjectId;
}