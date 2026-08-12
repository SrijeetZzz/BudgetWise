import { Types } from "mongoose";

interface NotificationCursor {
  createdAt: string;
  id: string;
}

/**
 * Encode notification cursor.
 *
 * The cursor contains:
 * - createdAt
 * - notification _id
 *
 * The resulting value is opaque to the client.
 */
export const encodeNotificationCursor = (
  createdAt: Date,
  id: Types.ObjectId
): string => {
  const payload: NotificationCursor = {
    createdAt: createdAt.toISOString(),
    id: id.toString(),
  };

  return Buffer.from(
    JSON.stringify(payload)
  ).toString("base64url");
};

/**
 * Decode notification cursor.
 *
 * Returns null when the cursor is invalid.
 */
export const decodeNotificationCursor = (
  cursor: string
): {
  createdAt: Date;
  id: Types.ObjectId;
} | null => {
  try {
    const decoded = Buffer.from(
      cursor,
      "base64url"
    ).toString("utf-8");

    const payload = JSON.parse(
      decoded
    ) as NotificationCursor;

    if (
      !payload.createdAt ||
      !payload.id ||
      !Types.ObjectId.isValid(payload.id)
    ) {
      return null;
    }

    const createdAt = new Date(
      payload.createdAt
    );

    if (Number.isNaN(createdAt.getTime())) {
      return null;
    }

    return {
      createdAt,
      id: new Types.ObjectId(payload.id),
    };
  } catch {
    return null;
  }
};