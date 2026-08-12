import { AuthProvider } from "../../../common/enums/auth-provider.enum";
import { UserStatus } from "../../../common/enums/user-status.enum";
import User, { UserDocument } from "../schemas/user.schema";

export const findUserByEmail = async (
  email: string,
): Promise<UserDocument | null> => {
  return User.findOne({ email });
};

export const findUserByPhone = async (
  phone: string,
): Promise<UserDocument | null> => {
  return User.findOne({ phone });
};

export const findUserById = async (
  userId: string,
): Promise<UserDocument | null> => {
  return User.findById(userId);
};

export const createUser = async (data: {
  email: string;
  phone: string;
  passwordHash: string;
  authProvider: AuthProvider.EMAIL;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  status: UserStatus.ACTIVE;
}): Promise<UserDocument> => {
  return User.create(data);
};

export const findUserByGoogleId = async (
  googleId: string,
): Promise<UserDocument | null> => {
  return User.findOne({ googleId });
};

export const linkGoogleAccount = async (
  userId: string,
  googleId: string,
): Promise<UserDocument | null> => {
  return User.findByIdAndUpdate(
    userId,
    {
      googleId,
      // authProvider: AuthProvider.GOOGLE,
    },
    {
      new: true,
    },
  );
};

export const createGoogleUser = async (data: {
  email: string;
  phone: string;
  googleId: string;
  authProvider: AuthProvider.GOOGLE;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  status: UserStatus.ACTIVE;
}): Promise<UserDocument> => {
  return User.create(data);
};

export const updateLastLogin = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, {
    lastLogin: new Date(),
  });
};

export const updatePassword = async (
  userId: string,
  passwordHash: string
): Promise<void> => {
  await User.findByIdAndUpdate(userId, {
    passwordHash,
  });
};