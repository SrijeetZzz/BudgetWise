import { z } from "zod";

export const budgetProgressSchema = z.object({
    budgetId: z.string().length(24),
});