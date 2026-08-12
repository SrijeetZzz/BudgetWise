import { z } from "zod";

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  otp: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "OTP must be a 6-digit number"),

  purpose: z.enum([
    "REGISTER",
    "LOGIN",
    "RESET_PASSWORD",
  ]),
});

export type VerifyOtpSchemaType = z.infer<typeof verifyOtpSchema>;