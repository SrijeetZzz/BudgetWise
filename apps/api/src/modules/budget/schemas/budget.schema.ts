import { Schema, model } from "mongoose";
import { IBudgetDocument, IBudgetModel } from "../interfaces/budget.interface";
import { BudgetPeriod, BudgetScope, BudgetStatus } from "../types/budget.types";

const budgetSchema = new Schema<IBudgetDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    scope: {
      type: String,
      enum: Object.values(BudgetScope),
      required: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    subcategoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    period: {
      type: String,
      enum: Object.values(BudgetPeriod),
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    budgetAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    spentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    remainingAmount: {
      type: Number,
      default: 0,
    },

    utilization: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(BudgetStatus),
      default: BudgetStatus.ACTIVE,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastAlertThreshold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

budgetSchema.index({
  userId: 1,
  scope: 1,
  categoryId: 1,
  subcategoryId: 1,
  startDate: 1,
  endDate: 1,
  isDeleted: 1,
});

export const Budget = model<IBudgetDocument, IBudgetModel>(
  "Budget",
  budgetSchema,
);
