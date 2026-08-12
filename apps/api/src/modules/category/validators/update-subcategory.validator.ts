import { z } from "zod";

export const updateSubcategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Subcategory name must be at least 2 characters")
    .max(50, "Subcategory name cannot exceed 50 characters")
    .optional(),

  icon: z
    .string()
    .trim()
    .min(1, "Icon is required")
    .max(50, "Icon cannot exceed 50 characters")
    .optional(),

  color: z
    .string()
    .trim()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Invalid hex color code"
    )
    .optional(),
});

export type UpdateSubcategoryInput = z.infer<
  typeof updateSubcategorySchema
>;