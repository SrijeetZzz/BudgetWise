import { FilterQuery, UpdateQuery } from "mongoose";
import { ICategory } from "./category.interface";

export interface ICategoryRepository {
  create(data: Partial<ICategory>): Promise<ICategory>;

  bulkCreate(data: Partial<ICategory>[]): Promise<ICategory[]>;

  findById(id: string): Promise<ICategory | null>;

  findByIdAndType(
    id: string,
    type: ICategory["type"]
  ): Promise<ICategory | null>;

  findByName(filter: FilterQuery<ICategory>): Promise<ICategory | null>;

  findAll(filter: FilterQuery<ICategory>): Promise<ICategory[]>;

  findParents(filter: FilterQuery<ICategory>): Promise<ICategory[]>;

  findSubcategories(parentCategoryId: string): Promise<ICategory[]>;

  update(
    id: string,
    data: UpdateQuery<ICategory>
  ): Promise<ICategory | null>;

  softDelete(id: string): Promise<ICategory | null>;

  exists(filter: FilterQuery<ICategory>): Promise<boolean>;
}