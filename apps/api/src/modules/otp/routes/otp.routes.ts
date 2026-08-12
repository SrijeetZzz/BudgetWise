import { Router } from "express";

import otpController from "../controllers/otp.controller";

import {validate} from "../../../middleware/validation.middleware";

import { sendOtpSchema } from "../validators/send-otp.validator";
import { verifyOtpSchema } from "../validators/verify-otp.validator";

const router = Router();

router.post(
  "/send-otp",
  validate(sendOtpSchema),
  otpController.sendOtp
);

router.post(
  "/verify-otp",
  validate(verifyOtpSchema),
  otpController.verifyOtp
);

export default router;