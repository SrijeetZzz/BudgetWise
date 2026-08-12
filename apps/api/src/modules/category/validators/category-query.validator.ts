import mongoose from "mongoose";
import { z } from "zod";
import { CategoryType } from "../../../common/enums/category-type.enum";
import { objectIdSchema } from "../../../common/validator/object-id.validator";

export const categoryQuerySchema = z.object({
  type: z.nativeEnum(CategoryType).optional(),

  parentCategoryId:objectIdSchema, 

  includeSystem: z
    .enum(["true", "false"])
    .optional(),

  search: z
    .string()
    .trim()
    .max(50, "Search cannot exceed 50 characters")
    .optional(),
});

export type CategoryQueryInput = z.infer<
  typeof categoryQuerySchema
>;