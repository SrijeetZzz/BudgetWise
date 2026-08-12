import { Router } from "express";

import transactionController from "../controllers/transaction.controller";

import { createTransactionSchema } from "../validators/create-transaction.validator";

import { updateTransactionSchema } from "../validators/update-transaction.validator";


import { updateRecurringTransactionSchema } from "../validators/update-recurring-transaction.validator";
import { validate } from "../../../middleware/validation.middleware";
import { authenticate } from "../../../middleware/auth.middleware";
import upload from "../../../config/multer/multer";

const router = Router();

router.use(authenticate);

// Transactions
router.post(
  "/",
  upload.single("receipt"),
  validate(createTransactionSchema),
  transactionController.createTransaction,
);

router.get("/", transactionController.getTransactions);

router.get("/:transactionId", transactionController.getTransactionById);

router.patch(
  "/:transactionId",
  validate(updateTransactionSchema),
  transactionController.updateTransaction,
);

router.delete("/:transactionId", transactionController.deleteTransaction);

// Recurring Transactions

router.patch(
  "/recurring/:transactionId",
  validate(updateRecurringTransactionSchema),
  transactionController.updateRecurringTransaction,
);

//attatchments upload
router.post(
  "/:transactionId/attachments",
  upload.single("receipt"),
  transactionController.uploadAttachment,
);

router.delete(
  "/:transactionId/attachment",
  transactionController.deleteAttachment,
);

export default router;
