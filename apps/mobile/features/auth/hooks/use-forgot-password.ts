import { useMutation } from "@tanstack/react-query";

import { authApi } from "../api/auth.api";

export function useForgotPassword() {
  return useMutation({
    mutationKey: ["auth", "forgot-password"],

    mutationFn: authApi.forgotPassword,

    onSuccess: (response) => {
      console.log(
        "FORGOT PASSWORD OTP SENT:",
        response.message,
      );
    },

    onError: (error: any) => {
      console.log(
        "FORGOT PASSWORD ERROR:",
        error?.response?.data ?? error,
      );
    },
  });
}