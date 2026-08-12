import { FilterQuery, Types } from "mongoose";

import {
  INotification,
  Notification,
  NotificationStatus,
} from "../schemas/notification.schema";

export interface NotificationQueryOptions {
  limit?: number;

  cursor?: {
    createdAt: Date;
    id: Types.ObjectId;
  };

  status?: NotificationStatus;
}

export interface INotificationRepository {
  create(
    data: Partial<INotification>
  ): Promise<INotification>;

  findById(
    notificationId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<INotification | null>;

  findMany(
    userId: Types.ObjectId,
    options?: NotificationQueryOptions
  ): Promise<INotification[]>;

  markAsRead(
    notificationId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<INotification | null>;

  markAllAsRead(
    userId: Types.ObjectId
  ): Promise<number>;

  softDelete(
    notificationId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<INotification | null>;
}

export class NotificationRepository
  implements INotificationRepository
{
  async create(
    data: Partial<INotification>
  ): Promise<INotification> {
    return Notification.create(data);
  }

  async findById(
    notificationId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<INotification | null> {
    return Notification.findOne({
      _id: notificationId,
      userId,
      isDeleted: false,
    }).exec();
  }

  async findMany(
    userId: Types.ObjectId,
    options: NotificationQueryOptions = {}
  ): Promise<INotification[]> {
    const {
      limit = 20,
      cursor,
      status,
    } = options;

    const query: FilterQuery<INotification> = {
      userId,
      isDeleted: false,
    };

    if (status) {
      query.status = status;
    }

    if (cursor) {
      query.$or = [
        {
          createdAt: {
            $lt: cursor.createdAt,
          },
        },
        {
          createdAt: cursor.createdAt,
          _id: {
            $lt: cursor.id,
          },
        },
      ];
    }

    return Notification.find(query)
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .limit(limit + 1)
      .exec();
  }

  async markAsRead(
    notificationId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<INotification | null> {
    return Notification.findOneAndUpdate(
      {
        _id: notificationId,
        userId,
        isDeleted: false,
        status: NotificationStatus.UNREAD,
      },
      {
        $set: {
          status: NotificationStatus.READ,
          readAt: new Date(),
        },
      },
      {
        new: true,
      }
    ).exec();
  }

  async markAllAsRead(
    userId: Types.ObjectId
  ): Promise<number> {
    const result = await Notification.updateMany(
      {
        userId,
        isDeleted: false,
        status: NotificationStatus.UNREAD,
      },
      {
        $set: {
          status: NotificationStatus.READ,
          readAt: new Date(),
        },
      }
    ).exec();

    return result.modifiedCount;
  }

  async softDelete(
    notificationId: Types.ObjectId,
    userId: Types.ObjectId
  ): Promise<INotification | null> {
    return Notification.findOneAndUpdate(
      {
        _id: notificationId,
        userId,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      },
      {
        new: true,
      }
    ).exec();
  }
}