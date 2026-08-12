
import { Request, Response } from "express";
import { Types } from "mongoose";

import { asyncHandler } from "../../../common/helpers/asyncHandler";
import { sendResponse } from "../../../common/utils/response";
import { AppError } from "../../../common/exceptions/AppError";



import {
  validateGetNotificationsQuery,
  validateNotificationId,
} from "../validators/notification.validator";
import { notificationService } from "../services/notification.service";

class NotificationController {
  getNotifications = asyncHandler(
    async (req: Request, res: Response) => {
      const {
        limit,
        cursor,
        status,
      } = validateGetNotificationsQuery(req.query);

      const notifications =
        await notificationService.getNotifications(
          new Types.ObjectId(req.user.userId),
          {
            limit,
            cursor,
            status,
          },
        );

      return sendResponse(res, 200, {
        success: true,
        message: "Notifications fetched successfully",
        data: notifications.notifications,
        meta: {
          hasMore: notifications.hasMore,
          nextCursor: notifications.nextCursor,
        },
      });
    },
  );

  getNotificationById = asyncHandler(
    async (req: Request, res: Response) => {
      const notificationId =
        validateNotificationId(req.params.id as string);

      const notification =
        await notificationService.getNotificationById(
          new Types.ObjectId(req.user.userId),
          notificationId,
        );

      return sendResponse(res, 200, {
        success: true,
        message: "Notification fetched successfully",
        data: notification,
      });
    },
  );

  markAsRead = asyncHandler(
    async (req: Request, res: Response) => {
      const notificationId =
        validateNotificationId(req.params.id as string);

      const notification =
        await notificationService.markAsRead(
          new Types.ObjectId(req.user.userId),
          notificationId,
        );

      return sendResponse(res, 200, {
        success: true,
        message: "Notification marked as read successfully",
        data: notification,
      });
    },
  );

  markAllAsRead = asyncHandler(
    async (req: Request, res: Response) => {
      const modifiedCount =
        await notificationService.markAllAsRead(
          new Types.ObjectId(req.user.userId),
        );

      return sendResponse(res, 200, {
        success: true,
        message: "All notifications marked as read successfully",
        data: {
          modifiedCount,
        },
      });
    },
  );

  deleteNotification = asyncHandler(
    async (req: Request, res: Response) => {
      const notificationId =
        validateNotificationId(req.params.id as string);

      await notificationService.deleteNotification(
        new Types.ObjectId(req.user.userId),
        notificationId,
      );

      return sendResponse(res, 200, {
        success: true,
        message: "Notification deleted successfully",
      });
    },
  );
}

export default new NotificationController();

