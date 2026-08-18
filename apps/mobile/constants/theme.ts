export const lightTheme = {
  background: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceSecondary: "#F7F7F7",

  text: "#111111",
  textSecondary: "#737373",

  border: "#EAEAEA",

  primary: "#111111",
  primaryText: "#FFFFFF",

  muted: "#F3F3F3",

  destructive: "#DC2626",
};

export const darkTheme = {
  background: "#111111",
  surface: "#181818",
  surfaceSecondary: "#222222",

  text: "#FFFFFF",
  textSecondary: "#A3A3A3",

  border: "#333333",

  primary: "#FFFFFF",
  primaryText: "#111111",

  muted: "#262626",

  destructive: "#F87171",
};

export type AppTheme =
  | typeof lightTheme
  | typeof darkTheme;