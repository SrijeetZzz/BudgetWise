import { Types } from "mongoose";
import { CategoryLevel } from "../../../common/enums/category-level.enum";
import { CategoryType } from "../../../common/enums/category-type.enum";

export interface ICategory {
  userId: Types.ObjectId | null;
  parentCategoryId: Types.ObjectId | null;
  level: CategoryLevel;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  isSystem: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}