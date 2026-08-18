
import { create } from "zustand";

export type ThemeMode =
  | "LIGHT"
  | "DARK"
  | "SYSTEM";

interface ThemeState {
  theme: ThemeMode;

  toggleTheme: () => void;

  setTheme: (theme: ThemeMode) => void;
}

export const useThemeStore =
  create<ThemeState>((set) => ({
    /*
     * Default to SYSTEM so the app
     * follows the device theme.
     */
    theme: "SYSTEM",

    toggleTheme: () =>
      set((state) => {
        if (state.theme === "SYSTEM") {
          return {
            theme: "LIGHT",
          };
        }

        if (state.theme === "LIGHT") {
          return {
            theme: "DARK",
          };
        }

        return {
          theme: "SYSTEM",
        };
      }),

    setTheme: (theme) =>
      set({
        theme,
      }),
  }));