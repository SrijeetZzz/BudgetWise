import { z } from 'zod';

export const registerOtpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

export type RegisterOtpSchema = z.infer<
  typeof registerOtpSchema
>;