

"use client";

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import type {
  Notification as BudgetWiseNotification,
} from "../../../types/notification";

import NotificationCard from "./Notification-card";

import {
  useNotifications,
} from "../hooks/use-notifications";

import { useTheme } from "../../../providers/ThemeProvider";

interface NotificationListProps {
  status:
    | "READ"
    | "UNREAD";

  onNotificationClick?: (
    notification: BudgetWiseNotification,
  ) => void;
}

const NotificationList = ({
  status,
  onNotificationClick,
}: NotificationListProps) => {
  const { theme } = useTheme();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications(status);

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (isLoading) {
    return (
      <View
        style={styles.stateContainer}
      >
        <ActivityIndicator
          size="small"
          color={theme.text}
        />

        <Text
          style={[
            styles.stateText,
            {
              color:
                theme.textSecondary,
            },
          ]}
        >
          Loading notifications...
        </Text>
      </View>
    );
  }

  /*
   * =========================================================
   * ERROR
   * =========================================================
   */

  if (isError) {
    return (
      <View
        style={styles.stateContainer}
      >
        <Text
          style={[
            styles.errorText,
            {
              color:
                theme.destructive,
            },
          ]}
        >
          Failed to load notifications.
        </Text>
      </View>
    );
  }

  /*
   * =========================================================
   * FLATTEN PAGINATED DATA
   * =========================================================
   */

  const notifications =
    data?.pages.flatMap(
      (page) => page.data,
    ) ?? [];

  /*
   * =========================================================
   * EMPTY
   * =========================================================
   */

  if (
    notifications.length === 0
  ) {
    return (
      <View
        style={styles.emptyContainer}
      >
        <Text
          style={[
            styles.emptyTitle,
            {
              color:
                theme.textSecondary,
            },
          ]}
        >
          {status === "UNREAD"
            ? "No unread notifications"
            : "No read notifications"}
        </Text>

        <Text
          style={[
            styles.emptySubtitle,
            {
              color:
                theme.muted,
            },
          ]}
        >
          {status === "UNREAD"
            ? "You're all caught up."
            : "Read notifications will appear here."}
        </Text>
      </View>
    );
  }

  /*
   * =========================================================
   * LIST
   * =========================================================
   */

  return (
    <View
      style={styles.container}
    >
      {notifications.map(
        (notification) => (
          <NotificationCard
            key={notification._id}
            notification={
              notification
            }
            onClick={
              onNotificationClick
            }
          />
        ),
      )}

      {/* =================================================
          LOAD MORE
      ================================================= */}

      {hasNextPage && (
        <View
          style={
            styles.loadMoreContainer
          }
        >
          <Pressable
            onPress={() =>
              fetchNextPage()
            }
            disabled={
              isFetchingNextPage
            }
            style={({
              pressed,
            }) => [
              styles.loadMoreButton,
              {
                borderColor:
                  theme.border,
                backgroundColor:
                  theme.surface,
              },
              pressed &&
                styles.pressed,
              isFetchingNextPage &&
                styles.disabled,
            ]}
          >
            {isFetchingNextPage && (
              <ActivityIndicator
                size="small"
                color={theme.text}
              />
            )}

            <Text
              style={[
                styles.loadMoreText,
                {
                  color:
                    theme.text,
                },
              ]}
            >
              {isFetchingNextPage
                ? "Loading..."
                : "Load More"}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default NotificationList;

/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles =
  StyleSheet.create({
    container: {
      gap: 10,
    },

    /*
     * =======================================================
     * STATES
     * =======================================================
     */

    stateContainer: {
      minHeight: 150,

      alignItems: "center",
      justifyContent: "center",

      gap: 10,
    },

    stateText: {
      fontSize: 11,
      fontWeight: "500",
    },

    errorText: {
      fontSize: 11,
      fontWeight: "600",
    },

    emptyContainer: {
      minHeight: 180,

      alignItems: "center",
      justifyContent: "center",

      paddingHorizontal: 20,
    },

    emptyTitle: {
      fontSize: 12,
      fontWeight: "700",
    },

    emptySubtitle: {
      marginTop: 5,

      fontSize: 10,
      fontWeight: "500",

      textAlign: "center",
    },

    /*
     * =======================================================
     * LOAD MORE
     * =======================================================
     */

    loadMoreContainer: {
      alignItems: "center",

      paddingTop: 6,
    },

    loadMoreButton: {
      minWidth: 110,
      minHeight: 38,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      gap: 7,

      paddingHorizontal: 16,

      borderWidth: 1,

      borderRadius: 10,
    },

    loadMoreText: {
      fontSize: 10,
      fontWeight: "700",
    },

    /*
     * =======================================================
     * INTERACTION
     * =======================================================
     */

    pressed: {
      opacity: 0.65,
    },

    disabled: {
      opacity: 0.5,
    },
  });