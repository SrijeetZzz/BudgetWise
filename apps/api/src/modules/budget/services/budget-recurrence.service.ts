import mongoose, { Types } from "mongoose";

import { budgetRepository } from "../repositories/budget.repository";

import {
  BudgetPeriod,
  BudgetRecurrenceStatus,
  BudgetStatus,
} from "../types/budget.types";

import { AppError } from "../../../common/exceptions/AppError";

import { cacheService } from "../../../common/services/cache.service";

import { DashboardFilter } from "../../../common/enums/dashboard-filter.enum";

class BudgetRecurrenceService {
  /**

   * Invalidate all dashboard-related cache entries

   * for the specified user.

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

   * Process all recurring budgets whose next generation

   * date has arrived.

   */

  async processDueRecurringBudgets(
    currentDate: Date = new Date(),
  ): Promise<void> {
    const recurringBudgets =
      await budgetRepository.findDueRecurringBudgets(currentDate);

    for (const budget of recurringBudgets) {
      try {
        await this.processRecurringBudget(
          budget._id,

          currentDate,
        );
      } catch (error) {
        console.error(
          `Failed to process recurring budget ${budget._id}:`,

          error,
        );
      }
    }
  }

  /**

   * Process one recurring budget source.

   *

   * If the scheduler missed multiple periods,

   * this method catches up by generating every

   * missing period until the source is current.

   */

  async processRecurringBudget(
    budgetId: Types.ObjectId,

    currentDate: Date = new Date(),
  ) {
    const source = await budgetRepository.findRecurringSource(budgetId);

    if (!source || !source.recurrence?.enabled) {
      return null;
    }

    let nextGenerationDate = source.recurrence.nextGenerationDate;

    if (!nextGenerationDate) {
      return null;
    }

    let cacheNeedsInvalidation = false;

    while (nextGenerationDate <= currentDate) {
      const generated = await this.generateNextBudget(source._id);

      if (!generated) {
        break;
      }

      cacheNeedsInvalidation = true;

      const refreshedSource = await budgetRepository.findRecurringSource(
        source._id,
      );

      if (!refreshedSource?.recurrence?.nextGenerationDate) {
        break;
      }

      nextGenerationDate = refreshedSource.recurrence.nextGenerationDate;
    }

    /**

     * The generated budget(s) and/or recurrence

     * source changed, so invalidate dashboard cache.

     */

    if (cacheNeedsInvalidation) {
      await this.invalidateDashboardCache(source.userId);
    }

    return true;
  }

  /**

   * Generate exactly one next budget period.

   */

  private async generateNextBudget(rootBudgetId: Types.ObjectId) {
    const session = await mongoose.startSession();

    try {
      let generatedBudget = null;

      await session.withTransaction(async () => {
        const source = await budgetRepository.findRecurringSource(
          rootBudgetId,
          session,
        );

        if (!source || !source.recurrence?.enabled) {
          return;
        }

        const recurrence = source.recurrence;

        if (!recurrence.nextGenerationDate) {
          return;
        }

        // -----------------------------------------
        // Calculate next period
        // -----------------------------------------

        const nextStartDate = new Date(recurrence.nextGenerationDate);

        const nextEndDate = this.calculatePeriodEndDate(
          nextStartDate,
          source.period,
        );

        // -----------------------------------------
        // Check recurrence end date
        // -----------------------------------------

        if (recurrence.endDate && nextStartDate > recurrence.endDate) {
          await budgetRepository.update(
            source._id,
            {
              "recurrence.enabled": false,

              "recurrence.status": BudgetRecurrenceStatus.COMPLETED,

              "recurrence.nextGenerationDate": null,
            },
            session,
          );

          return;
        }

        // -----------------------------------------
        // Prevent duplicate generation
        // -----------------------------------------

        const existingBudget = await budgetRepository.findBudgetForPeriod(
          source.userId,
          source._id,
          nextStartDate,
          nextEndDate,
          session,
        );

        if (existingBudget) {
          const followingStart = this.calculateNextPeriodStart(
            nextStartDate,
            source.period,
          );

          await this.updateNextGenerationDate(
            source._id,
            followingStart,
            recurrence.endDate,
            session,
          );

          generatedBudget = existingBudget;

          return;
        }

        // -----------------------------------------
        // Create next budget
        // -----------------------------------------

        generatedBudget = await budgetRepository.create(
          {
            userId: source.userId,

            scope: source.scope,

            categoryId: source.categoryId,

            subcategoryId: source.subcategoryId,

            period: source.period,

            startDate: nextStartDate,

            endDate: nextEndDate,

            budgetAmount: recurrence.budgetAmount,

            spentAmount: 0,

            remainingAmount: recurrence.budgetAmount,

            utilization: 0,

            status: BudgetStatus.ACTIVE,

            recurrence: {
              enabled: false,

              budgetAmount: recurrence.budgetAmount,

              nextGenerationDate: null,

              endDate: recurrence.endDate,

              status: recurrence.status,

              rootBudgetId: source._id,
            },
          },
          session,
        );

        // -----------------------------------------
        // Calculate following generation date
        // -----------------------------------------

        const followingStart = this.calculateNextPeriodStart(
          nextStartDate,
          source.period,
        );

        // -----------------------------------------
        // Update root recurrence
        // -----------------------------------------

        await this.updateNextGenerationDate(
          source._id,
          followingStart,
          recurrence.endDate,
          session,
        );
      });

      return generatedBudget;
    } catch (error) {
      console.error(
        `MongoDB transaction failed for recurring budget ${rootBudgetId}:`,
        error,
      );

      throw error;
    } finally {
      await session.endSession();
    }
  }

  /**

   * Update the source's next generation date.

   *

   * If recurrence has reached its end date,

   * mark the recurrence as completed.

   */

  private async updateNextGenerationDate(
    rootBudgetId: Types.ObjectId,
    nextGenerationDate: Date,
    recurrenceEndDate?: Date,
    session?: mongoose.ClientSession,
  ) {
    if (recurrenceEndDate && nextGenerationDate > recurrenceEndDate) {
      return budgetRepository.update(
        rootBudgetId,
        {
          "recurrence.enabled": false,

          "recurrence.status": BudgetRecurrenceStatus.COMPLETED,

          "recurrence.nextGenerationDate": null,
        },
        session,
      );
    }

    return budgetRepository.update(
      rootBudgetId,
      {
        "recurrence.nextGenerationDate": nextGenerationDate,
      },
      session,
    );
  }

  /**

   * Calculate the next budget period start.

   */

  private calculateNextPeriodStart(
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
        throw new AppError(
          400,

          "Unsupported recurring budget period.",
        );
    }

    return nextDate;
  }

  /**

   * Calculate the end date for a generated

   * budget period.

   */

  private calculatePeriodEndDate(
    startDate: Date,

    period: BudgetPeriod,
  ): Date {
    const endDate = new Date(startDate);

    switch (period) {
      case BudgetPeriod.WEEKLY:
        endDate.setDate(endDate.getDate() + 6);

        break;

      case BudgetPeriod.MONTHLY:
        endDate.setMonth(
          endDate.getMonth() + 1,

          0,
        );

        break;

      case BudgetPeriod.YEARLY:
        endDate.setMonth(11, 31);

        break;

      default:
        throw new AppError(
          400,

          "Unsupported recurring budget period.",
        );
    }

    endDate.setHours(
      23,

      59,

      59,

      999,
    );

    return endDate;
  }
}

export const budgetRecurrenceService = new BudgetRecurrenceService();
