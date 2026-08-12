import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { env } from "../env";
import { AppError } from "../../common/exceptions/AppError";

export interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = (
  payload: TokenPayload,
): string => {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  } as SignOptions);
};

export const generateRefreshToken = (
  payload: TokenPayload,
): string => {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  } as SignOptions);
};

export const verifyAccessToken = (
  token: string,
): TokenPayload => {
  try {
    return jwt.verify(
      token,
      env.jwt.accessSecret,
    ) as TokenPayload;
  } catch {
    throw new AppError(401, "Invalid or expired access token");
  }
};

export const verifyRefreshToken = (
  token: string,
): TokenPayload => {
  try {
    return jwt.verify(
      token,
      env.jwt.refreshSecret,
    ) as TokenPayload;
  } catch {
    throw new AppError(401, "Invalid or expired refresh token");
  }
};