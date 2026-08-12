import bcrypt from "bcrypt";
import { Types } from "mongoose";

import { AuthProvider } from "../../../common/enums/auth-provider.enum";
import { UserStatus } from "../../../common/enums/user-status.enum";
import { AppError } from "../../../common/exceptions/AppError";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../config/jwt/jwt.service";
import { JWT } from "../../../config/jwt/jwt.config";

import { RegisterDto } from "../dto/register.dto";

import * as authRepository from "../repositories/auth.repository";
import otpService from "../../otp/services/otp.service";
import sessionService from "../../session/services/session.service";
import { AuthResponseDto } from "../dto/auth-response.dto";
import { LoginDto } from "../dto/login.dto";
import sessionRepository from "../../session/repositories/session.repository";
import { UserDocument } from "../../auth/schemas/user.schema";
import { GoogleLoginDto } from "../dto/google-login.dto";
import { verifyGoogleToken } from "../../../config/google/google";
import { OtpPurpose } from "../../../common/enums/otp-purpose.enum";
import { GoogleCompleteDto } from "../dto/google-complete.dto";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { ForgotPasswordDto } from "../dto/forgot-password.dto";
import { profileRepository } from "../../profile/repositories/profile.repository";
import { settingsRepository } from "../../profile/repositories/settings.repository";

class AuthService {
  private async createAuthResponse(
    user: UserDocument,
    deviceId: string,
    browser?: string | null,
    ipAddress?: string | null,
  ): Promise<AuthResponseDto> {
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
    };

    const accessToken = generateAccessToken(tokenPayload);

    const refreshToken = generateRefreshToken(tokenPayload);

    const expiresAt = new Date(Date.now() + JWT.refreshCookieExpiresIn);

    await sessionService.createSession({
      userId: user._id.toString(),
      refreshToken,
      deviceId,
      browser,
      ipAddress,
      expiresAt,
    });

    await authRepository.updateLastLogin(user._id.toString());

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        phone: user.phone,
      },
      accessToken,
      refreshToken,
    };
  }

  async register(
    dto: RegisterDto,
    browser?: string | null,
    ipAddress?: string | null,
  ): Promise<AuthResponseDto> {
    const { displayName, email, phone, password, otp } = dto;

    const existingEmail = await authRepository.findUserByEmail(email);

    if (existingEmail) {
      throw new AppError(409, "Email is already registered");
    }

    const existingPhone = await authRepository.findUserByPhone(phone);

    if (existingPhone) {
      throw new AppError(409, "Phone number is already registered");
    }

    await otpService.verifyOtp({
      email,
      otp,
      purpose: OtpPurpose.REGISTER,
    });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await authRepository.createUser({
      email,
      phone,
      passwordHash,
      authProvider: AuthProvider.EMAIL,
      isEmailVerified: true,
      isPhoneVerified: false,
      status: UserStatus.ACTIVE,
    });

    await profileRepository.create({
      userId: user._id,
      displayName,
    });
    await settingsRepository.create({
      userId: user._id,
    });

    return this.createAuthResponse(user, dto.deviceId, browser, ipAddress);
  }

  async login(
    dto: LoginDto,
    browser?: string | null,
    ipAddress?: string | null,
  ): Promise<AuthResponseDto> {
    const { email, password, deviceId } = dto;

    // Find user
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    if (!user.passwordHash) {
      throw new AppError(401, "Invalid email or password");
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError(401, "Invalid email or password");
    }

    // Check account status
    if (user.status !== "ACTIVE") {
      throw new AppError(
        403,
        "Your account is inactive. Please contact support.",
      );
    }

    return this.createAuthResponse(user, deviceId, browser, ipAddress);
  }

  async refresh(
    refreshToken: string | undefined,
  ): Promise<{ accessToken: string }> {
    if (!refreshToken) {
      throw new AppError(401, "Refresh token is required");
    }

    const payload = verifyRefreshToken(refreshToken);

    const session = await sessionRepository.findByRefreshToken(refreshToken);

    if (!session) {
      throw new AppError(401, "Session not found");
    }

    if (session.revokedAt) {
      throw new AppError(401, "Session has been revoked");
    }

    if (session.expiresAt < new Date()) {
      throw new AppError(401, "Refresh token has expired");
    }

    const user = await authRepository.findUserById(payload.userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError(403, "User account is inactive");
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return {
      accessToken,
    };
  }

  async googleLogin(
    dto: GoogleLoginDto,
    browser?: string | null,
    ipAddress?: string | null,
  ): Promise<
    | AuthResponseDto
    | {
        requiresPhoneVerification: true;
        email: string;
        displayName: string;
        picture?: string;
      }
  > {
    const { idToken, deviceId } = dto;

    // Verify Google ID token
    const googleUser = await verifyGoogleToken(idToken);

    if (!googleUser.emailVerified) {
      throw new AppError(400, "Google email is not verified");
    }

    // Try finding user by Google ID
    let user = await authRepository.findUserByGoogleId(googleUser.googleId);

    // If not found, check by email
    if (!user) {
      user = await authRepository.findUserByEmail(googleUser.email);
    }

    // New user -> complete registration later
    if (!user) {
      await otpService.sendOtp({
        email: googleUser.email,
        purpose: OtpPurpose.GOOGLE_REGISTER,
      });
      return {
        requiresPhoneVerification: true,
        email: googleUser.email,
        displayName: googleUser.name,
        picture: googleUser.picture,
      };
    }

    // Account status
    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError(
        403,
        "Your account is inactive. Please contact support.",
      );
    }

    // Existing EMAIL account but Google not linked
    if (user.authProvider === AuthProvider.EMAIL && !user.googleId) {
      user = await authRepository.linkGoogleAccount(
        user._id.toString(),
        googleUser.googleId,
      );

      if (!user) {
        throw new AppError(404, "User not found");
      }
    }

    // Login using common helper
    return this.createAuthResponse(user, deviceId, browser, ipAddress);
  }
  async googleComplete(
    dto: GoogleCompleteDto,
    browser?: string | null,
    ipAddress?: string | null,
  ): Promise<AuthResponseDto> {
    const { idToken, phone, otp, deviceId } = dto;

    // Verify Google token
    const googleUser = await verifyGoogleToken(idToken);

    if (!googleUser.emailVerified) {
      throw new AppError(400, "Google email is not verified");
    }

    // Verify OTP sent to Google email
    await otpService.verifyOtp({
      email: googleUser.email,
      otp,
      purpose: OtpPurpose.GOOGLE_REGISTER,
    });

    // Check if user already exists by Google ID
    const existingGoogleUser = await authRepository.findUserByGoogleId(
      googleUser.googleId,
    );

    if (existingGoogleUser) {
      throw new AppError(409, "Google account is already registered");
    }

    // Check if phone number is already in use
    const existingPhoneUser = await authRepository.findUserByPhone(phone);

    if (existingPhoneUser) {
      throw new AppError(409, "Phone number is already registered");
    }

    // Check if email already exists
    const existingEmailUser = await authRepository.findUserByEmail(
      googleUser.email,
    );

    let user;

    if (existingEmailUser) {
      // Existing email/password account -> link Google
      user = await authRepository.linkGoogleAccount(
        existingEmailUser._id.toString(),
        googleUser.googleId,
      );

      if (!user) {
        throw new AppError(404, "User not found");
      }

      // Optional: update phone if it was never added
      if (!user.phone) {
        user.phone = phone;
        await user.save();
      }
    } else {
      // Create a brand new Google account
      user = await authRepository.createGoogleUser({
        email: googleUser.email,
        phone,
        googleId: googleUser.googleId,
        authProvider: AuthProvider.GOOGLE,
        isEmailVerified: true,
        isPhoneVerified: false,
        status: UserStatus.ACTIVE,
      });

      await profileRepository.create({
        userId: user._id,
        displayName: googleUser.name,
        profileImage: googleUser.picture ?? null,
      });
      await settingsRepository.create({
        userId: user._id,
      });
    }

    return this.createAuthResponse(user, deviceId, browser, ipAddress);
  }

  async logout(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      throw new AppError(401, "Refresh token is required");
    }

    const session = await sessionRepository.findByRefreshToken(refreshToken);

    if (!session) {
      throw new AppError(401, "Session not found");
    }

    if (session.revokedAt) {
      throw new AppError(401, "Session already revoked");
    }

    await sessionRepository.revokeByRefreshToken(refreshToken);
  }

  async logoutAll(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      throw new AppError(401, "Refresh token is required");
    }

    const payload = verifyRefreshToken(refreshToken);

    const user = await authRepository.findUserById(payload.userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    await sessionRepository.revokeAllSessions(user._id.toString());
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await authRepository.findUserByEmail(dto.email);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (user.authProvider === AuthProvider.GOOGLE && !user.passwordHash) {
      throw new AppError(
        400,
        "This account uses Google Sign-In. Please sign in with Google.",
      );
    }

    await otpService.sendOtp({
      email: user.email,
      purpose: OtpPurpose.RESET_PASSWORD,
    });
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const user = await authRepository.findUserByEmail(dto.email);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    await otpService.verifyOtp({
      email: dto.email,
      otp: dto.otp,
      purpose: OtpPurpose.RESET_PASSWORD,
    });

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);

    await authRepository.updatePassword(user.id, passwordHash);

    await sessionRepository.revokeAllSessions(user._id.toString());
  }

  async getCurrentUser(userId: Types.ObjectId) {
    const user = await authRepository.findUserById(userId.toString());

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const profile = await profileRepository.findByUserId(userId.toString());

    return {
      id: user._id.toString(),
      email: user.email,
      phone: user.phone,
      name: profile?.displayName ?? null,
      profileImage: profile?.profileImage ?? null,
    };
  }
}

export default new AuthService();
