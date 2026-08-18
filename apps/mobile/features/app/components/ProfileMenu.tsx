

import {
  LogOut,
  Settings,
  User,
  Sparkles,
  X,
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import { useLogout } from "../../auth/hooks/use-logout";
import { useAuthStore } from "../../../store/auth.store";
import { getImageUrl } from "../../../lib/image-url";
import { useTheme } from "../../../providers/ThemeProvider";

function getInitials(name?: string | null) {
  if (!name?.trim()) {
    return "U";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase(),
    )
    .join("");
}

export default function ProfileMenu() {
  const [visible, setVisible] = useState(false);

  const user = useAuthStore(
    (state) => state.user,
  );

  const { theme, isDark } = useTheme();

  const logoutMutation = useLogout();

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setVisible(false);
      },
    });
  };

  const name =
    user?.name?.trim() || "User";

  const email =
    user?.email?.trim() || "";

  const avatar = getImageUrl(
    user?.profileImage,
  );

  const initials = getInitials(
    user?.name,
  );

  return (
    <>
      {/* =================================================
          PROFILE TRIGGER
      ================================================= */}

      <Pressable
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Open profile menu"
        style={({ pressed }) => [
          styles.avatarButton,
          {
            backgroundColor:
              theme.surfaceSecondary,

            borderColor:
              theme.border,
          },
          pressed && styles.pressed,
        ]}
      >
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            style={styles.avatar}
          />
        ) : (
          <View
            style={[
              styles.avatarFallback,
              {
                backgroundColor:
                  theme.muted,
              },
            ]}
          >
            <Text
              style={[
                styles.initials,
                {
                  color: theme.text,
                },
              ]}
            >
              {initials}
            </Text>
          </View>
        )}
      </Pressable>

      {/* =================================================
          PROFILE MODAL
      ================================================= */}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setVisible(false)
        }
      >
        <Pressable
          style={[
            styles.overlay,
            {
              backgroundColor: isDark
                ? "rgba(0, 0, 0, 0.55)"
                : "rgba(0, 0, 0, 0.25)",
            },
          ]}
          onPress={() =>
            setVisible(false)
          }
        >
          <Pressable
            style={[
              styles.menu,
              {
                backgroundColor:
                  theme.surface,

                borderColor:
                  theme.border,
              },
            ]}
            onPress={(event) =>
              event.stopPropagation()
            }
          >
            {/* =================================================
                MENU HEADER
            ================================================= */}

            <View
              style={styles.menuHeader}
            >
              <Text
                style={[
                  styles.menuTitle,
                  {
                    color: theme.text,
                  },
                ]}
              >
                Account
              </Text>

              <Pressable
                onPress={() =>
                  setVisible(false)
                }
                style={[
                  styles.closeButton,
                  {
                    backgroundColor:
                      theme.surfaceSecondary,
                  },
                ]}
              >
                <X
                  size={18}
                  color={
                    theme.textSecondary
                  }
                />
              </Pressable>
            </View>

            {/* =================================================
                USER INFORMATION
            ================================================= */}

            <View
              style={styles.userSection}
            >
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  style={styles.largeAvatar}
                />
              ) : (
                <View
                  style={[
                    styles.largeAvatarFallback,
                    {
                      backgroundColor:
                        theme.muted,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.largeInitials,
                      {
                        color:
                          theme.text,
                      },
                    ]}
                  >
                    {initials}
                  </Text>
                </View>
              )}

              <View
                style={styles.userInfo}
              >
                <View
                  style={styles.nameRow}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.name,
                      {
                        color:
                          theme.text,
                      },
                    ]}
                  >
                    {name}
                  </Text>

                  <View
                    style={[
                      styles.planBadge,
                      {
                        backgroundColor:
                          theme.muted,
                      },
                    ]}
                  >
                    <Sparkles
                      size={10}
                      color={theme.text}
                    />

                    <Text
                      style={[
                        styles.planText,
                        {
                          color:
                            theme.text,
                        },
                      ]}
                    >
                      Free
                    </Text>
                  </View>
                </View>

                {email ? (
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.email,
                      {
                        color:
                          theme.textSecondary,
                      },
                    ]}
                  >
                    {email}
                  </Text>
                ) : null}
              </View>
            </View>

            <View
              style={[
                styles.separator,
                {
                  backgroundColor:
                    theme.border,
                },
              ]}
            />

            {/* =================================================
                PROFILE
            ================================================= */}

            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && {
                  backgroundColor:
                    theme.surfaceSecondary,
                },
              ]}
              onPress={() => {
                setVisible(false);

                router.push(
                  "/(app)/profile",
                );
              }}
            >
              <User
                size={19}
                color={theme.textSecondary}
              />

              <Text
                style={[
                  styles.menuItemText,
                  {
                    color: theme.text,
                  },
                ]}
              >
                Profile
              </Text>
            </Pressable>

            {/* =================================================
                SETTINGS
            ================================================= */}

            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                pressed && {
                  backgroundColor:
                    theme.surfaceSecondary,
                },
              ]}
              onPress={() => {
                setVisible(false);

                router.push(
                  "/(app)/settings",
                );
              }}
            >
              <Settings
                size={19}
                color={theme.textSecondary}
              />

              <Text
                style={[
                  styles.menuItemText,
                  {
                    color: theme.text,
                  },
                ]}
              >
                Settings
              </Text>
            </Pressable>

            <View
              style={[
                styles.separator,
                {
                  backgroundColor:
                    theme.border,
                },
              ]}
            />

            {/* =================================================
                LOGOUT
            ================================================= */}

            <Pressable
              disabled={
                logoutMutation.isPending
              }
              style={({ pressed }) => [
                styles.menuItem,
                styles.logoutItem,
                pressed && {
                  backgroundColor:
                    isDark
                      ? "#351818"
                      : "#FEF2F2",
                },
              ]}
              onPress={logout}
            >
              {logoutMutation.isPending ? (
                <ActivityIndicator
                  size="small"
                  color={
                    theme.destructive
                  }
                />
              ) : (
                <LogOut
                  size={19}
                  color={
                    theme.destructive
                  }
                />
              )}

              <Text
                style={[
                  styles.logoutText,
                  {
                    color:
                      theme.destructive,
                  },
                ]}
              >
                {logoutMutation.isPending
                  ? "Logging out..."
                  : "Logout"}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  avatarButton: {
    width: 40,
    height: 40,

    borderRadius: 20,

    borderWidth: 1,

    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.7,
  },

  avatar: {
    width: 34,
    height: 34,

    borderRadius: 17,
  },

  avatarFallback: {
    width: 34,
    height: 34,

    borderRadius: 17,

    alignItems: "center",
    justifyContent: "center",
  },

  initials: {
    fontSize: 12,
    fontWeight: "700",
  },

  overlay: {
    flex: 1,

    alignItems: "flex-end",
    justifyContent: "flex-start",

    paddingTop: 82,
    paddingRight: 14,
  },

  menu: {
    width: 300,

    borderRadius: 20,

    padding: 8,

    borderWidth: 1,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.15,

    shadowRadius: 20,

    elevation: 12,
  },

  menuHeader: {
    height: 42,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 8,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  closeButton: {
    width: 32,
    height: 32,

    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",
  },

  userSection: {
    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 8,
    paddingVertical: 12,
  },

  largeAvatar: {
    width: 42,
    height: 42,

    borderRadius: 21,
  },

  largeAvatarFallback: {
    width: 42,
    height: 42,

    borderRadius: 21,

    alignItems: "center",
    justifyContent: "center",
  },

  largeInitials: {
    fontSize: 14,
    fontWeight: "700",
  },

  userInfo: {
    flex: 1,

    marginLeft: 10,
  },

  nameRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 6,
  },

  name: {
    flexShrink: 1,

    fontSize: 14,
    fontWeight: "700",
  },

  planBadge: {
    flexDirection: "row",

    alignItems: "center",

    gap: 3,

    paddingHorizontal: 6,
    paddingVertical: 3,

    borderRadius: 10,
  },

  planText: {
    fontSize: 9,
    fontWeight: "700",
  },

  email: {
    marginTop: 3,

    fontSize: 11,
    fontWeight: "500",
  },

  separator: {
    height: 1,

    marginVertical: 5,
  },

  menuItem: {
    minHeight: 46,

    flexDirection: "row",

    alignItems: "center",

    gap: 12,

    paddingHorizontal: 12,

    borderRadius: 12,
  },

  menuItemText: {
    fontSize: 13,
    fontWeight: "600",
  },

  logoutItem: {
    marginBottom: 2,
  },

  logoutText: {
    fontSize: 13,
    fontWeight: "600",
  },
});