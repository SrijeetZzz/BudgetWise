import { CategoryType } from "../../../common/enums/category-type.enum";

export interface CreateCategoryDto {
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
}