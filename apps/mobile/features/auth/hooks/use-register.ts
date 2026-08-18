import { useMutation } from "@tanstack/react-query";

import { authApi } from "../api/auth.api";
import { getDeviceId } from "../../../lib/device";
import { authToken } from "../../../lib/auth";
import { useAuthStore } from "../../../store/auth.store";

interface RegisterInput {
  displayName: string;
  email: string;
  phone: string;
  password: string;
  otp: string;
}

export function useRegister() {
  const login = useAuthStore(
    (state) => state.login,
  );

  return useMutation({
    mutationKey: ["auth", "register"],

    mutationFn: async ({
      displayName,
      email,
      phone,
      password,
      otp,
    }: RegisterInput) => {
      const deviceId = await getDeviceId();

      return authApi.register({
        displayName,
        email,
        phone,
        password,
        otp,
        deviceId,
      });
    },

    onSuccess: async (response) => {
      console.log(
        "=== REGISTER SUCCESS ===",
      );

      console.log(
        "REGISTER RESPONSE:",
        response,
      );

      const {
        user,
        accessToken,
      } = response.data;

      console.log("USER:", user);
      console.log(
        "ACCESS TOKEN:",
        !!accessToken,
      );

      await authToken.set(accessToken);

      console.log(
        "REGISTER TOKEN STORED",
      );

      login(user, accessToken);

      console.log(
        "REGISTER SESSION STORED",
      );
    },

    onError: (error) => {
      console.log(
        "=== REGISTER ERROR ===",
        error,
      );
    },
  });
}