import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  profileApi,
} from "../api/profile.api";

import {
  PROFILE_SETTINGS_QUERY_KEY,
} from "./use-settings";

export function useUpdateSettings() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationKey: [
      "profile",
      "settings",
      "update",
    ],

    mutationFn:
      profileApi.updateSettings,

    onSuccess: (response) => {
      queryClient.setQueryData(
        PROFILE_SETTINGS_QUERY_KEY,
        response,
      );
    },
  });
}