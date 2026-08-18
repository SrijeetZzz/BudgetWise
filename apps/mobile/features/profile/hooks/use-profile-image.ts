import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  profileApi,
} from "../api/profile.api";

import {
  PROFILE_QUERY_KEY,
} from "./use-profile";

import type {
  ProfileImageFile,
} from "../../../types/profile.types";

export function useProfileImage() {
  const queryClient =
    useQueryClient();

  const upload = useMutation({
    mutationKey: [
      "profile",
      "image",
      "upload",
    ],

    mutationFn: (
      file: ProfileImageFile,
    ) =>
      profileApi.uploadProfileImage(
        file,
      ),

    onSuccess: (response) => {
      queryClient.setQueryData(
        PROFILE_QUERY_KEY,
        response,
      );
    },
  });

  const remove = useMutation({
    mutationKey: [
      "profile",
      "image",
      "delete",
    ],

    mutationFn:
      profileApi.deleteProfileImage,

    onSuccess: (response) => {
      queryClient.setQueryData(
        PROFILE_QUERY_KEY,
        response,
      );
    },
  });

  return {
    upload,
    remove,
  };
}