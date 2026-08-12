
import { Types } from "mongoose";

import { AppError } from "../../../common/exceptions/AppError";

import {
  INotification,
  NotificationStatus,
  NotificationType,
} from "../schemas/notification.schema";

import {
  NotificationRepository,
} from "../repositories/notification.repository";

import {
  encodeNotificationCursor,
} from "../utils/notification-cursor";

interface CreateNotificationInput {
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}

interface GetNotificationsOptions {
  limit?: number;
  cursor?: {
    createdAt: Date;
    id: Types.ObjectId;
  };
  status?: NotificationStatus;
}

interface GetNotificationsResult {
  notifications: INotification[];
  hasMore: boolean;
  nextCursor: string | null;
}

class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  /**
   * Create a notification.
   *
   * Used internally by modules such as:
   * - Budget Engine
   * - Recurring Transaction Scheduler
   * - Bill Reminder logic
   */
  async createNotification(
    data: CreateNotificationInput,
  ): Promise<INotification> {
    return this.notificationRepository.create({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      metadata: data.metadata,
      status: NotificationStatus.UNREAD,
      readAt: null,
      isDeleted: false,
      deletedAt: null,
    });
  }

  /**
   * Get notifications for a user.
   *
   * Uses cursor-based pagination for the
   * frontend Load More functionality.
   */
  async getNotifications(
    userId: Types.ObjectId,
    options: GetNotificationsOptions = {},
  ): Promise<GetNotificationsResult> {
    const limit = Math.min(
      Math.max(options.limit ?? 20, 1),
      50,
    );

    const records =
      await this.notificationRepository.findMany(
        userId,
        {
          limit,
          cursor: options.cursor,
          status: options.status,
        },
      );

    const hasMore = records.length > limit;

    const notifications = hasMore
      ? records.slice(0, limit)
      : records;

    const lastNotification =
      notifications[notifications.length - 1];

    const nextCursor =
      hasMore && lastNotification
        ? encodeNotificationCursor(
            lastNotification.createdAt,
            lastNotification._id,
          )
        : null;

    return {
      notifications,
      hasMore,
      nextCursor,
    };
  }

  /**
   * Get a single notification belonging to the user.
   */
  async getNotificationById(
    userId: Types.ObjectId,
    notificationId: Types.ObjectId,
  ): Promise<INotification> {
    const notification =
      await this.notificationRepository.findById(
        notificationId,
        userId,
      );

    if (!notification) {
      throw new AppError(
        404,
        "Notification not found",
      );
    }

    return notification;
  }

  /**
   * Mark a notification as read.
   */
  async markAsRead(
    userId: Types.ObjectId,
    notificationId: Types.ObjectId,
  ): Promise<INotification> {
    const notification =
      await this.notificationRepository.markAsRead(
        notificationId,
        userId,
      );

    if (!notification) {
      throw new AppError(
        404,
        "Notification not found",
      );
    }

    return notification;
  }

  /**
   * Mark all unread notifications as read.
   */
  async markAllAsRead(
    userId: Types.ObjectId,
  ): Promise<number> {
    return this.notificationRepository.markAllAsRead(
      userId,
    );
  }

  /**
   * Soft delete a notification.
   */
  async deleteNotification(
    userId: Types.ObjectId,
    notificationId: Types.ObjectId,
  ): Promise<INotification> {
    const notification =
      await this.notificationRepository.softDelete(
        notificationId,
        userId,
      );

    if (!notification) {
      throw new AppError(
        404,
        "Notification not found",
      );
    }

    return notification;
  }
}

const notificationRepository =
  new NotificationRepository();

export const notificationService =
  new NotificationService(
    notificationRepository,
  );

export default notificationService;

