import { FilterQuery, Types, UpdateQuery } from "mongoose";
import { Budget } from "../schemas/budget.schema";
import { IBudget, IBudgetDocument } from "../interfaces/budget.interface";
import { BudgetQueryDto } from "../dtos/budget-query.dto";
import { BudgetScope , BudgetStatus} from "../types/budget.types";

class BudgetRepository {
  async create(data: Partial<IBudgetDocument>) {
    return Budget.create(data);
  }

  async findById(id: Types.ObjectId) {
    return Budget.findOne({
      _id: id,
      isDeleted: false,
    });
  }

  async findOne(filter: FilterQuery<IBudgetDocument>) {
    return Budget.findOne({
      ...filter,
      isDeleted: false,
    });
  }

  async findAllByUserId(userId: Types.ObjectId, query: BudgetQueryDto) {
    const {
      page = 1,
      limit = 10,
      scope,
      period,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const filter: FilterQuery<IBudget> = {
      userId,
      isDeleted: false,
    };

    if (scope) {
      filter.scope = scope;
    }

    if (period) {
      filter.period = period;
    }

    if (status) {
      filter.status = status;
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const skip = (page - 1) * limit;

    const [budgets, totalRecords] = await Promise.all([
      Budget.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("categoryId",  "name icon color")
        .populate("subcategoryId",  "name icon color"),

      Budget.countDocuments(filter),
    ]);

    return {
      budgets,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        hasNext: page * limit < totalRecords,
        hasPrevious: page > 1,
      },
    };
  }

  async update(id: Types.ObjectId, update: UpdateQuery<IBudgetDocument>) {
    return Budget.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      update,
      {
        new: true,
      },
    );
  }

  async softDelete(id: Types.ObjectId) {
    return Budget.findOneAndUpdate(
      {
        _id: id,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );
  }

  async exists(filter: FilterQuery<IBudgetDocument>) {
    return Budget.exists({
      ...filter,
      isDeleted: false,
    });
  }
  async findAffectedBudgets(
    userId: Types.ObjectId,
    categoryId: Types.ObjectId,
    subcategoryId?: Types.ObjectId,
    transactionDate?: Date,
  ) {
    return Budget.find({
      userId,
      isDeleted: false,
        //  status: BudgetStatus.ACTIVE,//
      startDate: { $lte: transactionDate },
      endDate: { $gte: transactionDate },
      $or: [
        {
          scope: BudgetScope.OVERALL,
        },
        {
          scope: BudgetScope.CATEGORY,
          categoryId,
        },
        {
          scope: BudgetScope.SUBCATEGORY,
          categoryId,
          subcategoryId,
        },
      ],
    });
  }
}

export const budgetRepository = new BudgetRepository();
