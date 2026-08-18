
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import {
  useColorScheme,
} from "react-native";

import {
  ThemeMode,
  useThemeStore,
} from "../store/theme.store";

import {
  AppTheme,
  darkTheme,
  lightTheme,
} from "../constants/theme";

/*
 * ===========================================================
 * CONTEXT
 * ===========================================================
 */

interface ThemeContextValue {
  theme: AppTheme;

  mode: ThemeMode;

  isDark: boolean;

  toggleTheme: () => void;

  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext =
  createContext<ThemeContextValue | null>(null);

/*
 * ===========================================================
 * PROPS
 * ===========================================================
 */

interface ThemeProviderProps {
  children: ReactNode;
}

/*
 * ===========================================================
 * PROVIDER
 * ===========================================================
 */

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  /*
   * =========================================================
   * DEVICE THEME
   * =========================================================
   *
   * Returns:
   *
   * "light"
   * "dark"
   * null
   *
   * React Native automatically updates this value when
   * the device appearance changes.
   */

  const systemColorScheme =
    useColorScheme();

  /*
   * =========================================================
   * STORED THEME MODE
   * =========================================================
   */

  const mode = useThemeStore(
    (state) => state.theme,
  );

  const toggleTheme = useThemeStore(
    (state) => state.toggleTheme,
  );

  const setTheme = useThemeStore(
    (state) => state.setTheme,
  );

  /*
   * =========================================================
   * RESOLVE THEME
   * =========================================================
   *
   * LIGHT  → Always light
   * DARK   → Always dark
   * SYSTEM → Follow device appearance
   */

  const value = useMemo(() => {
    const isDark =
      mode === "DARK" ||
      (
        mode === "SYSTEM" &&
        systemColorScheme === "dark"
      );

    return {
      theme: isDark
        ? darkTheme
        : lightTheme,

      mode,

      isDark,

      toggleTheme,

      setTheme,
    };
  }, [
    mode,
    systemColorScheme,
    toggleTheme,
    setTheme,
  ]);

  /*
   * =========================================================
   * PROVIDER
   * =========================================================
   */

  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/*
 * ===========================================================
 * HOOK
 * ===========================================================
 */

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider",
    );
  }

  return context;
}