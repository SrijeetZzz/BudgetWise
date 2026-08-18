export type ProfileTheme =
  | "LIGHT"
  | "DARK"
  | "SYSTEM";

export type ProfileLanguage =
  | "ENGLISH"
  | "HINDI";

export type DateFormat =
  | "DD/MM/YYYY"
  | "MM/DD/YYYY"
  | "YYYY-MM-DD";

export type TimeFormat =
  | "12_HOUR"
  | "24_HOUR";

export type Currency =
  | "INR"
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "AUD"
  | "CAD";

/* =========================================================
   PROFILE
========================================================= */

export interface Profile {
  displayName: string;

  email: string;

  phone: string;

  profileImage: string | null;

  monthlyIncome: number | null;

  occupation: string | null;

  country: string | null;

  timezone: string | null;

  isEmailVerified: boolean;

  isPhoneVerified: boolean;
}

/* =========================================================
   UPDATE PROFILE
========================================================= */

export interface UpdateProfileRequest {
  displayName?: string;

  monthlyIncome?: number;

  occupation?: string;

  country?: string;

  timezone?: string;
}

/* =========================================================
   PROFILE SETTINGS
========================================================= */

export interface ProfileSettings {
  _id: string;

  userId: string;

  currency: Currency;

  theme: ProfileTheme;

  language: ProfileLanguage;

  dateFormat: DateFormat;

  timeFormat: TimeFormat;

  notificationsEnabled: boolean;

  emailNotifications: boolean;

  pushNotifications: boolean;

  budgetAlerts: boolean;

  expenseReminders: boolean;

  biometricEnabled: boolean;

  pinEnabled: boolean;

  createdAt: string;

  updatedAt: string;
}

/* =========================================================
   UPDATE SETTINGS
========================================================= */

export interface UpdateSettingsRequest {
  currency?: Currency;

  theme?: ProfileTheme;

  language?: ProfileLanguage;

  dateFormat?: DateFormat;

  timeFormat?: TimeFormat;

  notificationsEnabled?: boolean;

  emailNotifications?: boolean;

  pushNotifications?: boolean;

  budgetAlerts?: boolean;

  expenseReminders?: boolean;

  biometricEnabled?: boolean;

  pinEnabled?: boolean;
}

/* =========================================================
   MOBILE IMAGE
========================================================= */

export interface ProfileImageFile {
  uri: string;

  name: string;

  type: string;
}