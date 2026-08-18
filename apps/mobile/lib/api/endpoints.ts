export const API_ENDPOINTS = {
  HEALTH: "/health",

  AUTH: {
    REGISTER: "/api/v1/auth/register",
    LOGIN: "/api/v1/auth/login",
    GOOGLE: "/api/v1/auth/google",
    GOOGLE_COMPLETE: "/api/v1/auth/google/complete",

    REFRESH: "/api/v1/auth/refresh",

    LOGOUT: "/api/v1/auth/logout",
    LOGOUT_ALL: "/api/v1/auth/logout-all",
    ME: "/api/v1/auth/me",

    FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
    RESET_PASSWORD: "/api/v1/auth/reset-password",

    SEND_OTP: "/api/v1/auth/send-otp",
    VERIFY_OTP: "/api/v1/auth/verify-otp",
  },

 
  PROFILE: {
    GET: "api/v1/profile",
    UPDATE: "api/v1/profile",
    COMPLETE: "api/v1/profile/complete",

    IMAGE: "api/v1/profile/image",

    SETTINGS: "api/v1/profile/settings",
  },

  CATEGORIES: {
    BASE: "/api/v1/categories",
    SUBCATEGORIES: "/api/v1/categories/subcategories",
  },

  TRANSACTIONS: {
    BASE: "/api/v1/transactions",
    RECURRING: "/transactions/recurring"
  },

  BUDGETS: {
    BASE: "/api/v1/budgets",
  },

  DASHBOARD: {
    BASE: "/api/v1/dashboard",
  },

  NOTIFICATIONS: {
    BASE: "/api/v1/notifications",
    READ_ALL: "/api/v1/notifications/read-all",
  },

  SESSION: {
    BASE: "/api/v1/session",
  },
} as const;