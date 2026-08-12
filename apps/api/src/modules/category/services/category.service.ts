import { Types } from "mongoose";
import { CategoryLevel } from "../../../common/enums/category-level.enum";
import { AppError } from "../../../common/exceptions/AppError";

import categoryRepository from "../repositories/category.repository";

import { CreateCategoryDto } from "../dto/create-category.dto";
import { CreateSubcategoryDto } from "../dto/create-subcategory.dto";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { UpdateSubcategoryDto } from "../dto/update-subcategory.dto";

class CategoryService {
  async createCategory(userId: Types.ObjectId, payload: CreateCategoryDto) {
    const existingCategory = await categoryRepository.findByName({
      userId,
      parentCategoryId: null,
      type: payload.type,
      name: payload.name.trim(),
    });

    if (existingCategory) {
      throw new AppError(409, "Category already exists");
    }
    console.log("Service userId:", userId.toString());
    return categoryRepository.create({
      userId,
      parentCategoryId: null,
      level: CategoryLevel.PARENT,
      name: payload.name.trim(),
      type: payload.type,
      icon: payload.icon,
      color: payload.color,
      isSystem: false,
      isDeleted: false,
    });
  }

  async createSubcategory(
    userId: Types.ObjectId,
    payload: CreateSubcategoryDto,
  ) {
    // Check parent exists
    const parentCategory = await categoryRepository.findById(
      payload.parentCategoryId,
    );

    if (!parentCategory) {
      throw new AppError(404, "Parent category not found");
    }

    // Parent must actually be a parent category
    if (parentCategory.level !== CategoryLevel.PARENT) {
      throw new AppError(400, "Invalid parent category");
    }

    // User can only create subcategories under:
    // 1. System categories
    // 2. Their own categories
    if (
      !parentCategory.isSystem &&
      parentCategory.userId?.toString() !== userId.toString()
    ) {
      throw new AppError(
        403,
        "You are not allowed to create a subcategory for this category",
      );
    }

    // Duplicate check
    const existingSubcategory = await categoryRepository.findByName({
      parentCategoryId: parentCategory._id,
      name: payload.name.trim(),
    });

    if (existingSubcategory) {
      throw new AppError(409, "Subcategory already exists");
    }

    return categoryRepository.create({
      userId: parentCategory.isSystem ? userId : parentCategory.userId,
      parentCategoryId: parentCategory._id,
      level: CategoryLevel.SUBCATEGORY,
      name: payload.name.trim(),
      type: parentCategory.type,
      icon: payload.icon,
      color: payload.color,
      isSystem: false,
      isDeleted: false,
    });
  }
  async getCategories(userId: Types.ObjectId) {
    return categoryRepository.findAll({
      $or: [
        {
          isSystem: true,
        },
        {
          userId,
        },
      ],
    });
  }
  async getCategoryById(userId: Types.ObjectId, categoryId: string) {
    const category = await categoryRepository.findById(categoryId);

    if (!category) {
      throw new AppError(404, "Category not found");
    }

    // Allow access only to system categories
    // or categories owned by the current user
    if (
      !category.isSystem &&
      category.userId?.toString() !== userId.toString()
    ) {
      throw new AppError(403, "Access denied");
    }

    return category;
  }
  async getSubcategories(parentCategoryId: string) {
    const parent = await categoryRepository.findById(parentCategoryId);

    if (!parent) {
      throw new AppError(404, "Parent category not found");
    }

    return categoryRepository.findSubcategories(parentCategoryId);
  }
  async updateCategory(
    userId: Types.ObjectId,
    categoryId: string,
    payload: UpdateCategoryDto,
  ) {
    const category = await categoryRepository.findById(categoryId);

    if (!category) {
      throw new AppError(404, "Category not found");
    }

    if (category.isSystem) {
      throw new AppError(403, "System categories cannot be updated");
    }

    if (category.userId?.toString() !== userId.toString()) {
      throw new AppError(403, "Access denied");
    }

    if (
      payload.name &&
      payload.name.trim().toLowerCase() !== category.name.toLowerCase()
    ) {
      const existingCategory = await categoryRepository.findByName({
        userId,
        parentCategoryId: null,
        type: category.type,
        name: payload.name.trim(),
      });

      if (existingCategory) {
        throw new AppError(409, "Category already exists");
      }
    }

    const updatedCategory = await categoryRepository.update(categoryId, {
      ...(payload.name && { name: payload.name.trim() }),
      ...(payload.icon && { icon: payload.icon }),
      ...(payload.color && { color: payload.color }),
    });

    return updatedCategory;
  }

  async updateSubcategory(
    userId: Types.ObjectId,
    subcategoryId: string,
    payload: UpdateSubcategoryDto,
  ) {
    const subcategory = await categoryRepository.findById(subcategoryId);

    if (!subcategory) {
      throw new AppError(404, "Subcategory not found");
    }

    if (subcategory.level !== CategoryLevel.SUBCATEGORY) {
      throw new AppError(400, "Invalid subcategory");
    }

    if (subcategory.isSystem) {
      throw new AppError(403, "System subcategories cannot be updated");
    }

    if (subcategory.userId?.toString() !== userId.toString()) {
      throw new AppError(403, "Access denied");
    }

    if (
      payload.name &&
      payload.name.trim().toLowerCase() !== subcategory.name.toLowerCase()
    ) {
      const existingSubcategory = await categoryRepository.findByName({
        parentCategoryId: subcategory.parentCategoryId,
        name: payload.name.trim(),
      });

      if (
        existingSubcategory &&
        existingSubcategory._id.toString() !== subcategoryId
      ) {
        throw new AppError(409, "Subcategory already exists");
      }
    }

    return categoryRepository.update(subcategoryId, {
      ...(payload.name && { name: payload.name.trim() }),
      ...(payload.icon && { icon: payload.icon }),
      ...(payload.color && { color: payload.color }),
    });
  }
  async deleteSubcategory(userId: Types.ObjectId, subcategoryId: string) {
    const subcategory = await categoryRepository.findById(subcategoryId);

    if (!subcategory) {
      throw new AppError(404, "Subcategory not found");
    }

    if (subcategory.level !== CategoryLevel.SUBCATEGORY) {
      throw new AppError(400, "Invalid subcategory");
    }

    if (subcategory.isSystem) {
      throw new AppError(403, "System subcategories cannot be deleted");
    }

    if (subcategory.userId?.toString() !== userId.toString()) {
      throw new AppError(403, "Access denied");
    }

    // TODO:
    // Once Transaction module is implemented,
    // check if this subcategory is used in any transaction.
    // If yes, throw:
    // throw new AppError(400, "Subcategory is in use");

    await categoryRepository.softDelete(subcategoryId);

    return {
      message: "Subcategory deleted successfully",
    };
  }
  async deleteCategory(userId: Types.ObjectId, categoryId: string) {
    const category = await categoryRepository.findById(categoryId);

    if (!category) {
      throw new AppError(404, "Category not found");
    }

    if (category.level !== CategoryLevel.PARENT) {
      throw new AppError(400, "Invalid category");
    }

    if (category.isSystem) {
      throw new AppError(403, "System categories cannot be deleted");
    }

    if (category.userId?.toString() !== userId.toString()) {
      throw new AppError(403, "Access denied");
    }

    // Check for active subcategories
    const subcategories =
      await categoryRepository.findSubcategories(categoryId);

    if (subcategories.length > 0) {
      throw new AppError(
        400,
        "Delete all subcategories before deleting this category",
      );
    }

    // TODO:
    // Once Transaction module is implemented,
    // check if this category is used in any transaction.
    // If yes, throw:
    // throw new AppError(400, "Category is in use");

    await categoryRepository.softDelete(categoryId);

    return {
      message: "Category deleted successfully",
    };
  }
}

export default new CategoryService();
