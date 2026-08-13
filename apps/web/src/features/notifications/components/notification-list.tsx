// "use client";


// import { Notification } from "@/types/notification";
// import NotificationCard from "./notification-card";
// import { useNotifications } from "../hooks/use-notifications";

// interface NotificationListProps {
//   onNotificationClick?: (
//     notification: Notification,
//   ) => void;
// }

// const NotificationList = ({
//   onNotificationClick,
// }: NotificationListProps) => {
//   const {
//     data,
//     isLoading,
//     isError,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//   } = useNotifications();

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center py-10">
//         <p className="text-sm text-muted-foreground">
//           Loading notifications...
//         </p>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex items-center justify-center py-10">
//         <p className="text-sm text-destructive">
//           Failed to load notifications.
//         </p>
//       </div>
//     );
//   }

//   const notifications =
//     data?.pages.flatMap(
//       (page) => page.data,
//     ) ?? [];

//   if (notifications.length === 0) {
//     return (
//       <div className="flex items-center justify-center py-10 ">
//         <p className="text-sm text-muted-foreground">
//           No notifications yet.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-3">
//       {notifications.map((notification) => (
//         <NotificationCard
//           key={notification._id}
//           notification={notification}
//           onClick={onNotificationClick}
//         />
//       ))}

//       {hasNextPage && (
//         <div className="flex justify-center pt-4">
//           <button
//             type="button"
//             onClick={() => fetchNextPage()}
//             disabled={isFetchingNextPage}
//             className="rounded-lg border px-5 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {isFetchingNextPage
//               ? "Loading..."
//               : "Load More"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationList;

"use client";

import { Notification } from "@/types/notification";
import NotificationCard from "./notification-card";
import { useNotifications } from "../hooks/use-notifications";

interface NotificationListProps {
  status: "READ" | "UNREAD";
  onNotificationClick?: (
    notification: Notification,
  ) => void;
}

const NotificationList = ({
  status,
  onNotificationClick,
}: NotificationListProps) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications(status);

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-muted-foreground">
          Loading notifications...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-destructive">
          Failed to load notifications.
        </p>
      </div>
    );
  }

  const notifications =
    data?.pages.flatMap(
      (page) => page.data,
    ) ?? [];

  if (notifications.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-sm text-muted-foreground">
          {status === "UNREAD"
            ? "No unread notifications."
            : "No read notifications."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification._id}
          notification={notification}
          onClick={onNotificationClick}
        />
      ))}

      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="rounded-lg border px-5 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetchingNextPage
              ? "Loading..."
              : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationList;