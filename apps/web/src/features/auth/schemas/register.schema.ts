import { z } from 'zod';

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(3, 'Display name must be at least 3 characters'),

    email: z
      .string()
      .email('Please enter a valid email'),

    phone: z
      .string()
      .regex(
        /^[6-9]\d{9}$/,
        'Enter a valid phone number',
      ),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#]).*$/,
        'Password must contain uppercase, lowercase, number and special character',
      ),

    confirmPassword: z.string(),

    deviceId: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    },
  );

export type RegisterSchema = z.infer<
  typeof registerSchema
>;