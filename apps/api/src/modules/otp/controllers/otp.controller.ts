import { NextFunction, Request, Response } from "express";

import otpService from "../services/otp.service";

import { sendResponse } from "../../../common/utils/response";

class OtpController {
  async sendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await otpService.sendOtp(req.body);

      sendResponse(res, 200, {
        success: true,
        message: "OTP sent successfully.",
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await otpService.verifyOtp(req.body);

      sendResponse(res, 200, {
        success: true,
        message: "OTP verified successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new OtpController();