import { FilterQuery, Types, UpdateQuery } from "mongoose";
import { Category } from "../schemas/category.schema";
import { ICategory } from "../interfaces/category.interface";
import { CategoryLevel } from "../../../common/enums/category-level.enum";
import { CategoryType } from "../../../common/enums/category-type.enum";

export interface CreateCategoryData {
  userId?: Types.ObjectId | null;
  parentCategoryId?: Types.ObjectId | null;
  level: CategoryLevel;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  isSystem?: boolean;
  isDeleted?: boolean;
}

class CategoryRepository {
  async create(data: CreateCategoryData) {
    return Category.create(data);
  }

  async bulkCreate(data: CreateCategoryData[]) {
    return Category.insertMany(data);
  }

  async findById(id: string) {
    return Category.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  async findByIdAndType(id: string, type: CategoryType) {
    return Category.findOne({
      _id: id,
      type,
      isDeleted: false,
    });
  }

  async findByName(filter: FilterQuery<ICategory>) {
    const { name, ...rest } = filter;

    return Category.findOne({
      ...rest,
      ...(name && {
        name: {
          $regex: new RegExp(`^${String(name)}$`, "i"),
        },
      }),
      isDeleted: false,
    });
  }

  async findAll(filter: FilterQuery<ICategory> = {}) {
    return Category.find({
      ...filter,
      isDeleted: false,
    }).sort({
      isSystem: -1,
      name: 1,
    });
  }

  async findParents(filter: FilterQuery<ICategory> = {}) {
    return Category.find({
      ...filter,
      level: CategoryLevel.PARENT,
      isDeleted: false,
    }).sort({
      isSystem: -1,
      name: 1,
    });
  }

  async findSubcategories(parentCategoryId: string) {
    return Category.find({
      parentCategoryId,
      level: CategoryLevel.SUBCATEGORY,
      isDeleted: false,
    }).sort({
      isSystem: -1,
      name: 1,
    });
  }

  async update(id: string, data: UpdateQuery<ICategory>) {
    return Category.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      data,
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async softDelete(id: string) {
    return Category.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );
  }

  async exists(filter: FilterQuery<ICategory>) {
    return Boolean(
      await Category.exists({
        ...filter,
        isDeleted: false,
      }),
    );
  }
}

export default new CategoryRepository();
