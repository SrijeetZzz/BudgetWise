export type CategoryType = 'INCOME' | 'EXPENSE';

export interface Category {
  _id: string;
  userId: string | null;
  parentCategoryId: string | null;
  level: number;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  isSystem: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateCategoryRequest {
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
}

export interface CreateSubcategoryRequest {
  parentCategoryId: string;
  name: string;
  icon: string;
  color: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  icon?: string;
  color?: string;
}

export interface UpdateSubcategoryRequest {
  name?: string;
  icon?: string;
  color?: string;
}

export interface CategoryQuery {
  type?: CategoryType;
  parentCategoryId?: string;
  includeSystem?: boolean;
  search?: string;
}