
import { useMutation } from "@tanstack/react-query";

import { authApi } from "../api/auth.api";
import { getDeviceId } from "../../../lib/device";

import {
  authToken,
} from "../../../lib/auth";

import {
  useAuthStore,
} from "../../../store/auth.store";

export function useLogin() {
  const login =
    useAuthStore(
      (state) => state.login,
    );

  return useMutation({
    mutationKey: [
      "auth",
      "login",
    ],

    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const deviceId =
        await getDeviceId();

      return authApi.login({
        email,
        password,
        deviceId,
      });
    },

    onSuccess: async (response) => {
      console.log(
        "=== LOGIN SUCCESS FIRED ===",
      );

      try {
        /*
         * =====================================================
         * STEP 1
         * Get access token from login response
         * =====================================================
         */

        const {
          accessToken,
        } = response.data;

        console.log(
          "ACCESS TOKEN EXISTS:",
          !!accessToken,
        );

        if (!accessToken) {
          throw new Error(
            "Access token missing from login response",
          );
        }

        /*
         * =====================================================
         * STEP 2
         * Store access token
         * =====================================================
         */

        await authToken.set(
          accessToken,
        );

        console.log(
          "LOGIN → TOKEN STORED",
        );

        /*
         * =====================================================
         * STEP 3
         * Fetch complete user
         * =====================================================
         *
         * The login response currently does not contain
         * everything needed by the app header.
         *
         * /me gives us:
         *
         * - name
         * - profileImage
         * - theme
         * - email
         * - phone
         * - id
         *
         */

        console.log(
          "LOGIN → CALLING /ME",
        );

        const user =
          await authApi.me();

        console.log(
          "LOGIN → /ME USER:",
          user,
        );

        /*
         * =====================================================
         * STEP 4
         * Store COMPLETE user in Zustand
         * =====================================================
         */

        login(
          user,
          accessToken,
        );

        console.log(
          "LOGIN → COMPLETE USER STORED",
        );

        console.log(
          "LOGIN → LOGIN COMPLETE",
        );
      } catch (error) {
        console.log(
          "LOGIN → POST LOGIN ERROR:",
          error,
        );

        /*
         * If token was stored but /me failed,
         * don't leave a broken authenticated state.
         */

        await authToken.clear();

        throw error;
      }
    },

    onError: (error) => {
      console.log(
        "=== LOGIN ERROR ===",
      );

      console.log(
        error,
      );
    },
  });
}