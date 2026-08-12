import { Request, Response } from "express";

import authService from "../services/auth.service";

import { asyncHandler } from "../../../common/helpers/asyncHandler";
import { sendResponse } from "../../../common/utils/response";
import { refreshCookieOptions } from "../../../config/cookie/cookie.config";
import { JWT } from "../../../config/jwt";
import { GoogleLoginDto } from "../dto/google-login.dto";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const browser = req.get("User-Agent") ?? null;
  const ipAddress = req.ip;

  console.log(req.body);
  const result = await authService.register(req.body, browser, ipAddress);

  res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

  return sendResponse(res, 201, {
    success: true,
    message: "User registered successfully",
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const browser = req.get("User-Agent") ?? null;
  const ipAddress = req.ip;

  const result = await authService.login(req.body, browser, ipAddress);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: JWT.refreshCookieExpiresIn,
  });

  return sendResponse(res, 200, {
    success: true,
    message: "Login successful",
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
});

export const googleLogin = asyncHandler(async (req, res) => {
  const browser = req.get("User-Agent") ?? null;
  const ipAddress = req.ip;

  const result = await authService.googleLogin(req.body, browser, ipAddress);

  // Existing user -> login successful
  if ("refreshToken" in result) {
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: JWT.refreshCookieExpiresIn,
    });

    return sendResponse(res, 200, {
      success: true,
      message: "Google login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  }

  // New user -> complete phone verification
  return sendResponse(res, 200, {
    success: true,
    message: "Phone verification required",
    data: result,
  });
});

export const googleComplete = asyncHandler(async (req, res) => {
  const browser = req.get("User-Agent") ?? null;
  const ipAddress = req.ip;

  const result = await authService.googleComplete(req.body, browser, ipAddress);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: JWT.refreshCookieExpiresIn,
  });

  return sendResponse(res, 201, {
    success: true,
    message: "Google account created successfully",
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  const result = await authService.refresh(refreshToken);

  return sendResponse(res, 200, {
    success: true,
    message: "Token refreshed successfully",
    data: result,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  await authService.logout(refreshToken);

  res.clearCookie("refreshToken", refreshCookieOptions);

  return sendResponse(res, 200, {
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

export const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  await authService.logoutAll(refreshToken);

  res.clearCookie("refreshToken", refreshCookieOptions);

  return sendResponse(res, 200, {
    success: true,
    message: "Logged out from all devices",
    data: null,
  });
});

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    await authService.forgotPassword(req.body);

    return sendResponse(res, 200, {
      success: true,
      message: "Password reset OTP sent successfully",
      data: null,
    });
  },
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    await authService.resetPassword(req.body);

    return sendResponse(res, 200, {
      success: true,
      message: "Password reset successful",
      data: null,
    });
  },
);

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authService.getCurrentUser(
      req.user.userId,
    );

    return sendResponse(res, 200, {
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  },
);
