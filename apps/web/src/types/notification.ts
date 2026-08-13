export enum NotificationType {
  BUDGET_ALERT = "BUDGET_ALERT",
  RECURRING_REMINDER = "RECURRING_REMINDER",
  BILL_REMINDER = "BILL_REMINDER",
}

export enum NotificationStatus {
  READ = "READ",
  UNREAD = "UNREAD",
}

export interface BudgetNotificationMetadata {
  budgetId: string;
  budgetScope: "OVERALL" | "CATEGORY" | "SUBCATEGORY";

  categoryId?: string | null;
  categoryName?: string | null;

  subcategoryId?: string | null;
  subcategoryName?: string | null;

  threshold: number;
  utilization: number;
  spentAmount: number;
  budgetAmount: number;
}

export interface NotificationMetadata {
  budgetId?: string;
  budgetScope?: "OVERALL" | "CATEGORY" | "SUBCATEGORY";

  categoryId?: string | null;
  categoryName?: string | null;

  subcategoryId?: string | null;
  subcategoryName?: string | null;

  threshold?: number;
  utilization?: number;
  spentAmount?: number;
  budgetAmount?: number;

  [key: string]: unknown;
}

export interface Notification {
  _id: string;
  userId: string;

  type: NotificationType;

  title: string;
  message: string;

  status: NotificationStatus;

  metadata?: NotificationMetadata | null;

  readAt?: string | null;

  isDeleted: boolean;
  deletedAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface NotificationPaginationMeta {
  hasMore: boolean;
  nextCursor: string | null;
}

export interface GetNotificationsResponse {
  notifications: Notification[];
  meta: NotificationPaginationMeta;
}