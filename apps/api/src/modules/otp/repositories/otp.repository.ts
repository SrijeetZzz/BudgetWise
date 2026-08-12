import { OtpPurpose } from "../../../common/enums/otp-purpose.enum";
import Otp, { OTPDocument } from "../schemas/otp.schema";

interface CreateOtpPayload {
  email: string;
  otpHash: string;
  purpose: OtpPurpose;
  expiresAt: Date;
}

export const findOtp = async (
  email: string,
  purpose: CreateOtpPayload["purpose"]
): Promise<OTPDocument | null> => {
  return Otp.findOne({
    email,
    purpose,
  });
};

export const deleteOtp = async (
  email: string,
  purpose: CreateOtpPayload["purpose"]
): Promise<void> => {
  await Otp.deleteMany({
    email,
    purpose,
  });
};

export const createOtp = async (
  payload: CreateOtpPayload
): Promise<OTPDocument> => {
  return Otp.create({
    email: payload.email,
    otpHash: payload.otpHash,
    purpose: payload.purpose,
    expiresAt: payload.expiresAt,
    attemptCount: 0,
    isVerified: false,
  });
};

export const incrementAttemptCount = async (
  otpId: string
): Promise<void> => {
  await Otp.findByIdAndUpdate(otpId, {
    $inc: {
      attemptCount: 1,
    },
  });
};

export const markOtpVerified = async (
  otpId: string
): Promise<void> => {
  await Otp.findByIdAndUpdate(otpId, {
    isVerified: true,
  });
};

export const deleteOtpById = async (
  otpId: string
): Promise<void> => {
  await Otp.findByIdAndDelete(otpId);
};