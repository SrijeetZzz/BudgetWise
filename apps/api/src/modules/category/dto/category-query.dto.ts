import { CategoryType } from "../../../common/enums/category-type.enum";

export interface CategoryQueryDto {
  type?: CategoryType;

  parentCategoryId?: string;

  includeSystem?: boolean;

  search?: string;
}