import { OtpPurpose } from "../../../common/enums/otp-purpose.enum";

export interface SendOtpDto {
  email: string;
  purpose: OtpPurpose;
}