
"use client";

import {
  Bell,
  Check,
  Trash2,
} from "lucide-react-native";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useDeleteNotification,
  useMarkNotificationAsRead,
} from "../hooks/use-notifications";

import { Notification } from "../../../types/notification";

import { useTheme } from "../../../providers/ThemeProvider";

interface NotificationCardProps {
  notification: Notification;

  onClick?: (
    notification: Notification,
  ) => void;
}

const NotificationCard = ({
  notification,
  onClick,
}: NotificationCardProps) => {
  const { theme } = useTheme();

  const markAsRead =
    useMarkNotificationAsRead();

  const deleteNotification =
    useDeleteNotification();

  const isUnread =
    notification.status === "UNREAD";

  /*
   * =========================================================
   * OPEN NOTIFICATION
   * =========================================================
   */

  const handleClick = async () => {
    try {
      /*
       * Automatically mark unread
       * notifications as read.
       */

      if (isUnread) {
        await markAsRead.mutateAsync(
          notification._id,
        );
      }

      onClick?.(notification);
    } catch (error) {
      console.error(
        "Failed to mark notification as read:",
        error,
      );
    }
  };

  /*
   * =========================================================
   * DELETE
   * =========================================================
   */

  const handleDelete = async () => {
    try {
      await deleteNotification.mutateAsync(
        notification._id,
      );
    } catch (error) {
      console.error(
        "Failed to delete notification:",
        error,
      );
    }
  };

  const isLoading =
    markAsRead.isPending ||
    deleteNotification.isPending;

  /*
   * =========================================================
   * DATE
   * =========================================================
   */

  const formattedDate =
    new Date(
      notification.createdAt,
    ).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <View
      style={[
        styles.card,
        {
          borderColor:
            theme.border,

          backgroundColor:
            isUnread
              ? theme.surfaceSecondary
              : theme.surface,
        },
      ]}
    >
      <View
        style={styles.cardContent}
      >
        {/* =================================================
            NOTIFICATION CONTENT
        ================================================= */}

        <Pressable
          onPress={handleClick}
          disabled={isLoading}
          style={({ pressed }) => [
            styles.notificationButton,
            pressed &&
              styles.pressed,
          ]}
        >
          {/* =================================================
              ICON
          ================================================= */}

          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor:
                  isUnread
                    ? theme.border
                    : theme.surfaceSecondary,
              },
            ]}
          >
            <Bell
              size={18}
              color={theme.text}
              strokeWidth={2}
            />
          </View>

          {/* =================================================
              CONTENT
          ================================================= */}

          <View
            style={styles.textContainer}
          >
            <View
              style={
                styles.titleRow
              }
            >
              <Text
                numberOfLines={2}
                style={[
                  styles.notificationTitle,
                  {
                    color:
                      theme.text,
                  },
                ]}
              >
                {notification.title}
              </Text>

              {isUnread && (
                <View
                  style={[
                    styles.unreadDot,
                    {
                      backgroundColor:
                        theme.primary,
                    },
                  ]}
                />
              )}
            </View>

            <Text
              style={[
                styles.notificationMessage,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              {notification.message}
            </Text>

            <Text
              style={[
                styles.notificationDate,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              {formattedDate}
            </Text>
          </View>
        </Pressable>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <View
          style={styles.actions}
        >
          {/* Mark as read indicator */}

          {isUnread && (
            <View
              style={[
                styles.unreadIndicator,
                {
                  backgroundColor:
                    theme.primary,
                },
              ]}
            >
              <Check
                size={11}
                color={
                  theme.primaryText
                }
                strokeWidth={2.5}
              />
            </View>
          )}

          {/* Delete */}

          <Pressable
            onPress={handleDelete}
            disabled={isLoading}
            hitSlop={6}
            style={({ pressed }) => [
              styles.deleteButton,
              pressed &&
                styles.pressed,
              isLoading &&
                styles.disabled,
            ]}
          >
            <Trash2
              size={17}
              color={
                theme.textSecondary
              }
              strokeWidth={2}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default NotificationCard;

/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles =
  StyleSheet.create({
    /*
     * =======================================================
     * CARD
     * =======================================================
     */

    card: {
      width: "100%",

      borderWidth: 1,

      borderRadius: 13,
    },

    cardContent: {
      flexDirection: "row",

      alignItems: "flex-start",

      padding: 13,
    },

    /*
     * =======================================================
     * NOTIFICATION BUTTON
     * =======================================================
     */

    notificationButton: {
      flex: 1,

      minWidth: 0,

      flexDirection: "row",
      alignItems: "flex-start",

      gap: 11,
    },

    /*
     * =======================================================
     * ICON
     * =======================================================
     */

    iconContainer: {
      width: 38,
      height: 38,

      flexShrink: 0,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 19,
    },

    /*
     * =======================================================
     * TEXT
     * =======================================================
     */

    textContainer: {
      flex: 1,

      minWidth: 0,
    },

    titleRow: {
      flexDirection: "row",

      alignItems: "flex-start",

      gap: 7,
    },

    notificationTitle: {
      flex: 1,

      fontSize: 12,
      lineHeight: 17,

      fontWeight: "800",
    },

    notificationMessage: {
      marginTop: 4,

      fontSize: 10,
      lineHeight: 15,

      fontWeight: "500",
    },

    notificationDate: {
      marginTop: 7,

      fontSize: 9,
      lineHeight: 13,

      fontWeight: "500",
    },

    /*
     * =======================================================
     * UNREAD
     * =======================================================
     */

    unreadDot: {
      width: 7,
      height: 7,

      marginTop: 5,

      flexShrink: 0,

      borderRadius: 4,
    },

    /*
     * =======================================================
     * ACTIONS
     * =======================================================
     */

    actions: {
      alignItems: "center",

      marginLeft: 7,

      gap: 7,
    },

    unreadIndicator: {
      width: 20,
      height: 20,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 10,
    },

    deleteButton: {
      width: 32,
      height: 32,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 9,
    },

    /*
     * =======================================================
     * INTERACTION
     * =======================================================
     */

    pressed: {
      opacity: 0.6,
    },

    disabled: {
      opacity: 0.45,
    },
  });