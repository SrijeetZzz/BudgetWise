import { Types } from "mongoose";

import { NotificationStatus } from "../schemas/notification.schema";
import { decodeNotificationCursor } from "../utils/notification-cursor";

export interface GetNotificationsQuery {
  limit?: string;
  cursor?: string;
  status?: string;
}

export const validateGetNotificationsQuery = (
  query: GetNotificationsQuery
) => {
  let limit: number | undefined;

  if (query.limit !== undefined) {
    limit = Number(query.limit);

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 50
    ) {
      throw new Error(
        "Limit must be an integer between 1 and 50"
      );
    }
  }

  let status: NotificationStatus | undefined;

  if (query.status !== undefined) {
    if (
      !Object.values(NotificationStatus).includes(
        query.status as NotificationStatus
      )
    ) {
      throw new Error(
        "Invalid notification status"
      );
    }

    status =
      query.status as NotificationStatus;
  }

  let cursor:
    | {
        createdAt: Date;
        id: Types.ObjectId;
      }
    | undefined;

  if (query.cursor !== undefined) {
    const decodedCursor =
      decodeNotificationCursor(query.cursor);

    if (!decodedCursor) {
      throw new Error(
        "Invalid notification cursor"
      );
    }

    cursor = decodedCursor;
  }

  return {
    limit,
    cursor,
    status,
  };
};

export const validateNotificationId = (
  id: string
): Types.ObjectId => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(
      "Invalid notification ID"
    );
  }

  return new Types.ObjectId(id);
};