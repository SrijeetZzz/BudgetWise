// import { Types } from "mongoose";

// import { budgetRepository } from "../repositories/budget.repository";

// import { CreateBudgetDto } from "../dtos/create-budget.dto";
// import { UpdateBudgetDto } from "../dtos/update-budget.dto";
// import { BudgetQueryDto } from "../dtos/budget-query.dto";

// import {
//   BudgetPeriod,
//   BudgetRecurrenceStatus,
//   BudgetScope,
//   BudgetStatus,
// } from "../types/budget.types";

// import { AppError } from "../../../common/exceptions/AppError";

// import categoryRepository from "../../category/repositories/category.repository";

// import { budgetEngineService } from "./budget-engine.service";
// import { UpdateBudgetRecurrenceDto } from "../dtos/update-budget-recurrence.dto";

// class BudgetService {
//   /**
//    * Create a new budget.
//    *
//    * A budget can either be:
//    *
//    * 1. One-time budget
//    * 2. Recurring budget
//    *
//    * For recurring budgets, the current budget is created normally
//    * and recurrence configuration is attached to it.
//    *
//    * The scheduler is responsible for generating future periods.
//    */
//   async createBudget(userId: Types.ObjectId, dto: CreateBudgetDto) {
//     const {
//       scope,
//       categoryId,
//       subcategoryId,
//       period,
//       startDate,
//       endDate,
//       budgetAmount,
//       recurrence,
//     } = dto;

//     // -----------------------------------------
//     // Validate Category
//     // -----------------------------------------

//     if (scope === BudgetScope.CATEGORY) {
//       if (!categoryId) {
//         throw new AppError(400, "Category is required.");
//       }

//       const category = await categoryRepository.findById(categoryId);

//       if (
//         !category ||
//         (!category.isSystem &&
//           (!category.userId || !category.userId.equals(userId)))
//       ) {
//         throw new AppError(404, "Category not found.");
//       }
//     }

//     // -----------------------------------------
//     // Validate Subcategory
//     // -----------------------------------------

//     if (scope === BudgetScope.SUBCATEGORY) {
//       if (!categoryId || !subcategoryId) {
//         throw new AppError(400, "Category and Subcategory are required.");
//       }

//       const category = await categoryRepository.findById(categoryId);

//       if (
//         !category ||
//         (!category.isSystem &&
//           (!category.userId || !category.userId.equals(userId)))
//       ) {
//         throw new AppError(404, "Category not found.");
//       }

//       const subcategory = await categoryRepository.findById(subcategoryId);

//       if (
//         !subcategory ||
//         (!subcategory.isSystem &&
//           (!subcategory.userId || !subcategory.userId.equals(userId)))
//       ) {
//         throw new AppError(404, "Subcategory not found.");
//       }

//       // Make sure the selected subcategory
//       // belongs to the selected category.
//       if (
//         subcategory.parentCategoryId?.toString() !== category._id.toString()
//       ) {
//         throw new AppError(
//           400,
//           "Subcategory does not belong to the selected category.",
//         );
//       }
//     }

//     // -----------------------------------------
//     // Validate Recurrence
//     // -----------------------------------------

//     const isRecurring = recurrence?.enabled === true;

//     if (isRecurring && period === BudgetPeriod.CUSTOM) {
//       throw new AppError(
//         400,
//         "Recurring budgets are not supported for CUSTOM periods.",
//       );
//     }

//     // -----------------------------------------
//     // Validate Recurrence End Date
//     // -----------------------------------------

//     if (isRecurring && recurrence?.endDate && recurrence.endDate < endDate) {
//       throw new AppError(
//         400,
//         "Recurrence end date must be after the current budget period.",
//       );
//     }

//     // -----------------------------------------
//     // Determine recurring amount
//     // -----------------------------------------

//     const recurringAmount = recurrence?.budgetAmount ?? budgetAmount;

//     // -----------------------------------------
//     // Check duplicate current budget
//     // -----------------------------------------

//     const existingBudget = await budgetRepository.exists({
//       userId,

//       scope,

//       categoryId: categoryId ? new Types.ObjectId(categoryId) : undefined,

//       subcategoryId: subcategoryId
//         ? new Types.ObjectId(subcategoryId)
//         : undefined,

//       startDate,

//       endDate,

//       status: BudgetStatus.ACTIVE,
//     });

//     if (existingBudget) {
//       throw new AppError(
//         409,
//         "An active budget already exists for this scope and period.",
//       );
//     }

//     // -----------------------------------------
//     // Calculate next generation date
//     // -----------------------------------------

//     let nextGenerationDate: Date | undefined;

//     if (isRecurring) {
//       nextGenerationDate = this.calculateNextBudgetPeriodStart(
//         startDate,
//         period,
//       );
//     }

//     // -----------------------------------------
//     // Create Budget
//     // -----------------------------------------

//     const budget = await budgetRepository.create({
//       userId,

//       scope,

//       categoryId: categoryId ? new Types.ObjectId(categoryId) : undefined,

//       subcategoryId: subcategoryId
//         ? new Types.ObjectId(subcategoryId)
//         : undefined,

//       period,

//       startDate,

//       endDate,

//       budgetAmount,

//       spentAmount: 0,

//       remainingAmount: budgetAmount,

//       utilization: 0,

//       status: BudgetStatus.ACTIVE,

//       recurrence: isRecurring
//         ? {
//             enabled: true,

//             budgetAmount: recurringAmount,

//             nextGenerationDate,

//             endDate: recurrence?.endDate,

//             status: BudgetRecurrenceStatus.ACTIVE,

//             rootBudgetId: undefined,
//           }
//         : undefined,
//     });

//     // -----------------------------------------
//     // Establish recurrence root
//     // -----------------------------------------

//     if (isRecurring && budget.recurrence) {
//       budget.recurrence.rootBudgetId = budget._id;

//       await budget.save();
//     }

//     // -----------------------------------------
//     // Immediately sync with transactions
//     // -----------------------------------------

//     const updatedBudget = await budgetEngineService.recalculateBudget(
//       budget._id,
//     );

//     return updatedBudget;
//   }

//   /**
//    * Calculate the start date of the next
//    * budget period.
//    */
//   private calculateNextBudgetPeriodStart(
//     currentStartDate: Date,
//     period: BudgetPeriod,
//   ): Date {
//     const nextDate = new Date(currentStartDate);

//     switch (period) {
//       case BudgetPeriod.WEEKLY:
//         nextDate.setDate(nextDate.getDate() + 7);
//         break;

//       case BudgetPeriod.MONTHLY:
//         nextDate.setDate(1);
//         nextDate.setMonth(nextDate.getMonth() + 1);
//         break;

//       case BudgetPeriod.YEARLY:
//         nextDate.setMonth(0);
//         nextDate.setDate(1);
//         nextDate.setFullYear(nextDate.getFullYear() + 1);
//         break;

//       default:
//         throw new AppError(400, "Unsupported recurring budget period.");
//     }

//     return nextDate;
//   }

//   /**
//    * Get a single budget belonging to the user.
//    */
//   async getBudgetById(userId: Types.ObjectId, budgetId: string) {
//     const budget = await budgetRepository.findById(
//       new Types.ObjectId(budgetId),
//     );

//     if (!budget || !budget.userId.equals(userId)) {
//       throw new AppError(404, "Budget not found.");
//     }

//     return budget;
//   }

//   /**
//    * Get paginated budgets for the user.
//    */
//   async getBudgets(userId: Types.ObjectId, query: BudgetQueryDto) {
//     return budgetRepository.findAllByUserId(userId, query);
//   }

//   /**
//    * Update ONE budget period.
//    *
//    * This does NOT modify recurrence configuration.
//    *
//    * Example:
//    *
//    * August = ₹10,000
//    * September = ₹10,000
//    *
//    * Updating August to ₹12,000 results in:
//    *
//    * August = ₹12,000
//    * September = ₹10,000
//    */
//   async updateBudget(
//     userId: Types.ObjectId,
//     budgetId: string,
//     dto: UpdateBudgetDto,
//   ) {
//     const budget = await budgetRepository.findById(
//       new Types.ObjectId(budgetId),
//     );

//     if (!budget || !budget.userId.equals(userId)) {
//       throw new AppError(404, "Budget not found.");
//     }

//     // -----------------------------------------
//     // Validate Category
//     // -----------------------------------------

//     if (dto.scope === BudgetScope.CATEGORY) {
//       if (!dto.categoryId) {
//         throw new AppError(400, "Category is required.");
//       }

//       const category = await categoryRepository.findById(dto.categoryId);

//       if (
//         !category ||
//         (!category.isSystem &&
//           (!category.userId || !category.userId.equals(userId)))
//       ) {
//         throw new AppError(404, "Category not found.");
//       }
//     }

//     // -----------------------------------------
//     // Validate Subcategory
//     // -----------------------------------------

//     if (dto.scope === BudgetScope.SUBCATEGORY) {
//       if (!dto.categoryId || !dto.subcategoryId) {
//         throw new AppError(400, "Category and Subcategory are required.");
//       }

//       const category = await categoryRepository.findById(dto.categoryId);

//       if (
//         !category ||
//         (!category.isSystem &&
//           (!category.userId || !category.userId.equals(userId)))
//       ) {
//         throw new AppError(404, "Category not found.");
//       }

//       const subcategory = await categoryRepository.findById(dto.subcategoryId);

//       if (
//         !subcategory ||
//         (!subcategory.isSystem &&
//           (!subcategory.userId || !subcategory.userId.equals(userId)))
//       ) {
//         throw new AppError(404, "Subcategory not found.");
//       }

//       if (
//         subcategory.parentCategoryId?.toString() !== category._id.toString()
//       ) {
//         throw new AppError(
//           400,
//           "Subcategory does not belong to the selected category.",
//         );
//       }
//     }

//     // -----------------------------------------
//     // Recalculate derived values
//     // -----------------------------------------

//     let remainingAmount = budget.remainingAmount;

//     let utilization = budget.utilization;

//     if (dto.budgetAmount !== undefined) {
//       remainingAmount = Math.max(0, dto.budgetAmount - budget.spentAmount);

//       utilization =
//         dto.budgetAmount === 0
//           ? 0
//           : Number(((budget.spentAmount / dto.budgetAmount) * 100).toFixed(2));
//     }

//     // -----------------------------------------
//     // Update current budget only
//     // -----------------------------------------

//     const updatedBudget = await budgetRepository.update(budget._id, {
//       ...dto,

//       categoryId:
//         dto.categoryId !== undefined
//           ? new Types.ObjectId(dto.categoryId)
//           : budget.categoryId,

//       subcategoryId:
//         dto.subcategoryId !== undefined
//           ? new Types.ObjectId(dto.subcategoryId)
//           : budget.subcategoryId,

//       remainingAmount,

//       utilization,
//     });

//     if (!updatedBudget) {
//       throw new AppError(404, "Budget not found.");
//     }

//     return updatedBudget;
//   }

//   /**
//    * Delete a budget.
//    *
//    * Currently this deletes only the selected
//    * budget period.
//    *
//    * Recurrence handling will be implemented
//    * separately.
//    */
//   async deleteBudget(userId: Types.ObjectId, budgetId: string) {
//     const budget = await budgetRepository.findById(
//       new Types.ObjectId(budgetId),
//     );

//     if (!budget || !budget.userId.equals(userId)) {
//       throw new AppError(404, "Budget not found.");
//     }

//     // -----------------------------------------
//     // Root recurring budget
//     // -----------------------------------------

//     if (
//       budget.recurrence?.enabled &&
//       budget.recurrence.rootBudgetId &&
//       budget._id.equals(budget.recurrence.rootBudgetId)
//     ) {
//       await budgetRepository.update(budget._id, {
//         "recurrence.enabled": false,

//         "recurrence.status": BudgetRecurrenceStatus.COMPLETED,

//         "recurrence.nextGenerationDate": null,

//         isDeleted: true,
//       });

//       return {
//         message:
//           "Recurring budget deleted successfully. Existing generated budgets were preserved.",
//       };
//     }

//     // -----------------------------------------
//     // Normal / generated budget
//     // -----------------------------------------

//     await budgetRepository.softDelete(budget._id);

//     return {
//       message: "Budget deleted successfully.",
//     };
//   }
//   async updateBudgetRecurrence(
//     userId: Types.ObjectId,
//     budgetId: string,
//     dto: UpdateBudgetRecurrenceDto,
//   ) {
//     const budget = await budgetRepository.findById(
//       new Types.ObjectId(budgetId),
//     );

//     if (!budget || !budget.userId.equals(userId)) {
//       throw new AppError(404, "Budget not found.");
//     }

//     // -----------------------------------------
//     // Only the recurrence root can be edited
//     // -----------------------------------------

//     if (!budget.recurrence?.enabled) {
//       throw new AppError(
//         400,
//         "Only the recurring budget source can update recurrence settings.",
//       );
//     }

//     // -----------------------------------------
//     // Build final recurrence values
//     // -----------------------------------------

//     const currentRecurrence = budget.recurrence;

//     const finalEnabled = dto.enabled ?? currentRecurrence.enabled;

//     const finalBudgetAmount =
//       dto.budgetAmount ?? currentRecurrence.budgetAmount;

//     const finalEndDate =
//       dto.endDate !== undefined ? dto.endDate : currentRecurrence.endDate;

//     // -----------------------------------------
//     // Validate recurrence end date
//     // -----------------------------------------

//     if (
//       finalEnabled &&
//       finalEndDate &&
//       currentRecurrence.nextGenerationDate &&
//       finalEndDate < currentRecurrence.nextGenerationDate
//     ) {
//       throw new AppError(
//         400,
//         "Recurrence end date cannot be before the next budget generation date.",
//       );
//     }

//     // -----------------------------------------
//     // Stop recurrence
//     // -----------------------------------------

//     if (!finalEnabled) {
//       return budgetRepository.updateRecurrence(budget._id, {
//         "recurrence.enabled": false,

//         "recurrence.status": BudgetRecurrenceStatus.COMPLETED,

//         "recurrence.budgetAmount": finalBudgetAmount,

//         "recurrence.endDate": finalEndDate,

//         "recurrence.nextGenerationDate": null,
//       });
//     }

//     // -----------------------------------------
//     // Continue/update recurrence
//     // -----------------------------------------

//     let nextGenerationDate = currentRecurrence.nextGenerationDate;

//     /**
//      * If recurrence was previously completed
//      * and is being enabled again, calculate the
//      * next period from this budget.
//      */
//     if (!nextGenerationDate) {
//       nextGenerationDate = this.calculateNextBudgetPeriodStart(
//         budget.startDate,
//         budget.period,
//       );
//     }

//     if (finalEndDate && nextGenerationDate > finalEndDate) {
//       throw new AppError(
//         400,
//         "Recurrence end date does not allow another budget period.",
//       );
//     }

//     return budgetRepository.updateRecurrence(budget._id, {
//       "recurrence.enabled": true,

//       "recurrence.status": BudgetRecurrenceStatus.ACTIVE,

//       "recurrence.budgetAmount": finalBudgetAmount,

//       "recurrence.endDate": finalEndDate,

//       "recurrence.nextGenerationDate": nextGenerationDate,

//       "recurrence.rootBudgetId": budget._id,
//     });
//   }
// }

// export const budgetService = new BudgetService();


import { Types } from "mongoose";

import { budgetRepository } from "../repositories/budget.repository";

import { CreateBudgetDto } from "../dtos/create-budget.dto";
import { UpdateBudgetDto } from "../dtos/update-budget.dto";
import { BudgetQueryDto } from "../dtos/budget-query.dto";
import { UpdateBudgetRecurrenceDto } from "../dtos/update-budget-recurrence.dto";

import {
  BudgetPeriod,
  BudgetRecurrenceStatus,
  BudgetScope,
  BudgetStatus,
} from "../types/budget.types";

import { AppError } from "../../../common/exceptions/AppError";

import categoryRepository from "../../category/repositories/category.repository";

import { budgetEngineService } from "./budget-engine.service";

import { cacheService } from "../../../common/services/cache.service";
import { DashboardFilter } from "../../../common/enums/dashboard-filter.enum";

class BudgetService {
  /**
   * Invalidate all dashboard-related cache entries
   * for the specified user.
   *
   * Dashboard data contains budget information, so
   * every budget mutation must invalidate these caches.
   */
  private async invalidateDashboardCache(userId: Types.ObjectId) {
    const userIdString = userId.toString();

    const filters = [
      DashboardFilter.TODAY,
      DashboardFilter.THIS_WEEK,
      DashboardFilter.THIS_MONTH,
      DashboardFilter.LAST_3_MONTHS,
      DashboardFilter.LAST_6_MONTHS,
      DashboardFilter.THIS_YEAR,
    ];

    const keys = filters.flatMap((filter) => [
      `dashboard:${userIdString}:${filter}`,
      `dashboard:analytics:${userIdString}:${filter}`,
    ]);

    await cacheService.deleteMany(keys);

    console.log(
      `🗑️ Redis dashboard cache invalidated for user ${userIdString}`,
    );
  }

  /**
   * Create a new budget.
   *
   * A budget can either be:
   *
   * 1. One-time budget
   * 2. Recurring budget
   *
   * For recurring budgets, the current budget is created normally
   * and recurrence configuration is attached to it.
   *
   * The scheduler is responsible for generating future periods.
   */
  async createBudget(userId: Types.ObjectId, dto: CreateBudgetDto) {
    const {
      scope,
      categoryId,
      subcategoryId,
      period,
      startDate,
      endDate,
      budgetAmount,
      recurrence,
    } = dto;

    // -----------------------------------------
    // Validate Category
    // -----------------------------------------

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

    // -----------------------------------------
    // Validate Subcategory
    // -----------------------------------------

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

      if (
        subcategory.parentCategoryId?.toString() !== category._id.toString()
      ) {
        throw new AppError(
          400,
          "Subcategory does not belong to the selected category.",
        );
      }
    }

    // -----------------------------------------
    // Validate Recurrence
    // -----------------------------------------

    const isRecurring = recurrence?.enabled === true;

    if (isRecurring && period === BudgetPeriod.CUSTOM) {
      throw new AppError(
        400,
        "Recurring budgets are not supported for CUSTOM periods.",
      );
    }

    // -----------------------------------------
    // Validate Recurrence End Date
    // -----------------------------------------

    if (isRecurring && recurrence?.endDate && recurrence.endDate < endDate) {
      throw new AppError(
        400,
        "Recurrence end date must be after the current budget period.",
      );
    }

    // -----------------------------------------
    // Determine recurring amount
    // -----------------------------------------

    const recurringAmount = recurrence?.budgetAmount ?? budgetAmount;

    // -----------------------------------------
    // Check duplicate current budget
    // -----------------------------------------

    const existingBudget = await budgetRepository.exists({
      userId,
      scope,

      categoryId: categoryId
        ? new Types.ObjectId(categoryId)
        : undefined,

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

    // -----------------------------------------
    // Calculate next generation date
    // -----------------------------------------

    let nextGenerationDate: Date | undefined;

    if (isRecurring) {
      nextGenerationDate = this.calculateNextBudgetPeriodStart(
        startDate,
        period,
      );
    }

    // -----------------------------------------
    // Create Budget
    // -----------------------------------------

    const budget = await budgetRepository.create({
      userId,

      scope,

      categoryId: categoryId
        ? new Types.ObjectId(categoryId)
        : undefined,

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

      recurrence: isRecurring
        ? {
            enabled: true,

            budgetAmount: recurringAmount,

            nextGenerationDate,

            endDate: recurrence?.endDate,

            status: BudgetRecurrenceStatus.ACTIVE,

            rootBudgetId: undefined,
          }
        : undefined,
    });

    // -----------------------------------------
    // Establish recurrence root
    // -----------------------------------------

    if (isRecurring && budget.recurrence) {
      budget.recurrence.rootBudgetId = budget._id;

      await budget.save();
    }

    // -----------------------------------------
    // Immediately sync with transactions
    // -----------------------------------------

    const updatedBudget = await budgetEngineService.recalculateBudget(
      budget._id,
    );

    // -----------------------------------------
    // Invalidate dashboard cache
    // -----------------------------------------

    await this.invalidateDashboardCache(userId);

    return updatedBudget;
  }

  /**
   * Calculate the start date of the next
   * budget period.
   */
  private calculateNextBudgetPeriodStart(
    currentStartDate: Date,
    period: BudgetPeriod,
  ): Date {
    const nextDate = new Date(currentStartDate);

    switch (period) {
      case BudgetPeriod.WEEKLY:
        nextDate.setDate(nextDate.getDate() + 7);
        break;

      case BudgetPeriod.MONTHLY:
        nextDate.setDate(1);
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;

      case BudgetPeriod.YEARLY:
        nextDate.setMonth(0);
        nextDate.setDate(1);
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;

      default:
        throw new AppError(400, "Unsupported recurring budget period.");
    }

    return nextDate;
  }

  /**
   * Get a single budget belonging to the user.
   */
  async getBudgetById(userId: Types.ObjectId, budgetId: string) {
    const budget = await budgetRepository.findById(
      new Types.ObjectId(budgetId),
    );

    if (!budget || !budget.userId.equals(userId)) {
      throw new AppError(404, "Budget not found.");
    }

    return budget;
  }

  /**
   * Get paginated budgets for the user.
   */
  async getBudgets(
    userId: Types.ObjectId,
    query: BudgetQueryDto,
  ) {
    return budgetRepository.findAllByUserId(userId, query);
  }

  /**
   * Update ONE budget period.
   */
  async updateBudget(
    userId: Types.ObjectId,
    budgetId: string,
    dto: UpdateBudgetDto,
  ) {
    const budget = await budgetRepository.findById(
      new Types.ObjectId(budgetId),
    );

    if (!budget || !budget.userId.equals(userId)) {
      throw new AppError(404, "Budget not found.");
    }

    // -----------------------------------------
    // Validate Category
    // -----------------------------------------

    if (dto.scope === BudgetScope.CATEGORY) {
      if (!dto.categoryId) {
        throw new AppError(400, "Category is required.");
      }

      const category = await categoryRepository.findById(dto.categoryId);

      if (
        !category ||
        (!category.isSystem &&
          (!category.userId || !category.userId.equals(userId)))
      ) {
        throw new AppError(404, "Category not found.");
      }
    }

    // -----------------------------------------
    // Validate Subcategory
    // -----------------------------------------

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

      const subcategory = await categoryRepository.findById(
        dto.subcategoryId,
      );

      if (
        !subcategory ||
        (!subcategory.isSystem &&
          (!subcategory.userId || !subcategory.userId.equals(userId)))
      ) {
        throw new AppError(404, "Subcategory not found.");
      }

      if (
        subcategory.parentCategoryId?.toString() !== category._id.toString()
      ) {
        throw new AppError(
          400,
          "Subcategory does not belong to the selected category.",
        );
      }
    }

    // -----------------------------------------
    // Recalculate derived values
    // -----------------------------------------

    let remainingAmount = budget.remainingAmount;
    let utilization = budget.utilization;

    if (dto.budgetAmount !== undefined) {
      remainingAmount = Math.max(
        0,
        dto.budgetAmount - budget.spentAmount,
      );

      utilization =
        dto.budgetAmount === 0
          ? 0
          : Number(
              (
                (budget.spentAmount / dto.budgetAmount) *
                100
              ).toFixed(2),
            );
    }

    // -----------------------------------------
    // Update current budget only
    // -----------------------------------------

    const updatedBudget = await budgetRepository.update(
      budget._id,
      {
        ...dto,

        categoryId:
          dto.categoryId !== undefined
            ? new Types.ObjectId(dto.categoryId)
            : budget.categoryId,

        subcategoryId:
          dto.subcategoryId !== undefined
            ? new Types.ObjectId(dto.subcategoryId)
            : budget.subcategoryId,

        remainingAmount,

        utilization,
      },
    );

    if (!updatedBudget) {
      throw new AppError(404, "Budget not found.");
    }

    // -----------------------------------------
    // Invalidate dashboard cache
    // -----------------------------------------

    await this.invalidateDashboardCache(userId);

    return updatedBudget;
  }

  /**
   * Delete a budget.
   */
  async deleteBudget(
    userId: Types.ObjectId,
    budgetId: string,
  ) {
    const budget = await budgetRepository.findById(
      new Types.ObjectId(budgetId),
    );

    if (!budget || !budget.userId.equals(userId)) {
      throw new AppError(404, "Budget not found.");
    }

    // -----------------------------------------
    // Root recurring budget
    // -----------------------------------------

    if (
      budget.recurrence?.enabled &&
      budget.recurrence.rootBudgetId &&
      budget._id.equals(budget.recurrence.rootBudgetId)
    ) {
      await budgetRepository.update(budget._id, {
        "recurrence.enabled": false,

        "recurrence.status": BudgetRecurrenceStatus.COMPLETED,

        "recurrence.nextGenerationDate": null,

        isDeleted: true,
      });

      await this.invalidateDashboardCache(userId);

      return {
        message:
          "Recurring budget deleted successfully. Existing generated budgets were preserved.",
      };
    }

    // -----------------------------------------
    // Normal / generated budget
    // -----------------------------------------

    await budgetRepository.softDelete(budget._id);

    await this.invalidateDashboardCache(userId);

    return {
      message: "Budget deleted successfully.",
    };
  }

  /**
   * Update recurrence configuration.
   */
  async updateBudgetRecurrence(
    userId: Types.ObjectId,
    budgetId: string,
    dto: UpdateBudgetRecurrenceDto,
  ) {
    const budget = await budgetRepository.findById(
      new Types.ObjectId(budgetId),
    );

    if (!budget || !budget.userId.equals(userId)) {
      throw new AppError(404, "Budget not found.");
    }

    // -----------------------------------------
    // Only the recurrence root can be edited
    // -----------------------------------------

    if (!budget.recurrence?.enabled) {
      throw new AppError(
        400,
        "Only the recurring budget source can update recurrence settings.",
      );
    }

    // -----------------------------------------
    // Build final recurrence values
    // -----------------------------------------

    const currentRecurrence = budget.recurrence;

    const finalEnabled =
      dto.enabled ?? currentRecurrence.enabled;

    const finalBudgetAmount =
      dto.budgetAmount ?? currentRecurrence.budgetAmount;

    const finalEndDate =
      dto.endDate !== undefined
        ? dto.endDate
        : currentRecurrence.endDate;

    // -----------------------------------------
    // Validate recurrence end date
    // -----------------------------------------

    if (
      finalEnabled &&
      finalEndDate &&
      currentRecurrence.nextGenerationDate &&
      finalEndDate < currentRecurrence.nextGenerationDate
    ) {
      throw new AppError(
        400,
        "Recurrence end date cannot be before the next budget generation date.",
      );
    }

    // -----------------------------------------
    // Stop recurrence
    // -----------------------------------------

    if (!finalEnabled) {
      const updatedBudget =
        await budgetRepository.updateRecurrence(
          budget._id,
          {
            "recurrence.enabled": false,

            "recurrence.status":
              BudgetRecurrenceStatus.COMPLETED,

            "recurrence.budgetAmount":
              finalBudgetAmount,

            "recurrence.endDate":
              finalEndDate,

            "recurrence.nextGenerationDate":
              null,
          },
        );

      await this.invalidateDashboardCache(userId);

      return updatedBudget;
    }

    // -----------------------------------------
    // Continue/update recurrence
    // -----------------------------------------

    let nextGenerationDate =
      currentRecurrence.nextGenerationDate;

    if (!nextGenerationDate) {
      nextGenerationDate =
        this.calculateNextBudgetPeriodStart(
          budget.startDate,
          budget.period,
        );
    }

    if (
      finalEndDate &&
      nextGenerationDate > finalEndDate
    ) {
      throw new AppError(
        400,
        "Recurrence end date does not allow another budget period.",
      );
    }

    const updatedBudget =
      await budgetRepository.updateRecurrence(
        budget._id,
        {
          "recurrence.enabled": true,

          "recurrence.status":
            BudgetRecurrenceStatus.ACTIVE,

          "recurrence.budgetAmount":
            finalBudgetAmount,

          "recurrence.endDate":
            finalEndDate,

          "recurrence.nextGenerationDate":
            nextGenerationDate,

          "recurrence.rootBudgetId":
            budget._id,
        },
      );

    await this.invalidateDashboardCache(userId);

    return updatedBudget;
  }
}

export const budgetService = new BudgetService();