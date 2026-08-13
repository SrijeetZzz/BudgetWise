import { transactionRepository } from "../../transaction/repositories/transaction.repository";
import { transactionGeneratorService } from "../../transaction/services/transaction-generator.service";

import { budgetRecurrenceService } from "../../budget/services/budget-recurrence.service";

class SchedulerService {
  private isRunning = false;

  /**
   * Process all scheduled background tasks.
   *
   * Currently handles:
   * - Recurring transactions
   * - Recurring budgets
   *
   * A single scheduler lock prevents overlapping
   * executions.
   */
  async processScheduledTasks(): Promise<void> {
    // Prevent overlapping scheduler executions.
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    try {
      const now = new Date();

      // -----------------------------------------
      // Recurring Transactions
      // -----------------------------------------

      await this.processRecurringTransactions(now);

      // -----------------------------------------
      // Recurring Budgets
      // -----------------------------------------

      await this.processRecurringBudgets(now);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Process recurring transactions that are due.
   */
  private async processRecurringTransactions(currentDate: Date): Promise<void> {
    const recurringTransactions =
      await transactionRepository.findDueRecurringTransactions(currentDate);

    if (recurringTransactions.length === 0) {
      return;
    }

    for (const recurringTransaction of recurringTransactions) {
      try {
        await transactionGeneratorService.generateTransaction(
          recurringTransaction,
        );
      } catch (error) {
        console.error(
          `Failed to process recurring transaction ${recurringTransaction._id}:`,
          error,
        );
      }
    }
  }

  /**
   * Process recurring budgets that are due.
   */
  private async processRecurringBudgets(currentDate: Date): Promise<void> {
    try {
      await budgetRecurrenceService.processDueRecurringBudgets(currentDate);
    } catch (error) {
      console.error("Failed to process recurring budgets:", error);
    }
  }

  //testing function to run the scheduler for a specific date
  // async runTestScheduler(testDate: Date): Promise<void> {
  //   await budgetRecurrenceService.processDueRecurringBudgets(testDate);
  // }
}

export const schedulerService = new SchedulerService();
