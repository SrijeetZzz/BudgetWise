import { useMutation } from "@tanstack/react-query";

import { authApi } from "../api/auth.api";
import { getDeviceId } from "../../../lib/device";
import { authToken } from "../../../lib/auth";

import { useAuthStore } from "../../../store/auth.store";
import { useThemeStore } from "../../../store/theme.store";

interface GoogleCompletePayload {
  idToken: string;
  phone: string;
  otp: string;
}

export function useGoogleComplete() {
  const login = useAuthStore(
    (state) => state.login,
  );

  const setTheme = useThemeStore(
    (state) => state.setTheme,
  );

  return useMutation({
    mutationKey: [
      "auth",
      "google-complete",
    ],

    mutationFn: async ({
      idToken,
      phone,
      otp,
    }: GoogleCompletePayload) => {
      const deviceId = await getDeviceId();

      return authApi.googleComplete({
        idToken,
        phone,
        otp,
        deviceId,
      });
    },

    onSuccess: async (response) => {
      console.log(
        "=== GOOGLE COMPLETE SUCCESS ===",
      );

      console.log(
        "GOOGLE COMPLETE RESPONSE:",
        response,
      );

      const {
        user,
        accessToken,
      } = response.data;

      /*
       * Store access token
       */

      await authToken.set(
        accessToken,
      );

      console.log(
        "GOOGLE COMPLETE → TOKEN STORED",
      );

      /*
       * Store authenticated user
       */

      login(
        user,
        accessToken,
      );

      /*
       * Apply backend theme
       */

      if (
        user.theme === "LIGHT" ||
        user.theme === "DARK" ||
        user.theme === "SYSTEM"
      ) {
        setTheme(user.theme);

        console.log(
          "GOOGLE COMPLETE → THEME APPLIED:",
          user.theme,
        );
      } else {
        setTheme("SYSTEM");

        console.log(
          "GOOGLE COMPLETE → INVALID THEME → SYSTEM",
        );
      }

      console.log(
        "GOOGLE COMPLETE → ACCOUNT CREATED",
      );
    },

    onError: (error) => {
      console.log(
        "=== GOOGLE COMPLETE ERROR ===",
      );

      console.log(error);
    },
  });
}