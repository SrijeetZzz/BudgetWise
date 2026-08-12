import { Types } from "mongoose";
import { CategoryType } from "../../../common/enums/category-type.enum";

export interface CategoryFilter {
  userId?: Types.ObjectId;

  type?: CategoryType;

  level?: number;

  parentCategoryId?: Types.ObjectId | null;

  isSystem?: boolean;

  isDeleted?: boolean;

  search?: string;
}