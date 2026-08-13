// import { Types } from "mongoose";

// import { budgetRepository } from "../repositories/budget.repository";

// import {
//   BudgetPeriod,
//   BudgetRecurrenceStatus,
//   BudgetStatus,
// } from "../types/budget.types";

// import { AppError } from "../../../common/exceptions/AppError";

// class BudgetRecurrenceService {
//   /**
//    * Process all recurring budgets whose next generation
//    * date has arrived.
//    *
//    * The scheduler will call this method.
//    */
//   async processDueRecurringBudgets(
//     currentDate: Date = new Date(),
//   ): Promise<void> {
//     const recurringBudgets =
//       await budgetRepository.findDueRecurringBudgets(currentDate);

//     for (const budget of recurringBudgets) {
//       try {
//         await this.processRecurringBudget(budget._id, currentDate);
//       } catch (error) {
//         console.error(
//           `Failed to process recurring budget ${budget._id}:`,
//           error,
//         );
//       }
//     }
//   }

//   /**
//    * Process one recurring budget source.
//    *
//    * If the scheduler missed multiple periods,
//    * this method catches up by generating every
//    * missing period until the source is current.
//    */
//   async processRecurringBudget(
//     budgetId: Types.ObjectId,
//     currentDate: Date = new Date(),
//   ) {
//     const source = await budgetRepository.findRecurringSource(budgetId);

//     if (!source || !source.recurrence?.enabled) {
//       return null;
//     }

//     let nextGenerationDate = source.recurrence.nextGenerationDate;

//     if (!nextGenerationDate) {
//       return null;
//     }

//     /**
//      * Keep generating periods while the scheduler
//      * is behind.
//      *
//      * Example:
//      *
//      * nextGenerationDate = September 1
//      * currentDate = November 10
//      *
//      * Generates:
//      * September
//      * October
//      * November
//      *
//      * until the next generation date is in
//      * the future.
//      */
//     while (nextGenerationDate <= currentDate) {
//       const generated = await this.generateNextBudget(source._id);

//       if (!generated) {
//         break;
//       }

//       const refreshedSource = await budgetRepository.findRecurringSource(
//         source._id,
//       );

//       if (!refreshedSource?.recurrence?.nextGenerationDate) {
//         break;
//       }

//       nextGenerationDate = refreshedSource.recurrence.nextGenerationDate;
//     }

//     return true;
//   }

//   /**
//    * Generate exactly one next budget period.
//    */
//   private async generateNextBudget(rootBudgetId: Types.ObjectId) {
//     const source = await budgetRepository.findRecurringSource(rootBudgetId);

//     if (!source || !source.recurrence?.enabled) {
//       return null;
//     }

//     const recurrence = source.recurrence;

//     if (!recurrence.nextGenerationDate) {
//       return null;
//     }

//     // -----------------------------------------
//     // Calculate next period
//     // -----------------------------------------

//     const nextStartDate = new Date(recurrence.nextGenerationDate);

//     const nextEndDate = this.calculatePeriodEndDate(
//       nextStartDate,
//       source.period,
//     );

//     // -----------------------------------------
//     // Check recurrence end date
//     // -----------------------------------------

//     if (recurrence.endDate && nextStartDate > recurrence.endDate) {
//       await budgetRepository.update(source._id, {
//         "recurrence.enabled": false,
//         "recurrence.status": BudgetRecurrenceStatus.COMPLETED,
//         "recurrence.nextGenerationDate": null,
//       });

//       return null;
//     }

//     // -----------------------------------------
//     // Prevent duplicate generation
//     // -----------------------------------------

//     const existingBudget = await budgetRepository.findBudgetForPeriod(
//       source.userId,
//       source._id,
//       nextStartDate,
//       nextEndDate,
//     );

//     if (existingBudget) {
//       /**
//        * The period already exists.
//        *
//        * We still move the source forward so
//        * the scheduler does not repeatedly process
//        * the same period.
//        */
//       const followingStart = this.calculateNextPeriodStart(
//         nextStartDate,
//         source.period,
//       );

//       await this.updateNextGenerationDate(
//         source._id,
//         followingStart,
//         recurrence.endDate,
//       );

//       return existingBudget;
//     }

//     // -----------------------------------------
//     // Create next budget
//     // -----------------------------------------

//     const generatedBudget = await budgetRepository.create({
//       userId: source.userId,

//       scope: source.scope,

//       categoryId: source.categoryId,

//       subcategoryId: source.subcategoryId,

//       period: source.period,

//       startDate: nextStartDate,

//       endDate: nextEndDate,

//       budgetAmount: recurrence.budgetAmount,

//       spentAmount: 0,

//       remainingAmount: recurrence.budgetAmount,

//       utilization: 0,

//       status: BudgetStatus.ACTIVE,

//       /**
//        * IMPORTANT:
//        *
//        * Generated budgets are NOT scheduler
//        * sources themselves.
//        *
//        * They only keep the rootBudgetId so
//        * they remain associated with the
//        * recurring series.
//        */
//       recurrence: {
//         enabled: false,

//         budgetAmount: recurrence.budgetAmount,

//         nextGenerationDate: null,

//         endDate: recurrence.endDate,

//         status: recurrence.status,

//         rootBudgetId: source._id,
//       },
//     });

//     // -----------------------------------------
//     // Calculate following generation date
//     // -----------------------------------------

//     const followingStart = this.calculateNextPeriodStart(
//       nextStartDate,
//       source.period,
//     );

//     await this.updateNextGenerationDate(
//       source._id,
//       followingStart,
//       recurrence.endDate,
//     );

//     return generatedBudget;
//   }

//   /**
//    * Update the source's next generation date.
//    *
//    * If recurrence has reached its end date,
//    * mark the recurrence as completed.
//    */
//   private async updateNextGenerationDate(
//     rootBudgetId: Types.ObjectId,
//     nextGenerationDate: Date,
//     recurrenceEndDate?: Date,
//   ) {
//     if (recurrenceEndDate && nextGenerationDate > recurrenceEndDate) {
//       return budgetRepository.update(rootBudgetId, {
//         "recurrence.enabled": false,

//         "recurrence.status": BudgetRecurrenceStatus.COMPLETED,

//         "recurrence.nextGenerationDate": null,
//       });
//     }

//     return budgetRepository.update(rootBudgetId, {
//       "recurrence.nextGenerationDate": nextGenerationDate,
//     });
//   }

//   /**
//    * Calculate the next budget period start.
//    */
//   private calculateNextPeriodStart(
//     currentStartDate: Date,
//     period: BudgetPeriod,
//   ): Date {
//     const nextDate = new Date(currentStartDate);

//     switch (period) {
//       case BudgetPeriod.WEEKLY:
//         nextDate.setDate(nextDate.getDate() + 7);
//         break;

//       case BudgetPeriod.MONTHLY:
//         // Move to the first day of the next calendar month.
//         nextDate.setDate(1);
//         nextDate.setMonth(nextDate.getMonth() + 1);
//         break;

//       case BudgetPeriod.YEARLY:
//         // Move to January 1 of the next calendar year.
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
//    * Calculate the end date for a generated
//    * budget period.
//    *
//    * Examples:
//    *
//    * MONTHLY:
//    * Sep 1 → Sep 30
//    *
//    * WEEKLY:
//    * Sep 1 → Sep 7
//    *
//    * YEARLY:
//    * Jan 1 → Dec 31
//    */
//  private calculatePeriodEndDate(
//   startDate: Date,
//   period: BudgetPeriod,
// ): Date {
//   const endDate = new Date(startDate);

//   switch (period) {
//     case BudgetPeriod.WEEKLY:
//       endDate.setDate(
//         endDate.getDate() + 6,
//       );
//       break;

//     case BudgetPeriod.MONTHLY:
//       // Last day of the current calendar month.
//       endDate.setMonth(
//         endDate.getMonth() + 1,
//         0,
//       );
//       break;

//     case BudgetPeriod.YEARLY:
//       // December 31 of the current calendar year.
//       endDate.setMonth(11, 31);
//       break;

//     default:
//       throw new AppError(
//         400,
//         "Unsupported recurring budget period.",
//       );
//   }

//   // End at the very end of the day.
//   endDate.setHours(
//     23,
//     59,
//     59,
//     999,
//   );

//   return endDate;
// }
// }

// export const budgetRecurrenceService = new BudgetRecurrenceService();


import { Types } from "mongoose";

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
  private async invalidateDashboardCache(
    userId: Types.ObjectId,
  ) {
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
      await budgetRepository.findDueRecurringBudgets(
        currentDate,
      );

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
    const source =
      await budgetRepository.findRecurringSource(
        budgetId,
      );

    if (
      !source ||
      !source.recurrence?.enabled
    ) {
      return null;
    }

    let nextGenerationDate =
      source.recurrence.nextGenerationDate;

    if (!nextGenerationDate) {
      return null;
    }

    let cacheNeedsInvalidation = false;

    while (nextGenerationDate <= currentDate) {
      const generated =
        await this.generateNextBudget(
          source._id,
        );

      if (!generated) {
        break;
      }

      cacheNeedsInvalidation = true;

      const refreshedSource =
        await budgetRepository.findRecurringSource(
          source._id,
        );

      if (
        !refreshedSource?.recurrence
          ?.nextGenerationDate
      ) {
        break;
      }

      nextGenerationDate =
        refreshedSource.recurrence
          .nextGenerationDate;
    }

    /**
     * The generated budget(s) and/or recurrence
     * source changed, so invalidate dashboard cache.
     */
    if (cacheNeedsInvalidation) {
      await this.invalidateDashboardCache(
        source.userId,
      );
    }

    return true;
  }

  /**
   * Generate exactly one next budget period.
   */
  private async generateNextBudget(
    rootBudgetId: Types.ObjectId,
  ) {
    const source =
      await budgetRepository.findRecurringSource(
        rootBudgetId,
      );

    if (
      !source ||
      !source.recurrence?.enabled
    ) {
      return null;
    }

    const recurrence = source.recurrence;

    if (!recurrence.nextGenerationDate) {
      return null;
    }

    // -----------------------------------------
    // Calculate next period
    // -----------------------------------------

    const nextStartDate =
      new Date(
        recurrence.nextGenerationDate,
      );

    const nextEndDate =
      this.calculatePeriodEndDate(
        nextStartDate,
        source.period,
      );

    // -----------------------------------------
    // Check recurrence end date
    // -----------------------------------------

    if (
      recurrence.endDate &&
      nextStartDate > recurrence.endDate
    ) {
      await budgetRepository.update(
        source._id,
        {
          "recurrence.enabled": false,

          "recurrence.status":
            BudgetRecurrenceStatus.COMPLETED,

          "recurrence.nextGenerationDate":
            null,
        },
      );

      return null;
    }

    // -----------------------------------------
    // Prevent duplicate generation
    // -----------------------------------------

    const existingBudget =
      await budgetRepository.findBudgetForPeriod(
        source.userId,
        source._id,
        nextStartDate,
        nextEndDate,
      );

    if (existingBudget) {
      /**
       * The period already exists.
       *
       * Move the source forward so the scheduler
       * does not repeatedly process the same period.
       */
      const followingStart =
        this.calculateNextPeriodStart(
          nextStartDate,
          source.period,
        );

      await this.updateNextGenerationDate(
        source._id,
        followingStart,
        recurrence.endDate,
      );

      return existingBudget;
    }

    // -----------------------------------------
    // Create next budget
    // -----------------------------------------

    const generatedBudget =
      await budgetRepository.create({
        userId: source.userId,

        scope: source.scope,

        categoryId: source.categoryId,

        subcategoryId:
          source.subcategoryId,

        period: source.period,

        startDate: nextStartDate,

        endDate: nextEndDate,

        budgetAmount:
          recurrence.budgetAmount,

        spentAmount: 0,

        remainingAmount:
          recurrence.budgetAmount,

        utilization: 0,

        status: BudgetStatus.ACTIVE,

        recurrence: {
          enabled: false,

          budgetAmount:
            recurrence.budgetAmount,

          nextGenerationDate: null,

          endDate: recurrence.endDate,

          status: recurrence.status,

          rootBudgetId: source._id,
        },
      });

    // -----------------------------------------
    // Calculate following generation date
    // -----------------------------------------

    const followingStart =
      this.calculateNextPeriodStart(
        nextStartDate,
        source.period,
      );

    await this.updateNextGenerationDate(
      source._id,
      followingStart,
      recurrence.endDate,
    );

    return generatedBudget;
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
  ) {
    if (
      recurrenceEndDate &&
      nextGenerationDate > recurrenceEndDate
    ) {
      return budgetRepository.update(
        rootBudgetId,
        {
          "recurrence.enabled": false,

          "recurrence.status":
            BudgetRecurrenceStatus.COMPLETED,

          "recurrence.nextGenerationDate":
            null,
        },
      );
    }

    return budgetRepository.update(
      rootBudgetId,
      {
        "recurrence.nextGenerationDate":
          nextGenerationDate,
      },
    );
  }

  /**
   * Calculate the next budget period start.
   */
  private calculateNextPeriodStart(
    currentStartDate: Date,
    period: BudgetPeriod,
  ): Date {
    const nextDate =
      new Date(currentStartDate);

    switch (period) {
      case BudgetPeriod.WEEKLY:
        nextDate.setDate(
          nextDate.getDate() + 7,
        );
        break;

      case BudgetPeriod.MONTHLY:
        nextDate.setDate(1);
        nextDate.setMonth(
          nextDate.getMonth() + 1,
        );
        break;

      case BudgetPeriod.YEARLY:
        nextDate.setMonth(0);
        nextDate.setDate(1);
        nextDate.setFullYear(
          nextDate.getFullYear() + 1,
        );
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
    const endDate =
      new Date(startDate);

    switch (period) {
      case BudgetPeriod.WEEKLY:
        endDate.setDate(
          endDate.getDate() + 6,
        );
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

export const budgetRecurrenceService =
  new BudgetRecurrenceService();