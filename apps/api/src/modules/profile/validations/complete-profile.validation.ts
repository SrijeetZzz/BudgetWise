import { z } from "zod";

export const completeProfileSchema = z.object({
  monthlyIncome: z
    .number()
    .min(0, "Monthly income cannot be negative"),

  occupation: z
    .string()
    .trim()
    .min(2, "Occupation must be at least 2 characters")
    .max(100),

  country: z
    .string()
    .trim()
    .min(2)
    .max(100),

  timezone: z
    .string()
    .trim()
    .min(2)
    .max(100),
});

export type CompleteProfileInput = z.infer<
  typeof completeProfileSchema
>;