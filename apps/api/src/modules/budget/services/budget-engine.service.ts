

import {
  ClientSession,
  FilterQuery,
  Types,
} from "mongoose";

import { budgetRepository } from "../repositories/budget.repository";
import { transactionRepository } from "../../transaction/repositories/transaction.repository";
import categoryRepository from "../../category/repositories/category.repository";

import {
  BudgetScope,
  BudgetStatus,
} from "../types/budget.types";

import { ITransaction } from "../../transaction/interfaces/transaction.interface";
import { TransactionType } from "../../../common/enums/transaction-type.enum";

import notificationService from "../../notification/services/notification.service";
import { NotificationType } from "../../notification/schemas/notification.schema";

class BudgetEngineService {
  private getBudgetNotificationTitle(
    budgetName: string,
    threshold: number,
  ): string {
    if (threshold >= 100) {
      return `${budgetName} exceeded`;
    }

    return `${budgetName} reached ${threshold}%`;
  }

  private getBudgetNotificationMessage(
    budgetName: string,
    budgetAmount: number,
    spentAmount: number,
    utilization: number,
    threshold: number,
  ): string {
    if (threshold >= 100) {
      return `Your ${budgetName} has been exceeded. You have spent ${spentAmount} out of ${budgetAmount}.`;
    }

    return `Your ${budgetName} has reached ${threshold}%. You have used ${utilization}% of your allocated budget.`;
  }

  private async getBudgetName(
    budget: any,
  ): Promise<{
    budgetName: string;
    categoryName?: string;
    subcategoryName?: string;
  }> {
    if (budget.scope === BudgetScope.OVERALL) {
      return {
        budgetName: "Overall budget",
      };
    }

    if (budget.scope === BudgetScope.CATEGORY) {
      const category =
        await categoryRepository.findById(
          budget.categoryId.toString(),
        );

      return {
        budgetName:
          category?.name ?? "Category budget",
        categoryName: category?.name,
      };
    }

    if (budget.scope === BudgetScope.SUBCATEGORY) {
      const [category, subcategory] =
        await Promise.all([
          categoryRepository.findById(
            budget.categoryId.toString(),
          ),
          categoryRepository.findById(
            budget.subcategoryId.toString(),
          ),
        ]);

      return {
        budgetName:
          category && subcategory
            ? `${category.name} → ${subcategory.name}`
            : "Subcategory budget",

        categoryName: category?.name,

        subcategoryName:
          subcategory?.name,
      };
    }

    return {
      budgetName: "Budget",
    };
  }

  /**
   * Recalculate all budgets affected by a transaction.
   *
   * If a MongoDB session is provided, every database
   * operation participates in the same transaction.
   */
  async recalculateAffectedBudgets(
    transaction: ITransaction,
    session?: ClientSession,
  ) {
    const budgets =
      await budgetRepository.findAffectedBudgets(
        transaction.userId,
        transaction.categoryId,
        transaction.subcategoryId,
        transaction.transactionDate,
        session,
      );

    await Promise.all(
      budgets.map((budget) =>
        this.recalculateBudget(
          budget._id,
          session,
        ),
      ),
    );
  }

  /**
   * Recalculate a single budget.
   */
  async recalculateBudget(
    budgetId: Types.ObjectId,
    session?: ClientSession,
  ) {
    const budget =
      await budgetRepository.findById(
        budgetId,
        session,
      );

    if (!budget) {
      return null;
    }

    const filter: FilterQuery<ITransaction> = {
      userId: budget.userId,

      type: TransactionType.EXPENSE,

      transactionDate: {
        $gte: budget.startDate,
        $lte: budget.endDate,
      },
    };

    switch (budget.scope) {
      case BudgetScope.CATEGORY:
        filter.categoryId =
          budget.categoryId;
        break;

      case BudgetScope.SUBCATEGORY:
        filter.categoryId =
          budget.categoryId;

        filter.subcategoryId =
          budget.subcategoryId;
        break;

      case BudgetScope.OVERALL:
      default:
        break;
    }

    const spentAmount =
      await transactionRepository.calculateSpentAmount(
        filter,
        session,
      );

    const remainingAmount =
      this.calculateRemaining(
        budget.budgetAmount,
        spentAmount,
      );

    const utilization =
      this.calculateUtilization(
        budget.budgetAmount,
        spentAmount,
      );

    const alert = this.getThresholdAlert(
      budget.lastAlertThreshold ?? 0,
      utilization,
    );

    const status =
      new Date() > budget.endDate
        ? BudgetStatus.EXPIRED
        : BudgetStatus.ACTIVE;

    const updatedBudget =
      await budgetRepository.update(
        budget._id,
        {
          spentAmount,
          remainingAmount,
          utilization,
          status,
          lastAlertThreshold:
            alert.threshold,
        },
        session,
      );

    /*
     * IMPORTANT:
     *
     * Notification creation is intentionally
     * outside the MongoDB transaction boundary
     * conceptually.
     *
     * The notification service may use its own
     * persistence mechanism and should not be
     * assumed to participate in this transaction.
     */
    if (alert.triggered) {
      const {
        budgetName,
        categoryName,
        subcategoryName,
      } = await this.getBudgetName(
        budget,
      );

      await notificationService.createNotification({
        userId: budget.userId,

        type: NotificationType.BUDGET_ALERT,

        title:
          this.getBudgetNotificationTitle(
            budgetName,
            alert.threshold,
          ),

        message:
          this.getBudgetNotificationMessage(
            budgetName,
            budget.budgetAmount,
            spentAmount,
            utilization,
            alert.threshold,
          ),

        metadata: {
          budgetId: budget._id,

          budgetScope: budget.scope,

          categoryId:
            budget.categoryId,

          categoryName,

          subcategoryId:
            budget.subcategoryId,

          subcategoryName,

          threshold:
            alert.threshold,

          utilization,

          spentAmount,

          budgetAmount:
            budget.budgetAmount,
        },
      });
    }

    return updatedBudget;
  }

  /**
   * Get threshold reached.
   */
  getThreshold(
    utilization: number,
  ): number {
    if (utilization >= 100) {
      return 100;
    }

    if (utilization >= 90) {
      return 90;
    }

    if (utilization >= 75) {
      return 75;
    }

    if (utilization >= 50) {
      return 50;
    }

    return 0;
  }

  private getThresholdAlert(
    previousThreshold: number,
    currentUtilization: number,
  ) {
    const currentThreshold =
      this.getThreshold(
        currentUtilization,
      );

    if (
      currentThreshold >
      previousThreshold
    ) {
      return {
        triggered: true,
        threshold: currentThreshold,
      };
    }

    return {
      triggered: false,
      threshold: previousThreshold,
    };
  }

  /**
   * Check whether budget is exceeded.
   */
  isExceeded(
    budgetAmount: number,
    spentAmount: number,
  ) {
    return (
      spentAmount > budgetAmount
    );
  }

  /**
   * Calculate utilization percentage.
   */
  calculateUtilization(
    budgetAmount: number,
    spentAmount: number,
  ) {
    if (budgetAmount === 0) {
      return 0;
    }

    return Number(
      (
        (spentAmount /
          budgetAmount) *
        100
      ).toFixed(2),
    );
  }

  /**
   * Calculate remaining amount.
   */
  calculateRemaining(
    budgetAmount: number,
    spentAmount: number,
  ) {
    return Math.max(
      0,
      budgetAmount - spentAmount,
    );
  }
}

export const budgetEngineService =
  new BudgetEngineService();