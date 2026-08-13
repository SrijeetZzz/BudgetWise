// // import { FilterQuery, Types } from "mongoose";

// // import {
// //   ITransaction,
// //   TransactionDocument,
// // } from "../interfaces/transaction.interface";
// // import { Transaction } from "../schemas/transaction.schema";
// // import { TransactionQueryDto } from "../dto/transaction-query.dto";
// // import { IAttachment } from "../interfaces/attachment.interface";
// // import { TransactionSource } from "../../../common/enums/transaction-source.enum";
// // import { RecurrenceStatus } from "../../../common/enums/recurrence-status.enum";

// // export class TransactionRepository {
// //   async create(payload: Partial<ITransaction>): Promise<TransactionDocument> {
// //     return await Transaction.create(payload);
// //   }

// //   async findById(
// //     transactionId: Types.ObjectId,
// //   ): Promise<TransactionDocument | null> {
// //     return await Transaction.findOne({
// //       _id: transactionId,
// //       isDeleted: false,
// //     });
// //   }

// //   async findByIdAndUserId(
// //     transactionId: Types.ObjectId,
// //     userId: Types.ObjectId,
// //   ): Promise<TransactionDocument | null> {
// //     return await Transaction.findOne({
// //       _id: transactionId,
// //       userId,
// //       isDeleted: false,
// //     });
// //   }

// //   async findAllByUserId(userId: Types.ObjectId, query: TransactionQueryDto) {
// //     const {
// //       page = 1,
// //       limit = 10,
// //       search,
// //       type,
// //       categoryId,
// //       subcategoryId,
// //       paymentMethod,
// //       startDate,
// //       transactionSource,
// //       endDate,
// //       minAmount,
// //       maxAmount,
// //       sortBy = "transactionDate",
// //       sortOrder = "desc",
// //     } = query;

// //     const filter: FilterQuery<ITransaction> = {
// //       userId,
// //       isDeleted: false,
// //     };

// //     // Search
// //     if (search) {
// //       filter.$or = [
// //         { title: { $regex: search, $options: "i" } },
// //         { description: { $regex: search, $options: "i" } },
// //       ];
// //     }

// //     // Filters
// //     if (type) {
// //       filter.type = type;
// //     }
// //     if (transactionSource) {
// //       filter.transactionSource = transactionSource;
// //     }
// //     if (categoryId) {
// //       filter.categoryId = new Types.ObjectId(categoryId);
// //     }

// //     if (subcategoryId) {
// //       filter.subcategoryId = new Types.ObjectId(subcategoryId);
// //     }

// //     if (paymentMethod) {
// //       filter.paymentMethod = paymentMethod;
// //     }
// //     if (startDate || endDate) {
// //       filter.transactionDate = {};

// //       if (startDate) {
// //         filter.transactionDate.$gte = new Date(startDate);
// //       }

// //       if (endDate) {
// //         filter.transactionDate.$lte = new Date(endDate);
// //       }
// //     }

// //     if (minAmount !== undefined || maxAmount !== undefined) {
// //       filter.amount = {};

// //       if (minAmount !== undefined) {
// //         filter.amount.$gte = minAmount;
// //       }

// //       if (maxAmount !== undefined) {
// //         filter.amount.$lte = maxAmount;
// //       }
// //     }

// //     const sort: Record<string, 1 | -1> = {
// //       [sortBy]: sortOrder === "asc" ? 1 : -1,
// //     };

// //     const skip = (page - 1) * limit;

// //     const [transactions, totalRecords] = await Promise.all([
// //       Transaction.find(filter)
// //         .sort(sort)
// //         .skip(skip)
// //         .limit(limit)
// //         .populate("categoryId")
// //         .populate("subcategoryId"),

// //       Transaction.countDocuments(filter),
// //     ]);

// //     return {
// //       transactions,
// //       pagination: {
// //         page,
// //         limit,
// //         totalRecords,
// //         totalPages: Math.ceil(totalRecords / limit),
// //         hasNext: page * limit < totalRecords,
// //         hasPrevious: page > 1,
// //       },
// //     };
// //   }

// //   async update(
// //     transactionId: Types.ObjectId,
// //     payload: Partial<ITransaction>,
// //   ): Promise<TransactionDocument | null> {
// //     return await Transaction.findByIdAndUpdate(transactionId, payload, {
// //       new: true,
// //       runValidators: true,
// //     });
// //   }

// //   async softDelete(
// //     transactionId: Types.ObjectId,
// //   ): Promise<TransactionDocument | null> {
// //     return await Transaction.findByIdAndUpdate(
// //       transactionId,
// //       {
// //         isDeleted: true,
// //       },
// //       {
// //         new: true,
// //       },
// //     );
// //   }

// //   async findRecurringTransactions(): Promise<TransactionDocument[]> {
// //     return await Transaction.find({
// //       transactionSource: "RECURRING",
// //       isDeleted: false,
// //     });
// //   }
// //   async addAttachment(transactionId: Types.ObjectId, attachment: IAttachment) {
// //     return await Transaction.findByIdAndUpdate(
// //       transactionId,
// //       {
// //         $push: {
// //           attachments: attachment,
// //         },
// //       },
// //       {
// //         new: true,
// //       },
// //     );
// //   }
// //   async removeAttachment(
// //     transactionId: Types.ObjectId,
// //     attachmentId: Types.ObjectId,
// //   ) {
// //     return await Transaction.findByIdAndUpdate(
// //       transactionId,
// //       {
// //         $pull: {
// //           attachments: {
// //             _id: attachmentId,
// //           },
// //         },
// //       },
// //       {
// //         new: true,
// //       },
// //     );
// //   }
// //   async calculateSpentAmount(filter: FilterQuery<ITransaction>) {
// //     const result = await Transaction.aggregate([
// //       {
// //         $match: {
// //           ...filter,
// //           isDeleted: false,
// //         },
// //       },
// //       {
// //         $group: {
// //           _id: null,
// //           total: {
// //             $sum: "$amount",
// //           },
// //         },
// //       },
// //     ]);

// //     return result[0]?.total ?? 0;
// //   }

// //   async findDueRecurringTransactions(currentDate: Date = new Date()) {
// //     return Transaction.find({
// //       transactionSource: TransactionSource.RECURRING,
// //       recurrenceStatus: RecurrenceStatus.ACTIVE,
// //       isDeleted: false,
// //       nextExecutionDate: {
// //         $ne: null,
// //         $lte: currentDate,
// //       },
// //     }).sort({
// //       nextExecutionDate: 1,
// //     });
// //   }
// // }

// // export const transactionRepository = new TransactionRepository();


// import {
//   ClientSession,
//   FilterQuery,
//   Types,
// } from "mongoose";

// import {
//   ITransaction,
//   TransactionDocument,
// } from "../interfaces/transaction.interface";

// import { Transaction } from "../schemas/transaction.schema";

// import { TransactionQueryDto } from "../dto/transaction-query.dto";

// import { IAttachment } from "../interfaces/attachment.interface";

// import { TransactionSource } from "../../../common/enums/transaction-source.enum";
// import { RecurrenceStatus } from "../../../common/enums/recurrence-status.enum";

// export class TransactionRepository {
//   async create(
//     payload: Partial<ITransaction>,
//   ): Promise<TransactionDocument> {
//     return await Transaction.create(payload);
//   }

//   async findById(
//     transactionId: Types.ObjectId,
//   ): Promise<TransactionDocument | null> {
//     return await Transaction.findOne({
//       _id: transactionId,
//       isDeleted: false,
//     });
//   }

//   async findByIdAndUserId(
//     transactionId: Types.ObjectId,
//     userId: Types.ObjectId,
//   ): Promise<TransactionDocument | null> {
//     return await Transaction.findOne({
//       _id: transactionId,
//       userId,
//       isDeleted: false,
//     });
//   }

//   async findAllByUserId(
//     userId: Types.ObjectId,
//     query: TransactionQueryDto,
//   ) {
//     const {
//       page = 1,
//       limit = 10,
//       search,
//       type,
//       categoryId,
//       subcategoryId,
//       paymentMethod,
//       startDate,
//       transactionSource,
//       endDate,
//       minAmount,
//       maxAmount,
//       sortBy = "transactionDate",
//       sortOrder = "desc",
//     } = query;

//     const filter: FilterQuery<ITransaction> = {
//       userId,
//       isDeleted: false,
//     };

//     // Search
//     if (search) {
//       filter.$or = [
//         {
//           title: {
//             $regex: search,
//             $options: "i",
//           },
//         },
//         {
//           description: {
//             $regex: search,
//             $options: "i",
//           },
//         },
//       ];
//     }

//     // Filters
//     if (type) {
//       filter.type = type;
//     }

//     if (transactionSource) {
//       filter.transactionSource = transactionSource;
//     }

//     if (categoryId) {
//       filter.categoryId =
//         new Types.ObjectId(categoryId);
//     }

//     if (subcategoryId) {
//       filter.subcategoryId =
//         new Types.ObjectId(subcategoryId);
//     }

//     if (paymentMethod) {
//       filter.paymentMethod = paymentMethod;
//     }

//     if (startDate || endDate) {
//       filter.transactionDate = {};

//       if (startDate) {
//         filter.transactionDate.$gte =
//           new Date(startDate);
//       }

//       if (endDate) {
//         filter.transactionDate.$lte =
//           new Date(endDate);
//       }
//     }

//     if (
//       minAmount !== undefined ||
//       maxAmount !== undefined
//     ) {
//       filter.amount = {};

//       if (minAmount !== undefined) {
//         filter.amount.$gte = minAmount;
//       }

//       if (maxAmount !== undefined) {
//         filter.amount.$lte = maxAmount;
//       }
//     }

//     const sort: Record<string, 1 | -1> = {
//       [sortBy]:
//         sortOrder === "asc" ? 1 : -1,
//     };

//     const skip = (page - 1) * limit;

//     const [
//       transactions,
//       totalRecords,
//     ] = await Promise.all([
//       Transaction.find(filter)
//         .sort(sort)
//         .skip(skip)
//         .limit(limit)
//         .populate("categoryId")
//         .populate("subcategoryId"),

//       Transaction.countDocuments(filter),
//     ]);

//     return {
//       transactions,

//       pagination: {
//         page,
//         limit,
//         totalRecords,
//         totalPages: Math.ceil(
//           totalRecords / limit,
//         ),
//         hasNext:
//           page * limit < totalRecords,
//         hasPrevious: page > 1,
//       },
//     };
//   }

//   async update(
//     transactionId: Types.ObjectId,
//     payload: Partial<ITransaction>,
//   ): Promise<TransactionDocument | null> {
//     return await Transaction.findByIdAndUpdate(
//       transactionId,
//       payload,
//       {
//         new: true,
//         runValidators: true,
//       },
//     );
//   }

//   async softDelete(
//     transactionId: Types.ObjectId,
//   ): Promise<TransactionDocument | null> {
//     return await Transaction.findByIdAndUpdate(
//       transactionId,
//       {
//         isDeleted: true,
//       },
//       {
//         new: true,
//       },
//     );
//   }

//   async findRecurringTransactions(): Promise<
//     TransactionDocument[]
//   > {
//     return await Transaction.find({
//       transactionSource: "RECURRING",
//       isDeleted: false,
//     });
//   }

//   async addAttachment(
//     transactionId: Types.ObjectId,
//     attachment: IAttachment,
//   ) {
//     return await Transaction.findByIdAndUpdate(
//       transactionId,
//       {
//         $push: {
//           attachments: attachment,
//         },
//       },
//       {
//         new: true,
//       },
//     );
//   }

//   async removeAttachment(
//     transactionId: Types.ObjectId,
//     attachmentId: Types.ObjectId,
//   ) {
//     return await Transaction.findByIdAndUpdate(
//       transactionId,
//       {
//         $pull: {
//           attachments: {
//             _id: attachmentId,
//           },
//         },
//       },
//       {
//         new: true,
//       },
//     );
//   }

//   /**
//    * Calculate total expense amount.
//    *
//    * Supports an optional MongoDB session so this
//    * aggregation can participate in a transaction.
//    */
//   async calculateSpentAmount(
//     filter: FilterQuery<ITransaction>,
//     session?: ClientSession,
//   ) {
//     const result = await Transaction.aggregate([
//       {
//         $match: {
//           ...filter,
//           isDeleted: false,
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           total: {
//             $sum: "$amount",
//           },
//         },
//       },
//     ]).session(session ?? null);

//     return result[0]?.total ?? 0;
//   }

//   async findDueRecurringTransactions(
//     currentDate: Date = new Date(),
//   ) {
//     return Transaction.find({
//       transactionSource:
//         TransactionSource.RECURRING,

//       recurrenceStatus:
//         RecurrenceStatus.ACTIVE,

//       isDeleted: false,

//       nextExecutionDate: {
//         $ne: null,
//         $lte: currentDate,
//       },
//     }).sort({
//       nextExecutionDate: 1,
//     });
//   }
// }

// export const transactionRepository =
//   new TransactionRepository();



import {
  ClientSession,
  FilterQuery,
  Types,
} from "mongoose";

import {
  ITransaction,
  TransactionDocument,
} from "../interfaces/transaction.interface";

import { Transaction } from "../schemas/transaction.schema";

import { TransactionQueryDto } from "../dto/transaction-query.dto";

import { IAttachment } from "../interfaces/attachment.interface";

import { TransactionSource } from "../../../common/enums/transaction-source.enum";
import { RecurrenceStatus } from "../../../common/enums/recurrence-status.enum";

export class TransactionRepository {
  // -----------------------------------------
  // Create
  // -----------------------------------------

  async create(
    payload: Partial<ITransaction>,
    session?: ClientSession,
  ): Promise<TransactionDocument> {
    const transaction = new Transaction(payload);

    return await transaction.save({
      session,
    });
  }

  // -----------------------------------------
  // Find by ID
  // -----------------------------------------

  async findById(
    transactionId: Types.ObjectId,
  ): Promise<TransactionDocument | null> {
    return await Transaction.findOne({
      _id: transactionId,
      isDeleted: false,
    });
  }

  // -----------------------------------------
  // Find by ID and User
  // -----------------------------------------

  async findByIdAndUserId(
    transactionId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<TransactionDocument | null> {
    return await Transaction.findOne({
      _id: transactionId,
      userId,
      isDeleted: false,
    });
  }

  // -----------------------------------------
  // Find all transactions
  // -----------------------------------------

  async findAllByUserId(
    userId: Types.ObjectId,
    query: TransactionQueryDto,
  ) {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      categoryId,
      subcategoryId,
      paymentMethod,
      startDate,
      transactionSource,
      endDate,
      minAmount,
      maxAmount,
      sortBy = "transactionDate",
      sortOrder = "desc",
    } = query;

    const filter: FilterQuery<ITransaction> = {
      userId,
      isDeleted: false,
    };

    // Search
    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Filters
    if (type) {
      filter.type = type;
    }

    if (transactionSource) {
      filter.transactionSource = transactionSource;
    }

    if (categoryId) {
      filter.categoryId =
        new Types.ObjectId(categoryId);
    }

    if (subcategoryId) {
      filter.subcategoryId =
        new Types.ObjectId(subcategoryId);
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      filter.transactionDate = {};

      if (startDate) {
        filter.transactionDate.$gte =
          new Date(startDate);
      }

      if (endDate) {
        filter.transactionDate.$lte =
          new Date(endDate);
      }
    }

    if (
      minAmount !== undefined ||
      maxAmount !== undefined
    ) {
      filter.amount = {};

      if (minAmount !== undefined) {
        filter.amount.$gte = minAmount;
      }

      if (maxAmount !== undefined) {
        filter.amount.$lte = maxAmount;
      }
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]:
        sortOrder === "asc" ? 1 : -1,
    };

    const skip = (page - 1) * limit;

    const [
      transactions,
      totalRecords,
    ] = await Promise.all([
      Transaction.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("categoryId")
        .populate("subcategoryId"),

      Transaction.countDocuments(filter),
    ]);

    return {
      transactions,

      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(
          totalRecords / limit,
        ),
        hasNext:
          page * limit < totalRecords,
        hasPrevious: page > 1,
      },
    };
  }

  // -----------------------------------------
  // Update
  // -----------------------------------------

  async update(
    transactionId: Types.ObjectId,
    payload: Partial<ITransaction>,
    session?: ClientSession,
  ): Promise<TransactionDocument | null> {
    return await Transaction.findOneAndUpdate(
      {
        _id: transactionId,
        isDeleted: false,
      },
      payload,
      {
        new: true,
        runValidators: true,
        session,
      },
    );
  }

  // -----------------------------------------
  // Soft Delete
  // -----------------------------------------

  async softDelete(
    transactionId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<TransactionDocument | null> {
    return await Transaction.findOneAndUpdate(
      {
        _id: transactionId,
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

  // -----------------------------------------
  // Find recurring transactions
  // -----------------------------------------

  async findRecurringTransactions(): Promise<
    TransactionDocument[]
  > {
    return await Transaction.find({
      transactionSource:
        TransactionSource.RECURRING,
      isDeleted: false,
    });
  }

  // -----------------------------------------
  // Add attachment
  // -----------------------------------------

  async addAttachment(
    transactionId: Types.ObjectId,
    attachment: IAttachment,
  ) {
    return await Transaction.findOneAndUpdate(
      {
        _id: transactionId,
        isDeleted: false,
      },
      {
        $push: {
          attachments: attachment,
        },
      },
      {
        new: true,
      },
    );
  }

  // -----------------------------------------
  // Remove attachment
  // -----------------------------------------

  async removeAttachment(
    transactionId: Types.ObjectId,
    attachmentId: Types.ObjectId,
  ) {
    return await Transaction.findOneAndUpdate(
      {
        _id: transactionId,
        isDeleted: false,
      },
      {
        $pull: {
          attachments: {
            _id: attachmentId,
          },
        },
      },
      {
        new: true,
      },
    );
  }

  // -----------------------------------------
  // Calculate spent amount
  // -----------------------------------------

  async calculateSpentAmount(
    filter: FilterQuery<ITransaction>,
    session?: ClientSession,
  ) {
    const aggregate =
      Transaction.aggregate([
        {
          $match: {
            ...filter,
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]);

    if (session) {
      aggregate.session(session);
    }

    const result =
      await aggregate.exec();

    return result[0]?.total ?? 0;
  }

  // -----------------------------------------
  // Find due recurring transactions
  // -----------------------------------------

  async findDueRecurringTransactions(
    currentDate: Date = new Date(),
  ) {
    return await Transaction.find({
      transactionSource:
        TransactionSource.RECURRING,

      recurrenceStatus:
        RecurrenceStatus.ACTIVE,

      isDeleted: false,

      nextExecutionDate: {
        $ne: null,
        $lte: currentDate,
      },
    }).sort({
      nextExecutionDate: 1,
    });
  }
}

export const transactionRepository =
  new TransactionRepository();