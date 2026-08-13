import { z } from 'zod';

export const googleCompleteSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(
      /^[6-9]\d{9}$/,
      'Enter a valid 10-digit phone number',
    ),

  otp: z
    .string()
    .trim()
    .regex(
      /^\d{6}$/,
      'OTP must be exactly 6 digits',
    ),
});

export type GoogleCompleteSchema = z.infer<
  typeof googleCompleteSchema
>;