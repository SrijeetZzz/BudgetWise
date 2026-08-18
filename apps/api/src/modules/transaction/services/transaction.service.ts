


import mongoose, { Types } from "mongoose";
import fs from "fs";
import path from "path";

import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { UpdateRecurringTransactionDto } from "../dto/update-recurring-transaction.dto";
import { UpdateTransactionDto } from "../dto/update-transaction.dto";

import { transactionRepository } from "../repositories/transaction.repository";

import categoryRepository from "../../category/repositories/category.repository";

import { TransactionSource } from "../../../common/enums/transaction-source.enum";
import { RecurrenceStatus } from "../../../common/enums/recurrence-status.enum";

import { AppError } from "../../../common/exceptions/AppError";
import { TransactionQueryDto } from "../dto/transaction-query.dto";
import { IAttachment } from "../interfaces/attachment.interface";
import { ITransaction } from "../interfaces/transaction.interface";

import { budgetEngineService } from "../../budget/services/budget-engine.service";
import { TransactionType } from "../../../common/enums/transaction-type.enum";

import { invalidateDashboardCache } from "../../dashboard/utils/dashboard-cache";

export class TransactionService {
  async createTransaction(
    userId: Types.ObjectId,
    dto: CreateTransactionDto,
    file?: Express.Multer.File,
  ) {
    // -----------------------------------------
    // Validate category
    // -----------------------------------------

    const category = await categoryRepository.findById(
      dto.categoryId,
    );

    if (!category) {
      throw new AppError(404, "Category not found");
    }

    if (String(category.type) !== String(dto.type)) {
      throw new AppError(
        400,
        "Transaction type must match category type.",
      );
    }

    // -----------------------------------------
    // Validate subcategory
    // -----------------------------------------

    if (dto.subcategoryId) {
      const subcategory =
        await categoryRepository.findById(
          dto.subcategoryId,
        );

      if (!subcategory) {
        throw new AppError(
          404,
          "Subcategory not found",
        );
      }

      if (
        subcategory.parentCategoryId?.toString() !==
        category._id.toString()
      ) {
        throw new AppError(
          400,
          "Subcategory does not belong to the selected category.",
        );
      }

      if (
        String(subcategory.type) !==
        String(dto.type)
      ) {
        throw new AppError(
          400,
          "Transaction type must match subcategory type.",
        );
      }
    }

    const {
      isRecurring,
      categoryId,
      subcategoryId,
      ...transactionData
    } = dto;

    // -----------------------------------------
    // Build attachments
    // -----------------------------------------

    const attachments: IAttachment[] = [];

    if (file) {
      attachments.push({
        fileName: file.filename,
        fileUrl: `/uploads/receipts/${file.filename}`,
        fileType: file.mimetype,
        fileSize: file.size,
        uploadedAt: new Date(),
      });
    }

    // -----------------------------------------
    // Build transaction payload
    // -----------------------------------------

    const transactionPayload: Partial<ITransaction> = {
      ...transactionData,

      userId,

      categoryId:
        new Types.ObjectId(categoryId),

      subcategoryId: subcategoryId
        ? new Types.ObjectId(subcategoryId)
        : undefined,

      attachments,

      isGenerated: false,
    };

    // -----------------------------------------
    // Recurring transaction
    // -----------------------------------------

    if (isRecurring) {
      transactionPayload.transactionSource =
        TransactionSource.RECURRING;

      transactionPayload.recurrenceStatus =
        RecurrenceStatus.ACTIVE;

      transactionPayload.nextExecutionDate =
        dto.recurrenceStartDate;
    } else {
      transactionPayload.transactionSource =
        TransactionSource.MANUAL;

      transactionPayload.recurrenceFrequency =
        undefined;

      transactionPayload.recurrenceStartDate =
        undefined;

      transactionPayload.recurrenceEndDate =
        undefined;

      transactionPayload.recurrenceStatus =
        undefined;

      transactionPayload.nextExecutionDate =
        undefined;
    }

    // -----------------------------------------
    // MongoDB Transaction
    // -----------------------------------------

    const session = await mongoose.startSession();

    let transaction;

    try {
      await session.withTransaction(async () => {
        // Create transaction inside MongoDB transaction
        transaction =
          await transactionRepository.create(
            transactionPayload,
            session,
          );

        // Recalculate affected budgets
        if (
          transaction.type ===
          TransactionType.EXPENSE
        ) {
          await budgetEngineService.recalculateAffectedBudgets(
            transaction,
            session,
          );
        }
      });
    } catch (error) {
      console.error(
        "MongoDB transaction failed while creating transaction:",
        error,
      );

      throw error;
    } finally {
      await session.endSession();
    }

    // -----------------------------------------
    // Redis invalidation
    //
    // Only invalidate cache AFTER MongoDB
    // transaction has successfully committed.
    // -----------------------------------------

    await invalidateDashboardCache(userId);

    return transaction;
  }

  async getTransaction(
    userId: Types.ObjectId,
    transactionId: Types.ObjectId,
  ) {
    const transaction =
      await transactionRepository.findByIdAndUserId(
        transactionId,
        userId,
      );

    if (!transaction) {
      throw new AppError(
        404,
        "Transaction not found",
      );
    }

    return transaction;
  }

  async getTransactions(
    userId: Types.ObjectId,
    query: TransactionQueryDto,
  ) {
    return await transactionRepository.findAllByUserId(
      userId,
      query,
    );
  }

  async updateTransaction(
    userId: Types.ObjectId,
    transactionId: Types.ObjectId,
    dto:
      | UpdateTransactionDto
      | UpdateRecurringTransactionDto,
  ) {
    // -----------------------------------------
    // Load existing transaction
    // -----------------------------------------

    const existingTransaction =
      await transactionRepository.findByIdAndUserId(
        transactionId,
        userId,
      );

    if (!existingTransaction) {
      throw new AppError(
        404,
        "Transaction not found",
      );
    }

    const updateData: Record<
      string,
      unknown
    > = {
      ...dto,
    };

    // -----------------------------------------
    // Determine final values
    // -----------------------------------------

    const finalCategoryId =
      dto.categoryId ??
      existingTransaction.categoryId.toString();

    const finalSubcategoryId =
      dto.subcategoryId ??
      existingTransaction.subcategoryId?.toString();

    const finalType =
      dto.type ?? existingTransaction.type;

    // -----------------------------------------
    // Validate category
    // -----------------------------------------

    const category =
      await categoryRepository.findById(
        finalCategoryId,
      );

    if (!category) {
      throw new AppError(
        404,
        "Category not found",
      );
    }

    if (
      String(category.type) !==
      String(finalType)
    ) {
      throw new AppError(
        400,
        "Transaction type must match category type.",
      );
    }

    updateData.categoryId =
      new Types.ObjectId(finalCategoryId);

    // -----------------------------------------
    // Validate subcategory
    // -----------------------------------------

    if (finalSubcategoryId) {
      const subcategory =
        await categoryRepository.findById(
          finalSubcategoryId,
        );

      if (!subcategory) {
        throw new AppError(
          404,
          "Subcategory not found",
        );
      }

      if (
        subcategory.parentCategoryId?.toString() !==
        category._id.toString()
      ) {
        throw new AppError(
          400,
          "Subcategory does not belong to the selected category.",
        );
      }

      if (
        String(subcategory.type) !==
        String(finalType)
      ) {
        throw new AppError(
          400,
          "Transaction type must match subcategory type.",
        );
      }

      updateData.subcategoryId =
        new Types.ObjectId(
          finalSubcategoryId,
        );
    }

    // -----------------------------------------
    // MongoDB Transaction
    // -----------------------------------------

    const session = await mongoose.startSession();

    let updatedTransaction;

    try {
      await session.withTransaction(async () => {
        // Update transaction
        updatedTransaction =
          await transactionRepository.update(
            transactionId,
            updateData,
            session,
          );

        if (!updatedTransaction) {
          throw new AppError(
            404,
            "Transaction not found",
          );
        }

        // Recalculate budgets affected by
        // the OLD transaction
        if (
          existingTransaction.type ===
          TransactionType.EXPENSE
        ) {
          await budgetEngineService.recalculateAffectedBudgets(
            existingTransaction,
            session,
          );
        }

        // Recalculate budgets affected by
        // the UPDATED transaction
        if (
          updatedTransaction.type ===
          TransactionType.EXPENSE
        ) {
          await budgetEngineService.recalculateAffectedBudgets(
            updatedTransaction,
            session,
          );
        }
      });
    } catch (error) {
      console.error(
        "MongoDB transaction failed while updating transaction:",
        error,
      );

      throw error;
    } finally {
      await session.endSession();
    }

    // -----------------------------------------
    // Redis invalidation AFTER commit
    // -----------------------------------------

    await invalidateDashboardCache(userId);

    return updatedTransaction;
  }

  async updateRecurringTransaction(
    userId: Types.ObjectId,
    transactionId: Types.ObjectId,
    dto: UpdateRecurringTransactionDto,
  ) {
    const transaction =
      await transactionRepository.findByIdAndUserId(
        transactionId,
        userId,
      );

    if (!transaction) {
      throw new AppError(
        404,
        "Transaction not found",
      );
    }

    if (
      transaction.transactionSource !==
      TransactionSource.RECURRING
    ) {
      throw new AppError(
        400,
        "Only recurring transactions can be updated through this endpoint.",
      );
    }

    return this.updateTransaction(
      userId,
      transactionId,
      dto,
    );
  }

  async deleteTransaction(
    userId: Types.ObjectId,
    transactionId: Types.ObjectId,
  ) {
    // -----------------------------------------
    // Load existing transaction
    // -----------------------------------------

    const transaction =
      await transactionRepository.findByIdAndUserId(
        transactionId,
        userId,
      );

    if (!transaction) {
      throw new AppError(
        404,
        "Transaction not found",
      );
    }

    // -----------------------------------------
    // MongoDB Transaction
    // -----------------------------------------

    const session = await mongoose.startSession();

    let deletedTransaction;

    try {
      await session.withTransaction(async () => {
        deletedTransaction =
          await transactionRepository.softDelete(
            transactionId,
            session,
          );

        if (!deletedTransaction) {
          throw new AppError(
            404,
            "Transaction not found",
          );
        }

        // Recalculate affected budgets
        // while still inside transaction
        if (
          transaction.type ===
          TransactionType.EXPENSE
        ) {
          await budgetEngineService.recalculateAffectedBudgets(
            transaction,
            session,
          );
        }
      });
    } catch (error) {
      console.error(
        "MongoDB transaction failed while deleting transaction:",
        error,
      );

      throw error;
    } finally {
      await session.endSession();
    }

    // -----------------------------------------
    // Redis invalidation AFTER commit
    // -----------------------------------------

    await invalidateDashboardCache(userId);

    return deletedTransaction;
  }

  async uploadAttachment(
    userId: Types.ObjectId,
    transactionId: Types.ObjectId,
    file: Express.Multer.File,
  ) {
    const transaction =
      await transactionRepository.findByIdAndUserId(
        transactionId,
        userId,
      );

    if (!transaction) {
      throw new AppError(
        404,
        "Transaction not found.",
      );
    }

    const attachment: IAttachment = {
      fileName: file.filename,
      fileUrl: `/uploads/receipts/${file.filename}`,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadedAt: new Date(),
    };

    return await transactionRepository.addAttachment(
      transactionId,
      attachment,
    );
  }

  async deleteAttachment(
    userId: Types.ObjectId,
    transactionId: Types.ObjectId,
  ) {
    const transaction =
      await transactionRepository.findByIdAndUserId(
        transactionId,
        userId,
      );

    if (!transaction) {
      throw new AppError(
        404,
        "Transaction not found.",
      );
    }

    if (
      !transaction.attachments ||
      transaction.attachments.length === 0
    ) {
      throw new AppError(
        404,
        "No attachment found.",
      );
    }

    const attachment =
      transaction.attachments[0];

    const filePath = path.join(
      process.cwd(),
      attachment.fileUrl.replace(
        /^\/+/,
        "",
      ),
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    transaction.attachments = [];

    await transaction.save();

    return transaction;
  }
}

export const transactionService =
  new TransactionService();