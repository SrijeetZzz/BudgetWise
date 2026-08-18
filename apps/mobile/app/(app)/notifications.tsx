
"use client";

import {
  Bell,
  CheckCheck,
} from "lucide-react-native";

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useState } from "react";

import {
  useMarkAllNotificationsAsRead,
} from "../../features/notifications/hooks/use-notifications";

import AppHeader from "../../features/app/components/AppHeader";

import NotificationList from "../../features/notifications/components/Notification-list";

import { useTheme } from "../../providers/ThemeProvider";

type NotificationStatus =
  | "READ"
  | "UNREAD";

export default function NotificationsScreen() {
  const { theme } = useTheme();

  const [status, setStatus] =
    useState<NotificationStatus>(
      "UNREAD",
    );

  const markAllAsRead =
    useMarkAllNotificationsAsRead();

  /*
   * =========================================================
   * MARK ALL AS READ
   * =========================================================
   */

  const handleMarkAllAsRead =
    async () => {
      try {
        await markAllAsRead.mutateAsync();
      } catch (error) {
        console.error(
          "Failed to mark all notifications as read:",
          error,
        );
      }
    };

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.background,
        },
      ]}
    >
      {/* =====================================================
          APP HEADER
      ===================================================== */}

      <AppHeader />

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <View
          style={styles.pageHeader}
        >
          <View
            style={
              styles.titleRow
            }
          >
            <View
              style={[
                styles.titleIcon,
                {
                  backgroundColor:
                    theme.surfaceSecondary,
                },
              ]}
            >
              <Bell
                size={18}
                color={theme.text}
                strokeWidth={2.2}
              />
            </View>

            <View
              style={
                styles.titleTextContainer
              }
            >
              <Text
                style={[
                  styles.title,
                  {
                    color:
                      theme.text,
                  },
                ]}
              >
                Notifications
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  {
                    color:
                      theme.textSecondary,
                  },
                ]}
              >
                Stay updated with your
                account activity.
              </Text>
            </View>
          </View>

          {/* =================================================
              MARK ALL
          ================================================= */}

          {status === "UNREAD" && (
            <Pressable
              onPress={
                handleMarkAllAsRead
              }
              disabled={
                markAllAsRead.isPending
              }
              style={({
                pressed,
              }) => [
                styles.markAllButton,
                {
                  borderColor:
                    theme.border,
                  backgroundColor:
                    theme.surface,
                },
                pressed &&
                  styles.pressed,
                markAllAsRead.isPending &&
                  styles.disabled,
              ]}
            >
              <CheckCheck
                size={16}
                color={theme.text}
                strokeWidth={2}
              />

              <Text
                style={[
                  styles.markAllText,
                  {
                    color:
                      theme.text,
                  },
                ]}
              >
                {markAllAsRead.isPending
                  ? "Marking..."
                  : "Mark all as read"}
              </Text>
            </Pressable>
          )}
        </View>

        {/* =================================================
            READ / UNREAD TOGGLE
        ================================================= */}

        <View
          style={[
            styles.toggleContainer,
            {
              borderColor:
                theme.border,
              backgroundColor:
                theme.surface,
            },
          ]}
        >
          {/* Unread */}

          <Pressable
            onPress={() =>
              setStatus("UNREAD")
            }
            style={[
              styles.toggleButton,
              status === "UNREAD" && {
                backgroundColor:
                  theme.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                {
                  color:
                    status === "UNREAD"
                      ? theme.primaryText
                      : theme.textSecondary,
                },
              ]}
            >
              Unread
            </Text>
          </Pressable>

          {/* Read */}

          <Pressable
            onPress={() =>
              setStatus("READ")
            }
            style={[
              styles.toggleButton,
              status === "READ" && {
                backgroundColor:
                  theme.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.toggleText,
                {
                  color:
                    status === "READ"
                      ? theme.primaryText
                      : theme.textSecondary,
                },
              ]}
            >
              Read
            </Text>
          </Pressable>
        </View>

        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <NotificationList
          status={status}
        />

        {/* =================================================
            BOTTOM NAV SPACING
        ================================================= */}

        <View
          style={styles.bottomSpacing}
        />
      </ScrollView>
    </View>
  );
}

/*
 * =========================================================
 * STYLES
 * =========================================================
 */

const styles =
  StyleSheet.create({
    /*
     * =======================================================
     * CONTAINER
     * =======================================================
     */

    container: {
      flex: 1,
    },

    /*
     * =======================================================
     * SCROLL
     * =======================================================
     */

    scroll: {
      flex: 1,
    },

    content: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 20,
    },

    /*
     * =======================================================
     * PAGE HEADER
     * =======================================================
     */

    pageHeader: {
      marginBottom: 16,
    },

    titleRow: {
      flexDirection: "row",
      alignItems: "center",

      gap: 10,
    },

    titleIcon: {
      width: 36,
      height: 36,

      alignItems: "center",
      justifyContent: "center",

      borderRadius: 10,
    },

    titleTextContainer: {
      flex: 1,

      minWidth: 0,
    },

    title: {
      fontSize: 22,
      fontWeight: "800",
    },

    subtitle: {
      marginTop: 4,

      fontSize: 10,
      lineHeight: 15,

      fontWeight: "500",
    },

    /*
     * =======================================================
     * MARK ALL
     * =======================================================
     */

    markAllButton: {
      marginTop: 13,

      height: 40,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",

      gap: 7,

      paddingHorizontal: 12,

      borderWidth: 1,

      borderRadius: 11,
    },

    markAllText: {
      fontSize: 10,
      fontWeight: "700",
    },

    /*
     * =======================================================
     * TOGGLE
     * =======================================================
     */

    toggleContainer: {
      flexDirection: "row",

      width: "100%",

      padding: 4,

      marginBottom: 16,

      borderWidth: 1,

      borderRadius: 11,
    },

    toggleButton: {
      flex: 1,

      alignItems: "center",
      justifyContent: "center",

      minHeight: 36,

      borderRadius: 8,
    },

    toggleText: {
      fontSize: 11,
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

    /*
     * =======================================================
     * BOTTOM SPACING
     * =======================================================
     */

    bottomSpacing: {
      height: 90,
    },
  });