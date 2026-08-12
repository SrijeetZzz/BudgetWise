import { z } from "zod";
import {
    BudgetPeriod,
    BudgetScope,
} from "../types/budget.types";

export const createBudgetSchema = z
    .object({
        scope: z.nativeEnum(BudgetScope),

        categoryId: z.string().optional(),

        subcategoryId: z.string().optional(),

        period: z.nativeEnum(BudgetPeriod),

        startDate: z.coerce.date(),

        endDate: z.coerce.date(),

        budgetAmount: z.coerce.number().positive(),
    })
    .superRefine((data, ctx) => {
        if (data.scope === BudgetScope.CATEGORY && !data.categoryId) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["categoryId"],
                message: "Category is required for CATEGORY budget.",
            });
        }

        if (data.scope === BudgetScope.SUBCATEGORY) {
            if (!data.categoryId) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["categoryId"],
                    message: "Category is required for SUBCATEGORY budget.",
                });
            }

            if (!data.subcategoryId) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["subcategoryId"],
                    message: "Subcategory is required for SUBCATEGORY budget.",
                });
            }
        }

        if (data.endDate < data.startDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["endDate"],
                message: "End date must be after start date.",
            });
        }
    });