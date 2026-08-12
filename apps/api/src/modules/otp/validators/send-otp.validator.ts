import { z } from "zod";

export const sendOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  purpose: z.enum([
    "REGISTER",
    "LOGIN",
    "RESET_PASSWORD",
  ]),
});

export type SendOtpSchemaType = z.infer<typeof sendOtpSchema>;