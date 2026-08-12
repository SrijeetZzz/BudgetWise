import { z } from "zod";
import {
    BudgetPeriod,
    BudgetScope,
} from "../types/budget.types";

export const updateBudgetSchema = z
    .object({
        scope: z.nativeEnum(BudgetScope).optional(),

        categoryId: z.string().optional(),

        subcategoryId: z.string().optional(),

        period: z.nativeEnum(BudgetPeriod).optional(),

        startDate: z.coerce.date().optional(),

        endDate: z.coerce.date().optional(),

        budgetAmount: z.coerce.number().positive().optional(),
    })
    .superRefine((data, ctx) => {
        if (
            data.startDate &&
            data.endDate &&
            data.endDate < data.startDate
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["endDate"],
                message: "End date must be after start date.",
            });
        }
    });