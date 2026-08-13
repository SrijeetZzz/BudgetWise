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

export interface UpdateProfileRequest {
  displayName?: string;
  monthlyIncome?: number;
  occupation?: string;
  country?: string;
  timezone?: string;
}

export interface ProfileSettings {
  _id: string;
  userId: string;

  currency: string;
  theme: string;
  language: string;
  dateFormat: string;
  timeFormat: string;

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

export interface UpdateSettingsRequest {
  currency?: string;
  theme?: string;
  language?: string;
  dateFormat?: string;
  timeFormat?: string;

  notificationsEnabled?: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  budgetAlerts?: boolean;
  expenseReminders?: boolean;

  biometricEnabled?: boolean;
  pinEnabled?: boolean;
}