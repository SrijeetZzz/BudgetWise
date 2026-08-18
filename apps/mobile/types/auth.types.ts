import { ThemeMode } from "../store/theme.store";

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  profileImage?: string | null;
  theme: ThemeMode;
}

export interface LoginRequest {
  email: string;
  password: string;
  deviceId: string;
}

export interface AuthData {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: unknown;
}

export interface RegisterRequest {
  displayName: string;
  email: string;
  phone: string;
  password: string;
  otp: string;
  deviceId: string;
}

export interface SendOtpRequest {
  email: string;
  purpose: OtpPurpose;
}
export type OtpPurpose =
  | "REGISTER"
  | "LOGIN"
  | "FORGOT_PASSWORD"
  | "CHANGE_EMAIL"
  | "GOOGLE_REGISTER";

  export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface GoogleLoginRequest {
  idToken: string;
  deviceId: string;
}

export interface GoogleCompleteRequest {
  idToken: string;
  phone: string;
  otp: string;
  deviceId: string;
}

export interface GoogleRegistrationRequired {
  requiresPhoneVerification: true;
  email: string;
  displayName: string;
  picture?: string;
}

export type GoogleLoginResponse =
  | AuthData
  | GoogleRegistrationRequired;