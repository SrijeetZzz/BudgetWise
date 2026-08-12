import { Request, Response } from "express";
import { Types } from "mongoose";

import categoryService from "../services/category.service";
import { sendResponse } from "../../../common/utils/response";
import { asyncHandler } from "../../../common/helpers/asyncHandler";

class CategoryController {
  createCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.createCategory(
      new Types.ObjectId(req.user.userId),
      req.body,
    );

    return sendResponse(res, 201, {
      success: true,
      message: "Category created successfully",
      data: category,
    });
  });

  createSubcategory = asyncHandler(async (req: Request, res: Response) => {
    const subcategory = await categoryService.createSubcategory(
      new Types.ObjectId(req.user.userId),
      req.body,
    );

    return sendResponse(res, 201, {
      success: true,
      message: "Subcategory created successfully",
      data: subcategory,
    });
  });

  getCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await categoryService.getCategories(
      new Types.ObjectId(req.user.userId),
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  });

  getCategoryById = asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.getCategoryById(
      new Types.ObjectId(req.user.userId),
      req.params.categoryId as string,
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  });
  getSubcategories = asyncHandler(async (req: Request, res: Response) => {
  const { parentCategoryId } = req.query;

  const subcategories = await categoryService.getSubcategories(
    parentCategoryId as string,
  );

  return sendResponse(res, 200, {
    success: true,
    message: "Subcategories fetched successfully",
    data: subcategories,
  });
});

  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.updateCategory(
      new Types.ObjectId(req.user.userId),
      req.params.categoryId as string,
      req.body,
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  });

  updateSubcategory = asyncHandler(async (req: Request, res: Response) => {
    const subcategory = await categoryService.updateSubcategory(
      new Types.ObjectId(req.user.userId),
      req.params.subcategoryId as string,
      req.body,
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Subcategory updated successfully",
      data: subcategory,
    });
  });

  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const result = await categoryService.deleteCategory(
      new Types.ObjectId(req.user.userId),
      req.params.categoryId as string,
    );

    return sendResponse(res, 200, {
      success: true,
      message: result.message,
    });
  });

  deleteSubcategory = asyncHandler(async (req: Request, res: Response) => {
    const result = await categoryService.deleteSubcategory(
      new Types.ObjectId(req.user.userId),
      req.params.subcategoryId as string,
    );

    return sendResponse(res, 200, {
      success: true,
      message: result.message,
    });
  });
}

export default new CategoryController();