
import { Tabs, router } from "expo-router";
import type { ComponentProps } from "react";

import {
  Home,
  ArrowDownUp,
  Tags,
  WalletCards,
  Plus,
} from "lucide-react-native";

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../../../providers/ThemeProvider";

type FloatingTabBarProps = NonNullable<
  ComponentProps<typeof Tabs>["tabBar"]
> extends (props: infer P) => any
  ? P
  : never;

const TAB_CONFIG = [
  {
    routeName: "index",
    label: "Home",
    icon: Home,
  },
  {
    routeName: "transactions",
    label: "Transactions",
    icon: ArrowDownUp,
  },
  {
    routeName: "categories",
    label: "Categories",
    icon: Tags,
  },
  {
    routeName: "budgets",
    label: "Budgets",
    icon: WalletCards,
  },
] as const;

export default function FloatingTabBar({
  state,
  navigation,
}: FloatingTabBarProps) {
  const insets = useSafeAreaInsets();

  const { theme, isDark } = useTheme();

  const tabItems = TAB_CONFIG.map((tab) => {
    const routeIndex = state.routes.findIndex(
      (route) => route.name === tab.routeName,
    );

    if (routeIndex === -1) {
      return null;
    }

    return {
      ...tab,
      route: state.routes[routeIndex],
      routeIndex,
    };
  }).filter(Boolean) as Array<
    (typeof TAB_CONFIG)[number] & {
      route: (typeof state.routes)[number];
      routeIndex: number;
    }
  >;

  const handleTabPress = (
    routeName: string,
    routeKey: string,
  ) => {
    const event = navigation.emit({
      type: "tabPress",
      target: routeKey,
      canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  const handleCreateTransaction = () => {
    router.push("/transactions/create");
  };

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          bottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <View
        style={[
          styles.tabBar,
          {
            /*
             * Very subtle transparency.
             *
             * NOT a glass/frosted effect.
             */
            backgroundColor: isDark
              ? "rgba(24, 24, 24, 0.96)"
              : "rgba(255, 255, 255, 0.96)",

            borderColor: theme.border,

            shadowColor: isDark
              ? "#000000"
              : "#000000",
          },
        ]}
      >
        {/* HOME */}

        {tabItems[0] && (
          <TabButton
            label={tabItems[0].label}
            icon={tabItems[0].icon}
            active={
              state.index ===
              tabItems[0].routeIndex
            }
            theme={theme}
            onPress={() =>
              handleTabPress(
                tabItems[0].route.name,
                tabItems[0].route.key,
              )
            }
          />
        )}

        {/* TRANSACTIONS */}

        {tabItems[1] && (
          <TabButton
            label={tabItems[1].label}
            icon={tabItems[1].icon}
            active={
              state.index ===
              tabItems[1].routeIndex
            }
            theme={theme}
            onPress={() =>
              handleTabPress(
                tabItems[1].route.name,
                tabItems[1].route.key,
              )
            }
          />
        )}

        {/* CREATE */}

        <View style={styles.createButtonContainer}>
          <Pressable
            onPress={handleCreateTransaction}
            accessibilityRole="button"
            accessibilityLabel="Create transaction"
            hitSlop={8}
            style={({ pressed }) => [
              styles.createButton,
              {
                backgroundColor:
                  theme.primary,

                shadowColor:
                  theme.text,
              },
              pressed &&
                styles.createButtonPressed,
            ]}
          >
            <Plus
              size={27}
              color={theme.primaryText}
              strokeWidth={2.8}
            />
          </Pressable>
        </View>

        {/* CATEGORIES */}

        {tabItems[2] && (
          <TabButton
            label={tabItems[2].label}
            icon={tabItems[2].icon}
            active={
              state.index ===
              tabItems[2].routeIndex
            }
            theme={theme}
            onPress={() =>
              handleTabPress(
                tabItems[2].route.name,
                tabItems[2].route.key,
              )
            }
          />
        )}

        {/* BUDGETS */}

        {tabItems[3] && (
          <TabButton
            label={tabItems[3].label}
            icon={tabItems[3].icon}
            active={
              state.index ===
              tabItems[3].routeIndex
            }
            theme={theme}
            onPress={() =>
              handleTabPress(
                tabItems[3].route.name,
                tabItems[3].route.key,
              )
            }
          />
        )}
      </View>
    </View>
  );
}

/* =====================================================
   TAB BUTTON
===================================================== */

interface TabButtonProps {
  label: string;

  icon: React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;

  active: boolean;

  theme: {
    text: string;
    textSecondary: string;
    muted: string;
  };

  onPress: () => void;
}

function TabButton({
  label,
  icon: Icon,
  active,
  theme,
  onPress,
}: TabButtonProps) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{
        selected: active,
      }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tab,
        pressed &&
          styles.tabPressed,
      ]}
    >
      <View
        style={[
          styles.iconWrapper,
          active && {
            backgroundColor:
              theme.muted,
          },
        ]}
      >
        <Icon
          size={21}
          strokeWidth={
            active ? 2.4 : 1.8
          }
          color={
            active
              ? theme.text
              : theme.textSecondary
          }
        />
      </View>

      <Text
        numberOfLines={1}
        style={[
          styles.label,
          {
            color: active
              ? theme.text
              : theme.textSecondary,
          },
          active &&
            styles.activeLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    left: 12,
    right: 12,

    zIndex: 100,
  },

  tabBar: {
    minHeight: 76,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-around",

    paddingHorizontal: 6,

    paddingTop: 7,

    paddingBottom: 5,

    borderWidth: 1,

    borderRadius: 22,

    /*
     * Subtle floating shadow.
     */
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.12,

    shadowRadius: 10,

    elevation: 8,
  },

  tab: {
    flex: 1,

    minWidth: 58,

    alignItems: "center",

    justifyContent: "center",
  },

  tabPressed: {
    opacity: 0.55,
  },

  iconWrapper: {
    width: 38,

    height: 34,

    alignItems: "center",

    justifyContent: "center",

    borderRadius: 18,

    marginBottom: 2,
  },

  label: {
    fontSize: 10,

    fontWeight: "500",

    textAlign: "center",
  },

  activeLabel: {
    fontWeight: "700",
  },

  createButtonContainer: {
    width: 68,

    height: 76,

    alignItems: "center",

    justifyContent: "center",
  },

  createButton: {
    width: 56,

    height: 56,

    alignItems: "center",

    justifyContent: "center",

    borderRadius: 28,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.25,

    shadowRadius: 7,

    elevation: 8,
  },

  createButtonPressed: {
    transform: [
      {
        scale: 0.92,
      },
    ],

    opacity: 0.85,
  },
});

