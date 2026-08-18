import { useMutation } from "@tanstack/react-query";

import { authApi } from "../api/auth.api";

export function useResetPassword() {
  return useMutation({
    mutationKey: ["auth", "reset-password"],

    mutationFn: authApi.resetPassword,

    onSuccess: (response) => {
      console.log(
        "PASSWORD RESET SUCCESS:",
        response.message,
      );
    },

    onError: (error: any) => {
      console.log(
        "RESET PASSWORD ERROR:",
        error?.response?.data ?? error,
      );
    },
  });
}