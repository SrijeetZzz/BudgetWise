import { z } from "zod";

export const getBudgetSchema = z.object({
    budgetId: z.string().length(24),
});