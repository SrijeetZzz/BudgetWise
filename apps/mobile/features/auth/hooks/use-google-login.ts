import { useMutation } from "@tanstack/react-query";

import { authApi } from "../api/auth.api";
import { getDeviceId } from "../../../lib/device";

import { authToken } from "../../../lib/auth";
import { useAuthStore } from "../../../store/auth.store";
import { useThemeStore } from "../../../store/theme.store";

export function useGoogleLogin() {
  const login = useAuthStore(
    (state) => state.login,
  );

  const setTheme = useThemeStore(
    (state) => state.setTheme,
  );

  return useMutation({
    mutationKey: [
      "auth",
      "google-login",
    ],

    mutationFn: async (
      idToken: string,
    ) => {
      const deviceId =
        await getDeviceId();

      return authApi.googleLogin({
        idToken,
        deviceId,
      });
    },

    onSuccess: async (response) => {
      console.log(
        "=== GOOGLE LOGIN SUCCESS ===",
      );

      console.log(
        "GOOGLE RESPONSE:",
        response,
      );

      const data = response.data;

      /* =================================================
         NEW GOOGLE USER
      ================================================= */

      if (
        "requiresPhoneVerification" in
        data
      ) {
        console.log(
          "GOOGLE → PHONE VERIFICATION REQUIRED",
        );

        /*
         * Do NOT authenticate the user yet.
         *
         * LoginForm handles navigation to
         * Google Complete.
         */

        return;
      }

      /* =================================================
         EXISTING GOOGLE USER
      ================================================= */

      const {
        accessToken,
      } = data;

      /*
       * Store access token first.
       */

      await authToken.set(
        accessToken,
      );

      console.log(
        "GOOGLE → TOKEN STORED",
      );

      /* =================================================
         FETCH COMPLETE USER
      ================================================= */

      console.log(
        "GOOGLE → CALLING /ME",
      );

      const fullUser =
        await authApi.me();

      console.log(
        "GOOGLE → /ME USER:",
        fullUser,
      );

      /* =================================================
         STORE COMPLETE USER
      ================================================= */

      login(
        fullUser,
        accessToken,
      );

      console.log(
        "GOOGLE → COMPLETE USER STORED",
      );

      /* =================================================
         APPLY USER THEME
      ================================================= */

      if (
        fullUser.theme === "LIGHT" ||
        fullUser.theme === "DARK" ||
        fullUser.theme === "SYSTEM"
      ) {
        setTheme(fullUser.theme);

        console.log(
          "GOOGLE → THEME APPLIED:",
          fullUser.theme,
        );
      } else {
        setTheme("SYSTEM");

        console.log(
          "GOOGLE → INVALID/MISSING THEME → SYSTEM",
        );
      }

      console.log(
        "GOOGLE → LOGIN COMPLETE",
      );
    },

    onError: (error) => {
      console.log(
        "=== GOOGLE LOGIN ERROR ===",
      );

      console.log(error);
    },
  });
}