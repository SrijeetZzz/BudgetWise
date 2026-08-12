import { Types } from "mongoose";

import { Transaction } from "../../transaction/schemas/transaction.schema";

import { TransactionType } from "../../../common/enums/transaction-type.enum";
import { Budget } from "../../budget/schemas/budget.schema";
import { BudgetScope, BudgetStatus } from "../../budget/types/budget.types";
import { DashboardFilter } from "../../../common/enums/dashboard-filter.enum";
import { TransactionSource } from "../../../common/enums/transaction-source.enum";
import { RecurrenceStatus } from "../../../common/enums/recurrence-status.enum";

class DashboardRepository {
  async getDashboardSummary(
    userId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ) {
    const [summary] = await Transaction.aggregate([
      {
        $match: {
          userId,
          isDeleted: false,
          transactionDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,

          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", TransactionType.INCOME] }, "$amount", 0],
            },
          },

          totalExpense: {
            $sum: {
              $cond: [
                { $eq: ["$type", TransactionType.EXPENSE] },
                "$amount",
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,

          totalIncome: 1,

          totalExpense: 1,

          balance: {
            $subtract: ["$totalIncome", "$totalExpense"],
          },
        },
      },
    ]);

    return (
      summary ?? {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
      }
    );
  }
  async getBudgetSummary(userId: Types.ObjectId) {
    const summaries = await Budget.aggregate([
      {
        $match: {
          userId,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$scope",

          totalBudgets: {
            $sum: 1,
          },

          activeBudgets: {
            $sum: {
              $cond: [{ $eq: ["$status", BudgetStatus.ACTIVE] }, 1, 0],
            },
          },

          expiredBudgets: {
            $sum: {
              $cond: [{ $eq: ["$status", BudgetStatus.EXPIRED] }, 1, 0],
            },
          },

          totalBudgetAmount: {
            $sum: "$budgetAmount",
          },

          totalSpent: {
            $sum: "$spentAmount",
          },

          totalRemaining: {
            $sum: "$remainingAmount",
          },

          overBudgetCount: {
            $sum: {
              $cond: [{ $gt: ["$spentAmount", "$budgetAmount"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const emptySummary = {
      totalBudgets: 0,
      activeBudgets: 0,
      expiredBudgets: 0,
      totalBudgetAmount: 0,
      totalSpent: 0,
      totalRemaining: 0,
      overBudgetCount: 0,
    };

    const result = {
      overall: { ...emptySummary },
      category: { ...emptySummary },
      subcategory: { ...emptySummary },
    };

    for (const summary of summaries) {
      switch (summary._id) {
        case BudgetScope.OVERALL:
          result.overall = summary;
          break;

        case BudgetScope.CATEGORY:
          result.category = summary;
          break;

        case BudgetScope.SUBCATEGORY:
          result.subcategory = summary;
          break;
      }

      delete (summary as any)._id;
    }

    return result;
  }
  async getCategoryWiseSpending(
    userId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ) {
    const categoryWiseSpend = await Transaction.aggregate([
      {
        $match: {
          userId,
          isDeleted: false,
          type: TransactionType.EXPENSE,
          transactionDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },

      {
        $group: {
          _id: "$categoryId",
          amount: {
            $sum: "$amount",
          },
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },

      {
        $unwind: "$category",
      },

      {
        $project: {
          _id: 0,

          categoryId: "$category._id",

          name: "$category.name",

          icon: "$category.icon",

          color: "$category.color",

          amount: 1,
        },
      },

      {
        $sort: {
          amount: -1,
        },
      },
    ]);

    const totalExpense = categoryWiseSpend.reduce(
      (sum, category) => sum + category.amount,
      0,
    );

    return categoryWiseSpend.map((category) => ({
      ...category,

      percentage:
        totalExpense === 0
          ? 0
          : Number(((category.amount / totalExpense) * 100).toFixed(2)),
    }));
  }
  async getSubcategoryWiseSpending(
    userId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ) {
    const subcategoryWiseSpend = await Transaction.aggregate([
      {
        $match: {
          userId,
          isDeleted: false,
          type: TransactionType.EXPENSE,
          transactionDate: {
            $gte: startDate,
            $lte: endDate,
          },
          subcategoryId: {
            $ne: null,
          },
        },
      },
      {
        $group: {
          _id: "$subcategoryId",
          amount: {
            $sum: "$amount",
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "subcategory",
        },
      },
      {
        $unwind: "$subcategory",
      },
      {
        $lookup: {
          from: "categories",
          localField: "subcategory.parentCategoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          _id: 0,

          categoryId: "$category._id",
          categoryName: "$category.name",

          subcategoryId: "$subcategory._id",
          subcategoryName: "$subcategory.name",

          icon: "$subcategory.icon",
          color: "$subcategory.color",

          amount: 1,
        },
      },
      {
        $sort: {
          amount: -1,
        },
      },
    ]);

    const totalExpense = subcategoryWiseSpend.reduce(
      (sum, subcategory) => sum + subcategory.amount,
      0,
    );

    return subcategoryWiseSpend.map((subcategory) => ({
      ...subcategory,

      percentage:
        totalExpense === 0
          ? 0
          : Number(((subcategory.amount / totalExpense) * 100).toFixed(2)),
    }));
  }
  async getBudgetAlerts(userId: Types.ObjectId) {
    return Budget.find({
      userId,
      isDeleted: false,
      lastAlertThreshold: {
        $gt: 0,
      },
    })
      .populate("categoryId", "name icon color")
      .populate("subcategoryId", "name icon color")
      .sort({
        utilization: -1,
      })
      .select(
        "scope budgetAmount spentAmount remainingAmount utilization lastAlertThreshold categoryId subcategoryId",
      );
  }
  async getRecentTransactions(
    userId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
    limit = 10,
  ) {
    return Transaction.find({
      userId,
      isDeleted: false,
      transactionDate: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .sort({
        transactionDate: -1,
        createdAt: -1,
      })
      .limit(limit)
      .populate("categoryId", "name icon color")
      .populate("subcategoryId", "name icon color").select(`
      title
      amount
      type
      currency
      paymentMethod
      transactionDate
      categoryId
      subcategoryId
    `);
  }

  async getIncomeVsExpenseTrend(
    userId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
    filter: DashboardFilter = DashboardFilter.THIS_MONTH,
  ) {
    let groupId: any;
    let sortStage: any;

    switch (filter) {
      case DashboardFilter.TODAY:
        groupId = {
          hour: { $hour: "$transactionDate" },
        };
        sortStage = { "_id.hour": 1 };
        break;

      case DashboardFilter.THIS_WEEK:
      case DashboardFilter.THIS_MONTH:
        groupId = {
          year: { $year: "$transactionDate" },
          month: { $month: "$transactionDate" },
          day: { $dayOfMonth: "$transactionDate" },
        };
        sortStage = {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
        };
        break;

      case DashboardFilter.LAST_3_MONTHS:
      case DashboardFilter.LAST_6_MONTHS:
      case DashboardFilter.THIS_YEAR:
        groupId = {
          year: { $year: "$transactionDate" },
          month: { $month: "$transactionDate" },
        };
        sortStage = {
          "_id.year": 1,
          "_id.month": 1,
        };
        break;
    }

    return Transaction.aggregate([
      {
        $match: {
          userId,
          isDeleted: false,
          transactionDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },

      {
        $group: {
          _id: groupId,

          income: {
            $sum: {
              $cond: [{ $eq: ["$type", TransactionType.INCOME] }, "$amount", 0],
            },
          },

          expense: {
            $sum: {
              $cond: [
                { $eq: ["$type", TransactionType.EXPENSE] },
                "$amount",
                0,
              ],
            },
          },
        },
      },

      {
        $sort: sortStage,
      },
    ]);
  }
  async getExpenseTrend(
    userId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
    filter: DashboardFilter,
  ) {
    return this.getIncomeVsExpenseTrend(
      userId,
      startDate,
      endDate,
      filter,
    ).then((data) =>
      data.map((item) => ({
        ...item,
        value: item.expense,
      })),
    );
  }
  async getCategoryTrend(
    userId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ) {
    return Transaction.aggregate([
      {
        $match: {
          userId,
          isDeleted: false,
          type: TransactionType.EXPENSE,
          transactionDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },

      {
        $group: {
          _id: "$categoryId",
          amount: {
            $sum: "$amount",
          },
        },
      },

      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },

      {
        $unwind: "$category",
      },

      {
        $project: {
          _id: 0,
          categoryId: "$category._id",
          name: "$category.name",
          icon: "$category.icon",
          color: "$category.color",
          amount: 1,
        },
      },

      {
        $sort: {
          amount: -1,
        },
      },
    ]);
  }
  async getPaymentMethodBreakdown(
    userId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ) {
    return Transaction.aggregate([
      {
        $match: {
          userId,
          isDeleted: false,
          type: TransactionType.EXPENSE,
          transactionDate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },

      {
        $group: {
          _id: "$paymentMethod",
          amount: {
            $sum: "$amount",
          },
        },
      },

      {
        $project: {
          _id: 0,
          paymentMethod: "$_id",
          amount: 1,
        },
      },

      {
        $sort: {
          amount: -1,
        },
      },
    ]);
  }
  async getCashFlowTrend(
    userId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
    filter: DashboardFilter,
  ) {
    const trend = await this.getIncomeVsExpenseTrend(
      userId,
      startDate,
      endDate,
      filter,
    );

    return trend.map((item) => ({
      ...item,
      balance: item.income - item.expense,
    }));
  }
  async getMonthlyComparison(userId: Types.ObjectId) {
    const now = new Date();

    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const currentMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );

    const previousMonthEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );

    const [current, previous] = await Promise.all([
      Transaction.aggregate([
        {
          $match: {
            userId,
            isDeleted: false,
            type: TransactionType.EXPENSE,
            transactionDate: {
              $gte: currentMonthStart,
              $lte: currentMonthEnd,
            },
          },
        },
        {
          $group: {
            _id: null,
            amount: {
              $sum: "$amount",
            },
          },
        },
      ]),

      Transaction.aggregate([
        {
          $match: {
            userId,
            isDeleted: false,
            type: TransactionType.EXPENSE,
            transactionDate: {
              $gte: previousMonthStart,
              $lte: previousMonthEnd,
            },
          },
        },
        {
          $group: {
            _id: null,
            amount: {
              $sum: "$amount",
            },
          },
        },
      ]),
    ]);

    const currentExpense = current[0]?.amount ?? 0;
    const previousExpense = previous[0]?.amount ?? 0;

    const difference = currentExpense - previousExpense;

    const percentage =
      previousExpense === 0
        ? 0
        : Number(((difference / previousExpense) * 100).toFixed(2));

    return {
      currentExpense,
      previousExpense,
      difference,
      percentage,
      trend:
        difference > 0 ? "INCREASE" : difference < 0 ? "DECREASE" : "NO_CHANGE",
    };
  }
  async getBudgetProgress(userId: Types.ObjectId) {
    return Budget.find({
      userId,
      isDeleted: false,
      status: BudgetStatus.ACTIVE,
    })
      .populate("categoryId", "name icon color")
      .populate("subcategoryId", "name icon color")
      .select(
        `
      scope
      budgetAmount
      spentAmount
      remainingAmount
      utilization
      categoryId
      subcategoryId
    `,
      )
      .sort({
        utilization: -1,
      });
  }
  async getUpcomingRecurringTransactions(userId: Types.ObjectId, limit = 5) {
    return Transaction.find({
      userId,
      isDeleted: false,
      transactionSource: TransactionSource.RECURRING,
      recurrenceStatus: RecurrenceStatus.ACTIVE,
      nextExecutionDate: {
        $ne: null,
      },
    })
      .sort({
        nextExecutionDate: 1,
      })
      .limit(limit)
      .populate("categoryId", "name icon color")
      .populate("subcategoryId", "name icon color").select(`
      title
      amount
      currency
      type
      recurrenceFrequency
      nextExecutionDate
      categoryId
      subcategoryId
    `);
  }
}

export const dashboardRepository = new DashboardRepository();
