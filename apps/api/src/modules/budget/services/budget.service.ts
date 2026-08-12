import { Types } from "mongoose";
import { budgetRepository } from "../repositories/budget.repository";
import { CreateBudgetDto } from "../dtos/create-budget.dto";
import { BudgetScope, BudgetStatus } from "../types/budget.types";
import { AppError } from "../../../common/exceptions/AppError";
import categoryRepository from "../../category/repositories/category.repository";
import { BudgetQueryDto } from "../dtos/budget-query.dto";
import { budgetEngineService } from "./budget-engine.service";

class BudgetService {
  async createBudget(userId: Types.ObjectId, dto: CreateBudgetDto) {
    const {
      scope,
      categoryId,
      subcategoryId,
      period,
      startDate,
      endDate,
      budgetAmount,
    } = dto;

    // Validate Category
    if (scope === BudgetScope.CATEGORY) {
      if (!categoryId) {
        throw new AppError(400, "Category is required.");
      }

      const category = await categoryRepository.findById(categoryId);

      if (
        !category ||
        (!category.isSystem &&
          (!category.userId || !category.userId.equals(userId)))
      ) {
        throw new AppError(404, "Category not found.");
      }
    }

    // Validate Subcategory
    if (scope === BudgetScope.SUBCATEGORY) {
      if (!categoryId || !subcategoryId) {
        throw new AppError(400, "Category and Subcategory are required.");
      }

      const category = await categoryRepository.findById(categoryId);

      if (
        !category ||
        (!category.isSystem &&
          (!category.userId || !category.userId.equals(userId)))
      ) {
        throw new AppError(404, "Category not found.");
      }

      const subcategory = await categoryRepository.findById(subcategoryId);

      if (
        !subcategory ||
        (!subcategory.isSystem &&
          (!subcategory.userId || !subcategory.userId.equals(userId)))
      ) {
        throw new AppError(404, "Subcategory not found.");
      }
    }

    // Check duplicate active budget
    const existingBudget = await budgetRepository.exists({
      userId,
      scope,
      categoryId: categoryId ? new Types.ObjectId(categoryId) : undefined,
      subcategoryId: subcategoryId
        ? new Types.ObjectId(subcategoryId)
        : undefined,
      startDate,
      endDate,
      status: BudgetStatus.ACTIVE,
    });

    if (existingBudget) {
      throw new AppError(
        409,
        "An active budget already exists for this scope and period.",
      );
    }

    // Create Budget
    const budget = await budgetRepository.create({
      userId,
      scope,
      categoryId: categoryId ? new Types.ObjectId(categoryId) : undefined,
      subcategoryId: subcategoryId
        ? new Types.ObjectId(subcategoryId)
        : undefined,
      period,
      startDate,
      endDate,
      budgetAmount,
      spentAmount: 0,
      remainingAmount: budgetAmount,
      utilization: 0,
      status: BudgetStatus.ACTIVE,
    });

    // Immediately sync with existing transactions
    const updatedBudget = await budgetEngineService.recalculateBudget(
      budget._id,
    );

    return updatedBudget;
  }
  async getBudgetById(userId: Types.ObjectId, budgetId: string) {
    const budget = await budgetRepository.findById(
      new Types.ObjectId(budgetId),
    );

    if (!budget || !budget.userId.equals(userId)) {
      throw new AppError(404, "Budget not found.");
    }

    return budget;
  }

  //   async getBudgets(
  //     userId: Types.ObjectId,
  //     query: {
  //       page?: number;
  //       limit?: number;
  //       scope?: BudgetScope;
  //       status?: BudgetStatus;
  //     },
  //   ) {
  //     const { page = 1, limit = 10, scope, status } = query;

  //     const filter: any = {
  //       userId,
  //     };

  //     if (scope) filter.scope = scope;
  //     if (status) filter.status = status;

  //     return budgetRepository.findAllByUserId(userId, query);
  //   }
  async getBudgets(userId: Types.ObjectId, query: BudgetQueryDto) {
    return budgetRepository.findAllByUserId(userId, query);
  }

  async updateBudget(
    userId: Types.ObjectId,
    budgetId: string,
    dto: Partial<CreateBudgetDto>,
  ) {
    const budget = await budgetRepository.findById(
      new Types.ObjectId(budgetId),
    );

    if (!budget || !budget.userId.equals(userId)) {
      throw new AppError(404, "Budget not found.");
    }

    // Validate Category
    if (dto.scope === BudgetScope.CATEGORY && dto.categoryId) {
      const category = await categoryRepository.findById(dto.categoryId);

      if (
        !category ||
        (!category.isSystem &&
          (!category.userId || !category.userId.equals(userId)))
      ) {
        throw new AppError(404, "Category not found.");
      }
    }

    // Validate Subcategory
    if (dto.scope === BudgetScope.SUBCATEGORY) {
      if (!dto.categoryId || !dto.subcategoryId) {
        throw new AppError(400, "Category and Subcategory are required.");
      }

      const category = await categoryRepository.findById(dto.categoryId);

      if (
        !category ||
        (!category.isSystem &&
          (!category.userId || !category.userId.equals(userId)))
      ) {
        throw new AppError(404, "Category not found.");
      }

      const subcategory = await categoryRepository.findById(dto.subcategoryId);

      if (
        !subcategory ||
        (!subcategory.isSystem &&
          (!subcategory.userId || !subcategory.userId.equals(userId)))
      ) {
        throw new AppError(404, "Subcategory not found.");
      }
    }

    if (dto.budgetAmount !== undefined) {
      budget.remainingAmount = Math.max(
        0,
        dto.budgetAmount - budget.spentAmount,
      );

      budget.utilization =
        dto.budgetAmount === 0
          ? 0
          : Number(((budget.spentAmount / dto.budgetAmount) * 100).toFixed(2));
    }

    return await budgetRepository.update(budget._id, {
      ...dto,
      categoryId: dto.categoryId
        ? new Types.ObjectId(dto.categoryId)
        : budget.categoryId,
      subcategoryId: dto.subcategoryId
        ? new Types.ObjectId(dto.subcategoryId)
        : budget.subcategoryId,
      remainingAmount: budget.remainingAmount,
      utilization: budget.utilization,
    });
  }
  async deleteBudget(userId: Types.ObjectId, budgetId: string) {
    const budget = await budgetRepository.findById(
      new Types.ObjectId(budgetId),
    );

    if (!budget || !budget.userId.equals(userId)) {
      throw new AppError(404, "Budget not found.");
    }

    await budgetRepository.softDelete(budget._id);

    return {
      message: "Budget deleted successfully.",
    };
  }
}

export const budgetService = new BudgetService();
