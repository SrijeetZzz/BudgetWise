import { Stack } from "expo-router";

import QueryProvider from "../providers/QueryProvider";
import AuthProvider from "../providers/auth-provider";
import { ThemeProvider } from "../providers/ThemeProvider";

export default function RootLayout() {
  return (
    <QueryProvider>
      <AuthProvider>
        <ThemeProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </ThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}