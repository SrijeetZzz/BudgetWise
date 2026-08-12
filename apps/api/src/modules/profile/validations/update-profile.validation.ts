import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  monthlyIncome: z
    .number()
    .min(0)
    .optional(),

  occupation: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  country: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  timezone: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),
});

export type UpdateProfileInput = z.infer<
  typeof updateProfileSchema
>;