// import { FilterQuery, Types, UpdateQuery } from "mongoose";

// import { Budget } from "../schemas/budget.schema";

// import { IBudget, IBudgetDocument } from "../interfaces/budget.interface";

// import { BudgetQueryDto } from "../dtos/budget-query.dto";

// import { BudgetRecurrenceStatus, BudgetScope } from "../types/budget.types";

// class BudgetRepository {
//   async create(data: Partial<IBudgetDocument>) {
//     return Budget.create(data);
//   }

//   async findById(id: Types.ObjectId) {
//     return Budget.findOne({
//       _id: id,
//       isDeleted: false,
//     });
//   }

//   async findOne(filter: FilterQuery<IBudgetDocument>) {
//     return Budget.findOne({
//       ...filter,
//       isDeleted: false,
//     });
//   }

//   async findAllByUserId(userId: Types.ObjectId, query: BudgetQueryDto) {
//     const {
//       page = 1,
//       limit = 10,
//       scope,
//       period,
//       status,
//       sortBy = "createdAt",
//       sortOrder = "desc",
//     } = query;

//     const filter: FilterQuery<IBudget> = {
//       userId,
//       isDeleted: false,
//     };

//     if (scope) {
//       filter.scope = scope;
//     }

//     if (period) {
//       filter.period = period;
//     }

//     if (status) {
//       filter.status = status;
//     }

//     const sort: Record<string, 1 | -1> = {
//       [sortBy]: sortOrder === "asc" ? 1 : -1,
//     };

//     const skip = (page - 1) * limit;

//     const [budgets, totalRecords] = await Promise.all([
//       Budget.find(filter)
//         .sort(sort)
//         .skip(skip)
//         .limit(limit)
//         .populate("categoryId", "name icon color")
//         .populate("subcategoryId", "name icon color"),

//       Budget.countDocuments(filter),
//     ]);

//     return {
//       budgets,

//       pagination: {
//         page,
//         limit,
//         totalRecords,
//         totalPages: Math.ceil(totalRecords / limit),
//         hasNext: page * limit < totalRecords,
//         hasPrevious: page > 1,
//       },
//     };
//   }

//   async update(id: Types.ObjectId, update: UpdateQuery<IBudgetDocument>) {
//     return Budget.findOneAndUpdate(
//       {
//         _id: id,
//         isDeleted: false,
//       },
//       update,
//       {
//         new: true,
//         runValidators: true,
//       },
//     );
//   }

//   async softDelete(id: Types.ObjectId) {
//     return Budget.findOneAndUpdate(
//       {
//         _id: id,
//         isDeleted: false,
//       },
//       {
//         isDeleted: true,
//       },
//       {
//         new: true,
//       },
//     );
//   }

//   async exists(filter: FilterQuery<IBudgetDocument>) {
//     return Budget.exists({
//       ...filter,
//       isDeleted: false,
//     });
//   }

//   /**
//    * Find budgets affected by an expense transaction.
//    *
//    * A budget is affected when:
//    * - It belongs to the user.
//    * - It is not deleted.
//    * - The transaction falls inside the budget period.
//    * - The transaction matches the budget scope.
//    */
//   async findAffectedBudgets(
//     userId: Types.ObjectId,
//     categoryId: Types.ObjectId,
//     subcategoryId?: Types.ObjectId,
//     transactionDate?: Date,
//   ) {
//     return Budget.find({
//       userId,

//       isDeleted: false,

//       startDate: {
//         $lte: transactionDate,
//       },

//       endDate: {
//         $gte: transactionDate,
//       },

//       $or: [
//         {
//           scope: BudgetScope.OVERALL,
//         },

//         {
//           scope: BudgetScope.CATEGORY,
//           categoryId,
//         },

//         {
//           scope: BudgetScope.SUBCATEGORY,
//           categoryId,
//           subcategoryId,
//         },
//       ],
//     });
//   }

//   /**
//    * Find recurring budget sources that are
//    * due for generation.
//    *
//    * The scheduler will call this method.
//    */
//   async findDueRecurringBudgets(currentDate: Date = new Date()) {
//     return Budget.find({
//       isDeleted: false,

//       "recurrence.enabled": true,

//       "recurrence.status": BudgetRecurrenceStatus.ACTIVE,

//       "recurrence.nextGenerationDate": {
//         $ne: null,
//         $lte: currentDate,
//       },
//     }).sort({
//       "recurrence.nextGenerationDate": 1,
//     });
//   }

//   /**
//    * Check whether a budget already exists for
//    * a particular recurring series and period.
//    *
//    * This prevents duplicate budget creation if
//    * the scheduler runs again after a partial failure.
//    */
//   async findBudgetForPeriod(
//     userId: Types.ObjectId,
//     rootBudgetId: Types.ObjectId,
//     startDate: Date,
//     endDate: Date,
//   ) {
//     return Budget.findOne({
//       userId,

//       isDeleted: false,

//       startDate,

//       endDate,

//       $or: [
//         {
//           _id: rootBudgetId,
//         },

//         {
//           "recurrence.rootBudgetId": rootBudgetId,
//         },
//       ],
//     });
//   }

//   /**
//    * Find the original recurring budget source.
//    *
//    * The source contains the recurrence configuration
//    * used by the scheduler.
//    */
//   async findRecurringSource(rootBudgetId: Types.ObjectId) {
//     return Budget.findOne({
//       _id: rootBudgetId,

//       isDeleted: false,

//       "recurrence.enabled": true,

//       "recurrence.status": BudgetRecurrenceStatus.ACTIVE,
//     });
//   }

//   async findRecurringRoot(rootBudgetId: Types.ObjectId) {
//     return Budget.findOne({
//       _id: rootBudgetId,
//       isDeleted: false,
//       "recurrence.enabled": true,
//     });
//   }

//   async updateRecurrence(
//     budgetId: Types.ObjectId,
//     update: UpdateQuery<IBudgetDocument>,
//   ) {
//     return Budget.findOneAndUpdate(
//       {
//         _id: budgetId,
//         isDeleted: false,
//       },
//       update,
//       {
//         new: true,
//         runValidators: true,
//       },
//     );
//   }
// }

// export const budgetRepository = new BudgetRepository();


import {
  ClientSession,
  FilterQuery,
  Types,
  UpdateQuery,
} from "mongoose";

import { Budget } from "../schemas/budget.schema";

import {
  IBudget,
  IBudgetDocument,
} from "../interfaces/budget.interface";

import { BudgetQueryDto } from "../dtos/budget-query.dto";

import {
  BudgetRecurrenceStatus,
  BudgetScope,
} from "../types/budget.types";

class BudgetRepository {
  async create(
    data: Partial<IBudgetDocument>,
    session?: ClientSession,
  ) {
    const [budget] = await Budget.create(
      [data],
      { session },
    );

    return budget;
  }

  async findById(
    id: Types.ObjectId,
    session?: ClientSession,
  ) {
    return Budget.findOne({
      _id: id,
      isDeleted: false,
    }).session(session ?? null);
  }

  async findOne(
    filter: FilterQuery<IBudgetDocument>,
    session?: ClientSession,
  ) {
    return Budget.findOne({
      ...filter,
      isDeleted: false,
    }).session(session ?? null);
  }

  async findAllByUserId(
    userId: Types.ObjectId,
    query: BudgetQueryDto,
  ) {
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
        .populate("categoryId", "name icon color")
        .populate("subcategoryId", "name icon color"),

      Budget.countDocuments(filter),
    ]);

    return {
      budgets,

      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(
          totalRecords / limit,
        ),
        hasNext: page * limit < totalRecords,
        hasPrevious: page > 1,
      },
    };
  }

  async update(
    id: Types.ObjectId,
    update: UpdateQuery<IBudgetDocument>,
    session?: ClientSession,
  ) {
    return Budget.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      update,
      {
        new: true,
        runValidators: true,
        session,
      },
    );
  }

  async softDelete(
    id: Types.ObjectId,
    session?: ClientSession,
  ) {
    return Budget.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
        session,
      },
    );
  }

  async exists(
    filter: FilterQuery<IBudgetDocument>,
    session?: ClientSession,
  ) {
    return Budget.exists({
      ...filter,
      isDeleted: false,
    }).session(session ?? null);
  }

  /**
   * Find budgets affected by an expense transaction.
   */
  async findAffectedBudgets(
    userId: Types.ObjectId,
    categoryId: Types.ObjectId,
    subcategoryId?: Types.ObjectId,
    transactionDate?: Date,
    session?: ClientSession,
  ) {
    return Budget.find({
      userId,

      isDeleted: false,

      startDate: {
        $lte: transactionDate,
      },

      endDate: {
        $gte: transactionDate,
      },

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
    }).session(session ?? null);
  }

  /**
   * Find recurring budget sources that are
   * due for generation.
   */
  async findDueRecurringBudgets(
    currentDate: Date = new Date(),
    session?: ClientSession,
  ) {
    return Budget.find({
      isDeleted: false,

      "recurrence.enabled": true,

      "recurrence.status":
        BudgetRecurrenceStatus.ACTIVE,

      "recurrence.nextGenerationDate": {
        $ne: null,
        $lte: currentDate,
      },
    })
      .sort({
        "recurrence.nextGenerationDate": 1,
      })
      .session(session ?? null);
  }

  /**
   * Check whether a budget already exists for
   * a particular recurring series and period.
   */
  async findBudgetForPeriod(
    userId: Types.ObjectId,
    rootBudgetId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
    session?: ClientSession,
  ) {
    return Budget.findOne({
      userId,

      isDeleted: false,

      startDate,

      endDate,

      $or: [
        {
          _id: rootBudgetId,
        },

        {
          "recurrence.rootBudgetId":
            rootBudgetId,
        },
      ],
    }).session(session ?? null);
  }

  /**
   * Find the original recurring budget source.
   */
  async findRecurringSource(
    rootBudgetId: Types.ObjectId,
    session?: ClientSession,
  ) {
    return Budget.findOne({
      _id: rootBudgetId,

      isDeleted: false,

      "recurrence.enabled": true,

      "recurrence.status":
        BudgetRecurrenceStatus.ACTIVE,
    }).session(session ?? null);
  }

  async findRecurringRoot(
    rootBudgetId: Types.ObjectId,
    session?: ClientSession,
  ) {
    return Budget.findOne({
      _id: rootBudgetId,

      isDeleted: false,

      "recurrence.enabled": true,
    }).session(session ?? null);
  }

  async updateRecurrence(
    budgetId: Types.ObjectId,
    update: UpdateQuery<IBudgetDocument>,
    session?: ClientSession,
  ) {
    return Budget.findOneAndUpdate(
      {
        _id: budgetId,
        isDeleted: false,
      },
      update,
      {
        new: true,
        runValidators: true,
        session,
      },
    );
  }
}

export const budgetRepository =
  new BudgetRepository();