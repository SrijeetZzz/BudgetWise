
import {
  PropsWithChildren,
  useEffect,
} from "react";

import { authApi } from "../features/auth/api/auth.api";

import { authToken } from "../lib/auth";
import {
  configureGoogleSignIn,
} from "../lib/google";

import { useAuthStore } from "../store/auth.store";
import { useThemeStore } from "../store/theme.store";

export default function AuthProvider({
  children,
}: PropsWithChildren) {
  const login = useAuthStore(
    (state) => state.login,
  );

  const logout = useAuthStore(
    (state) => state.logout,
  );

  const setLoading = useAuthStore(
    (state) => state.setLoading,
  );

  const setTheme = useThemeStore(
    (state) => state.setTheme,
  );

  useEffect(() => {
    /*
     * =====================================================
     * GOOGLE SIGN-IN CONFIGURATION
     * =====================================================
     *
     * Configure Google Sign-In once when the
     * application starts.
     */
    try {
      configureGoogleSignIn();

      console.log(
        "GOOGLE SIGN-IN → CONFIGURED",
      );
    } catch (error) {
      console.log(
        "GOOGLE SIGN-IN → CONFIGURATION FAILED:",
        error,
      );
    }

    /*
     * =====================================================
     * SESSION RESTORATION
     * =====================================================
     */

    const restoreSession = async () => {
      try {
        console.log(
          "AUTH PROVIDER → RESTORING SESSION",
        );

        const accessToken =
          await authToken.get();

        console.log(
          "AUTH PROVIDER → TOKEN EXISTS:",
          !!accessToken,
        );

        /*
         * =================================================
         * NO TOKEN
         * =================================================
         */

        if (!accessToken) {
          console.log(
            "AUTH PROVIDER → NO TOKEN → LOGGED OUT",
          );

          logout();

          /*
           * No authenticated user exists,
           * so fall back to device theme.
           */
          setTheme("SYSTEM");

          return;
        }

        /*
         * =================================================
         * GET CURRENT USER
         * =================================================
         */

        console.log(
          "AUTH PROVIDER → CALLING /ME",
        );

        const user =
          await authApi.me();

        console.log(
          "AUTH PROVIDER → /ME USER:",
          user,
        );

        /*
         * =================================================
         * STORE USER + TOKEN
         * =================================================
         */

        login(
          user,
          accessToken,
        );

        console.log(
          "AUTH PROVIDER → USER STORED",
        );

        /*
         * =================================================
         * APPLY USER THEME
         * =================================================
         *
         * Backend returns:
         *
         * LIGHT
         * DARK
         * SYSTEM
         *
         * ThemeProvider resolves SYSTEM
         * using the device appearance.
         */

        if (
          user.theme === "LIGHT" ||
          user.theme === "DARK" ||
          user.theme === "SYSTEM"
        ) {
          setTheme(
            user.theme,
          );

          console.log(
            "AUTH PROVIDER → THEME APPLIED:",
            user.theme,
          );
        } else {
          /*
           * Safe fallback.
           */
          setTheme("SYSTEM");

          console.log(
            "AUTH PROVIDER → INVALID/MISSING THEME → USING SYSTEM",
          );
        }

        console.log(
          "SESSION RESTORED SUCCESSFULLY",
        );
      } catch (error) {
        console.log(
          "AUTH PROVIDER → SESSION RESTORE FAILED:",
          error,
        );

        await authToken.clear();

        logout();

        /*
         * Reset theme so the previous user's
         * preference doesn't remain after logout.
         */
        setTheme("SYSTEM");

        console.log(
          "AUTH PROVIDER → TOKEN CLEARED + LOGGED OUT",
        );
      } finally {
        setLoading(false);

        console.log(
          "AUTH PROVIDER → LOADING COMPLETE",
        );
      }
    };

    restoreSession();
  }, [
    login,
    logout,
    setLoading,
    setTheme,
  ]);

  return <>{children}</>;
}