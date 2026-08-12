import { Router } from "express";

import profileController from "../controllers/profile.controller";
import { authenticate } from "../../../middleware/auth.middleware";
import { completeProfileSchema } from "../validations/complete-profile.validation";
import { updateProfileSchema } from "../validations/update-profile.validation";
import { validate } from "../../../middleware/validation.middleware";
import { updateSettingsSchema } from "../validations/update-settings.validation";
import profileImageUpload from "../../../config/multer/profile-image.multer";

const router = Router();

router.get(
  "/",
  authenticate,
  profileController.getProfile,
);

router.put(
  "/complete",
  authenticate,
  validate(completeProfileSchema),
  profileController.completeProfile,
);

router.patch(
  "/",
  authenticate,
  validate(updateProfileSchema),
  profileController.updateProfile,
);

router.get(
  "/settings",
  authenticate,
  profileController.getSettings,
);

router.patch(
  "/settings",
  authenticate,
  validate(updateSettingsSchema),
  profileController.updateSettings,
);

router.post(
  "/image",
  authenticate,
  profileImageUpload.single("image"),
  profileController.uploadProfileImage,
);

router.delete(
  "/image",
  authenticate,
  profileImageUpload.single("image"),
  profileController.deleteProfileImage,
);

export default router;