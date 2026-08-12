import { Schema, model, Types } from "mongoose";

/**
 * Notification types supported by BudgetWise.
 */
export enum NotificationType {
  BUDGET_ALERT = "BUDGET_ALERT",
  RECURRING_REMINDER = "RECURRING_REMINDER",
  BILL_REMINDER = "BILL_REMINDER",
}

/**
 * Notification read status.
 */
export enum NotificationStatus {
  UNREAD = "UNREAD",
  READ = "READ",
}

/**
 * Notification document interface.
 */
export interface INotification {
  _id: Types.ObjectId;
  userId: Types.ObjectId;

  type: NotificationType;

  title: string;
  message: string;

  status: NotificationStatus;

  metadata?: Record<string, unknown>;

  readAt?: Date | null;

  isDeleted: boolean;
  deletedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(NotificationStatus),
      default: NotificationStatus.UNREAD,
      required: true,
      index: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: undefined,
    },

    readAt: {
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Primary index for the notification feed.
 *
 * Supports:
 * - User-specific notifications
 * - Excluding soft-deleted records
 * - Newest-first ordering
 * - Cursor/load-more queries
 */
notificationSchema.index({
  userId: 1,
  isDeleted: 1,
  createdAt: -1,
});

/**
 * Index for unread notification queries.
 */
notificationSchema.index({
  userId: 1,
  status: 1,
  isDeleted: 1,
  createdAt: -1,
});

export const Notification = model<INotification>(
  "Notification",
  notificationSchema,
);
