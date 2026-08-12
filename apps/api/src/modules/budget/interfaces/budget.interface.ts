import { Document, Model, Types } from "mongoose";
import {
    BudgetPeriod,
    BudgetScope,
    BudgetStatus,
} from "../types/budget.types";

export interface IBudget {
    userId: Types.ObjectId;

    scope: BudgetScope;

    categoryId?: Types.ObjectId;

    subcategoryId?: Types.ObjectId;

    period: BudgetPeriod;

    startDate: Date;

    endDate: Date;

    budgetAmount: number;

    spentAmount: number;

    remainingAmount: number;

    utilization: number;

    status: BudgetStatus;

    isDeleted: boolean;

    createdAt: Date;

    updatedAt: Date;

    lastAlertThreshold: number;
}

export interface IBudgetDocument extends IBudget, Document {}

export interface IBudgetModel extends Model<IBudgetDocument> {}