import { z } from "zod";
import { CategoryType } from "../../../common/enums/category-type.enum";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name cannot exceed 50 characters"),

  type: z.nativeEnum(CategoryType, {
    message: "Category type must be INCOME or EXPENSE",
  }),

  icon: z
    .string()
    .trim()
    .min(1, "Icon is required")
    .max(50, "Icon cannot exceed 50 characters"),

  color: z
    .string()
    .trim()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Invalid hex color code"
    ),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;