import { useQuery } from "@tanstack/react-query";

import type {
  DashboardQuery,
} from "../../../types/dashboard.types";

import { dashboardApi } from "../api/dashboard.api";

export function useDashboardAnalytics(
  query?: DashboardQuery,
) {
  return useQuery({
    queryKey: ["dashboard-analytics", query],
    queryFn: () =>
      dashboardApi.getDashboardAnalytics(query),
  });
}