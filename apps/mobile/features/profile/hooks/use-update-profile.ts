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

export function useUpdateProfile() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationKey: [
      "profile",
      "update",
    ],

    mutationFn:
      profileApi.updateProfile,

    onSuccess: (response) => {
      queryClient.setQueryData(
        PROFILE_QUERY_KEY,
        response,
      );
    },
  });
}