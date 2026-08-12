import { Types } from "mongoose";
import {
    BudgetPeriod,
    BudgetScope,
} from "../types/budget.types";

export interface CreateBudgetDto {
    scope: BudgetScope;

    categoryId?: string;

    subcategoryId?: string;

    period: BudgetPeriod;

    startDate: Date;

    endDate: Date;

    budgetAmount: number;
}