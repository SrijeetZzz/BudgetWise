import { TransactionDocument } from "../interfaces/transaction.interface";

import { transactionRepository } from "../repositories/transaction.repository";

import { TransactionSource } from "../../../common/enums/transaction-source.enum";
import { TransactionType } from "../../../common/enums/transaction-type.enum";
import { RecurrenceFrequency } from "../../../common/enums/recurrence-frequency.enum";
import { RecurrenceStatus } from "../../../common/enums/recurrence-status.enum";

import { budgetEngineService } from "../../budget/services/budget-engine.service";

class TransactionGeneratorService {
  /**
   * Generate an actual transaction from a recurring transaction template.
   */
  async generateTransaction(
    recurringTransaction: TransactionDocument,
  ) {
    if (
      recurringTransaction.recurrenceStatus !==
      RecurrenceStatus.ACTIVE
    ) {
      return null;
    }

    if (
      !recurringTransaction.nextExecutionDate ||
      !recurringTransaction.recurrenceFrequency
    ) {
      return null;
    }

    const executionDate = new Date(
      recurringTransaction.nextExecutionDate,
    );

    // Do not generate transactions after the recurrence end date.
    if (
      recurringTransaction.recurrenceEndDate &&
      executionDate >
        new Date(recurringTransaction.recurrenceEndDate)
    ) {
      await transactionRepository.update(
        recurringTransaction._id,
        {
          recurrenceStatus:
            RecurrenceStatus.COMPLETED,
        },
      );

      return null;
    }

    const generatedTransaction =
      await transactionRepository.create({
        userId: recurringTransaction.userId,

        categoryId:
          recurringTransaction.categoryId,

        subcategoryId:
          recurringTransaction.subcategoryId,

        type: recurringTransaction.type,

        amount: recurringTransaction.amount,

        currency: recurringTransaction.currency,

        title: recurringTransaction.title,

        description:
          recurringTransaction.description,

        paymentMethod:
          recurringTransaction.paymentMethod,

        transactionDate: executionDate,

        attachments: [],

        transactionSource:
          TransactionSource.RECURRING,

        parentRecurringId:
          recurringTransaction._id,

        isGenerated: true,

        isDeleted: false,
      });

    // Recalculate affected budgets for generated expenses.
    if (
      generatedTransaction.type ===
      TransactionType.EXPENSE
    ) {
      await budgetEngineService.recalculateAffectedBudgets(
        generatedTransaction,
      );
    }

    const nextExecutionDate =
      this.calculateNextExecutionDate(
        executionDate,
        recurringTransaction.recurrenceFrequency,
      );

    let recurrenceStatus =
      RecurrenceStatus.ACTIVE;

    if (
      recurringTransaction.recurrenceEndDate &&
      nextExecutionDate >
        new Date(recurringTransaction.recurrenceEndDate)
    ) {
      recurrenceStatus =
        RecurrenceStatus.COMPLETED;
    }

    await transactionRepository.update(
      recurringTransaction._id,
      {
        nextExecutionDate,
        lastExecutedAt: executionDate,
        recurrenceStatus,
      },
    );

    return generatedTransaction;
  }

  /**
   * Calculate the next execution date.
   */
  private calculateNextExecutionDate(
    currentDate: Date,
    frequency: RecurrenceFrequency,
  ): Date {
    const nextDate = new Date(currentDate);

    switch (frequency) {
      case RecurrenceFrequency.DAILY:
        nextDate.setDate(
          nextDate.getDate() + 1,
        );
        break;

      case RecurrenceFrequency.WEEKLY:
        nextDate.setDate(
          nextDate.getDate() + 7,
        );
        break;

      case RecurrenceFrequency.MONTHLY:
        nextDate.setMonth(
          nextDate.getMonth() + 1,
        );
        break;

      case RecurrenceFrequency.QUARTERLY:
        nextDate.setMonth(
          nextDate.getMonth() + 3,
        );
        break;

      case RecurrenceFrequency.HALF_YEARLY:
        nextDate.setMonth(
          nextDate.getMonth() + 6,
        );
        break;

      case RecurrenceFrequency.YEARLY:
        nextDate.setFullYear(
          nextDate.getFullYear() + 1,
        );
        break;

      default:
        throw new Error(
          `Unsupported recurrence frequency: ${frequency}`,
        );
    }

    return nextDate;
  }
}

export const transactionGeneratorService =
  new TransactionGeneratorService();