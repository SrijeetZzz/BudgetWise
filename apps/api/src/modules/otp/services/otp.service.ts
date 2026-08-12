import bcrypt from "bcrypt";

import { AppError } from "../../../common/exceptions/AppError";

import { SendOtpDto } from "../dto/send-otp.dto";
import { VerifyOtpDto } from "../dto/verify-otp.dto";

import * as otpRepository from "../repositories/otp.repository";
import { mailService } from "../../../common/services/mail.service";

const OTP_EXPIRY_MINUTES = 5;
const MAX_ATTEMPTS = 5;

class OtpService {
  async sendOtp(dto: SendOtpDto): Promise<void> {
    const { email, purpose } = dto;

    // Remove any existing OTP for this email & purpose
    await otpRepository.deleteOtp(email, purpose);

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 10);

    // Calculate expiry
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Store OTP
    await otpRepository.createOtp({
      email,
      otpHash,
      purpose,
      expiresAt,
    });

    try {
      await mailService.sendOTP(email, otp);
    } catch (error) {
      // Delete the OTP since the user never received it
      await otpRepository.deleteOtp(email, purpose);

      throw new AppError(
        500,
        "Failed to send OTP email. Please try again later.",
      );
    }
  }
  async verifyOtp(dto: VerifyOtpDto): Promise<void> {
    const { email, otp, purpose } = dto;

    const otpRecord = await otpRepository.findOtp(email, purpose);

    if (!otpRecord) {
      throw new AppError(400, "OTP not found");
    }

    if (otpRecord.expiresAt < new Date()) {
      await otpRepository.deleteOtpById(otpRecord.id);

      throw new AppError(400, "OTP has expired");
    }

    if (otpRecord.attemptCount >= MAX_ATTEMPTS) {
      await otpRepository.deleteOtpById(otpRecord.id);

      throw new AppError(400, "Maximum OTP verification attempts exceeded");
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);

    if (!isValid) {
      await otpRepository.incrementAttemptCount(otpRecord.id);

      throw new AppError(400, "Invalid OTP");
    }

    await otpRepository.deleteOtpById(otpRecord.id);
  }
}

export default new OtpService();
