export type OtpPurpose =
  | 'REGISTER'
  | 'LOGIN'
  | 'FORGOT_PASSWORD'
  | 'CHANGE_EMAIL';

export interface RegisterRequest {
  displayName: string;
  email: string;
  phone: string;
  password: string;
  otp: string;
  deviceId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  deviceId: string;
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

export interface GoogleLoginResponse {
  success: boolean;
  message: string;
  data:
    | {
        user: User;
        accessToken: string;
      }
    | {
        requiresPhoneVerification: true;
        email: string;
        displayName: string;
        picture?: string;
      };
  meta?: unknown;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface SendOtpRequest {
  email: string;
  purpose: OtpPurpose;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  phone: string;
  avatar?: string;
  isEmailVerified: boolean;
}

export interface AuthData {
  user: User;
  accessToken: string;
  refreshToken?: string;
}