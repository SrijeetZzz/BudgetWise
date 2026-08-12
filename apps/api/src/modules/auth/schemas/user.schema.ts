import {
  Schema,
  model,
  InferSchemaType,
  HydratedDocument,
} from "mongoose";

import { AuthProvider } from "../../../common/enums/auth-provider.enum";
import { UserStatus } from "../../../common/enums/user-status.enum";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      default: null,
    },

    googleId: {
      type: String,
      default: null,
    },

    authProvider: {
      type: String,
      enum: Object.values(AuthProvider),
      required: true,
      default: AuthProvider.EMAIL,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ status: 1 });

export type User = InferSchemaType<typeof userSchema>;

export type UserDocument = HydratedDocument<User>;

const UserModel = model<User>("User", userSchema);

export default UserModel;