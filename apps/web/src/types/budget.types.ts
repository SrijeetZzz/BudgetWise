// export type BudgetScope =
//   | 'OVERALL'
//   | 'CATEGORY'
//   | 'SUBCATEGORY';

// export type BudgetPeriod =
//   | 'WEEKLY'
//   | 'MONTHLY'
//   | 'YEARLY'
//   | 'CUSTOM';

// export type BudgetStatus =
//   | 'ACTIVE'
//   | 'COMPLETED'
//   | 'EXPIRED';

// export interface BudgetCategory {
//   _id: string;
//   name: string;
//   icon?: string;
//   color?: string;
// }

// export interface Budget {
//   _id: string;
//   userId: string;

//   scope: BudgetScope;

//   categoryId?: string | BudgetCategory | null;
//   subcategoryId?: string | BudgetCategory | null;

//   period: BudgetPeriod;

//   startDate: string;
//   endDate: string;

//   budgetAmount: number;
//   spentAmount: number;
//   remainingAmount: number;
//   utilization: number;

//   status: BudgetStatus;

//   isDeleted: boolean;
//   lastAlertThreshold: number;

//   createdAt: string;
//   updatedAt: string;
// }

// export interface BudgetQuery {
//   page?: number;
//   limit?: number;

//   search?: string;

//   scope?: BudgetScope;
//   period?: BudgetPeriod;
//   status?: BudgetStatus;

//   sortBy?:
//     | 'createdAt'
//     | 'budgetAmount'
//     | 'spentAmount'
//     | 'remainingAmount'
//     | 'utilization';

//   sortOrder?: 'asc' | 'desc';
// }

// export interface CreateBudgetInput {
//   scope: BudgetScope;

//   categoryId?: string;
//   subcategoryId?: string;

//   period: BudgetPeriod;

//   startDate: string;
//   endDate: string;

//   budgetAmount: number;
// }

// export interface UpdateBudgetInput {
//   scope?: BudgetScope;

//   categoryId?: string;
//   subcategoryId?: string;

//   period?: BudgetPeriod;

//   startDate?: string;
//   endDate?: string;

//   budgetAmount?: number;
// }

// export interface BudgetPagination {
//   page: number;
//   limit: number;
//   totalRecords: number;
//   totalPages: number;
//   hasNext: boolean;
//   hasPrevious: boolean;
// }

// export interface BudgetListResponse {
//   budgets: Budget[];
//   pagination: BudgetPagination;
// }

// export type BudgetScope =
//   | 'OVERALL'
//   | 'CATEGORY'
//   | 'SUBCATEGORY';

// export type BudgetPeriod =
//   | 'WEEKLY'
//   | 'MONTHLY'
//   | 'YEARLY'
//   | 'CUSTOM';

// export type BudgetStatus =
//   | 'ACTIVE'
//   | 'COMPLETED'
//   | 'EXPIRED';

// export type BudgetRecurrenceStatus =
//   | 'ACTIVE'
//   | 'COMPLETED';

// export interface BudgetRecurrence {
//   enabled: boolean;

//   /**
//    * Amount used for future generated budget periods.
//    */
//   budgetAmount: number;

//   /**
//    * Next period that the scheduler will generate.
//    */
//   nextGenerationDate: string | null;

//   /**
//    * End date of the recurrence series.
//    */
//   endDate: string | null;

//   status: BudgetRecurrenceStatus;

//   /**
//    * Root budget that owns the recurrence.
//    */
//   rootBudgetId: string | null;
// }

// export interface BudgetCategory {
//   _id: string;
//   name: string;
//   icon?: string;
//   color?: string;
// }

// export interface Budget {
//   _id: string;
//   userId: string;

//   scope: BudgetScope;

//   categoryId?: string | BudgetCategory | null;
//   subcategoryId?: string | BudgetCategory | null;

//   period: BudgetPeriod;

//   startDate: string;
//   endDate: string;

//   budgetAmount: number;
//   spentAmount: number;
//   remainingAmount: number;
//   utilization: number;

//   status: BudgetStatus;

//   /**
//    * Present for recurring root budgets and generated
//    * budgets that belong to a recurrence series.
//    */
//   recurrence?: BudgetRecurrence;

//   isDeleted: boolean;
//   lastAlertThreshold: number;

//   createdAt: string;
//   updatedAt: string;
// }

// export interface BudgetQuery {
//   page?: number;
//   limit?: number;

//   search?: string;

//   scope?: BudgetScope;
//   period?: BudgetPeriod;
//   status?: BudgetStatus;

//   sortBy?:
//     | 'createdAt'
//     | 'budgetAmount'
//     | 'spentAmount'
//     | 'remainingAmount'
//     | 'utilization';

//   sortOrder?: 'asc' | 'desc';
// }

// export interface CreateBudgetInput {
//   scope: BudgetScope;

//   categoryId?: string;
//   subcategoryId?: string;

//   period: BudgetPeriod;

//   startDate: string;
//   endDate: string;

//   budgetAmount: number;
// }

// export interface UpdateBudgetInput {
//   scope?: BudgetScope;

//   categoryId?: string;
//   subcategoryId?: string;

//   period?: BudgetPeriod;

//   startDate?: string;
//   endDate?: string;

//   budgetAmount?: number;
// }

// export interface UpdateBudgetRecurrenceInput {
//   enabled?: boolean;

//   /**
//    * Changes the amount used for future
//    * not-yet-generated periods.
//    */
//   budgetAmount?: number;

//   /**
//    * null means no recurrence end date.
//    */
//   endDate?: string | null;
// }

// export interface BudgetPagination {
//   page: number;
//   limit: number;
//   totalRecords: number;
//   totalPages: number;
//   hasNext: boolean;
//   hasPrevious: boolean;
// }

// export interface BudgetListResponse {
//   budgets: Budget[];
//   pagination: BudgetPagination;
// }

export type BudgetScope =
  | "OVERALL"
  | "CATEGORY"
  | "SUBCATEGORY";

export type BudgetPeriod =
  | "WEEKLY"
  | "MONTHLY"
  | "YEARLY"
  | "CUSTOM";

export type BudgetStatus =
  | "ACTIVE"
  | "COMPLETED"
  | "EXPIRED";

export type BudgetRecurrenceStatus =
  | "ACTIVE"
  | "COMPLETED";

export interface BudgetRecurrence {
  enabled: boolean;

  /**
   * Amount used for future generated budget periods.
   */
  budgetAmount: number;

  /**
   * Next period that the scheduler will generate.
   */
  nextGenerationDate: string | null;

  /**
   * End date of the recurrence series.
   */
  endDate: string | null;

  status: BudgetRecurrenceStatus;

  /**
   * Root budget that owns the recurrence.
   */
  rootBudgetId: string | null;
}

export interface BudgetCategory {
  _id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface Budget {
  _id: string;
  userId: string;

  scope: BudgetScope;

  categoryId?: string | BudgetCategory | null;
  subcategoryId?: string | BudgetCategory | null;

  period: BudgetPeriod;

  startDate: string;
  endDate: string;

  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  utilization: number;

  status: BudgetStatus;

  /**
   * Recurrence configuration.
   *
   * Present when the budget belongs to a
   * recurrence series.
   */
  recurrence?: BudgetRecurrence;

  isDeleted: boolean;
  lastAlertThreshold: number;

  createdAt: string;
  updatedAt: string;
}

export interface BudgetQuery {
  page?: number;
  limit?: number;

  search?: string;

  scope?: BudgetScope;
  period?: BudgetPeriod;
  status?: BudgetStatus;

  sortBy?:
    | "createdAt"
    | "budgetAmount"
    | "spentAmount"
    | "remainingAmount"
    | "utilization";

  sortOrder?: "asc" | "desc";
}

export interface CreateBudgetInput {
  scope: BudgetScope;

  categoryId?: string;
  subcategoryId?: string;

  period: BudgetPeriod;

  startDate: string;
  endDate: string;

  budgetAmount: number;

  /**
   * Optional recurrence configuration.
   *
   * Omitted = normal one-time budget.
   */
  recurrence?: {
    enabled: boolean;

    /**
     * Amount to use for future generated budgets.
     * If omitted, backend uses budgetAmount.
     */
    budgetAmount?: number;

    /**
     * Optional date at which recurrence stops.
     */
    endDate?: string | null;
  };
}

export interface UpdateBudgetInput {
  scope?: BudgetScope;

  categoryId?: string;
  subcategoryId?: string;

  period?: BudgetPeriod;

  startDate?: string;
  endDate?: string;

  budgetAmount?: number;
}

export interface UpdateBudgetRecurrenceInput {
  /**
   * Enable or disable future generation.
   */
  enabled?: boolean;

  /**
   * Changes the amount used for future
   * not-yet-generated periods.
   */
  budgetAmount?: number;

  /**
   * null means no recurrence end date.
   */
  endDate?: string | null;
}

export interface BudgetPagination {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface BudgetListResponse {
  budgets: Budget[];
  pagination: BudgetPagination;
}