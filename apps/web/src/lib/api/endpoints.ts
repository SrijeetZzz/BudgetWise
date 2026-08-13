// src/lib/api/endpoints.ts

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    GOOGLE: "/auth/google",
    GOOGLE_COMPLETE: "/auth/google/complete",

    SEND_OTP: "/auth/send-otp",
    VERIFY_OTP: "/auth/verify-otp",

    REFRESH: "/auth/refresh",

    LOGOUT: "/auth/logout",
    LOGOUT_ALL: "/auth/logout-all",
    ME: "/auth/me",

    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",

    SESSIONS: "/auth/sessions",
  },

  PROFILE: {
    GET: "/profile",
    UPDATE: "/profile",
    COMPLETE: "/profile/complete",

    IMAGE: "/profile/image",

    SETTINGS: "/profile/settings",
  },

  TRANSACTIONS: {
    BASE: "/transactions",

    SEARCH: "/transactions/search",
    FILTER: "/transactions/filter",
    SORT: "/transactions/sort",

    RECURRING: "/transactions/recurring",
  },

  CATEGORIES: {
    BASE: "/categories",
    SUBCATEGORIES: '/categories/subcategories',
  },

  BUDGETS: {
    BASE: "/budgets",
    PROGRESS: "/budgets/progress",
    RECALCULATE: "/budgets/recalculate",
  },

  DASHBOARD: {
  BASE: "/dashboard",
  ANALYTICS: "/dashboard/analytics",
},

  REPORTS: {
    SUMMARY: "/reports/summary",

    WEEKLY: "/reports/weekly",

    MONTHLY: "/reports/monthly",

    YEARLY: "/reports/yearly",

    CUSTOM: "/reports/custom",

    CATEGORY: "/reports/category",

    SUBCATEGORY: "/reports/subcategory",

    BUDGET: "/reports/budget",

    EXPORT_CSV: "/reports/export/csv",

    EXPORT_PDF: "/reports/export/pdf",
  },

  NOTIFICATIONS: {
    BASE: "/notifications",
    READ_ALL: "/notifications/read-all",
  },
} as const;
