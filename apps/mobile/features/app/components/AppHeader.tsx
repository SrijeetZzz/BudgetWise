
import {
  Bell,
  Wallet,
} from "lucide-react-native";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import ProfileMenu from "./ProfileMenu";

import { useAuthStore } from "../../../store/auth.store";
import { useTheme } from "../../../providers/ThemeProvider";

interface AppHeaderProps {
  hasUnreadNotifications?: boolean;
}

export default function AppHeader({
  hasUnreadNotifications = false,
}: AppHeaderProps) {
  const user = useAuthStore(
    (state) => state.user,
  );

  /*
   * Theme is still used here for styling,
   * but theme switching is no longer handled
   * by the header.
   */
  const { theme } = useTheme();

  const insets =
    useSafeAreaInsets();

  const firstName =
    user?.name
      ?.trim()
      ?.split(/\s+/)[0] ??
    null;

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop:
            insets.top,

          height:
            68 + insets.top,

          backgroundColor:
            theme.surface,

          borderBottomColor:
            theme.border,
        },
      ]}
    >
      {/* =====================================================
          BRAND
      ===================================================== */}

      <Pressable
        style={styles.brand}
        onPress={() =>
          router.replace(
            "/(app)",
          )
        }
      >
        <View
          style={[
            styles.logo,
            {
              backgroundColor:
                theme.primary,
            },
          ]}
        >
          <Wallet
            size={18}
            color={
              theme.primaryText
            }
            strokeWidth={2.4}
          />
        </View>

        <View>
          <Text
            style={[
              styles.brandText,
              {
                color:
                  theme.text,
              },
            ]}
          >
            BudgetWise
          </Text>

          {firstName ? (
            <Text
              style={[
                styles.greeting,
                {
                  color:
                    theme.textSecondary,
                },
              ]}
            >
              Welcome back,{" "}
              {firstName}!
            </Text>
          ) : null}
        </View>
      </Pressable>

      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <View
        style={styles.actions}
      >
        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            {
              backgroundColor:
                theme.surfaceSecondary,

              borderColor:
                theme.border,
            },

            pressed &&
              styles.iconButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Notifications"
          onPress={() =>
            router.push(
              "/(app)/notifications",
            )
          }
        >
          <Bell
            size={19}
            color={theme.text}
            strokeWidth={2}
          />

          {hasUnreadNotifications && (
            <View
              style={[
                styles.notificationDot,
                {
                  backgroundColor:
                    theme.primary,

                  borderColor:
                    theme.surfaceSecondary,
                },
              ]}
            />
          )}
        </Pressable>

        {/* =================================================
            PROFILE
        ================================================= */}

        <ProfileMenu />
      </View>
    </View>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles =
  StyleSheet.create({
    header: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between",

      paddingHorizontal: 16,

      borderBottomWidth: 1,
    },

    brand: {
      flexDirection: "row",

      alignItems: "center",

      gap: 9,
    },

    logo: {
      width: 40,

      height: 40,

      borderRadius: 12,

      alignItems: "center",

      justifyContent: "center",
    },

    brandText: {
      fontSize: 17,

      fontWeight: "800",

      letterSpacing: -0.4,
    },

    greeting: {
      marginTop: 2,

      fontSize: 10,

      fontWeight: "500",
    },

    actions: {
      flexDirection: "row",

      alignItems: "center",

      gap: 7,
    },

    iconButton: {
      width: 40,

      height: 40,

      borderRadius: 13,

      alignItems: "center",

      justifyContent: "center",

      borderWidth: 1,
    },

    iconButtonPressed: {
      opacity: 0.7,
    },

    notificationDot: {
      position: "absolute",

      top: 7,

      right: 7,

      width: 7,

      height: 7,

      borderRadius: 4,

      borderWidth: 1.5,
    },
  });