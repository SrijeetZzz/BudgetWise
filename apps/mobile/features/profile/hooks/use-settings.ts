import { useQuery } from "@tanstack/react-query";

import { profileApi } from "../api/profile.api";

export const PROFILE_SETTINGS_QUERY_KEY =
  ["profile", "settings"] as const;

export function useSettings() {
  return useQuery({
    queryKey:
      PROFILE_SETTINGS_QUERY_KEY,

    queryFn:
      profileApi.getSettings,
  });
}