import { apiClient } from "../../../lib/api/client";
import { API_ENDPOINTS } from "../../../lib/api/endpoints";
import { ApiResponse } from "../../../types/auth.types";
import { Profile, ProfileImageFile, ProfileSettings, UpdateProfileRequest, UpdateSettingsRequest } from "../../../types/profile.types";


export const profileApi = {
  /* =====================================================
     PROFILE
  ===================================================== */

  getProfile: async () => {
    const { data } =
      await apiClient.get<
        ApiResponse<Profile>
      >(
        API_ENDPOINTS.PROFILE.GET,
      );

    return data;
  },

  updateProfile: async (
    payload: UpdateProfileRequest,
  ) => {
    const { data } =
      await apiClient.patch<
        ApiResponse<Profile>
      >(
        API_ENDPOINTS.PROFILE.UPDATE,
        payload,
      );

    return data;
  },

  /* =====================================================
     PROFILE IMAGE
  ===================================================== */

  uploadProfileImage: async (
    file: ProfileImageFile,
  ) => {
    const formData = new FormData();

    formData.append(
      "image",
      {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any,
    );

    const { data } =
      await apiClient.post<
        ApiResponse<Profile>
      >(
        API_ENDPOINTS.PROFILE.IMAGE,
        formData,
      );

    return data;
  },

  deleteProfileImage: async () => {
    const { data } =
      await apiClient.delete<
        ApiResponse<Profile>
      >(
        API_ENDPOINTS.PROFILE.IMAGE,
      );

    return data;
  },

  /* =====================================================
     SETTINGS
  ===================================================== */

  getSettings: async () => {
    const { data } =
      await apiClient.get<
        ApiResponse<ProfileSettings>
      >(
        API_ENDPOINTS.PROFILE.SETTINGS,
      );

    return data;
  },

  updateSettings: async (
    payload: UpdateSettingsRequest,
  ) => {
    const { data } =
      await apiClient.patch<
        ApiResponse<ProfileSettings>
      >(
        API_ENDPOINTS.PROFILE.SETTINGS,
        payload,
      );

    return data;
  },
};