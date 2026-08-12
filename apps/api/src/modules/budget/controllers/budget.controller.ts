import { Request, Response } from "express";
import { Types } from "mongoose";
import { budgetService } from "../services/budget.service";
import { asyncHandler } from "../../../common/helpers/asyncHandler";
import { sendResponse } from "../../../common/utils/response";

class BudgetController {
  createBudget = asyncHandler(async (req: Request, res: Response) => {
    const budget = await budgetService.createBudget(
      new Types.ObjectId(req.user.userId),
      req.body
    );

    return sendResponse(res, 201, {
      success: true,
      message: "Budget created successfully",
      data: budget,
    });
  });

  getBudget = asyncHandler(async (req: Request, res: Response) => {
    const budget = await budgetService.getBudgetById(
      new Types.ObjectId(req.user.userId),
      req.params.budgetId as string
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Budget fetched successfully",
      data: budget,
    });
  });

  getBudgets = asyncHandler(async (req: Request, res: Response) => {
    const budgets = await budgetService.getBudgets(
      new Types.ObjectId(req.user.userId),
      req.query as any
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Budgets fetched successfully",
      data: budgets,
    });
  });

  updateBudget = asyncHandler(async (req: Request, res: Response) => {
    const budget = await budgetService.updateBudget(
      new Types.ObjectId(req.user.userId),
      req.params.budgetId as string,
      req.body
    );

    return sendResponse(res, 200, {
      success: true,
      message: "Budget updated successfully",
      data: budget,
    });
  });

  deleteBudget = asyncHandler(async (req: Request, res: Response) => {
    const result = await budgetService.deleteBudget(
      new Types.ObjectId(req.user.userId),
      req.params.budgetId as string,
    );

    return sendResponse(res, 200, {
      success: true,
      message: result.message,
      data: null,
    });
  });
}

export default new BudgetController();