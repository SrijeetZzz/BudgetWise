import { transactionRepository } from "../../transaction/repositories/transaction.repository";
import { transactionGeneratorService } from "../../transaction/services/transaction-generator.service";

class SchedulerService {
  private isRunning = false;

  async processRecurringTransactions(): Promise<void> {
    // Prevent overlapping scheduler executions
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;

    try {
      const now = new Date();

      const recurringTransactions =
        await transactionRepository.findDueRecurringTransactions(
          now,
        );

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
    } finally {
      this.isRunning = false;
    }
  }
}

export const schedulerService =
  new SchedulerService();