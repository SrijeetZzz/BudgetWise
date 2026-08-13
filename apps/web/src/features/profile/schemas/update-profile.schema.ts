import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),

  monthlyIncome: z
    .number()
    .min(0, 'Income cannot be negative')
    .optional(),

  occupation: z
    .string()
    .trim()
    .max(100, 'Occupation cannot exceed 100 characters')
    .optional(),

  country: z
    .string()
    .trim()
    .max(100, 'Country cannot exceed 100 characters')
    .optional(),

  timezone: z
    .string()
    .trim()
    .max(100, 'Timezone cannot exceed 100 characters')
    .optional(),
});

export type UpdateProfileSchema = z.infer<
  typeof updateProfileSchema
>;