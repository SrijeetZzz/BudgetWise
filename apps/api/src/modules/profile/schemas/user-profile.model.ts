import {
  Schema,
  model,
  InferSchemaType,
  HydratedDocument,
} from "mongoose";

const userProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    displayName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    profileImage: {
      type: String,
      default: null,
      maxlength: 500,
    },

    monthlyIncome: {
      type: Number,
      default: null,
      min: 0,
    },

    financialGoal: {
      type: String,
      default: null,
      trim: true,
    },

    occupation: {
      type: String,
      default: null,
      trim: true,
    },

    country: {
      type: String,
      default: null,
      trim: true,
    },

    timezone: {
      type: String,
      required: true,
      default: "Asia/Kolkata",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userProfileSchema.index({ userId: 1 });

export type UserProfile = InferSchemaType<typeof userProfileSchema>;

export type UserProfileDocument = HydratedDocument<UserProfile>;

const UserProfileModel = model<UserProfile>("UserProfile", userProfileSchema);

export default UserProfileModel;
