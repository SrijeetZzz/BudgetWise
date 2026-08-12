import { z } from "zod";
import {
    BudgetPeriod,
    BudgetScope,
    BudgetStatus,
} from "../types/budget.types";

export const listBudgetSchema = z.object({
    page: z.coerce.number().min(1).optional(),

    limit: z.coerce.number().min(1).max(100).optional(),

    search: z.string().trim().optional(),

    scope: z.nativeEnum(BudgetScope).optional(),

    period: z.nativeEnum(BudgetPeriod).optional(),

    status: z.nativeEnum(BudgetStatus).optional(),

    sortBy: z
        .enum([
            "createdAt",
            "budgetAmount",
            "spentAmount",
            "remainingAmount",
            "utilization",
        ])
        .optional(),

    sortOrder: z.enum(["asc", "desc"]).optional(),
});