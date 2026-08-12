import { CookieOptions } from "express";
import { JWT } from "../jwt/jwt.config";

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: JWT.refreshCookieExpiresIn,
};