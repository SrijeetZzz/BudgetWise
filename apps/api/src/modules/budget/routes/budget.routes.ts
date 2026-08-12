import { Router } from "express";

import budgetController from "../controllers/budget.controller";

import { authenticate } from "../../../middleware/auth.middleware";
import { validate } from "../../../middleware/validation.middleware";

import { createBudgetSchema } from "../validators/create-budget.validator";
import { updateBudgetSchema } from "../validators/update-budget.validator";
import { getBudgetSchema } from "../validators/get-budget.validator";

const router = Router();

router.use(authenticate);

/* -------------------------- Create -------------------------- */

router.post(
  "/",
  validate(createBudgetSchema),
  budgetController.createBudget,
);

/* --------------------------- Read --------------------------- */

router.get(
  "/",
  budgetController.getBudgets,
);

router.get(
  "/:budgetId",
  budgetController.getBudget,
);

/* -------------------------- Update -------------------------- */

router.patch(
  "/:budgetId",
  validate(updateBudgetSchema),
  budgetController.updateBudget,
);

/* -------------------------- Delete -------------------------- */

router.delete(
  "/:budgetId",
  budgetController.deleteBudget,
);
export default router;