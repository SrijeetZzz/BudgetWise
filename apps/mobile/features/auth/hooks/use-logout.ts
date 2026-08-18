import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

import { authApi } from "../api/auth.api";
import { authToken } from "../../../lib/auth";
import { useAuthStore } from "../../../store/auth.store";

export function useLogout() {
  const logout = useAuthStore(
    (state) => state.logout,
  );

  return useMutation({
    mutationKey: ["auth", "logout"],

    mutationFn: authApi.logout,

    onSuccess: async () => {
      try {
        await authToken.clear();
      } finally {
        logout();
        router.replace("/(auth)/login");
      }
    },

    onError: async (error) => {
      console.log("LOGOUT API ERROR:", error);

      // Even if the server request fails, remove the
      // local authentication state.
      await authToken.clear();
      logout();

      router.replace("/(auth)/login");
    },
  });
}