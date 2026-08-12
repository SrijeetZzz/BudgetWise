import { login, register, refresh, logout, logoutAll, googleLogin, googleComplete, forgotPassword, resetPassword, getCurrentUser } from "../controllers/auth.controller";
import { validate } from "../../../middleware/validation.middleware";

import { registerSchema } from "../validators/register.validator";
import { loginSchema } from "../validators/login.validator";
import otpRoutes from "../../otp";
import { Router } from "express";
import { authenticate } from "../../../middleware/auth.middleware";
import { googleLoginSchema } from "../validators/google-login.validator";
import { googleCompleteSchema } from "../validators/google-complete.validator";
import { forgotPasswordSchema } from "../validators/forgot-password.validator";
import { resetPasswordSchema } from "../validators/reset-password.validator";

const router = Router();

router.use("/", otpRoutes);

router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.post(
  "/google",
  validate(googleLoginSchema),
  googleLogin,
);

router.post(
  "/google/complete",
  validate(googleCompleteSchema),
  googleComplete,
);

router.post(
  "/refresh",
  refresh,
);

router.post(
  "/logout",
  logout,
);

router.post(
  "/logout-all",
  logoutAll,
);

router.get(
  "/me",
  authenticate,
  getCurrentUser,
);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  forgotPassword,
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPassword,
);

export default router;