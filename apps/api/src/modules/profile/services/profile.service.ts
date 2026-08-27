import { AppError } from "../../../common/exceptions/AppError";

import * as authRepository from "../../auth/repositories/auth.repository";
import { profileRepository } from "../repositories/profile.repository";

import { CompleteProfileDto } from "../dto/complete-profile.dto";
import { UpdateProfileDto } from "../dto/update-profile.dto";
import { ProfileResponseDto } from "../dto/profile-response.dto";
import path from "path";
import fs from "fs/promises";
import cloudinary from "../../../config/cloudinary";

class ProfileService {
  async getProfile(userId: string): Promise<ProfileResponseDto> {
    const user = await authRepository.findUserById(userId);

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const profile = await profileRepository.findByUserId(userId);

    if (!profile) {
      throw new AppError(404, "Profile not found");
    }

    return {
      displayName: profile.displayName ?? null,
      email: user.email,
      phone: user.phone,
      profileImage: profile.profileImage ?? null,

      monthlyIncome: profile.monthlyIncome ?? null,
      occupation: profile.occupation ?? null,
      country: profile.country ?? null,
      timezone: profile.timezone ?? null,

      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
    };
  }
  async completeProfile(
    userId: string,
    dto: CompleteProfileDto,
  ): Promise<ProfileResponseDto> {
    const profile = await profileRepository.updateByUserId(userId, dto);

    if (!profile) {
      throw new AppError(404, "Profile not found");
    }

    return this.getProfile(userId);
  }
  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<ProfileResponseDto> {
    const profile = await profileRepository.updateByUserId(userId, dto);

    if (!profile) {
      throw new AppError(404, "Profile not found");
    }

    return this.getProfile(userId);
  }
  // async uploadProfileImage(userId: string, file?: Express.Multer.File) {
  //   if (!file) {
  //     throw new AppError(400, "Profile image is required");
  //   }

  //   const profile = await profileRepository.findByUserId(userId);

  //   if (!profile) {
  //     throw new AppError(404, "Profile not found");
  //   }

  //   if (profile.profileImage) {
  //     const oldImagePath = path.join(process.cwd(), profile.profileImage);

  //     try {
  //       await fs.unlink(oldImagePath);
  //     } catch {
  //       // Ignore if old file doesn't exist
  //     }
  //   }

  //   const profileImagePath = path
  //     .relative(process.cwd(), file.path)
  //     .replace(/\\/g, "/");

  //   await profileRepository.updateByUserId(userId, {
  //     profileImage: profileImagePath,
  //   });

  //   return this.getProfile(userId);
  // }
  async uploadProfileImage(userId: string, file?: Express.Multer.File) {
    if (!file) {
      throw new AppError(400, "Profile image is required");
    }

    const profile = await profileRepository.findByUserId(userId);

    if (!profile) {
      try {
        await fs.unlink(file.path);
      } catch {
        // Ignore cleanup errors
      }

      throw new AppError(404, "Profile not found");
    }

    try {
      /*
       * Delete old image from Cloudinary
       * before replacing it.
       */
      if (profile.profileImagePublicId) {
        await cloudinary.uploader.destroy(profile.profileImagePublicId);
      }

      /*
       * Upload new image to Cloudinary.
       */
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "budgetwise/profile-images",

        resource_type: "image",
      });

      /*
       * Save new Cloudinary details.
       */
      await profileRepository.updateByUserId(userId, {
        profileImage: result.secure_url,

        profileImagePublicId: result.public_id,
      });

      return this.getProfile(userId);
    } finally {
      /*
       * Always remove temporary Multer file.
       */
      try {
        await fs.unlink(file.path);
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  // async deleteProfileImage(userId: string) {
  //   const profile = await profileRepository.findByUserId(userId);

  //   if (!profile) {
  //     throw new AppError(404, "Profile not found");
  //   }

  //   if (profile.profileImage) {
  //     const imagePath = path.join(process.cwd(), profile.profileImage);

  //     try {
  //       await fs.unlink(imagePath);
  //     } catch {
  //       // Ignore if file doesn't exist
  //     }
  //   }

  //   await profileRepository.updateByUserId(userId, {
  //     profileImage: null,
  //   });

  //   return this.getProfile(userId);
  // }

  async deleteProfileImage(userId: string) {
    const profile = await profileRepository.findByUserId(userId);

    if (!profile) {
      throw new AppError(404, "Profile not found");
    }

    /*
     * Delete image from Cloudinary.
     */
    if (profile.profileImagePublicId) {
      await cloudinary.uploader.destroy(profile.profileImagePublicId);
    }

    /*
     * Remove image data from database.
     */
    await profileRepository.updateByUserId(userId, {
      profileImage: null,
      profileImagePublicId: null,
    });

    return this.getProfile(userId);
  }
}
export default new ProfileService();
