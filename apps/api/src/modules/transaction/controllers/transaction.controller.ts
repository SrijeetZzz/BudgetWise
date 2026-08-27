import { Request, Response } from "express";
import { Types } from "mongoose";

import { asyncHandler } from "../../../common/helpers/asyncHandler";
import { sendResponse } from "../../../common/utils/response";
import { transactionService } from "../services/transaction.service";
import { TransactionQueryDto } from "../dto/transaction-query.dto";
import { AppError } from "../../../common/exceptions/AppError";

class TransactionController {
  createTransaction = asyncHandler(async (req: Request, res: Response) => {
    const transaction = await transactionService.createTransaction(
      new Types.ObjectId(req.user.userId),
      req.body,
      req.file,
    );

    return sendResponse(res, 201, {
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  });

 

  getTransactions = asyncHandler(async (req: Request, res: Response) => {
    const transactions = await transactionService.getTransactions(
      new Types.ObjectId(req.user.userId),
      req.query as unknown as TransactionQueryDto,
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Transactions fetched successfully",
      data: transactions.transactions,
      meta: transactions.pagination,
    });
  });

  getTransactionById = asyncHandler(async (req: Request, res: Response) => {
    const transaction = await transactionService.getTransaction(
      new Types.ObjectId(req.user.userId),
      new Types.ObjectId(req.params.transactionId as string),
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Transaction fetched successfully",
      data: transaction,
    });
  });

  updateTransaction = asyncHandler(async (req: Request, res: Response) => {
    const transaction = await transactionService.updateTransaction(
      new Types.ObjectId(req.user.userId),
      new Types.ObjectId(req.params.transactionId as string),
      req.body,
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Transaction updated successfully",
      data: transaction,
    });
  });

  updateRecurringTransaction = asyncHandler(
    async (req: Request, res: Response) => {
      const transaction = await transactionService.updateRecurringTransaction(
        new Types.ObjectId(req.user.userId),
        new Types.ObjectId(req.params.transactionId as string),
        req.body,
      );

      return sendResponse(res, 200, {
        success: true,
        message: "Recurring transaction updated successfully",
        data: transaction,
      });
    },
  );

  deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
    const result = await transactionService.deleteTransaction(
      new Types.ObjectId(req.user.userId),
      new Types.ObjectId(req.params.transactionId as string),
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Transaction deleted successfully",
    });
  });
  uploadAttachment = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError(400, "No file uploaded.");
    }

    const transaction = await transactionService.uploadAttachment(
      new Types.ObjectId(req.user.userId),
      new Types.ObjectId(req.params.transactionId as string),
      req.file,
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Attachment uploaded successfully.",
      data: transaction,
    });
  });
  
  deleteAttachment = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await transactionService.deleteAttachment(
    new Types.ObjectId(req.user.userId),
    new Types.ObjectId(req.params.transactionId as string),
  );

  return sendResponse(res, 200, {
    success: true,
    message: "Attachment deleted successfully.",
    data: transaction,
  });
});
}

export default new TransactionController();
