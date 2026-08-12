import { OtpPurpose } from "../../../common/enums/otp-purpose.enum";

export interface VerifyOtpDto {
  email: string;
  otp: string;
  purpose: OtpPurpose;
}