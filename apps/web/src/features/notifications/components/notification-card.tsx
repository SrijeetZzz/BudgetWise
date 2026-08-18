
"use client";

import { Bell, Check, Trash2 } from "lucide-react";

import { Notification } from "@/types/notification";
import {
  useDeleteNotification,
  useMarkNotificationAsRead,
} from "../hooks/use-notifications";

interface NotificationCardProps {
  notification: Notification;
  onClick?: (notification: Notification) => void;
}

const NotificationCard = ({
  notification,
  onClick,
}: NotificationCardProps) => {
  const markAsRead = useMarkNotificationAsRead();
  const deleteNotification =
    useDeleteNotification();

  const isUnread =
    notification.status === "UNREAD";

  const handleClick = async () => {
    if (isUnread) {
      await markAsRead.mutateAsync(
        notification._id,
      );
    }

    onClick?.(notification);
  };

  const handleDelete = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();

    await deleteNotification.mutateAsync(
      notification._id,
    );
  };

  const isLoading =
    markAsRead.isPending ||
    deleteNotification.isPending;

  return (
    <div
      className={`w-full rounded-xl border transition-colors ${
        isUnread
          ? "bg-muted/50"
          : "bg-background"
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Notification Content */}
        <button
          type="button"
          onClick={handleClick}
          disabled={isLoading}
          className="flex min-w-0 flex-1 gap-3 text-left disabled:cursor-not-allowed"
        >
          {/* Notification Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
            <Bell className="h-5 w-5" />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-medium">
                {notification.title}
              </h3>

              {isUnread && (
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
              )}
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              {notification.message}
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              {new Date(
                notification.createdAt,
              ).toLocaleString()}
            </p>
          </div>
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isLoading}
          aria-label="Delete notification"
          className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;