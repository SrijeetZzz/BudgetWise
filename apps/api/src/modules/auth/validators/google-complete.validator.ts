// import { z } from "zod";

// export const googleCompleteSchema = z.object({
//   body: z.object({
//     idToken: z.string().min(1, "Google ID token is required"),

//     phone: z
//       .string()
//       .regex(/^[6-9]\d{9}$/, "Invalid phone number"),

//     otp: z
//       .string()
//       .length(6, "OTP must be 6 digits"),

//     deviceId: z
//       .string()
//       .min(1, "Device ID is required"),
//   }),
// });

import { z } from "zod";

export const googleCompleteSchema = z.object({
  idToken: z
    .string()
    .trim()
    .min(1, "Google ID token is required"),

  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),

  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),

  deviceId: z
    .string()
    .trim()
    .min(1, "Device ID is required"),
});

export type GoogleCompleteInput = z.infer<typeof googleCompleteSchema>;