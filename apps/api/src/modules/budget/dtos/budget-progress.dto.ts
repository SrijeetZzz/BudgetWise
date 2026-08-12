export interface BudgetProgressDto {
    budgetId: string;

    budgetAmount: number;

    spentAmount: number;

    remainingAmount: number;

    utilization: number;

    status: string;
}