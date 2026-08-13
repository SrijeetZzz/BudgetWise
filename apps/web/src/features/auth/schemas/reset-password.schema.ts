import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Invalid email address'),

    otp: z
      .string()
      .trim()
      .regex(
        /^\d{6}$/,
        'OTP must be exactly 6 digits',
      ),

    newPassword: z
      .string()
      .min(
        8,
        'Password must be at least 8 characters',
      )
      .max(
        64,
        'Password cannot exceed 64 characters',
      )
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]+$/,
        'Password must contain uppercase, lowercase, number, and special character',
      ),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    },
  );

export type ResetPasswordSchema = z.infer<
  typeof resetPasswordSchema
>;