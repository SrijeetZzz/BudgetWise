
// "use client";

// import NotificationList from "@/features/notifications/components/notification-list";
// import { useMarkAllNotificationsAsRead } from "@/features/notifications/hooks/use-notifications";
// import { CheckCheck } from "lucide-react";

// const NotificationsPage = () => {
//   const markAllAsRead =
//     useMarkAllNotificationsAsRead();

//   const handleMarkAllAsRead = async () => {
//     await markAllAsRead.mutateAsync();
//   };

//   return (
//     <div className="space-y-6">
//       {/* Desktop Header */}
//       <div className="hidden sm:flex items-start justify-between gap-4 ">
//         {/* Heading */}
//         <div>
//           <h1 className="text-2xl font-semibold">
//             Notifications
//           </h1>

//           <p className="mt-1 text-sm text-muted-foreground">
//             Stay updated with your account activity.
//           </p>
//         </div>

//         {/* Actions */}
//         <button
//           type="button"
//           onClick={handleMarkAllAsRead}
//           disabled={markAllAsRead.isPending}
//           className="flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           <CheckCheck className="h-4 w-4" />

//           {markAllAsRead.isPending
//             ? "Marking..."
//             : "Mark all as read"}
//         </button>
//       </div>

//       {/* Mobile Action */}
//       <div className="px-1 sm:hidden">
//         <button
//           type="button"
//           onClick={handleMarkAllAsRead}
//           disabled={markAllAsRead.isPending}
//           className="flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           <CheckCheck className="h-4 w-4" />

//           {markAllAsRead.isPending
//             ? "Marking..."
//             : "Mark all as read"}
//         </button>
//       </div>

//       {/* Notification List */}
//       <div className="px-4 sm:px-0">
//         <NotificationList />
//       </div>
//     </div>
//   );
// };

// export default NotificationsPage;

"use client";

import { useState } from "react";
import { CheckCheck } from "lucide-react";

import NotificationList from "@/features/notifications/components/notification-list";
import { useMarkAllNotificationsAsRead } from "@/features/notifications/hooks/use-notifications";

type NotificationStatus = "READ" | "UNREAD";

const NotificationsPage = () => {
  const [status, setStatus] =
    useState<NotificationStatus>("UNREAD");

  const markAllAsRead =
    useMarkAllNotificationsAsRead();

  const handleMarkAllAsRead = async () => {
    await markAllAsRead.mutateAsync();
  };

  return (
    <div className="space-y-6 px-4">
      {/* Desktop Header */}
      <div className="hidden sm:flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Stay updated with your account activity.
          </p>
        </div>

        {status === "UNREAD" && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsRead.isPending}
            className="flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" />

            {markAllAsRead.isPending
              ? "Marking..."
              : "Mark all as read"}
          </button>
        )}
      </div>

      {/* Read / Unread Toggle */}
      <div className="flex w-full rounded-lg border p-1">
        <button
          type="button"
          onClick={() => setStatus("UNREAD")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            status === "UNREAD"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Unread
        </button>

        <button
          type="button"
          onClick={() => setStatus("READ")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            status === "READ"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Read
        </button>
      </div>

      {/* Mobile Mark All */}
      {status === "UNREAD" && (
        <div className="sm:hidden">
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsRead.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" />

            {markAllAsRead.isPending
              ? "Marking..."
              : "Mark all as read"}
          </button>
        </div>
      )}

      {/* Notifications */}
      <NotificationList status={status} />
    </div>
  );
};

export default NotificationsPage;