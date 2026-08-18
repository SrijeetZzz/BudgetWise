import { useMutation } from "@tanstack/react-query";

import { authApi } from "../api/auth.api";

export function useSendOtp() {
  return useMutation({
    mutationKey: ["auth", "send-otp"],

    mutationFn: authApi.sendOtp,

    onSuccess: (response) => {
      console.log(
        "=== OTP SENT SUCCESSFULLY ===",
      );

      console.log(
        "OTP RESPONSE:",
        response,
      );
    },

    onError: (error) => {
      console.log(
        "=== SEND OTP ERROR ===",
        error,
      );
    },
  });
}