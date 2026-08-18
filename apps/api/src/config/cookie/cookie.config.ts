import { CookieOptions } from "express";

import { JWT } from "../jwt/jwt.config";

const isProduction = process.env.NODE_ENV === "production";

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: JWT.refreshCookieExpiresIn,
};