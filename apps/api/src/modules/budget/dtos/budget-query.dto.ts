import {
    BudgetPeriod,
    BudgetScope,
    BudgetStatus,
} from "../types/budget.types";

export interface BudgetQueryDto {
    page?: number;

    limit?: number;

    search?: string;

    scope?: BudgetScope;

    period?: BudgetPeriod;

    status?: BudgetStatus;

    sortBy?: string;

    sortOrder?: "asc" | "desc";
}