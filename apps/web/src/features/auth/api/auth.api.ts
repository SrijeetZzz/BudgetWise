import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

import type { ApiResponse } from "@/types/api.types";

import type {
  AuthData,
  ForgotPasswordRequest,
  GoogleCompleteRequest,
  GoogleLoginRequest,
  GoogleLoginResponse,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  SendOtpRequest,
  User,
  VerifyOtpRequest,
} from "@/types/auth.types";

export const authApi = {
  register: async (payload: RegisterRequest) => {
    const { data } = await apiClient.post<ApiResponse<AuthData>>(
      API_ENDPOINTS.AUTH.REGISTER,
      payload,
    );

    return data;
  },

  login: async (payload: LoginRequest) => {
    const { data } = await apiClient.post<ApiResponse<AuthData>>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload,
    );

    return data;
  },

  googleLogin: async (
  payload: GoogleLoginRequest,
) => {
  const { data } =
    await apiClient.post<GoogleLoginResponse>(
      API_ENDPOINTS.AUTH.GOOGLE,
      payload,
    );

  return data;
},

googleComplete: async (
  payload: GoogleCompleteRequest,
) => {
  const { data } =
    await apiClient.post<ApiResponse<AuthData>>(
      API_ENDPOINTS.AUTH.GOOGLE_COMPLETE,
      payload,
    );

  return data;
},

  sendOtp: async (payload: SendOtpRequest) => {
    const { data } = await apiClient.post<ApiResponse<null>>(
      API_ENDPOINTS.AUTH.SEND_OTP,
      payload,
    );

    return data;
  },

  verifyOtp: async (payload: VerifyOtpRequest) => {
    const { data } = await apiClient.post<ApiResponse<null>>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      payload,
    );

    return data;
  },

  forgotPassword: async (payload: ForgotPasswordRequest) => {
    const { data } = await apiClient.post<ApiResponse<null>>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      payload,
    );

    return data;
  },

  resetPassword: async (payload: ResetPasswordRequest) => {
    const { data } = await apiClient.post<ApiResponse<null>>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      payload,
    );

    return data;
  },

  refresh: async () => {
    const { data } = await apiClient.post<ApiResponse<{ accessToken: string }>>(
      API_ENDPOINTS.AUTH.REFRESH,
    );

    return data;
  },

  logout: async () => {
    const { data } = await apiClient.post<ApiResponse<null>>(
      API_ENDPOINTS.AUTH.LOGOUT,
    );

    return data;
  },

  logoutAll: async () => {
    const { data } = await apiClient.post<ApiResponse<null>>(
      API_ENDPOINTS.AUTH.LOGOUT_ALL,
    );

    return data;
  },

  me: async () => {
    const { data } = await apiClient.get<ApiResponse<User>>(
      API_ENDPOINTS.AUTH.ME,
    );

    return data.data;
  },
};
