import {
  HydratedDocument,
  InferSchemaType,
  model,
  Schema,
} from "mongoose";
import { OtpPurpose } from "../../../common/enums/otp-purpose.enum";

const otpSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: false,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
      required: false,
      index: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: Object.values(OtpPurpose),
      required: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    attemptCount: {
      type: Number,
      default: 0,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Automatically remove expired OTPs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type OTP = InferSchemaType<typeof otpSchema>;
export type OTPDocument = HydratedDocument<OTP>;

const OTPModel = model<OTP>("OTP", otpSchema);

export default OTPModel;