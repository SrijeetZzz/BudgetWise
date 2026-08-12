import { Request, Response } from "express";

import profileService from "../services/profile.service";
import settingsService from "../services/settings.service";

import { asyncHandler } from "../../../common/helpers/asyncHandler";

class ProfileController {
  getProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await profileService.getProfile(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: profile,
    });
  });

  completeProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await profileService.completeProfile(
      req.user.userId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      data: profile,
    });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const profile = await profileService.updateProfile(
      req.user.userId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  });

  getSettings = asyncHandler(async (req: Request, res: Response) => {
    const settings = await settingsService.getSettings(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Settings fetched successfully",
      data: settings,
    });
  });

  updateSettings = asyncHandler(async (req: Request, res: Response) => {
    const settings = await settingsService.updateSettings(
      req.user.userId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  });
  uploadProfileImage = asyncHandler(async (req: Request, res: Response) => {
    const profile = await profileService.uploadProfileImage(
      req.user.userId,
      req.file,
    );

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: profile,
    });
  });
  deleteProfileImage = asyncHandler(async (req: Request, res: Response) => {
    const profile = await profileService.deleteProfileImage(req.user.userId);

    res.status(200).json({
      success: true,
      message: "Profile image deleted successfully",
      data: profile,
    });
  });
}

export default new ProfileController();
