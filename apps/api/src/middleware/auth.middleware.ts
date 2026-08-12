import { NextFunction, Request, Response } from "express";
import * as authRepository from "../modules/auth/repositories/auth.repository";
import { AppError } from "../common/exceptions/AppError";
import { verifyAccessToken } from "../config/jwt";
import { UserStatus } from "../common/enums/user-status.enum";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return next(
      new AppError(
        401,
        "Access token is required",
      ),
    );
  }

  const token = authHeader.split(" ")[1];

  const payload =
    verifyAccessToken(token);

  const user =
    await authRepository.findUserById(
      payload.userId,
    );

  if (!user) {
    return next(
      new AppError(401, "User not found"),
    );
  }

  if (user.status !== UserStatus.ACTIVE) {
    return next(
      new AppError(
        403,
        "User account is inactive",
      ),
    );
  }

  req.user = payload;

  next();
};