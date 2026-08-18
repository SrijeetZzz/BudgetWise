
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters"),

  deviceId: z
    .string()
    .trim()
    .min(1, "Device ID is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;